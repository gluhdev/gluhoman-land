# Booking redesign — full-page, booking.com-style flow

**Date:** 2026-05-29
**Branch:** `feat/i18n-english`
**Status:** Design — approved direction, pending spec review

## Problem

Hotel room bookings currently open `BookingDialog` — a single 1604-line modal (custom
`gluhoman:booking:open` event) that crams a 3-step, 4-service flow into a `max-w-5xl`
box with `document.body` scroll-locked. Verified via Playwright: tiny room thumbnails,
the page behind is frozen, the user scrolls inside an 860px box that barely moves. The
client called it unusable ("шляпа") and asked for a full **page** where rooms are
browsable like booking.com — a proven flow guests already understand.

A full-page flow already exists at `/hotel/booking` (`BookingFlow.tsx`) but:
- nothing links to it (all room cards open the modal),
- it is date-first (search → results), not room-browsable,
- **it runs on a separate, semi-orphaned data model** with no notifications.

## Two booking systems (key constraint)

The codebase has two divergent persistence paths. The redesign must consolidate on the
**canonical** one.

| | **Canonical (live)** | **BookingFlow (orphaned)** |
|---|---|---|
| Store | Prisma `Booking` (`hotelSlug`, `roomCategorySlug`, payment fields) | Prisma `HotelRoom` / `HotelBooking` (`roomId`, `number` 5001+) |
| Rooms data | static `room-prices.ts` / `room-gallery.ts` / `room-inventory.ts` + i18n | DB `HotelRoom` rows |
| Submit | `submitBooking()` server action | `POST /api/hotel/bookings` (`bookingStorage`) |
| Notifications | ✅ Telegram + Email | ❌ none |
| Availability | `checkAvailability()` (inventory-based) | `bookingStorage.findAvailableRooms()` |
| Used by | room cards, **admin panel, calendar, payments** | only the hidden `/hotel/booking` |

**Decision:** build everything on the **canonical** system. Retire `BookingFlow.tsx`,
`POST /api/hotel/bookings`, and the `HotelRoom`/`HotelBooking` model (left dormant; not
deleted in phase 1 to avoid migration risk — flagged for later removal).

## Approved product decisions

1. **Layout:** room-results page **per hotel** (booking.com style).
2. **Modal:** removed everywhere; every service gets a full page.
3. **Room payment:** **required to confirm** — booking persists `PENDING`, guest is sent
   to LiqPay, and Telegram/Email fire on the **payment-success callback**. An abandoned
   payment leaves a `PENDING` row (admin-visible) but produces no confirmed lead /
   notification. Applies to **rooms only**.
4. **Restaurant / aquapark / sauna:** request-based (no payment) — immediate
   `submitBooking` + Telegram/Email, exactly as the modal does today.
5. **Generic CTAs** (Header / Footer / Hero / FloatingButtons) → `/booking` hub.

## Architecture

### Routes

| Route | Purpose |
|---|---|
| `/hotel/booking` | **Centerpiece.** Room-results page. Hotel selector + dates/guests + room list with galleries + reserve. Deep-link params: `?hotel=&room=&from=&to=&adults=&children=`. |
| `/restaurant/booking` | Full-page restaurant form (date, time, guests, occasion, dietary). |
| `/aquapark/booking` | Full-page aquapark form (date, tariff, adults/kids/toddlers). |
| `/sauna/booking` | Full-page sauna form (date, slot, group size, programme). |
| `/booking` | Hub: 4 service cards (Готель / Аквапарк / Ресторан / Лазня) → route to the above. |
| `/hotel/booking/success`, `/fail` | Reused for LiqPay return (already exist). |

All under `src/app/[locale]/…`. Hotel pages (`/hotel/central` etc.) stay as marketing
pages; their room "Забронювати" buttons become `<Link>`s to
`/hotel/booking?hotel=<slug>&room=<roomSlug>`.

### `/hotel/booking` — components & data flow

Server component `page.tsx` reads `searchParams`, loads room config (prices, galleries,
inventory, i18n copy) for the selected hotel, and renders a client island.

```
BookingRoomsPage (server)
 ├─ resolve hotel from ?hotel (default: central); load that hotel's rooms from
 │  HOTEL_CATALOG + room-prices + room-gallery + room-inventory + i18n room copy
 └─ <RoomResults> (client)
     ├─ <SearchBar>   sticky: hotel tabs · date-range (Calendar) · guests stepper
     ├─ for each room: <RoomResultCard>
     │     ├─ <RoomGalleryCarousel>  prev/next + thumbnail strip (per-room photos)
     │     ├─ name · capacity · amenities (i18n bullets)
     │     ├─ <RoomPrice> per-occupancy tiers (existing component)
     │     ├─ availability badge ← checkAvailability(hotel, room, from, to)
     │     └─ [Забронювати] → opens <ReservePanel> for that room
     └─ <ReservePanel> (per selected room)
           name · phone · email · comment → submit
```

