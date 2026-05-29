# ⚙️ Environment Variables

> Every `process.env.*` referenced in `src/`, `scripts/`, and `next.config.ts` (extracted from code). See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index. Dev values go in `.env.local`; the i18n scripts load it via `--env-file=.env.local`.

`NEXT_PUBLIC_*` vars are exposed to the browser; everything else is server-only.

## Database

| Var | Required | Notes |
|-----|----------|-------|
| `DATABASE_URL` | ✅ | SQLite path in dev (`file:./dev.db`), Postgres URL in prod |

## Admin / auth

| Var | Required | Notes |
|-----|----------|-------|
| `ADMIN_EMAIL` | seed | Super-admin email created by `prisma/seed.ts` (dev fallback `admin@gluhoman.local`) |
| `ADMIN_PASSWORD` | seed | Super-admin password (dev fallback `admin123`) |

> next-auth also needs its standard secret/URL in production (e.g. `NEXTAUTH_SECRET`, `NEXTAUTH_URL` / `AUTH_*`) — set per your next-auth version even though they aren't directly grepped in app code.

## Payments — LiqPay

| Var | Required | Notes |
|-----|----------|-------|
| `LIQPAY_PUBLIC_KEY` | prod | Missing → **stub mode** (auto-marks paid). Fine for dev |
| `LIQPAY_PRIVATE_KEY` | prod | Used for signing + callback verification |

## Telegram notifications

| Var | Required | Notes |
|-----|----------|-------|
| `TELEGRAM_BOT_TOKEN` | ✅ for notify | Bot API token |
| `TELEGRAM_CHAT_ID` | ✅ for notify | Default chat for all notifications |
| `TELEGRAM_WEBHOOK_SECRET` | opt | Validates incoming `/api/telegram/webhook` |
| `TELEGRAM_CHAT_ID_AQUAPARK` | opt | Per-hotel override — legacy `Booking` flow only (`chatIdForHotel`) |
| `TELEGRAM_CHAT_ID_CENTRAL` | opt | " |
| `TELEGRAM_CHAT_ID_BREWERY` | opt | " |
| `TELEGRAM_CHAT_ID_COTTAGES` | opt | " |

> Per-hotel chat routing lives in `src/app/actions/booking.ts`; if a hotel-specific ID is unset it falls back to `TELEGRAM_CHAT_ID`. The CRM notify modules (`*-notify.ts`) always use the single `TELEGRAM_CHAT_ID`.

## Email — Resend

| Var | Required | Notes |
|-----|----------|-------|
| `RESEND_API_KEY` | ✅ for email | Resend API key |
| `ORDERS_EMAIL_TO` / `ORDERS_EMAIL_FROM` | opt | Restaurant order notifications |
| `BOOKING_EMAIL_TO` / `BOOKING_EMAIL_FROM` | opt | Booking notifications |

## Site / SEO / analytics

| Var | Required | Notes |
|-----|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical base URL (default `https://gluhoman.com.ua`) — metadata, sitemap, OG |
| `BASE_URL` | opt | Server-side base URL |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | opt | Plausible analytics domain |
| `NEXT_PUBLIC_PLAUSIBLE_HOST` | opt | Self-hosted Plausible host |

## i18n tooling

| Var | Required | Notes |
|-----|----------|-------|
| `DEEPL_API_KEY` | ✅ for sync | Used by `npm run i18n:sync` / `:menu` (DeepL translation) |

## Error tracking — Sentry (prod build)

| Var | Required | Notes |
|-----|----------|-------|
| `SENTRY_ORG` | prod | Sentry org slug |
| `SENTRY_PROJECT` | prod | Sentry project slug |
| `SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING` | opt | Silence build warning |

## Build / runtime (set by platform)

| Var | Notes |
|-----|-------|
| `NODE_ENV` | `development` / `production` |
| `CI` | Set in CI pipelines |
| `PORT` | Used by `npm run start` (default 3000) |
| `AUDIT_BASE_URL` | Base URL for the Playwright audit tooling |
