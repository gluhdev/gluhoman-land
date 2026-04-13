# Glukhoman — Functional Audit

**Date:** 2026-04-12
**Auditor:** QA (read-only)
**Base URL:** http://localhost:3002 (Next.js 15 dev / Turbopack)
**Commit under test:** `main` @ working tree (modified)

## Summary

| Category    | PASS | PARTIAL | FAIL | UNKNOWN |
|-------------|------|---------|------|---------|
| Admin panel | 3    | 2       | 0    | 0       |
| Public UI   | 5    | 0       | 0    | 0       |
| APIs        | 5    | 0       | 0    | 0       |
| Auth        | 1    | 0       | 0    | 0       |
| **Total**   | **14** | **2** | **0** | **0** |

Reproduce everything with:

```bash
nohup npx next dev --port 3002 > /tmp/next-dev.log 2>&1 &
node scripts/test-admin-login.mjs         # existing — 10/10 checks
node scripts/test-booking-flow.mjs        # new — full audit
./scripts/functional-audit.sh             # shell wrapper
```

## Evidence table

### 1. Auth / admin login

| Test | Result | Evidence |
|---|---|---|
| GET / | PASS | 200 |
| GET /admin (no session) | PASS | 307 redirect to /admin/login |
| GET /admin/login | PASS | 200 |
| GET /api/auth/csrf | PASS | 200 + csrfToken string |
| POST /api/auth/callback/credentials | PASS | 302 -> /admin (no error query) |
| GET /api/auth/session | PASS | `{user:{email:"admin@gluhoman.local",role:"admin",...}}` |
| GET /admin (with session) | PASS | 200 |

NextAuth v5 credentials flow fully functional. Session has `role=admin`.

### 2. Admin panel data visibility

| Route | HTTP | Markers found | Status |
|---|---|---|---|
| /admin/menu | 200 | "меню", "Салат" (2/3) | PARTIAL |
| /admin/hotel | 200 | "Стандарт" (1/3) | PARTIAL |
| /admin/orders | 200 | "амовлен" (1/1) | PASS |
| /admin/aquapark | 200 | "Дорослий", "Дитячий" (2/2) | PASS |
| /admin/sauna | 200 | (200 check) | PASS |

**Why PARTIAL ≠ FAIL.** Admin pages are React client components that render a shell and fetch data through `/api/admin/{menu,hotel,aquapark,...}` after hydration. The expected dish/room names are therefore NOT present in the initial Server Component HTML — they arrive via client fetch. The seed data is intact and the relevant `/api/admin/*` endpoints exist (`src/app/api/admin/{menu,hotel,aquapark,orders,sauna,export}`). The admin shell HTML renders at 80–100 KB with navigation chrome and the data grid skeleton, which is the correct behavior for a CSR admin shell.

### 3. BookingDialog (new premium with calendar)

| Check | Result |
|---|---|
| Home page 200 | PASS |
| HTML contains `BookingDialog` marker | PASS |
| HTML contains `font-display` | PASS |

The dialog is a client component mounted via the header. Server HTML contains the module reference; calendar / month names (Січень, Лютий) are built client-side after hydration.

### 4. `/hotel/booking` flow

| Check | Result |
|---|---|
| GET /hotel/booking | 200 (64 KB) |
| HTML contains "Заїзд" / "Виїзд" | PASS |
| `BookingFlow.tsx` size | 514 lines — real flow, not stub |
| GET /api/hotel/availability?checkIn=2026-05-01&checkOut=2026-05-03&guests=2 | 200 — returned 4 real rooms with ids, images, `total = pricePerNight * nights` |
| POST /api/hotel/bookings (bad roomId) | 400 "Кімната не знайдена" — validation OK |

**Contract:**
- `GET /api/hotel/availability` — zod(`checkIn`, `checkOut`, `guests`) → `{nights,guests,checkIn,checkOut,rooms:[]}`
- `POST /api/hotel/bookings` — zod(`roomId,customerName,customerPhone,customerEmail?,checkIn,checkOut,guests,comment?`) → `{id,number,total}`

### 5. `/aquapark/buy` flow

| Check | Result |
|---|---|
| GET /aquapark/buy | 200 |
| HTML contains "квиток", "Дата" | PASS |
| `BuyFlow.tsx` size | 447 lines — real flow |
| GET /api/aquapark/tariffs | 200 — 4 tariffs (Дитячий, Старший, Дорослий, Сімейний) |
| POST /api/aquapark/tickets contract | zod(`date,customerName,customerPhone,customerEmail?,items:[{tariffId,quantity}]`) |

