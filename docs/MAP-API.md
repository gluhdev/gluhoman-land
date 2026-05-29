# 🔌 API Reference

> Every route under `src/app/api/`. Methods verified from the route files. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index; commerce flows are narrated in [MAP-COMMERCE.md](MAP-COMMERCE.md).

Auth column: **public** = no auth; **admin** = requires an authenticated admin session (next-auth); **signed** = verified by signature/secret (not a session).

## Public — booking & commerce

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/hotel/availability` | public | Room availability for a date range |
| GET | `/api/hotel/availability/month` | public | Per-day free-room grid for a month (calendar) |
| POST | `/api/hotel/bookings` | public | Create a `HotelBooking` |
| GET | `/api/hotel/bookings/[id]` | public | Fetch a booking (success page polls this) |
| GET | `/api/sauna/availability` | public | Virtual sauna slots for a given date |
| POST | `/api/sauna/bookings` | public | Create a `SaunaSlot` |
| GET | `/api/sauna/bookings/[id]` | public | Fetch a sauna slot |
| GET | `/api/aquapark/tariffs` | public | List active aquapark tariffs |
| POST | `/api/aquapark/tickets` | public | Create an `AquaparkTicket` (generates QR) |
| GET | `/api/aquapark/tickets/[id]` | public | Fetch a ticket |
| POST | `/api/orders` | public | Create a restaurant `Order` (server recalculates totals) |
| GET | `/api/orders/[id]` | public | Fetch an order |

## Payments & integrations

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/payment/liqpay/create` | public | Create payment session (`{entityType, entityId}`); stub-mode auto-pays |
| POST | `/api/payment/liqpay/callback` | signed | LiqPay webhook — verifies SHA1 signature, `markPaid`/`markFailed` |
| GET, POST | `/api/telegram/webhook` | signed | Telegram bot webhook (validates secret header) |
| — | `/api/auth/[...nextauth]` | — | next-auth handler (GET+POST exported via `handlers`) |

## Admin (require admin session)

| Method | Path | Purpose |
|--------|------|---------|
| GET, POST | `/api/admin/content` | Read / save SiteContent CMS values |
| POST | `/api/admin/upload` | Image upload (→ ImageUploader / EditableImage) |
| POST | `/api/admin/aquapark/scan` | Validate & consume a ticket QR (sets status `used`) |
| POST | `/api/admin/aquapark/tickets/[id]/status` | Change ticket status |
| PUT | `/api/admin/hotel/bookings/[id]` | Edit a hotel booking |
| POST | `/api/admin/hotel/bookings/[id]/status` | Change hotel-booking status |
| POST | `/api/admin/hotel/bookings/manual` | Create a manual hotel booking |
| POST | `/api/admin/orders/[id]/status` | Change order status |
| POST | `/api/admin/orders/manual` | Create a manual order |
| POST | `/api/admin/sauna/slots/[id]/status` | Change sauna-slot status |
| GET | `/api/admin/telegram/info` | Read bot/webhook info |
| POST | `/api/admin/telegram/set-webhook` | Register the Telegram webhook |
| GET | `/api/admin/export/orders` | CSV export — orders |
| GET | `/api/admin/export/hotel-bookings` | CSV export — hotel bookings |
| GET | `/api/admin/export/aquapark-tickets` | CSV export — aquapark tickets |
| GET | `/api/admin/export/sauna-slots` | CSV export — sauna slots |

CSV exports use `src/lib/csv.ts` (UTF-8 BOM + semicolon separators for Excel UA).

## Server actions (not HTTP routes)

Some mutations bypass API routes and use `'use server'` actions instead:
- `src/app/actions/booking.ts` — legacy public `Booking` create + **per-hotel Telegram routing** (`chatIdForHotel`, see [MAP-COMMERCE.md](MAP-COMMERCE.md#telegram--email-notifications)).
- `src/app/actions/availability.ts` — `checkAvailability`, `getRoomPriceOverrides`, `getAllRoomPrices`.
- `src/app/admin/*/actions.ts` — admin CRUD (`saveRoomConfig`, staff CRUD, menu, aquapark, hotel, bookings) → Prisma + `revalidatePath`.
