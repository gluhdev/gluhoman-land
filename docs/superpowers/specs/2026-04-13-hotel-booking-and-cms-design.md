# Hotel Booking v2 + Site Content CMS — Design Spec

**Date:** 2026-04-13
**Project:** gluhoman-land (Next.js 15 / React 19 / Prisma / Tailwind v4)
**Status:** Approved for implementation
**Order:** Hotel Booking first, then CMS

---

## Context

The site already has a partial hotel booking system:
- Prisma models `HotelRoom`, `HotelBooking` (`src/lib/booking-storage.ts`)
- API routes: `/api/hotel/availability`, `/api/hotel/bookings`, `/api/hotel/bookings/[id]`
- LiqPay integration in `src/lib/liqpay.ts`, `/api/payment/liqpay/{create,callback}`, polymorphic order_id `{type}-{id}`
- Admin CRUD skeleton: `src/app/admin/hotel/rooms/*`, `src/app/admin/hotel/bookings/*`
- Guest `BookingFlow.tsx` (3-step) in `src/app/hotel/booking/`

Goal: bring this to a production-quality, owner-operable state, then add a visual content editor so the non-technical owner can update all marketing copy and photos themselves.

Scope is explicitly split into two sequential projects:
1. **Hotel Booking v2** (this first)
2. **Site Content CMS** (after booking is done and verified)

Laznya (sauna) booking is out of scope for this iteration — treated separately later.

---

## Project 1 — Hotel Booking v2

### Goals
- Owner can add/edit/delete rooms (photos, prices, description, capacity) entirely through the admin UI — no code touch.
- Owner can manage every booking A→Z from the admin panel: see calendar, create manual bookings, edit, change status, cancel.
- Guests can book a room from the public site with a smooth mobile-first flow and pay online via LiqPay.
- System is reliable: no double-booking, no stuck pending bookings, admin gets notified on new bookings.

### Non-goals
- Refund/chargeback flow (manual for now)
- Multi-language (Ukrainian only)
- Loyalty, discount codes, promocodes
- Email marketing integrations

### Etap 0 — Admin Rooms CRUD + Photo Upload

**What works today:** `src/app/admin/hotel/rooms/` has list, new, edit pages and a `RoomForm` component. Prisma stores room fields incl. `images JSON`.

**What's missing:** Real file upload. Form likely only accepts image URLs.

**Changes:**
- New endpoint `POST /api/admin/upload` (admin-auth protected):
  - Accepts `multipart/form-data`, field `file`
  - Validates: image/jpeg, image/png, image/webp; max 5 MB
  - Saves to `/public/uploads/YYYY/MM/<uuid>.<ext>`
  - Returns `{ url, width, height, size }`
  - On VPS: `/public/uploads` mounted as Docker volume (`./uploads:/app/public/uploads`) so uploads persist across redeploys. Update `docker-compose.yml` and document in deploy script.
- `RoomForm` updates:
  - Multi-image uploader with drag & drop, live preview, reorder via drag-handle, delete
  - Required fields: `number`, `type` (standard/lux/family), `capacity`, `pricePerNight`, `description`, `images[]`, `active`
  - Ukrainian labels, brand colors
- Preview card inside admin form showing "as guest sees it"
- Delete protection: cannot delete a room with active (non-cancelled/completed) bookings — show friendly error

**Acceptance:** Owner can create a new room from scratch, upload 5 photos, save, see it live on `/hotel/booking` flow availability results.

### Etap 1 — Admin Bookings A→Z

**What works today:** List with status filter, detail page with status change buttons.

**Additions:**

1. **Calendar grid view** at `/admin/hotel/calendar`:
   - X-axis: days of selected month (paginate by month)
   - Y-axis: active rooms
   - Cells colored by booking status (pending=жовт, paid=синій, confirmed=зелений, completed=сірий, cancelled=червоний striped)
   - Click cell → booking detail
   - Click empty cell → "Create manual booking" with that room + date pre-filled

