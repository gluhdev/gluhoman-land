# Admin management — Web + Telegram

How operators manage bookings/orders from the web admin and the Telegram bot.
Both surfaces call ONE shared seam: `changeStatus()` in `src/lib/status-service.ts`
(load → hotel-scope → idempotency → mutate via existing storage → notify).

## Web admin

- **`/admin/today`** is the operational cockpit: every row (orders, hotel
  arrivals, aquapark, sauna) has action buttons (Confirm / Cancel / Mark Ready /
  Delivered / Complete / Refund) that POST `{type,id,action}` to
  `POST /api/admin/status`.
- The 4 existing status endpoints and the `updateBookingStatus` action now route
  through `changeStatus`, so a status change also notifies operators and (on
  confirm/cancel) the guest by email.

## Telegram bot — single webhook transport

The **in-app webhook bot** (`src/lib/telegram-bot.ts`, on `TELEGRAM_BOT_TOKEN`)
is the one and only bot. The standalone `bot/` Telegraf poller is **deprecated**
and must NOT run on the same token (a Telegram token serves one transport only).

Setup:
1. `TELEGRAM_ADMIN_CHAT_IDS` = comma-separated Telegram **user** ids allowed to
   manage (default **closed** — empty = nobody). Get an id from `@userinfobot`.
2. `TELEGRAM_WEBHOOK_SECRET` = any random string (verifies incoming updates).
3. Register the webhook (once, after deploy), e.g. from the server:
   ```
   curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d url=https://<host>/api/telegram/webhook \
     -d secret_token=$TELEGRAM_WEBHOOK_SECRET
   ```
4. Stop the standalone poller: `docker compose -f docker-compose.prod.yml rm -sf bot`.

### Admin actions

- **Notification buttons** — every "new order/booking/…" operator message carries
  inline buttons. Tap **✅ Підтвердити / ✖️ Скасувати** (aquapark: Скасувати /
  ♻️ Повернення). The bot authorizes the tapper against `TELEGRAM_ADMIN_CHAT_IDS`,
  applies the change via `changeStatus` (idempotent — a second tap says
  "Вже виконано"), notifies the guest, and edits the message to stamp the result
  and drop the buttons.
- **`/pending`** — lists open bookings + orders, each with the same buttons.
- **`/book`** — create a booking in chat: hotel → room → check-in → check-out →
  guests → name → phone → confirm. Reuses `createBookingCore` (the same code the
  web "manual booking" uses). Conversation state is in-memory (15-min TTL, lost
  on redeploy — fine for a short flow).

### `callback_data` format

`action:entity:id` — e.g. `confirm:order:clx123`, `cancel:reservation:ab12`.
`entity` ∈ `order | reservation | hotel | sauna | aquapark`. `id` is the cuid (keeps
it under Telegram's 64-byte limit). Never put names/phones in `callback_data`.

### Notes

- `reservation` = canonical `Booking`; `hotel` = legacy `HotelBooking`. Both get
  buttons (distinct prefixes).
- Refunds set status only — they do **not** reverse money in LiqPay (manual
  finance step; LiqPay is stub for now anyway).
- Callback queries have no per-update secret (unlike the webhook header), so admin
  security rests on the `TELEGRAM_ADMIN_CHAT_IDS` allowlist.
