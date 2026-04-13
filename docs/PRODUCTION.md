# Продакшен-розгортання Глухомань (VPS)

Цей документ описує розгортання та експлуатацію сайту Глухомань у продакшені на
одному Hostinger KVM 2 VPS (Ubuntu 24.04, 8 GB RAM). Локальна розробка описана
в `docs/SETUP.md` та `docs/DEPLOYMENT.md` — цей файл стосується виключно
повноцінного стека Docker Compose на сервері.

---

## 1. Огляд продакшен-стека

Весь стек працює через `docker-compose.prod.yml`:

| Сервіс     | Образ                  | Призначення                                            |
|------------|------------------------|---------------------------------------------------------|
| `postgres` | `postgres:16-alpine`   | Основна БД (замінює SQLite з dev-середовища)            |
| `redis`    | `redis:7-alpine`       | Кеш, rate-limit, черги (AOF + LRU, ліміт 256 MB)        |
| `site`     | `gluhoman-site:latest` | Next.js 15 застосунок (порт 3000, тільки на 127.0.0.1)  |
| `bot`      | `gluhoman-bot:latest`  | Telegraf-бот (профіль `bot`, запускається за потреби)   |
| `backup`   | `postgres:16-alpine`   | One-shot pg_dump (профіль `backup`, для cron)           |

Зовнішній Nginx на хості термінує TLS та проксіює на `127.0.0.1:3000`. Внутрішня
мережа `internal` ізолює сервіси — ззовні доступний лише сайт через Nginx.

---

## 2. Перший запуск на VPS

```bash
# 1. Клонуємо репозиторій
sudo mkdir -p /opt/gluhoman && sudo chown $USER /opt/gluhoman
git clone https://github.com/<org>/gluhoman-land.git /opt/gluhoman
cd /opt/gluhoman

# 2. Готуємо .env
cp .env.example .env
# Згенерувати надійний пароль для Postgres:
openssl rand -base64 32
# Заповнити у .env щонайменше:
#   POSTGRES_PASSWORD=...
#   NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua
#   TELEGRAM_BOT_TOKEN=...
#   TELEGRAM_CHAT_ID=...

# 3. Запускаємо базовий стек (postgres + redis + site)
docker compose -f docker-compose.prod.yml up -d

# 4. Застосовуємо міграції Prisma (Postgres-схема)
docker compose -f docker-compose.prod.yml exec site \
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma

# 5. Перевіряємо, що сайт відповідає локально
curl -I http://localhost:3000
```

Після цього налаштуйте Nginx на хості (reverse proxy → `127.0.0.1:3000`) та
Let's Encrypt сертифікат через certbot.

---

## 3. Запуск з ботом

Telegraf-бот живе в окремому сервісі та запускається лише за потреби через
профіль `bot`:

```bash
docker compose -f docker-compose.prod.yml --profile bot up -d
```

Перед стартом переконайтесь, що у `.env` задано `BOT_TOKEN` та `ADMIN_CHAT_IDS`.

---

## 4. Бекапи

### Разовий (ручний) бекап

```bash
docker compose -f docker-compose.prod.yml --profile backup run --rm backup
```

Дамп з'явиться у `./backups/gluhoman-YYYYMMDD-HHMMSS.dump`.

### Щоденний бекап через cron (03:00)

```cron
0 3 * * * cd /opt/gluhoman && docker compose -f docker-compose.prod.yml --profile backup run --rm backup >> /var/log/gluhoman-backup.log 2>&1
```

Ротація: скрипт автоматично видаляє дампи, старші за 7 днів
(`find /backups -name 'gluhoman-*.dump' -mtime +7 -delete`).

### Відновлення з дампа

```bash
export DATABASE_URL="postgresql://gluhoman:PASSWORD@localhost:5432/gluhoman"
./scripts/restore-postgres.sh ./backups/gluhoman-20260415-030000.dump
```

Або всередині контейнера:

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_restore --clean --if-exists -U gluhoman -d gluhoman < ./backups/gluhoman-20260415-030000.dump
```

---

## 5. Міграція даних з SQLite у Postgres

Одноразовий скрипт `scripts/migrate-sqlite-to-postgres.mjs` переносить
бронювання з локального `prisma/dev.db` у продакшен Postgres, зберігаючи
`id`, `createdAt` та `updatedAt`.

```bash
# 1. Перегляд (dry-run)
DATABASE_URL="postgresql://gluhoman:PASSWORD@localhost:5432/gluhoman" \
  node scripts/migrate-sqlite-to-postgres.mjs --dry-run

# 2. Фактичне перенесення
DATABASE_URL="postgresql://gluhoman:PASSWORD@localhost:5432/gluhoman" \
  node scripts/migrate-sqlite-to-postgres.mjs
```

Скрипт коректно завершується, якщо `prisma/dev.db` відсутній.

---

## 6. Моніторинг

```bash
docker compose -f docker-compose.prod.yml ps           # стан сервісів
docker compose -f docker-compose.prod.yml logs -f site # логи сайту
docker compose -f docker-compose.prod.yml logs -f postgres
docker stats                                           # CPU/RAM по контейнерах
```

Healthchecks вбудовано у Postgres (`pg_isready`) та site (`wget` → `/`). Для
зовнішнього моніторингу підключіть Sentry (`SENTRY_DSN`) та Uptime Kuma / Better
Stack на `https://gluhoman.com.ua/api/health`.

---

## 7. Оновлення застосунку

```bash
cd /opt/gluhoman
git pull
docker compose -f docker-compose.prod.yml build site
docker compose -f docker-compose.prod.yml up -d site
docker compose -f docker-compose.prod.yml exec site \
  npx prisma migrate deploy --schema=prisma/schema.postgres.prisma
```

Завдяки healthcheck Docker не маршрутизує трафік у несправний контейнер, тож
оновлення site проходить майже без простою.

---

## 8. Откат деплою

Перед кожним деплоєм зберігайте поточний образ під окремим тегом:

```bash
docker tag gluhoman-site:latest gluhoman-site:prev
```

У разі невдалого релізу:

```bash
docker tag gluhoman-site:prev gluhoman-site:latest
docker compose -f docker-compose.prod.yml up -d site
```

Якщо проблема в міграції БД — відновіть найсвіжіший дамп із
`./backups/` через `scripts/restore-postgres.sh` та перезапустіть site.