2. **Manual booking creation** `POST /api/admin/hotel/bookings/manual`:
   - Admin form: room, checkIn, checkOut, guests, guest name/phone/email/comment, payment mode (`online` / `cash` / `paid-offline`)
   - Creates booking in `confirmed` status if cash/offline, skips LiqPay flow
   - Same availability transaction guard as public booking

3. **Edit existing booking** `PUT /api/admin/hotel/bookings/[id]`:
   - Change dates (with availability re-check), room, guest info, comment
   - Not editable if status `completed` or `cancelled` (historical record)

4. **Status transitions** (already partially there):
   - `pending` → `paid` (auto via LiqPay callback, or manual "Mark as paid")
   - `paid` → `confirmed` (admin confirms intention)
   - `confirmed` → `completed` (guest checked out)
   - Any → `cancelled` (with required reason field)

5. **Filters in list view:** date range, status, room, search by guest name/phone

6. **Export:** verify existing `/api/admin/export/hotel-bookings` returns CSV with all fields; add date-range query param.

**Acceptance:** Admin can do everything end-to-end from the panel: see calendar, create a booking from a phone call, edit, confirm, cancel, export month's report.

### Etap 2 — Guest BookingFlow v2

**Current `BookingFlow.tsx`:** 3-step (search → rooms → confirm), works but date pickers are basic and there's no visibility of which dates are already booked.

**Changes:**

1. New endpoint `GET /api/hotel/availability/month?year=&month=&roomType=`:
   - Returns per-day `{ date, availableRoomCount }` for the month
   - Used to render the calendar with greyed-out fully-booked dates

2. `BookingFlow` step 1 — Search:
   - Range date picker (e.g., `react-day-picker`) with booked dates disabled
   - Guest count selector
   - "Знайти номер" button

3. Step 2 — Room selection:
   - Card per available room: image carousel, type badge, capacity, price per night, total = nights × price
   - "Обрати" CTA

4. Step 3 — Contacts + payment:
   - Form: name, phone (required), email (optional), comment
   - Submit → `POST /api/hotel/bookings` → `POST /api/payment/liqpay/create` → redirect to LiqPay
   - Inline errors, loading states

5. Mobile-first: calendar full width on small screens, sticky price summary at bottom

**Acceptance:** From a phone, a guest can see real occupancy, pick dates, pick a room, pay via LiqPay, and land on a success page confirming their booking number.

### Etap 3 — LiqPay in Production

1. Create `/hotel/booking/success` page:
   - Reads `?id=<hotelBookingId>` from URL
   - Polls `GET /api/hotel/bookings/[id]` every 2s until `paymentStatus=paid` or timeout (30s)
   - Shows booking number, dates, room, total; "Дякуємо, ми зв'яжемось для підтвердження"
2. Create `/hotel/booking/fail` page with "Спробувати знову" → links back to BookingFlow
3. Environment variables on VPS:
   - `LIQPAY_PUBLIC_KEY`, `LIQPAY_PRIVATE_KEY` (real keys)
   - `NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua` (or VPS IP until DNS repointed)
   - `STUB_PAYMENTS=0`
4. Verify callback URL `https://<host>/api/payment/liqpay/callback` is reachable from LiqPay servers (test with LiqPay sandbox first)
5. On `paymentStatus=paid` → Telegram notify admin (already wired via `booking-notify.ts` — verify)
6. Document the env vars and DNS requirement in a short runbook in `docs/BOOKING_RUNBOOK.md`

**Known external dependency:** The domain `gluhoman.com.ua` currently points to a legacy site, not the VPS. LiqPay callback will only work from the final public domain. Until DNS is repointed, test end-to-end via VPS IP with LiqPay sandbox mode.

### Etap 4 — Reliability

1. **Transactional availability check** — verify existing `POST /api/hotel/bookings` uses a Prisma transaction that re-queries availability inside the same tx. If not, add.
2. **Auto-cancel stale pending bookings:**
   - On every call to `/api/hotel/availability`, sweep bookings with `paymentStatus=pending` and `createdAt < now-30min`, set status `cancelled`, reason "payment timeout"
   - This piggybacks on natural traffic — no cron needed
