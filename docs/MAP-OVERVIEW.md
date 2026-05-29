# 🗺️ Site Map — Overview & Index

> **Master orientation document for the Глухомань (Gluhoman) site.**
> Generated 2026-05-29 by auditing the live codebase. This is the source of truth for "where does X live"; the older `docs/ARCHITECTURE.md` is stale (still describes the pre-i18n 4-page marketing site) — prefer these `MAP-*.md` files.

## What this project actually is (2026)

It started as a marketing site but is now a **full booking & commerce platform** for the Глухомань recreational complex (с. Нижні Млини, Полтавська область, Ukraine). It has:

- A bilingual public marketing site (Ukrainian default + English).
- **Four independent commerce flows**: hotel booking, sauna booking, aquapark tickets (with QR), restaurant menu ordering.
- A polymorphic **LiqPay** payment layer (+ stub mode for dev).
- **Telegram bot + email** notifications for every paid transaction.
- A full **admin panel / CMS** with role-based access (super-admin vs per-hotel manager).
- A **Prisma** database (SQLite dev / Postgres prod — dual schema).

Content language in the UI is **Ukrainian** (with English translations). Never introduce Russian into the UI.

## The documentation set

| Doc | Covers |
|-----|--------|
| **MAP-OVERVIEW.md** (this file) | Tech stack, top-level layout, index of the others |
| [MAP-ROUTES.md](MAP-ROUTES.md) | i18n setup + every public route under `src/app/[locale]/`, home sections, header/footer, layouts, SEO |
| [MAP-ADMIN.md](MAP-ADMIN.md) | Auth & roles, admin shell/nav, every `/admin/*` page, server actions, the SiteContent CMS |
| [MAP-DATA.md](MAP-DATA.md) | Prisma models (both schemas), hotel/room domain, constants, types, every `src/lib/*` module |
| [MAP-COMMERCE.md](MAP-COMMERCE.md) | The 4 booking/commerce flows end-to-end, LiqPay payments, Telegram notifications |
| [MAP-API.md](MAP-API.md) | Every `src/app/api/*` endpoint with method + auth, plus server actions |
| [MAP-ENV.md](MAP-ENV.md) | All environment variables, grouped, with required/optional notes |
| [MAP-STYLING.md](MAP-STYLING.md) | Design system: brand palette, fonts, Tailwind v4, the scroll gotcha |
| [MAP-DEPLOY.md](MAP-DEPLOY.md) | Docker/VPS deploy, nginx/TLS, CI/CD, Postgres migrations, the `bot/` service, prod gotchas |
| [MAP-I18N.md](MAP-I18N.md) | Translation namespaces (32) + the `i18n:sync` (DeepL) workflow |
| [MAP-COMPONENTS.md](MAP-COMPONENTS.md) | Inventory of every `src/components/*` with a one-line purpose |
| [MAP-BOT.md](MAP-BOT.md) | The standalone `bot/` Telegraf admin bot (separate from the app's notifications) |
| [README.md](README.md) | Full docs index — `MAP-*` (current) + older reference docs |

Other long-form docs (older, may be partially stale): `ARCHITECTURE.md`, `SETUP.md`, `TECH_STACK.md`, `DEPLOYMENT.md`, `PRODUCTION.md`, `VPS-SETUP.md`, `CI-CD.md`, `SECURITY.md`, `OPERATIONS.md`, `BOOKING_RUNBOOK.md`, `TELEGRAM_BOT.md`, `BOT-DEPLOY.md`, `CRM_PLAN.md`, `MENU_PAGE_PLAN.md`, plus audit reports (`A11Y-AUDIT.md`, `MOBILE-AUDIT.md`, `FUNCTIONAL-AUDIT.md`, `LIGHTHOUSE-REPORT.md`, `IOS-*.md`).

## Tech stack (verified from package.json)

- **Next.js 15.5.2** App Router, **React 19.1.0**, **TypeScript 5**
- **next-intl ^3.26.5** — i18n (`uk` default, `en`)
- **Tailwind v4** + **shadcn/ui** (Radix primitives)
- **Prisma ^6.19.3** — `@prisma/client`; SQLite (dev) / Postgres (prod)
- **next-auth** — admin auth (Credentials provider, JWT sessions)
- **zustand** — client cart store
- **framer-motion**, **lenis** (smooth scroll), **embla-carousel** — animation/UX
- **react-day-picker** + **date-fns** — booking calendars
- **qrcode** + **html5-qrcode** — aquapark ticket QR generation + admin scanner
- **bcryptjs** — password hashing; **zod** — validation; **sharp** — images
- **@sentry/nextjs** — error tracking (prod only)
- **Plausible** — privacy-friendly analytics
- Deployed **standalone** (Docker/VPS); also runs on Vercel

## Essential commands

```bash
npm run dev                       # Next dev server (default port 3000; PORT env overrides)
npm run build                     # Production build
npm run start                     # Run built app (PORT env)
npm run lint                      # ESLint (bare `eslint`)

npm run db:migrate:dev            # Prisma migrate (dev / SQLite)
npm run db:migrate:deploy         # Prisma migrate deploy (prod / Postgres schema)
npm run db:generate:postgres      # Generate client against Postgres schema
npm run db:studio                 # Prisma Studio
npm run db:seed                   # Seed menu + admin user (tsx prisma/seed.ts)

npm run i18n:sync                 # Translate uk → en via DeepL (hash-tracked). RUN AFTER ANY UI COPY CHANGE.
npm run i18n:sync:menu            # Same, for data/menu.json
npm run i18n:check                # Validate translation completeness

npm run test:e2e                  # Playwright E2E (now wired up — contrary to old CLAUDE.md)
npm run test:e2e:ui               # Playwright UI mode
```

> ⚠️ A Husky `prepare` hook is installed (`"prepare": "husky"`) — git hooks run on install/commit.

## Top-level repository layout

```
src/
  app/
    layout.tsx              # Minimal root — delegates to locale layout
    globals.css, mobile.css # Global styles (NB: no overflow on html/body — see macOS scroll memory)
    robots.ts, sitemap.ts   # SEO (both locales, hreflang)
    global-error.tsx
    [locale]/               # ALL public pages (uk + en) — see MAP-ROUTES.md
    admin/                  # Admin panel & CMS (NOT localized) — see MAP-ADMIN.md
    api/                    # All API routes (public + admin + payment + telegram) — see MAP-COMMERCE.md
    actions/                # Server actions: availability.ts, booking.ts
  components/
    layout/                 # Header, Footer
    sections/               # Home* sections + shared page sections
    ui/                     # shadcn primitives + project widgets (BookingDialog, etc.)
    admin/, content/        # ImageUploader; EditableText/EditableImage (live CMS)
    hotel/, cottages/, menu/, restaurant/, sauna/, seo/, analytics/, providers/, dev/
  constants/                # index.ts (services/nav/contact), fontPairings.ts
  data/menu.json            # Restaurant menu source (bilingual)
  i18n/                     # routing.ts, request.ts
  lib/                      # Domain + storage + notify + payment + auth — see MAP-DATA.md
  types/                    # Shared TS types (booking, cart, menu, sauna, aquapark, next-auth.d.ts)
  middleware.ts             # next-intl locale routing
prisma/
  schema.prisma             # SQLite (dev)
  schema.postgres.prisma    # Postgres (prod) — MUST stay in sync with dev schema
  migrations/, seed.ts, dev.db
messages/
  uk.json, en.json          # Translations (+ .hashes.json tracking)
scripts/                    # i18n/ (sync, check, glossary) + deploy/ops (vps-*.sh, nginx, backup, seed-admin, migrate-sqlite-to-postgres)
docs/                       # This documentation
bot/                        # SEPARATE Telegram (Telegraf) bot service — own package.json, Dockerfile, prisma, src
Dockerfile, docker-compose*.yml, .github/workflows/   # Containerization + CI/CD — see MAP-DEPLOY.md
```

## Key architectural facts to remember

1. **Everything public lives under `src/app/[locale]/`.** `uk` has no URL prefix; `en` is prefixed `/en/...` (`localePrefix: as-needed`).
2. **Admin is NOT localized** — it lives at `src/app/admin/` (no `[locale]`), UI in Ukrainian.
3. **Two databases, two schemas** — edits to `schema.prisma` must be mirrored in `schema.postgres.prisma`.
4. **Payments are polymorphic** — one LiqPay create/callback endpoint serves all 4 flows via an `{type}-{id}` order_id encoding (`src/lib/payment-router.ts`).
5. **Room data has three layers**: static catalog (`hotel-catalog.ts`) + static prices/inventory (`room-prices.ts`, `room-inventory.ts`) + DB overrides via SiteContent (`room-config.ts`). Admin edits the overrides.
6. **Sequential human-readable numbers** avoid collisions: orders 1001+, hotel 5001+, sauna 7001+, aquapark 9001+.
7. **i18n discipline**: any UI copy change must be followed by `npm run i18n:sync` so `en.json` never goes stale.
