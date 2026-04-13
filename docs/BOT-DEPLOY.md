# Розгортання Telegram-бота Глухомань

## Що це

Telegram-бот для адміністрування заявок рекреаційного комплексу "Глухомань".
Побудований на [Telegraf](https://telegraf.js.org/) + Prisma, працює з тією ж
базою даних, що й основний сайт (SQLite у dev, Postgres у prod). Бот дозволяє
адміністраторам отримувати сповіщення про нові бронювання, переглядати список
заявок та швидко реагувати на них у Telegram.

Вихідний код розташовано у каталозі [`bot/`](../bot).

---

## Структура образу

Dockerfile мультистейджовий:

1. **deps** — ставить залежності (`npm ci`), виконує `prisma generate`.
2. **build** — компілює TypeScript → `dist/` (`npm run build`).
3. **runner** — мінімальний `node:20-alpine` з `tini`, запускається від не-root
   користувача `bot`. Містить тільки `node_modules`, `dist`, `prisma`,
   `package.json`.

Цільовий розмір образу: **< 300 MB** (Alpine + Node 20 + Prisma engine).

---

## Локальний білд

> Контекст білду — сам каталог `bot/` (усі шляхи в Dockerfile відносні до нього).

```bash
cd /path/to/gluhoman-land
docker build -t gluhoman-bot -f bot/Dockerfile bot/
```

Перевірити розмір:

```bash
docker images gluhoman-bot --format "{{.Repository}}:{{.Tag}} {{.Size}}"
```

---

## Запуск локально

Бот очікує три змінні оточення:

| Змінна            | Опис                                                        |
| ----------------- | ----------------------------------------------------------- |
| `BOT_TOKEN`       | Токен, виданий [@BotFather](https://t.me/BotFather)         |
| `DATABASE_URL`    | Рядок підключення Prisma (SQLite / Postgres)                |
| `ADMIN_CHAT_IDS`  | Список ID адмінів через кому, напр. `123456789,987654321`   |

Приклад запуску з SQLite:

```bash
docker run --rm --name gluhoman-bot \
  -e BOT_TOKEN="123456:ABC-DEF..." \
  -e DATABASE_URL="file:/data/bot.db" \
  -e ADMIN_CHAT_IDS="123456789" \
  -v "$PWD/bot-data:/data" \
  gluhoman-bot
```

Smoke-test без справжнього токена (перевірка, що процес Node стартує):

```bash
docker run --rm \
  -e BOT_TOKEN=fake \
  -e DATABASE_URL="file:/tmp/test.db" \
  -e ADMIN_CHAT_IDS="0" \
  gluhoman-bot \
  node -e "console.log('OK'); process.exit(0)"
```

---

## Продакшен (VPS)

Бот підключається до основного `docker-compose.prod.yml` через
[Compose profile](https://docs.docker.com/compose/profiles/) `bot`, щоб його
можна було вмикати опційно:

```bash
# тільки сайт
docker compose -f docker-compose.prod.yml up -d

# сайт + бот
docker compose -f docker-compose.prod.yml --profile bot up -d
```

Змінні для бота беруться з `.env.production` поруч з compose-файлом
(`BOT_TOKEN`, `DATABASE_URL`, `ADMIN_CHAT_IDS`). У прод-середовищі `DATABASE_URL`
повинен вказувати на той самий Postgres, що й Next.js-додаток, щоб бот
бачив свіжі бронювання.

Рекомендовано виставити у compose:

```yaml
restart: unless-stopped
depends_on:
  - db
```

---

## Логи та моніторинг

```bash
docker logs -f gluhoman-bot            # потокові логи
docker logs --tail 200 gluhoman-bot    # останні 200 рядків
docker inspect --format='{{.State.Health.Status}}' gluhoman-bot
```

Healthcheck в Dockerfile виконує `node -e "process.exit(0)"` кожні 60 секунд —
це лише підтверджує, що процес живий. Повніший probe (ping Telegram API)
можна додати пізніше.

---

## Команди адміна

Бот реагує лише на користувачів, чиї `chat_id` перераховано у `ADMIN_CHAT_IDS`.

| Команда              | Дія                                                   |
| -------------------- | ------------------------------------------------------ |
| `/start`             | Привітання + перевірка, чи ви адмін                    |
| `/help`              | Список команд                                          |
| `/bookings`          | Останні 10 бронювань                                   |
| `/booking <id>`      | Деталі конкретного бронювання                          |
| `/stats`             | Коротка статистика (кількість заявок за тиждень/місяць)|

---

## Troubleshooting

### `401: Unauthorized` при старті
Неправильний або протермінований `BOT_TOKEN`. Перегенеруйте через @BotFather
і оновіть `.env.production`, далі:
```bash
docker compose -f docker-compose.prod.yml --profile bot up -d --force-recreate bot
```

### `PrismaClientInitializationError: Can't reach database`
- Перевірте `DATABASE_URL`
- Переконайтесь, що контейнер `db` запущений і в одній мережі з `bot`
- Для SQLite — переконайтесь, що том `/data` змонтовано

### `Cannot find module '.prisma/client'` або `@prisma/client did not initialize`
Prisma Client не згенеровано під час білду. Це означає, що `prisma/schema.prisma`
не було скопійовано до того, як виконався `npm ci` (postinstall). У поточному
Dockerfile `COPY prisma ./prisma` зроблено *перед* `npm ci` саме для цього —
якщо зміните порядок, білд впаде.

Ручне виправлення всередині запущеного контейнера (тимчасово):
```bash
docker exec -it gluhoman-bot npx prisma generate
```

### Образ занадто великий (> 300 MB)
- Перевірте `.dockerignore` — `node_modules`, `dist`, `.git` мають бути у списку
- Переконайтесь, що стейдж `runner` не копіює вихідний код (`src/`)
- `prisma` CLI не потрібен у прод — тільки `@prisma/client` engine

### Dockerfile не зібрався на macOS (Apple Silicon)
Node 20 Alpine працює на arm64, але Prisma engine може потребувати
`--platform=linux/amd64` для повної сумісності з VPS:
```bash
docker buildx build --platform linux/amd64 -t gluhoman-bot -f bot/Dockerfile bot/
```

---

## Примітка про верифікацію

На момент написання цього документа локально Docker був недоступний на машині
розробника. Фактичний `docker build` буде виконано на VPS під час першого
деплою — Dockerfile пройшов статичний аналіз (усі `COPY` шляхи існують,
multi-stage коректний, non-root user налаштований, `prisma generate`
викликається до `tsc`).
