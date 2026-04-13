# Безпека — Глухомань

Цей документ описує роботу з секретами, паролями адміністратора та ротацією
ключів у проєкті `gluhoman-land`. Актуально для локальної розробки, VPS та
хмарних платформ (Vercel/Hosting panel).

---

## 1. Перший запуск

Перед першим деплоєм у будь-яке середовище (staging або production) ОБОВ'ЯЗКОВО
згенеруйте сильний пароль для адміністратора — НЕ використовуйте дефолтний
`admin123` з dev-середовища.

```bash
# Згенерувати сильний пароль (~32 символи)
openssl rand -base64 24
```

Потім створіть адміністратора через seed-скрипт:

```bash
ADMIN_EMAIL=admin@gluhoman.com.ua \
ADMIN_PASSWORD='<згенерований пароль>' \
node scripts/seed-admin.mjs
```

Збережіть пароль у менеджері паролів (1Password, Bitwarden, KeePass) — він
більше ніде не зберігається у відкритому вигляді.

---

## 2. Генерація секретів

| Змінна            | Команда генерації            | Довжина           |
|-------------------|-------------------------------|-------------------|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32`    | 44 символи base64 |
| `AUTH_SECRET`     | те саме значення, що й вище  | —                 |
| `ADMIN_PASSWORD`  | `openssl rand -base64 24`    | ~32 символи       |
| `POSTGRES_PASSWORD` | `openssl rand -base64 32`  | 44 символи        |

`AUTH_SECRET` і `NEXTAUTH_SECRET` повинні мати ОДНАКОВЕ значення (сумісність
між NextAuth v4 та Auth.js v5).

---

## 3. Де зберігати секрети

- **Локальна розробка** — `.env.local` у корені проєкту. Файл додано до
  `.gitignore`, перевірте командою `git check-ignore -v .env.local`.
- **VPS (docker-compose.prod.yml)** — файл `.env` на сервері, права `600`,
  власник — користувач, який запускає docker. НЕ комітити в git.
- **Vercel / хмарні хостинги** — Project Settings → Environment Variables.
  Розділяти на Production / Preview / Development.
- **Секрети у CI/CD** — GitHub Actions Secrets або Vercel Encrypted Env.

НІКОЛИ:
- не публікувати секрети у чатах, тікетах, commit-повідомленнях;
- не зберігати у `.env.example` (там мають бути лише пусті поля + коментарі);
- не логувати значення секретів у консоль або файли логів.

---

## 4. Ротація пароля адміністратора

### Варіант A — через seed-скрипт

```bash
ADMIN_EMAIL=admin@gluhoman.local \
ADMIN_PASSWORD='<новий пароль>' \
node scripts/seed-admin.mjs
```

Скрипт оновить bcrypt-hash для існуючого користувача (`upsert`).

### Варіант B — Prisma one-liner

```bash
DATABASE_URL="file:$PWD/prisma/dev.db" \
NEW_ADMIN_PW='<новий пароль>' \
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const hash = bcrypt.hashSync(process.env.NEW_ADMIN_PW, 10);
p.user.update({
  where: { email: 'admin@gluhoman.local' },
  data: { password: hash }
}).then(u => { console.log('Оновлено для', u.email); process.exit(0); });
"
```

Після ротації:
1. Оновіть `ADMIN_PASSWORD` у `.env.local` / `.env` на VPS / Vercel env.
2. Перевірте вхід через форму `/admin/login` або curl-сценарій з
   `docs/ADMIN-LOGIN-TEST.md`.
3. Видаліть старий пароль з менеджера паролів.

---

## 5. Ротація `NEXTAUTH_SECRET`

Коли потрібно:
- підозра на компрометацію ключа або витік env-файлу;
- звільнення співробітника, який мав доступ до секретів;
- планова ротація раз на 6–12 місяців;
- після будь-якого інциденту безпеки.

Наслідок: усі активні JWT-сесії стають недійсними — користувачі повинні
заново залогінитись.

```bash
# Згенерувати новий секрет
openssl rand -base64 32
```

1. Оновіть `NEXTAUTH_SECRET` та `AUTH_SECRET` (однакове значення).
2. Зробіть rolling restart сервісу (`docker compose restart web` або
   Vercel redeploy).
3. Повідомте команду про необхідність повторного входу.

---

## 6. Recovery — якщо втратили пароль

Якщо пароль адміністратора втрачено, скиньте його прямо в БД через seed-скрипт:

```bash
# Локально
DATABASE_URL="file:./prisma/dev.db" \
ADMIN_EMAIL=admin@gluhoman.local \
ADMIN_PASSWORD='<новий пароль>' \
node scripts/seed-admin.mjs

# На VPS (PostgreSQL)
DATABASE_URL="postgresql://gluhoman:...@localhost:5432/gluhoman" \
ADMIN_EMAIL=admin@gluhoman.com.ua \
ADMIN_PASSWORD='<новий пароль>' \
node scripts/seed-admin.mjs
```

Якщо втрачено доступ до сервера — відновлення через SSH-ключ або консоль
хостинг-провайдера. Ніколи не скидайте пароль через публічний ендпоінт.

---

## 7. Чеклист для продакшену

Перед деплоєм у production перевірте КОЖЕН пункт:

- [ ] Унікальний `NEXTAUTH_SECRET` (НЕ з dev-середовища)
- [ ] Сильний `ADMIN_PASSWORD` (мінімум 16 символів, згенерований openssl)
- [ ] Telegram credentials (`TELEGRAM_BOT_TOKEN`, `BOT_TOKEN`, `ADMIN_CHAT_IDS`)
      захищені та не витекли
- [ ] `.env.local` НЕ закомічено у git — перевірити `git status` та
      `git check-ignore -v .env.local`
- [ ] Backup бази даних зроблено ПЕРЕД ротацією паролів
- [ ] Доступ до сервера лише через SSH-ключ (парольна автентифікація
      вимкнена у `/etc/ssh/sshd_config`)
- [ ] `fail2ban` активований (`systemctl status fail2ban`)
- [ ] UFW firewall активований (`ufw status` → active), відкриті лише
      22/tcp, 80/tcp, 443/tcp
- [ ] HTTPS сертифікат валідний (Let's Encrypt auto-renewal)
- [ ] `POSTGRES_PASSWORD` — унікальний, згенерований openssl
- [ ] Логи не містять секретів (перевірити `docker compose logs web`)

---

## Див. також

- `docs/VPS-SETUP.md` — первинне налаштування сервера
- `docs/PRODUCTION.md` — docker-compose.prod.yml та деплой
- `docs/ADMIN-LOGIN-TEST.md` — E2E-перевірка входу адміністратора
- `scripts/seed-admin.mjs` — створення/ротація адміністратора
- `scripts/setup-ssh-hardening.sh` — hardening SSH
- `scripts/setup-firewall.sh` — налаштування UFW
