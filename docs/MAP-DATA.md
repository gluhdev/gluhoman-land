# 🗄️ Data Layer & Domain Model

> Prisma, the hotel/room domain, constants, types, and every `src/lib/*` module. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index.

## Prisma — dual schema

| File | Use |
|------|-----|
| `prisma/schema.prisma` | **SQLite**, development (`prisma/dev.db`) |
| `prisma/schema.postgres.prisma` | **PostgreSQL**, production |
| `src/lib/prisma.ts` | Singleton client (global-cached to survive hot reload; logs warn+error in dev, error in prod) |

⚠️ **The two schemas must be kept in sync manually.** They're identical except the datasource provider line. Any model/field change goes in **both**.

`prisma/seed.ts` (`npm run db:seed`): idempotent — upserts menu categories/items from `src/data/menu.json` by slug, and creates an admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env (dev fallback `admin@gluhoman.local` / `admin123`).

`prisma/migrations/`: `init` → `crm_phase2` (menu/orders/hotel/aquapark/sauna/payments) → `site_content` → `add_booking_hotel_room_slugs` → (latest) `hotelSlug` on User.

### Models

| Model | Key fields | Notes |
|-------|-----------|-------|
| **User** | email, password_hash, name, `role` (admin\|manager), **`hotelSlug`** | `hotelSlug=null` ⇒ super-admin; else scoped |
| **Booking** (legacy) | service, status, name, phone, email, guests, dateFrom/dateTo, time, comment, **hotelSlug**, **roomCategorySlug**, telegram/email delivery status, ip/userAgent | enums: `BookingService` (HOTEL/AQUAPARK/RESTAURANT/SAUNA), `BookingStatus`, `DeliveryStatus`. Indexed on service/status/dateFrom/createdAt/hotelSlug/roomCategorySlug. Public booking flow writes here |
| **MenuCategory** | slug, name, icon, order, active → `items[]` | |
| **MenuItem** | slug, name, description, price(грн), weight, image, active, order, categoryId → category, orderItems[] | |
| **Order** | number(unique, 1001+), status, paymentStatus, customerName/Phone, deliveryType, address, scheduledAt, comment, subtotal, deliveryFee, total, items, payment, paymentExternalId | status: PENDING→PAID→CONFIRMED→PREPARING→DELIVERING→COMPLETED/CANCELLED |
| **OrderItem** | orderId, menuItemId, name+price snapshot, quantity | |
| **HotelRoom** | number(unique), type (standard\|lux\|family), capacity, pricePerNight, description, images(JSON), active → bookings[] | CRM rooms (distinct from the static catalog) |
| **HotelBooking** | number(unique, 5001+), roomId, customer\*, checkIn/checkOut, guests, total, status, paymentStatus, comment | unique (roomId, checkIn, checkOut) |
| **AquaparkTariff** | name, price, description, active → tickets[] | |
| **AquaparkTicket** | number(unique, 9001+), date, customer\*, items, total, status, paymentStatus, payment, **qrCode(unique)** | status: pending→paid→used→cancelled→refunded |
| **AquaparkTicketItem** | ticketId, tariffId, name+price snapshot, quantity | |
| **SaunaSlot** | number(unique, 7001+), date, startTime/endTime, saunaType (small\|big), customer\*, status, paymentStatus, payment, total, comment | unique (date, startTime, saunaType) — DB-level anti-double-book. Slots are virtual/computed, not pre-seeded |
| **Payment** (polymorphic) | provider (liqpay\|monobank\|stub), externalId(unique), status, amount, currency, payload(JSON), **one of** orderId\|hotelBookingId\|aquaparkTicketId\|saunaSlotId | routed by `payment-router.ts` |
| **SiteContent** | key(unique), type (text\|richtext\|image\|number\|url), value(JSON), updatedAt, updatedBy | CMS — dotted-path keys (see [MAP-ADMIN.md](MAP-ADMIN.md#sitecontent-cms)) |

## Hotel & room domain

Room data exists in **three layers** that merge at request time:

1. **Static catalog** — `src/lib/hotel-catalog.ts`: `HOTEL_CATALOG`, 4 hotels / ~17 room categories.
   - `aquapark` (6 cats), `central` (5 cats), `brewery` (2 cats), `cottages` (4 cottages: yaga/lisovyk/teremok/terem-lux).
   - Each `CatalogRoom`: `{ slug, nameKey (i18n), priceKey (SiteContent), photo }`. Hotel = `{ slug, nameKey, rooms[] }`.
   - Legacy key safety: also accepts `"central:brewery-balcony"`.
2. **Static prices & inventory:**
   - `src/lib/room-prices.ts` — `ROOM_PRICES: Record<string, PriceTiers | null>` where `PriceTiers = Record<guests, грн/night>` (e.g. `{1:3600,2:3900,3:4450,4:5000}`; `null` = "Ціна за запитом"). Helpers: `priceTiers()`, `priceForGuests()`, `priceFrom()`, `formatUAH()`. Keyed `"<hotel>:<slug>"`. Source: summer 2026 price docx.
   - `src/lib/room-inventory.ts` — `ROOM_INVENTORY: Record<string, number>` (counts; total ~49 rooms).
3. **DB overrides** — `src/lib/room-config.ts` (server-only): merges the statics with SiteContent overrides (`room.<hotel>.<slug>.tiers` / `.count`). Exports `getRoomConfigMap()` (full config + override flags, for the admin UI), `getPriceOverrides()`, `resolvedInventory()`. Falls back to statics if DB is unavailable.

**Availability** — `src/app/actions/availability.ts` (server actions):
- `checkAvailability(hotelSlug, roomCategorySlug, fromISO, toISO)` → `{ ok, total, booked, available, tracked }`. Counts overlapping non-cancelled `Booking` rows (`existing.from < req.to && existing.to > req.from`) against `resolvedInventory`.
- `getRoomPriceOverrides()` — wraps `getPriceOverrides()` for client components (used by `BookingDialog`).
- `getAllRoomPrices()` — loads all `*.price` SiteContent display strings.

> The public booking system uses the **catalog (slug-based)**; the admin CRM uses **HotelRoom DB rows**; the legacy **Booking** model bridges them via `hotelSlug` + `roomCategorySlug` strings.

## Constants & types

- `src/constants/index.ts` — `CONTACT_INFO` (phones/address/hours), `MAIN_SERVICES` (4 cards), `ADDITIONAL_SERVICES` (extras), `NAVIGATION` (derived header/footer nav). Adding an item here propagates to the nav.
- `src/constants/fontPairings.ts` — Cyrillic-verified Google Font pairs for the `FontSwitcher` preview tool.
- `src/types/`:
  - `index.ts` — `ServiceCard`, `ContactInfo`, `HeroSection`, `Service`.
  - `booking.ts` — `HotelRoom`, `HotelBooking`, statuses, `ROOM_TYPE_LABEL`, `getNights()`.
  - `cart.ts` — `CartItem`, `Order`, `OrderInput`, statuses; `MIN_ORDER` 500 грн, `DELIVERY_FEE` 100 грн, `FREE_DELIVERY_THRESHOLD` 2000 грн, `formatPrice()`.
  - `menu.ts` — `MenuItem`, `MenuCategory`, `Menu`.
  - `sauna.ts` — `SaunaType`, statuses, `TIME_WINDOWS` (7×2h slots 10:00–24:00), `SAUNA_PRICE` ({small:2000,big:2000}), `VirtualSlot`.
  - `aquapark.ts` — `AquaparkTariff`, `AquaparkTicket(Item)`, statuses.
  - `next-auth.d.ts` — augments Session/User/JWT with `id`, `role`, `hotelSlug`.

## `src/lib/*` modules

**Storage (Prisma-backed singletons, all expose create/get/updatePayment/updateStatus/list):**
- `order-storage.ts` (`orderStorage`, numbers 1001+)
- `booking-storage.ts` (`bookingStorage`, 5001+; `listRooms`, `isAvailable`, `findAvailableRooms`)
- `aquapark-storage.ts` (`aquaparkStorage`, 9001+; generates QR, `getByQr`)
- `sauna-storage.ts` (`saunaStorage`, 7001+; `getAvailability(date)` virtual grid)

**Notifications** (Telegram + email, fire-and-forget): `order-notify.ts`, `booking-notify.ts`, `aquapark-notify.ts`, `sauna-notify.ts`.

**Comms:** `telegram.ts` (low-level Bot API `callTelegram`), `telegram-bot.ts` (message formatting + `handleUpdate` webhook dispatch).

**Payments:** `liqpay.ts` (base64+SHA1 sign/verify, stub mode), `payment-router.ts` (polymorphic `lookupEntity`/`markPaid`/`markFailed`, `{type}-{id}` order_id encoding). See [MAP-COMMERCE.md](MAP-COMMERCE.md#payments-liqpay).

**Auth/admin/content:** `auth.ts` (NextAuth config), `admin-hotels.ts` (hotel registry/labels), `site-content.ts` + `content-schema.ts` (CMS).

**Utilities:** `cart-store.ts` (zustand + localStorage cart), `csv.ts` (UTF-8 BOM exports), `analytics.ts` (Plausible `trackEvent`), `blur-placeholder.ts` (`BLUR_DATA_URL`), `use-is-touch.ts` (disable parallax/Lenis on touch/mobile/reduced-motion), `utils.ts` (`cn` classname helper, etc.).

## Menu data — `src/data/menu.json`

```jsonc
{ "categories": [ {
  "id": "kholodni-zakusky", "name": "Холодні закуски", "icon": "🍢",
  "items": [ { "id": "...", "name": "...", "price": 550, "weight": "100 г",
               "image": "https://static.shaketopay.com.ua/...",
               "name_en": "...", "description": "...", "description_en": "..." } ]
} ] }
```

Bilingual (uk + `*_en` keys), images on the shaketopay CDN. Synced to Prisma by `seed.ts`; EN kept current via `npm run i18n:sync:menu`.