- **Availability:** on date/guest change, call `checkAvailability()` per visible room
  (server action). Full rooms show "немає вільних на ці дати" and a disabled CTA.
- **Reserve submit:** create canonical `Booking` (`PENDING`) via a new server action
  `createRoomReservation()` (wraps `submitBooking` for `service: "hotel"`), then call
  `POST /api/payment/liqpay/create` with `{ entityType: 'reservation', entityId: bookingId }`
  and auto-submit the returned LiqPay form (existing `document.createElement('form')`
  pattern). Amount = `suggestedReservationAmount()` (tiers × nights) from `room-config.ts`.
- **Confirmation:** LiqPay → `/hotel/booking/success?id=…`.

### Payment + notification wiring

- Reuse `POST /api/payment/liqpay/create` (`entityType: 'reservation'` already in its
  Zod enum) and the existing callback → `payment-router.markPaid('reservation', id)`.
- **Gap to close:** `markPaid` for the `reservation`/hotel path must send Telegram +
  Email on success. Extract the notification block from `submitBooking` into a reusable
  `notifyBooking(booking)` helper and call it from `markPaid` (reservation) instead of at
  creation time. `submitBooking` keeps calling `notifyBooking` immediately for the
  request-based services (restaurant/aquapark/sauna).

### Restaurant / aquapark / sauna pages

Port each service's existing modal step (same fields, same validation messages, same
i18n keys under `ui.booking_dialog_*`) into a full-page form that calls `submitBooking`
directly and shows the existing success panel inline. No payment.

### Retiring the modal

1. Replace every `openBookingDialog(...)` call site with navigation:
   - `HotelBookingTrigger` → `<Link href="/hotel/booking?hotel=…&room=…">`.
   - `MenuBookingCTA` → `/restaurant/booking`.
   - `FloatingButtons`, `Header`, `Footer`, `HomeHero`, `HomeServices`, `HomeBookingCta`,
     `HeroSlider`, `BookingButton` → `/booking` (or service-specific where known).
2. Remove `<BookingDialog/>` mount and delete `BookingDialog.tsx` + the
   `openBookingDialog`/`gluhoman:booking:open` event module.
3. Leave `BookingFlow.tsx` / `/api/hotel/bookings` / `HotelRoom` model dormant; flag for
   a later cleanup PR.

## i18n

Reuse existing `ui.booking_dialog*` namespaces; add a new `booking_page` namespace for
page-level chrome (hub cards, search bar labels, results headings, reserve panel). Every
new key added to **both** `messages/uk.json` and `messages/en.json` (run `npm run
i18n:sync`).

## Components to add

- `src/app/[locale]/hotel/booking/page.tsx` (rewrite — server)
- `src/app/[locale]/hotel/booking/RoomResults.tsx` (client)
- `src/components/booking/RoomResultCard.tsx`
- `src/components/booking/RoomGalleryCarousel.tsx` (extract gallery from modal)
- `src/components/booking/SearchBar.tsx` (hotel tabs + dates + guests)
- `src/components/booking/ReservePanel.tsx`
- `src/app/[locale]/booking/page.tsx` (hub)
- `src/app/[locale]/restaurant/booking/page.tsx`, `…/aquapark/booking`, `…/sauna/booking`
- `src/app/actions/booking.ts` → add `createRoomReservation()`, extract `notifyBooking()`

## Sequencing

- **Phase 1 (centerpiece):** `/hotel/booking` room-results page + reserve→LiqPay +
  `notifyBooking` extraction + rewire room-card buttons. Ship and verify first.
- **Phase 2:** restaurant/aquapark/sauna full-page forms + `/booking` hub + rewire
  generic CTAs.
- **Phase 3:** delete `BookingDialog.tsx`, remove all dispatch sites, retire orphaned
  BookingFlow path.

## Out of scope

- Deleting the `HotelRoom`/`HotelBooking` Prisma model (separate migration PR).
- Changing admin panel, calendar, or pricing/inventory data.
- New photography (only existing `/public/images` assets).

## Verification

- `npx tsc --noEmit` and `npm run lint` clean.
- Playwright: room-results page scrolls normally (no body lock), gallery works, reserve →
  LiqPay redirect, deep-link `?hotel=&room=` preselects, mobile layout usable.
- Manual: a paid sandbox booking appears in admin + sends Telegram; an abandoned payment
  leaves a `PENDING` row and no notification.
