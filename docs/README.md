# 📚 Documentation Index

Start here. The **`MAP-*.md`** set (written 2026-05-29 from a full codebase audit) is the **current source of truth** for how the site is built. The older docs below are kept for reference but may be partially stale — trust `MAP-*` where they disagree.

## 🗺️ Current structure docs (source of truth)

| Doc | Covers |
|-----|--------|
| [MAP-OVERVIEW.md](MAP-OVERVIEW.md) | **Read first** — tech stack, repo layout, index, key architectural facts |
| [MAP-ROUTES.md](MAP-ROUTES.md) | i18n + every public route, home sections, header/footer, SEO |
| [MAP-ADMIN.md](MAP-ADMIN.md) | Auth & roles, all `/admin/*` pages, server actions, SiteContent CMS |
| [MAP-DATA.md](MAP-DATA.md) | Prisma models (dual schema), hotel/room domain, constants, types, `src/lib/*` |
| [MAP-COMMERCE.md](MAP-COMMERCE.md) | The 4 booking/commerce flows, LiqPay payments, Telegram notifications |
| [MAP-API.md](MAP-API.md) | Every `src/app/api/*` endpoint (method + auth) + server actions |
| [MAP-ENV.md](MAP-ENV.md) | All environment variables, grouped |
| [MAP-STYLING.md](MAP-STYLING.md) | Design system: palette, fonts, Tailwind v4, scroll gotcha |
| [MAP-DEPLOY.md](MAP-DEPLOY.md) | Docker/VPS, nginx/TLS, CI/CD, Postgres migrations, prod gotchas |
| [MAP-I18N.md](MAP-I18N.md) | Translation namespaces + `i18n:sync` workflow |
| [MAP-COMPONENTS.md](MAP-COMPONENTS.md) | Inventory of every `src/components/*` |
| [MAP-BOT.md](MAP-BOT.md) | The standalone `bot/` Telegraf admin bot |

## 📦 Older reference docs (may be stale)

**Architecture / setup** — superseded by `MAP-*`:
- `ARCHITECTURE.md` ⚠️ stale (Russian, pre-i18n 4-page model) → use `MAP-OVERVIEW.md`
- `SETUP.md`, `TECH_STACK.md`

**Deployment / ops** — accurate but scattered; consolidated in `MAP-DEPLOY.md`:
- `DEPLOYMENT.md`, `VPS-SETUP.md`, `PRODUCTION.md`, `CI-CD.md`, `OPERATIONS.md`

**Telegram bot** — see `MAP-BOT.md`:
- `BOT-DEPLOY.md`, `TELEGRAM_BOT.md`

**Plans / runbooks** (historical intent, not necessarily current):
- `CRM_PLAN.md`, `MENU_PAGE_PLAN.md`, `BOOKING_RUNBOOK.md`

**Security & testing:**
- `SECURITY.md`, `TESTING.md`, `ADMIN-LOGIN-TEST.md`

**Audit reports** (point-in-time snapshots):
- `A11Y-AUDIT.md`, `MOBILE-AUDIT.md`, `FUNCTIONAL-AUDIT.md`, `LIGHTHOUSE-REPORT.md`, `IOS-DEFINITIVE-FIX.md`, `IOS-RESEARCH.md`

> Note: `CLAUDE.md` (repo root) is the agent-guidance file. Its top now points here; some of its lower sections are historical — `MAP-*` overrides.
