# Hotel Booking Runbook

Operational notes for running the hotel booking + LiqPay payment flow in production.

## Environment variables

Set these in `.env` on the VPS next to `docker-compose.yml`. They are read by
the `gluhoman` service (see `docker-compose.yml`).

### Required for LiqPay

```
LIQPAY_PUBLIC_KEY=i00000000000      # from my.liqpay.ua → merchant → keys
LIQPAY_PRIVATE_KEY=sandbox_xxxxxx   # sandbox_ prefix for test mode, real for prod
STUB_PAYMENTS=0                     # set to 1 only to bypass LiqPay during local dev
```

If either LiqPay key is missing or empty, the app falls back to **stub mode**
(auto-marks bookings as paid). Any non-empty value for `STUB_PAYMENTS` also
forces stub mode. Make sure both are set correctly before accepting real
customers.

### Required for public URLs / redirects

```
NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua
```

Used by LiqPay to build the success/fail redirects and the server-to-server
callback URL. Must match the domain LiqPay can reach.

### Notifications (optional but recommended)

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

RESEND_API_KEY=...
BOOKING_EMAIL_FROM=booking@gluhoman.com.ua
BOOKING_EMAIL_TO=owner@gluhoman.com.ua
```

## LiqPay dashboard configuration

1. Log in to <https://my.liqpay.ua>.
2. Merchant → API → callback URL: `https://gluhoman.com.ua/api/payment/liqpay/callback`
3. Merchant → API → result URL: `https://gluhoman.com.ua/hotel/booking/success`
4. Copy public + private keys into `.env` on the VPS.

LiqPay posts `data` + `signature` (form-encoded) to the callback URL. The
server verifies the signature with `LIQPAY_PRIVATE_KEY` and updates the
booking payment status in the database.

## DNS requirement

The callback URL must be reachable from LiqPay's servers over HTTPS. Until
`gluhoman.com.ua` points to the current VPS (72.60.16.73), real LiqPay
callbacks will not arrive. Options:

- Point the domain at the VPS (recommended).
- Use a temporary subdomain (e.g., `booking.gluhoman.com.ua`) with Let's
  Encrypt and update both LiqPay and `NEXT_PUBLIC_SITE_URL` to that subdomain
  until the main domain is ready.

While testing, you can keep `STUB_PAYMENTS=1` and verify the full flow
locally — bookings will be marked paid automatically without talking to
LiqPay.

## Persistent uploads volume

Admin-uploaded room photos are stored under `/app/public/uploads` inside the
container, which is bind-mounted to `./uploads` on the host. First-time
deploy:

```bash
mkdir -p uploads
chmod 755 uploads
docker compose up -d --build
```

Back up `./uploads` alongside the database if you want room photos to
survive VPS recreation.

## Verifying a test booking

1. Admin: log in, open `/admin/hotel/rooms/new`, create a test room with at
   least one uploaded photo.
2. Guest: open `/hotel/booking`, pick dates, pick that room, fill customer
   details, click "Сплатити".
3. Sandbox path: LiqPay sandbox form opens, complete test payment. On
   callback the booking flips to `paymentStatus=paid`.
4. Stub path: no LiqPay redirect; the app jumps straight to
   `/hotel/booking/success?id=<booking-id>` with paid status.
5. Admin: find the booking in `/admin/hotel/bookings` and confirm it shows
   paid + appears on the calendar.

## Troubleshooting

- **Callback 401 from LiqPay logs** — wrong `LIQPAY_PRIVATE_KEY`. Re-copy
  from the LiqPay dashboard and redeploy.
- **Booking stuck in `pending`** — availability endpoint auto-cancels
  pending bookings older than 30 minutes. If LiqPay callback never arrived,
  verify the callback URL is publicly reachable (`curl -v`). Recreate the
  booking from the admin panel if the guest still wants it.
- **Double-booking attempt** — the create endpoint runs the availability
  check inside a Prisma transaction, so overlapping writes are rejected.
  If you see one anyway, check that both writers were hitting the same
  database.
