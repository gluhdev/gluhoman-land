# CI/CD Документація

Документація пайплайнів GitHub Actions для проєкту "Глухомань".

## 1. Огляд

У репозиторії налаштовано три workflow-и та Dependabot:

- **CI** (`.github/workflows/ci.yml`) — автоматична перевірка коду на кожен push та pull request.
- **Deploy** (`.github/workflows/deploy.yml`) — ручний запуск для збірки та публікації Docker-образів у GitHub Container Registry (ghcr.io).
- **Security** (`.github/workflows/security.yml`) — щотижневе сканування залежностей та секретів.
- **Dependabot** (`.github/dependabot.yml`) — автоматичне оновлення залежностей npm та GitHub Actions.

## 2. CI

**Тригер:** push у гілки `main`, `develop` та pull request у `main`.

**Джоби:**

1. `lint` — встановлює залежності, генерує Prisma Client, запускає `npm run lint` (не блокуюче) та `tsc --noEmit` для перевірки типів.
2. `build` — збирає Next.js застосунок та зберігає артефакт `next-build` (3 дні).
3. `e2e` — встановлює Playwright (chromium), застосовує Prisma міграції, сідує тестового адміна, запускає e2e тести. Звіт `playwright-report` зберігається 7 днів.
4. `bot-build` — збирає Docker-образ Telegram-бота з `bot/Dockerfile`.

**Звіти:** у вкладці Actions → вибрати run → Artifacts. HTML-звіт Playwright доступний в артефакті `playwright-report`.

**Concurrency:** новий push у ту саму гілку скасовує попередній запуск.

## 3. Deploy

**Тригер:** тільки ручний (`workflow_dispatch`).

**Як запустити:**

1. Відкрити GitHub → Actions → вибрати workflow **Deploy**.
2. Натиснути **Run workflow**.
3. Вибрати гілку (зазвичай `main`) та середовище: `production` або `staging`.
4. Підтвердити запуск.

**Що відбувається:**

- Логін у `ghcr.io` через `GITHUB_TOKEN`.
- Збірка та публікація образу сайту: `ghcr.io/<owner>/<repo>/site:latest` та `:<sha>`.
- Збірка та публікація образу бота: `ghcr.io/<owner>/<repo>/bot:latest` та `:<sha>`.
- Використовується кеш GitHub Actions (`type=gha`) для прискорення збірок.

**Вимоги:**

- У репозиторії має бути `Dockerfile` у корені (для сайту) та `bot/Dockerfile` (для бота).
- Права `packages: write` вже надані workflow-ом.

## 4. Secrets у GitHub

Для базового Deploy достатньо стандартного `GITHUB_TOKEN` (створюється автоматично). Додаткові секрети — опціонально:

| Secret | Призначення | Обов'язковий |
|---|---|---|
| `GITHUB_TOKEN` | публікація у ghcr.io | автоматичний |
| `TELEGRAM_BOT_TOKEN` | інтеграційні тести бота | ні |
| `RESEND_API_KEY` | тести надсилання пошти | ні |
| `DATABASE_URL` | підключення до продакшн БД (якщо додасться runtime деплой) | ні |
| `NEXTAUTH_SECRET` | продакшн-секрет NextAuth | ні |

**Як додати:** Settings → Secrets and variables → Actions → New repository secret.

## 5. Dependabot

Файл `.github/dependabot.yml` налаштовує автоматичні PR з оновленнями:

- **npm (корінь)** — щотижня у понеділок, до 5 відкритих PR. Групи: `next`, `react`, `prisma` (об'єднуються в один PR).
- **npm (`/bot`)** — щотижня, залежності бота.
- **github-actions** — щомісячно, оновлює версії `actions/*` у workflow-ах.

PR проходять CI автоматично; мерджити після зеленого статусу.

## 6. Локальний запуск workflow

Для відлагодження локально можна використати [`act`](https://github.com/nektos/act):

```bash
# встановлення (macOS)
brew install act

# запуск CI локально
act push -W .github/workflows/ci.yml

# конкретна джоба
act -j lint -W .github/workflows/ci.yml
```

Зауваження: `act` використовує Docker і може не повністю емулювати середовище GitHub (особливо для Playwright та Docker-in-Docker джоб).
