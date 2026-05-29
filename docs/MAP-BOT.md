# 🤖 Telegram Bot Service (`bot/`)

> A standalone Telegraf bot, separate from the main Next.js app. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index and [MAP-COMMERCE.md](MAP-COMMERCE.md#telegram--email-notifications) for the app's outbound notifications.

## Two distinct Telegram integrations (don't confuse them)

| | Main app | `bot/` service |
|---|----------|----------------|
| Direction | **Outbound** — sends notifications | **Inbound** — answers admin queries |
| Mechanism | Webhook (`/api/telegram/webhook`) + `sendMessage` | **Long-polling** (`bot.launch()`) |
| Token env | `TELEGRAM_BOT_TOKEN` | `BOT_TOKEN` |
| Code | `src/lib/telegram*.ts`, `*-notify.ts` | `bot/src/**` |
| Process | Inside the Next.js container | Its own container (`--profile bot`) |
| DB access | Via the app's Prisma | Its own Prisma client (`bot/src/lib/db.ts`) reading the **same** DB |

They may share the same bot token in practice, but they're independent code paths. This doc covers the `bot/` service.

## What it is

A small self-contained Node.js (ESM) package — `bot/` — built with **Telegraf 4** and its own `@prisma/client`. It runs as a separate Docker container alongside the site on the same VPS, reading the shared database to answer admin questions in Telegram.

```
bot/
  package.json            # name "gluhoman-bot"; telegraf + @prisma/client
  Dockerfile, .dockerignore
  tsconfig.json
  prisma/schema.prisma     # bot's copy of the schema (shares the same DATABASE_URL)
  src/
    index.ts               # entrypoint: wires commands, launches polling
    handlers/
      start.ts             # /start — greeting
      help.ts              # /help — command list
      bookings.ts          # /bookings, /booking <id>, /stats (admin-gated)
    lib/
      db.ts                # PrismaClient singleton
      format.ts            # message formatters (formatBookingShort/Full, serviceEmoji)
```

## Commands

**Everyone:**
- `/start` — greeting + short description
- `/help` — command list
- any free-text message → auto-reply with contact phone (admins' text is ignored)

**Admins only** (gated by `chat_id` ∈ `ADMIN_CHAT_IDS`):
- `/bookings` — last 10 `Booking` records
- `/booking <id>` — full details for a booking (matched by ID prefix)
- `/stats` — total count + breakdown by service

Non-admins calling an admin command get "Ця команда лише для адміністраторів."

## Environment

| Var | Purpose |
|-----|---------|
| `BOT_TOKEN` | Token from @BotFather (this bot's own token) |
| `ADMIN_CHAT_IDS` | Comma-separated admin `chat_id`s, e.g. `12345,67890` |
| `DATABASE_URL` | Same connection string as the main app (reads the shared DB) |

The process exits immediately if `BOT_TOKEN` is unset. Handles `SIGINT`/`SIGTERM` for clean shutdown.

## Running it

**Local dev:**
```bash
cd bot && npm install
npx prisma generate --schema=../prisma/schema.prisma   # share the app's schema
export BOT_TOKEN=xxx ADMIN_CHAT_IDS=12345 DATABASE_URL="file:../prisma/dev.db"
npm run dev          # tsx src/index.ts
```

**Production (Docker, on the VPS):** the bot is a compose service with `profiles: [bot]`, so it only starts when explicitly enabled:
```bash
docker compose -f docker-compose.prod.yml --profile bot up -d bot
```
Built separately in CI (`bot-build` job; `bot/Dockerfile`) and pushed to GHCR by `deploy.yml`. See [MAP-DEPLOY.md](MAP-DEPLOY.md).

## Notes & gotchas

- The bot reads `Booking` (the **legacy** booking model — see [MAP-DATA.md](MAP-DATA.md)). It does not currently surface the structured `HotelBooking`/`Order`/`AquaparkTicket`/`SaunaSlot` records.
- It uses `(prisma as any).booking` casts in places — its Prisma client must be regenerated against the shared schema or the model types won't line up.
- Keep `bot/prisma/schema.prisma` consistent with the app schemas (it's a third copy of the schema to keep in sync).
- Easy to forget the `--profile bot` flag — without it the bot container never starts and there's no error.