3. **Guest confirmation notification:**
   - On `paymentStatus=paid`, if phone present → send Telegram bot message to guest (only if guest has started bot) — deferred to v2 since it requires guest bot interaction; for now just admin notify
4. **Double-payment guard:** `POST /api/payment/liqpay/create` already checks existing `paymentStatus` — verify it returns early if already `paid`

**Acceptance:** Impossible to book the same room for overlapping dates from two parallel sessions. Pending bookings auto-expire. Admin always gets notified. No double charges.

---

## Project 2 — Site Content CMS (after Booking is done)

### Goal
Non-technical owner can edit all marketing copy and hero images through the admin panel without touching code.

### Approach: Structured content with code fallback + admin forms + optional pencil overlay

### Data model

```prisma
model SiteContent {
  key       String   @id           // e.g., "home.hero.title"
  type      String                 // 'text' | 'richtext' | 'image' | 'images' | 'number' | 'url'
  value     Json                   // string or object per type
  updatedAt DateTime @updatedAt
  updatedBy String?
}
```

### Component wrappers

All server components, read from DB on each request (cached per-request with React cache):

```tsx
<EditableText k="home.hero.title" fallback="Відпочинок у Глухомані" as="h1" className="..." />
<EditableRich k="hotel.intro" fallback={<><p>...</p></>} />
<EditableImage k="home.hero.bg" fallback="/images/hero.jpg" alt="..." className="..." sizes="..." />
<EditableList k="home.features.items" fallback={DEFAULT_FEATURES} render={(item) => ...} />
```

Implementation: `getContent(key)` helper with `React.cache` to batch lookups per render.

### Editable scope (explicit keys only)

Listed explicitly per page in the spec — not every DOM node is editable. Scope limited to what the owner will realistically want to change:

- **Home:** hero title/subtitle/bg, story paragraph, features items, services descriptions, location description, reviews list, booking CTA copy
- **Hotel page:** hero, intro paragraph, amenities list, hero image
- **Aquapark/Restaurant/Sauna:** same pattern (hero + intro + key image)
- **Contact info:** phone, address, hours (shared in header/footer) — stored in special keys `contact.phone`, `contact.address`, `contact.hours`
- **Privacy / Terms:** full page richtext
- **NOT editable:** navigation structure, button labels, legal boilerplate in code, dev-facing strings

### Admin `/admin/content`

- Tree navigation by page → section
- Each section is a form with typed fields; "Save" writes to `SiteContent`, calls `revalidatePath('/page/...')`
- "Reset to default" button deletes the row → site re-renders with fallback
- Image fields use the same `POST /api/admin/upload` endpoint as hotel rooms
- Preview button opens the target page in a new tab

### Optional pencil overlay (v2)

- In an authorized admin session, site renders a small "🖉" icon next to each `<EditableText>` / `<EditableImage>`
- Click → opens `/admin/content/<path>?focus=<key>` in a side panel
- Implemented as a provider that checks `session.role === 'admin'` and exposes context to editable wrappers
- Can be deferred indefinitely; not required for MVP owner handover

### Migration plan
For each editable key, start with `fallback` in code equal to current hardcoded string. Owner can progressively override. Zero breakage risk.

---

## Shared infrastructure

- `POST /api/admin/upload` — single endpoint used by both projects
- `/public/uploads` Docker volume
- Admin auth — existing NextAuth session with role check (verify `role==='admin'` middleware on all `/api/admin/*` routes)

---

## Open questions / deferred

- Final production domain + DNS cutover timing
- Real room data (count, photos, prices) from client — proceed with placeholders until provided
- Guest-side Telegram confirmations (needs bot interaction; deferred)
- Refund flow (manual for now)

---

## Acceptance for full Booking v2
Owner can:
1. Create a brand new room (photos uploaded through admin) and see it on the public booking flow.
2. Receive a test booking from a mobile phone, paid via LiqPay sandbox, land on success page with booking number.
3. See that booking in the admin calendar and list.
4. Create a second booking manually from the admin (simulating a phone call), see it on calendar.
5. Cancel a booking with a reason.
6. Export a CSV of this month's bookings.
7. Verify no double-booking is possible from two parallel browsers.