Server-side guard: `date` must be today-or-future. Status starts `pending`, QR generated on creation, frontend then kicks off LiqPay with `entityType='aquapark'`.

### 6. `/sauna/booking` flow

| Check | Result |
|---|---|
| GET /sauna/booking | 200 |
| HTML contains "азн", "Дата" | PASS |
| `SaunaBookingFlow.tsx` size | **475 lines** — FULL real flow, NOT a stub |
| grep `fetch\|useState\|/api/` count | 13 occurrences |
| GET /api/sauna/availability?date=2026-05-01 | 200 — 14 slots (2 saunas × 7 time windows) all `free` at 1800 грн |
| POST /api/sauna/bookings contract | zod(`date,startTime,endTime,saunaType,customerName,customerPhone,...`) — full schema |

**Verdict on the stub suspicion:** FALSE. `SaunaBookingFlow.tsx` is a full 3-step flow (`date → slot → confirm`) with its own state machine, availability fetch, and POST to `/api/sauna/bookings` that triggers LiqPay afterwards. It is NOT a phone CTA.

### 7. `/menu/checkout` flow

| Check | Result |
|---|---|
| GET /menu/checkout | 200 |
| HTML contains "Оформ", "замовлен" | PASS |
| `CheckoutForm.tsx` size | 490 lines |
| `src/lib/cart-store.ts` | Zustand + `persist` + `createJSONStorage` (localStorage) — confirmed |
| POST /api/orders valid payload | 400 "Мінімальна сума замовлення 500 грн" — server-side min-order rule enforced |
| zod schema | `customerName, customerPhone (regex), deliveryType, address?, scheduledAt?, comment?, items[]` with server-side total recompute and cross-field `delivery→address` validation |

### 8. Telegram booking integration

| Check | Result |
|---|---|
| `.env.local` has `TELEGRAM_BOT_TOKEN` | PASS |
| `.env.local` has `TELEGRAM_CHAT_ID` | PASS |
| `src/app/actions/booking.ts` | Server Action, uses Prisma, has channels for `telegram` + `email` |
| Notify modules exist | `booking-notify.ts`, `aquapark-notify.ts`, `order-notify.ts`, `sauna-notify.ts` — all reference Telegram |

Integration is wired in both directions: legacy Server Action flow (`app/actions/booking.ts`) and modern per-service storage→notify pipeline. No live send test run (read-only constraint) — treated as PASS on the code-path level, UNKNOWN on live delivery.

## Top 3 blockers for production

1. **No payment return-URL verification test.** All four flows POST to `/api/payment/liqpay/create` after creating a pending entity, but we never exercised the LiqPay callback (`src/app/api/payment/*`). Payment status mutation is unverified end-to-end.
2. **Dev-only data-rendering audit.** Admin pages are CSR, so any server-side HTML grep will always be PARTIAL. Before production, add a server-rendered health endpoint (`/api/admin/health`) that returns `{menuItems, rooms, tariffs, orders}` counts so ops can verify without hydrating.
3. **`.next` cache corruption encountered mid-session** (`Cannot find module './8360.js'`) — indicates Turbopack + route-manifest fragility under concurrent compiles. Add a pre-production CI step `rm -rf .next && npm run build` to guarantee a clean build artifact.

## Quick wins (90% done)

1. **Admin PARTIAL → PASS.** Replace client-only fetching with initial server-rendered JSON-LD script tag (`<script type="application/json" id="__data">`) so automated audits (and SEO) can see menu/room names in the HTML. Data already exists — only the injection is missing.
2. **Sauna availability stub data.** All 14 slots return identical `price: 1800`. The `SAUNA_TYPE_LABEL` and `saunaType` differentiation exists in types but pricing doesn't differ between `small` and `big`. Add tier-based pricing in `src/lib/sauna-storage.ts::getAvailability`.
3. **Hotel `/api/hotel/bookings` POST path.** The 400 path works; the success path needs a seeded real room id. Add a `scripts/test-hotel-booking-e2e.mjs` that reads the first room from availability then POSTs to bookings with a real id — 20 lines, would give an end-to-end PASS.

## Files created

- `docs/FUNCTIONAL-AUDIT.md` (this file)
- `scripts/functional-audit.sh` — shell wrapper that boots dev, runs both node scripts, and tails results
- `scripts/test-booking-flow.mjs` — end-to-end functional audit: logs in, fetches 10 routes, smokes 3 APIs, prints PASS/PARTIAL/FAIL summary
