# 💳 Commerce & Booking Flows

> Four commerce flows, one polymorphic payment layer, Telegram + email notifications. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index and [MAP-DATA.md](MAP-DATA.md) for the underlying models.

## The shared shape

```
UI (client) → API route / server action → Prisma storage
            → POST /api/payment/liqpay/create  → LiqPay (or stub) 
            → POST /api/payment/liqpay/callback → markPaid() → notify (Telegram + email)
            → success/fail page (polls entity until paymentStatus = paid)
```

| Flow | Payment | QR/Scan | Number range | Storage |
|------|---------|---------|--------------|---------|
| Hotel booking | LiqPay | — | 5001+ | `booking-storage.ts` |
| Sauna booking | optional | — | 7001+ | `sauna-storage.ts` |
| Aquapark tickets | LiqPay | ✓ | 9001+ | `aquapark-storage.ts` |
| Menu order | LiqPay | — | 1001+ | `order-storage.ts` |

> Note: there are **two hotel-booking paths**. The public marketing flow writes the legacy **`Booking`** model (via `BookingDialog` + `src/app/actions/booking.ts`, scoped by `hotelSlug`/`roomCategorySlug`). The CRM/checkout path writes the structured **`HotelBooking`** model (via `/hotel/booking` `BookingFlow` + `/api/hotel/bookings`). Keep this distinction in mind when touching availability or admin.

---

## 1. Hotel booking

- **UI:** `src/components/ui/BookingDialog.tsx` (global modal), `src/components/hotel/HotelBookingTrigger.tsx`, `src/components/cottages/CottageBookingTrigger.tsx`; full stepper at `src/app/[locale]/hotel/booking/BookingFlow.tsx`.
- **Availability:** `GET /api/hotel/availability` and `/api/hotel/availability/month` (per-day free-room grid). Plus server actions in `src/app/actions/availability.ts`.
- **Create:** `POST /api/hotel/bookings` → `bookingStorage.create()`. Fetch: `GET /api/hotel/bookings/[id]`.
- **Pages:** `/hotel/booking`, `/hotel/booking/success` (`BookingSuccessClient.tsx`, polls), `/hotel/booking/fail`.
- **Notify:** `src/lib/booking-notify.ts`. **Types:** `src/types/booking.ts`.
- **Model:** `HotelBooking` — nights × pricePerNight, unique (roomId, checkIn, checkOut).

## 2. Sauna booking

- **UI:** `src/app/[locale]/sauna/booking/SaunaBookingFlow.tsx` (date → 2h slot grid → details); price components `src/components/sauna/PriceGrid.tsx` + `PriceList.tsx`.
- **Availability:** `GET /api/sauna/availability?date=…` → virtual slots (`saunaStorage.getAvailability`). No pre-seeding; DB unique (date, startTime, saunaType) prevents double-booking.
- **Create/fetch:** `POST /api/sauna/bookings`, `GET /api/sauna/bookings/[id]`.
- **Pages:** `/sauna/booking[/success|/fail]` (`SaunaSuccessClient.tsx`).
- **Notify:** `sauna-notify.ts`. **Types:** `sauna.ts` (`TIME_WINDOWS`, `SAUNA_PRICE` 2000 грн/slot).

## 3. Aquapark tickets (QR)

- **UI:** `src/app/[locale]/aquapark/buy/BuyFlow.tsx` (date → tariff quantities → details).
- **Tariffs:** `GET /api/aquapark/tariffs`. **Create/fetch:** `POST /api/aquapark/tickets`, `GET /api/aquapark/tickets/[id]`.
- **QR:** generated on create (`qrcode` lib); shown on success (`TicketSuccessClient.tsx`).
- **Admin scan:** `/admin/aquapark/scan` (`ScannerClient.tsx`, `html5-qrcode`) → `POST /api/admin/aquapark/scan` → validates `paymentStatus=paid` & not already `used` → sets status `used` (prevents reuse).
- **Pages:** `/aquapark/buy[/success|/fail]`. **Notify:** `aquapark-notify.ts`. **Types:** `aquapark.ts`.

## 4. Restaurant menu ordering

- **Cart:** `src/lib/cart-store.ts` (zustand + localStorage; subtotal / deliveryFee / total). UI: `src/components/menu/{AddToCartButton,CartButton,CartDrawer,DishCard,...}.tsx`.
- **Checkout:** `src/app/[locale]/menu/checkout/CheckoutForm.tsx` (delivery vs pickup, address, scheduledAt, comment).
- **Create/fetch:** `POST /api/orders` (server recalculates totals — never trusts client), `GET /api/orders/[id]`.
- **Pages:** `/menu/checkout[/success|/fail]` (`SuccessClient.tsx`).
- **Notify:** `order-notify.ts`. **Types:** `cart.ts` (`MIN_ORDER` 500, `DELIVERY_FEE` 100, `FREE_DELIVERY_THRESHOLD` 2000 грн).

---

## Payments (LiqPay)

One endpoint pair serves all four flows.

- **Create:** `POST /api/payment/liqpay/create` — body `{ entityType: 'order'|'hotel'|'aquapark'|'sauna', entityId }` (also accepts legacy `{ orderId }`). Resolves the entity via `lookupEntity()`, then:
  - **Stub mode** (no `LIQPAY_PUBLIC_KEY`/`LIQPAY_PRIVATE_KEY`): immediately marks paid → success. *Default in dev.*
  - **Real:** returns `{ data, signature, endpoint }`; the client POSTs a hidden form to `https://www.liqpay.ua/api/3/checkout`.
- **Callback:** `POST /api/payment/liqpay/callback` — verifies signature `base64(SHA1(privateKey + data + privateKey))`, decodes `order_id` = `{type}-{id}`, then `markPaid(type, id, paymentId)` on success / `markFailed` on failure.
- **Router:** `src/lib/payment-router.ts` — `encodeOrderId`/`decodeOrderId`, `lookupEntity`, `markPaid`/`markFailed`. `markPaid` updates the entity (`paymentStatus='paid'`, stores `paymentExternalId`) and fires the matching `notifyNew*()` (fire-and-forget, `.catch(()=>{})`).
- **Helpers:** `src/lib/liqpay.ts` (encode/sign/verify, stub detection).
- **Model:** `Payment` (polymorphic — one of orderId/hotelBookingId/aquaparkTicketId/saunaSlotId).

**Env:** `LIQPAY_PUBLIC_KEY`, `LIQPAY_PRIVATE_KEY`, `LIQPAY_MODE` (production|sandbox|stub).

## Telegram + email notifications

- **Low-level:** `src/lib/telegram.ts` (`callTelegram(method, params)`, no deps, global fetch).
- **Bot logic:** `src/lib/telegram-bot.ts` (message formatting + `handleUpdate`).
- **Webhook:** `POST /api/telegram/webhook` (validates secret header).
- **Admin setup:** `/admin/telegram` (`SetupClient.tsx`) → `/api/admin/telegram/{info,set-webhook}`.
- **Trigger:** every paid transaction → `payment-router.markPaid` → the flow's `*-notify.ts` → Telegram message + Resend email.

**Env:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ORDERS_EMAIL_TO`/`BOOKING_EMAIL_TO`, `*_EMAIL_FROM`.

## Success-page polling

Success pages poll their entity endpoint (~1s) until `paymentStatus === 'paid'`, so the UX updates after the LiqPay redirect without a manual refresh.
