# Booking Page — Phase 1 (room-results page, end-to-end) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cramped booking modal (for hotel rooms) with a full-page, booking.com-style room-results experience at `/hotel/booking`, built on the canonical `Booking` system, where each room shows a large gallery, per-occupancy price, live availability, and a Reserve→LiqPay (pay-to-confirm) flow that sends Telegram/Email on payment success.

**Architecture:** Server component (`page.tsx`) reads `searchParams` (`?hotel=&room=&from=&to=&adults=&children=`) as the source of truth, assembles per-room view-models from the existing static config + i18n, and renders a client island (`RoomResults`). A sticky `AvailabilityBar` mutates the URL (router.replace + transition) to re-run availability. Reserve creates a `PENDING` `Booking` with `totalAmount`, then POSTs to the existing LiqPay create route and auto-submits the LiqPay form. `markPaid('reservation')` confirms the booking and fires notifications via a newly-extracted shared `reservation-notify` module.

**Tech Stack:** Next.js 15.5 App Router (async `searchParams`), React 19 (`useTransition`/`useActionState`), TypeScript, Tailwind v4, next-intl, Prisma, the repo's custom `Calendar` (range mode), `embla-carousel-react` (already installed), LiqPay.

**Project reality (verification):** There is **no unit-test runner** wired up (per `CLAUDE.md`). Verification gates per task are: `npx tsc --noEmit`, `npm run lint`, and Playwright e2e scripts under `.playwright-audit/` (the existing inspection workflow). Dev server: `npm run dev` (already running on :3000; routes resolve without a locale prefix, e.g. `http://localhost:3000/hotel/booking`).

**Design tokens (match `src/app/[locale]/hotel/central/page.tsx`):** cream bg `#faf6ec`, green `#1a3d2e`, ink `#0f1f18`, cream accent `#e6d9b8`, warm-gold accent for primary CTAs (brand memory: green+white+gold only, never blue/purple/teal). `font-display` for headings, italic accents. lucide icons (`Check`, `Users`, `ChevronLeft/Right`, `X`). **Never** put `overflow`/`overscroll` on `html`/`body` (macOS trackpad-scroll memory) — sticky/scroll only on inner containers.

---

## File Structure

**Create (backend/util/data):**
- `src/lib/reservation-notify.ts` — shared notifier for the canonical `Booking` (extracted from `booking.ts`): label maps, `buildEnrichedComment`, `formatMessage`, per-hotel Telegram routing, `notifyReservation()`. (NOT `booking-notify.ts` — that name is taken by the legacy CRM notifier.)
- `src/lib/liqpay-redirect.ts` — client util: `submitLiqPayForm(endpoint, data, signature)`.
- `src/lib/hotel-rooms.ts` — server view-model assembler: `getHotelRooms(hotel, locale)`, `getBookingHotels()`.

**Create (UI):**
- `src/app/[locale]/hotel/booking/RoomResults.tsx` — client orchestrator.
- `src/components/booking/AvailabilityBar.tsx` — sticky hotel tabs + date range + guests, URL-synced.
- `src/components/booking/RoomResultCard.tsx` — one room card.
- `src/components/booking/RoomGallery.tsx` — carousel + thumbnails + lightbox.
- `src/components/booking/ReservePanel.tsx` — guest form + summary + reserve→pay.

**Modify:**
- `src/app/actions/booking.ts` — refactor `submitBooking` onto `reservation-notify`; add `createRoomReservation()`.
- `src/lib/payment-router.ts` — fire `notifyReservation` in `markPaid('reservation')` (with idempotency guard).
- `src/app/[locale]/hotel/booking/page.tsx` — rewrite as the room-results server page.
- `src/components/hotel/HotelBookingTrigger.tsx` — button→`<Link>` to `/hotel/booking?hotel=&room=`.
- `messages/uk.json`, `messages/en.json` — add `booking_page` namespace.

**Left dormant (retired later, Phase 3):** `BookingFlow.tsx`, `/api/hotel/bookings`, `HotelRoom`/`HotelBooking` model.

---

### Task 1: Extract canonical-booking notifier into `reservation-notify.ts`

**Files:**
- Create: `src/lib/reservation-notify.ts`

This is a pure DRY extraction of the notification logic currently private inside
`src/app/actions/booking.ts` (lines 50–268, 333–406), so it can be reused by both
`submitBooking` (immediate) and `markPaid('reservation')` (on payment).

- [ ] **Step 1: Create the module with the full extracted code**

```ts
// src/lib/reservation-notify.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import type { BookingPayload, BookingService } from "@/app/actions/booking";

type ChannelName = "telegram" | "email";
interface ChannelResult { ok: boolean; channel: ChannelName; error?: string }

export const SERVICE_LABEL: Record<BookingService, string> = {
  hotel: "Готель", aquapark: "Аквапарк", restaurant: "Ресторан", sauna: "Лазня",
};
export const SERVICE_TO_DB: Record<BookingService, "HOTEL" | "AQUAPARK" | "RESTAURANT" | "SAUNA"> = {
  hotel: "HOTEL", aquapark: "AQUAPARK", restaurant: "RESTAURANT", sauna: "SAUNA",
};
const HOTEL_SLUG_LABEL: Record<NonNullable<BookingPayload["hotelSlug"]>, string> = {
  aquapark: "Готель-Аквапарк", central: "Центральний Готель",
  cottages: "Будиночки", brewery: "Корпус Броварні",
};
const ROOM_TYPE_LABEL: Record<NonNullable<BookingPayload["roomType"]>, string> = {
  standard: "Стандарт", family: "Сімейний", lux: "Люкс",
};
const TARIFF_LABEL: Record<NonNullable<BookingPayload["tariff"]>, string> = {
  full_day: "Повний день", half_day: "Пів дня",
};
const OCCASION_LABEL: Record<NonNullable<BookingPayload["occasion"]>, string> = {
  birthday: "День народження", business: "Бізнес-зустріч",
  romantic: "Романтична вечеря", casual: "Дружня зустріч", other: "Інше",
};
const PROGRAMME_LABEL: Record<NonNullable<BookingPayload["programme"]>, string> = {
  classic: "Класична", herbal: "Фіто", family: "Сімейна",
};
const SAUNA_SLOT_LABEL_UK: Record<string, string> = {
  morning: "Ранок 10:00–13:00", afternoon: "День 14:00–17:00", evening: "Вечір 18:00–22:00",
};

/** Service-specific fields flattened into the Booking.comment column. */
export function buildEnrichedComment(p: BookingPayload): string | null {
  const x: string[] = [];
  if (p.roomType) x.push(`Номер: ${ROOM_TYPE_LABEL[p.roomType]}`);
  if (p.adults != null) x.push(`Дорослих: ${p.adults}`);
  if (p.children != null) x.push(`Дітей: ${p.children}`);
  if (p.breakfast) x.push("Зі сніданком");
  if (p.tariff) x.push(`Тариф: ${TARIFF_LABEL[p.tariff]}`);
  if (p.adultsCount != null) x.push(`Дорослих: ${p.adultsCount}`);
  if (p.kidsCount != null) x.push(`Діти 3–12: ${p.kidsCount}`);
  if (p.toddlersCount != null) x.push(`До 3 років: ${p.toddlersCount}`);
  if (p.occasion) x.push(`Привід: ${OCCASION_LABEL[p.occasion]}`);
  if (p.dietary) x.push(`Дієта: ${p.dietary}`);
  if (p.programme) x.push(`Програма: ${PROGRAMME_LABEL[p.programme]}`);
  if (p.comment?.trim()) x.push(p.comment.trim());
  return x.length ? x.join(" · ") : null;
}

interface NotifyOpts { paid?: boolean; amount?: number }

function formatMessage(p: BookingPayload, bookingId: string, opts: NotifyOpts = {}): string {
  const header = opts.paid
    ? `✅ Оплачена бронь — ${SERVICE_LABEL[p.service]}`
    : `🌲 Нова заявка — ${SERVICE_LABEL[p.service]}`;
  const lines = [header, `🆔 #${bookingId.slice(0, 8)}`, `👤 ${p.name}`, `📞 ${p.phone}`];
  if (p.email) lines.push(`✉️ ${p.email}`);
  lines.push(`👥 Гостей: ${p.guests}`);
  if (p.hotelSlug) lines.push(`🏨 Готель: ${HOTEL_SLUG_LABEL[p.hotelSlug]}`);
  if (p.roomCategorySlug) lines.push(`🏷 Категорія: ${p.roomCategorySlug}`);
  if (p.service === "hotel") {
    lines.push(`📅 Заїзд: ${p.dateFrom}`);
    lines.push(`📅 Виїзд: ${p.dateTo}`);
    if (p.roomType) lines.push(`🛏 Номер: ${ROOM_TYPE_LABEL[p.roomType]}`);
    if (p.adults != null) lines.push(`👤 Дорослих: ${p.adults}`);
    if (p.children != null) lines.push(`🧒 Дітей: ${p.children}`);
    if (p.breakfast) lines.push(`🥐 Зі сніданком`);
  } else if (p.service === "restaurant") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    lines.push(`🕐 Час: ${p.time}`);
    if (p.occasion) lines.push(`🎉 Привід: ${OCCASION_LABEL[p.occasion]}`);
    if (p.dietary) lines.push(`🥗 Дієта: ${p.dietary}`);
  } else if (p.service === "aquapark") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    if (p.tariff) lines.push(`🎟 Тариф: ${TARIFF_LABEL[p.tariff]}`);
    if (p.adultsCount != null) lines.push(`👤 Дорослих: ${p.adultsCount}`);
    if (p.kidsCount != null) lines.push(`🧒 Діти 3–12: ${p.kidsCount}`);
    if (p.toddlersCount != null) lines.push(`👶 До 3 років: ${p.toddlersCount}`);
  } else if (p.service === "sauna") {
    lines.push(`📅 Дата: ${p.dateFrom}`);
    if (p.time) lines.push(`🕐 Час: ${SAUNA_SLOT_LABEL_UK[p.time] ?? p.time}`);
    if (p.programme) lines.push(`🌿 Програма: ${PROGRAMME_LABEL[p.programme]}`);
  }
  if (opts.amount) lines.push(`💳 Сума: ${opts.amount} грн`);
  if (p.comment) lines.push(`💬 ${p.comment}`);
  return lines.join("\n");
}

function chatIdForHotel(hotelSlug?: BookingPayload["hotelSlug"]): string | undefined {
  if (hotelSlug === "aquapark" && process.env.TELEGRAM_CHAT_ID_AQUAPARK) return process.env.TELEGRAM_CHAT_ID_AQUAPARK;
  if (hotelSlug === "central" && process.env.TELEGRAM_CHAT_ID_CENTRAL) return process.env.TELEGRAM_CHAT_ID_CENTRAL;
  if (hotelSlug === "cottages" && process.env.TELEGRAM_CHAT_ID_COTTAGES) return process.env.TELEGRAM_CHAT_ID_COTTAGES;
  if (hotelSlug === "brewery" && process.env.TELEGRAM_CHAT_ID_BREWERY) return process.env.TELEGRAM_CHAT_ID_BREWERY;
  return process.env.TELEGRAM_CHAT_ID;
}

async function sendTelegram(message: string, hotelSlug?: BookingPayload["hotelSlug"]): Promise<ChannelResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chatIdForHotel(hotelSlug);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }), cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[reservation] Telegram error:", res.status, body);
      return { ok: false, channel: "telegram", error: `HTTP ${res.status}: ${body}` };
    }
    return { ok: true, channel: "telegram" };
  } catch (e) {
    console.error("[reservation] Telegram network error:", e);
    return { ok: false, channel: "telegram", error: e instanceof Error ? e.message : String(e) };
  }
}

async function sendEmail(payload: BookingPayload, message: string): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const to = process.env.BOOKING_EMAIL_TO;
  const subject = `Нова заявка — ${SERVICE_LABEL[payload.service]} — ${payload.name}`;
  const text = payload.email
    ? `${message}\n\nВідповідайте на цей лист, щоб зв'язатися з гостем.` : message;
  const body: Record<string, unknown> = {
    from, to: to!.split(",").map((s) => s.trim()).filter(Boolean), subject, text,
  };
  if (payload.email) body.reply_to = payload.email;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body), cache: "no-store",
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("[reservation] Resend error:", res.status, errBody);
      return { ok: false, channel: "email", error: `HTTP ${res.status}: ${errBody}` };
    }
    return { ok: true, channel: "email" };
  } catch (e) {
    console.error("[reservation] Resend network error:", e);
    return { ok: false, channel: "email", error: e instanceof Error ? e.message : String(e) };
  }
}

export interface NotifyResult { anyOk: boolean; hadChannels: boolean }

/**
 * Send Telegram + email for a Booking and persist delivery status on the row.
 * Used by submitBooking (immediate) and markPaid('reservation') (on payment).
 */
export async function notifyReservation(
  payload: BookingPayload, bookingId: string, opts: NotifyOpts = {}
): Promise<NotifyResult> {
  const message = formatMessage(payload, bookingId, opts);
  const telegramConfigured = !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  const emailConfigured =
    !!process.env.RESEND_API_KEY && !!process.env.BOOKING_EMAIL_FROM && !!process.env.BOOKING_EMAIL_TO;

  const channels: Promise<ChannelResult>[] = [];
  if (telegramConfigured) channels.push(sendTelegram(message, payload.hotelSlug));
  if (emailConfigured) channels.push(sendEmail(payload, message));

  if (channels.length === 0) {
    console.log(`[reservation] no channels configured — booking ${bookingId} stored only:\n${message}`);
    return { anyOk: false, hadChannels: false };
  }

  const results = await Promise.allSettled(channels);
  const find = (ch: ChannelName) =>
    results.find((r) => r.status === "fulfilled" && (r.value as ChannelResult).channel === ch) as
      | PromiseFulfilledResult<ChannelResult> | undefined;
  const tg = find("telegram"), em = find("email");

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        telegramStatus: tg ? (tg.value.ok ? "SENT" : "FAILED") : telegramConfigured ? "FAILED" : "PENDING",
        telegramError: tg ? tg.value.error || null : null,
        emailStatus: em ? (em.value.ok ? "SENT" : "FAILED") : emailConfigured ? "FAILED" : "PENDING",
        emailError: em ? em.value.error || null : null,
      },
    });
  } catch (e) {
    console.error("[reservation] failed to update delivery status:", e);
  }

  return { anyOk: results.some((r) => r.status === "fulfilled" && r.value.ok), hadChannels: true };
}
```

- [ ] **Step 2: Typecheck (will still pass — booking.ts not yet refactored, duplicate consts are fine across files)**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). The `import type` from `@/app/actions/booking` resolves the existing `BookingPayload`/`BookingService` types.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors for `src/lib/reservation-notify.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/reservation-notify.ts
git commit -m "feat(booking): extract canonical-booking notifier into reservation-notify

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Refactor `submitBooking` onto the shared notifier + add `createRoomReservation`

**Files:**
- Modify: `src/app/actions/booking.ts`

Goal: `submitBooking` keeps identical external behavior but delegates notification to
`notifyReservation`. Add `createRoomReservation` for the pay-to-confirm room flow.

- [ ] **Step 1: Replace the body of `booking.ts` below the type definitions.**

Keep lines 1–48 (the `"use server"`, imports, `BookingService`, `BookingPayload`,
`BookingResult` definitions). Add these imports at top (after existing imports):

```ts
import {
  SERVICE_TO_DB, buildEnrichedComment, notifyReservation,
} from "@/lib/reservation-notify";
import { suggestedReservationAmount, nightsBetween } from "@/lib/room-config";
```

Delete the now-moved private consts/functions (`HOTEL_SLUG_LABEL`, `SERVICE_LABEL`,
`SERVICE_TO_DB`, `ROOM_TYPE_LABEL`, `TARIFF_LABEL`, `OCCASION_LABEL`, `PROGRAMME_LABEL`,
`SAUNA_SLOT_LABEL_UK`, `ChannelName`, `ChannelResult`, `formatMessage`, `chatIdForHotel`,
`sendTelegram`, `sendEmail`). **Keep** `validate()`.

Replace `submitBooking` with:

```ts
export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  const error = validate(payload);
  if (error) return { ok: false, message: error };

  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") || null;
  const userAgent = headersList.get("user-agent") || null;

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        service: SERVICE_TO_DB[payload.service],
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || null,
        guests: payload.guests,
        dateFrom: new Date(payload.dateFrom),
        dateTo: payload.service === "hotel" && payload.dateTo ? new Date(payload.dateTo) : null,
        time: payload.time || null,
        comment: buildEnrichedComment(payload),
        hotelSlug: payload.hotelSlug ?? null,
        roomCategorySlug: payload.roomCategorySlug ?? null,
        ipAddress, userAgent,
      },
    });
  } catch (e) {
    console.error("[booking] DB persist failed:", e);
    return { ok: false, message: `Технічна помилка. Зателефонуйте нам: ${CONTACT_INFO.phone[0]}` };
  }

  const { anyOk } = await notifyReservation(payload, booking.id);
  const ref = booking.id.slice(0, 8);
  return {
    ok: true, bookingId: booking.id,
    message: anyOk
      ? `Дякуємо! Заявку #${ref} прийнято. Ми зв'яжемося з вами найближчим часом.`
      : `Заявку #${ref} збережено. Зателефонуйте нам для підтвердження: ${CONTACT_INFO.phone[0]}`,
  };
}
```

- [ ] **Step 2: Add `createRoomReservation` at the end of the file.**

```ts
export interface RoomReservationInput {
  hotelSlug: NonNullable<BookingPayload["hotelSlug"]>;
  roomCategorySlug: string;
  name: string;
  phone: string;
  email?: string;
  dateFrom: string; // ISO yyyy-mm-dd
  dateTo: string;   // ISO yyyy-mm-dd
  adults: number;
  children?: number;
  breakfast?: boolean;
  comment?: string;
}

export interface RoomReservationResult {
  ok: boolean;
  mode?: "pay" | "request";
  bookingId?: string;
  totalAmount?: number;
  message?: string;
  error?: string;
}

/**
 * Room booking with pay-to-confirm. If the room has a price, persist a PENDING
 * booking with totalAmount (NO notification yet — that fires on payment via
 * markPaid('reservation')) and return mode:'pay'. If the room is «за запитом»
 * (amount 0), fall back to submitBooking (immediate request + notify).
 */
export async function createRoomReservation(
  input: RoomReservationInput,
): Promise<RoomReservationResult> {
  const guests = input.adults + (input.children ?? 0);
  const payload: BookingPayload = {
    service: "hotel",
    name: input.name, phone: input.phone, email: input.email,
    guests, dateFrom: input.dateFrom, dateTo: input.dateTo,
    adults: input.adults, children: input.children, breakfast: input.breakfast,
    hotelSlug: input.hotelSlug, roomCategorySlug: input.roomCategorySlug,
    comment: input.comment,
  };

  const error = validate(payload);
  if (error) return { ok: false, error };

  const nights = nightsBetween(new Date(input.dateFrom), new Date(input.dateTo));
  const amount = await suggestedReservationAmount(
    input.hotelSlug, input.roomCategorySlug, guests, nights,
  );

  // «За запитом» → request flow (immediate notify, no payment)
  if (!amount || amount <= 0) {
    const res = await submitBooking(payload);
    return {
      ok: res.ok, mode: "request", bookingId: res.bookingId,
      message: res.message, error: res.ok ? undefined : res.message,
    };
  }

  // Pay-to-confirm → persist PENDING with totalAmount, NO notify here.
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") || null;
  const userAgent = headersList.get("user-agent") || null;

  try {
    const booking = await prisma.booking.create({
      data: {
        service: "HOTEL",
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email?.trim() || null,
        guests,
        dateFrom: new Date(input.dateFrom),
        dateTo: new Date(input.dateTo),
        comment: buildEnrichedComment(payload),
        hotelSlug: input.hotelSlug,
        roomCategorySlug: input.roomCategorySlug,
        totalAmount: amount,
        paymentStatus: "unpaid",
        ipAddress, userAgent,
      },
    });
    return { ok: true, mode: "pay", bookingId: booking.id, totalAmount: amount };
  } catch (e) {
    console.error("[reservation] DB persist failed:", e);
    return { ok: false, error: `Технічна помилка. Зателефонуйте нам: ${CONTACT_INFO.phone[0]}` };
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (Confirms `suggestedReservationAmount`/`nightsBetween` signatures match.)

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors. Remove any now-unused imports flagged.

- [ ] **Step 5: Smoke-check existing modal still submits.**

Run: `node .playwright-audit/inspect-booking.mjs` (existing script) — the mobile modal
should still open and the room/gallery render. (Submission path unchanged for the modal.)
Expected: `dialogOpened: true`, no console crash in `/tmp/gluhoman-dev.log`.

- [ ] **Step 6: Commit**

```bash
git add src/app/actions/booking.ts
git commit -m "feat(booking): submitBooking uses reservation-notify; add createRoomReservation

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Fire paid-notification in `markPaid('reservation')` (idempotent)

**Files:**
- Modify: `src/lib/payment-router.ts:180-200`

- [ ] **Step 1: Add import at top (after the existing `notifyNewBooking` import line).**

```ts
import { notifyReservation } from "@/lib/reservation-notify";
import type { BookingPayload } from "@/app/actions/booking";
```

- [ ] **Step 2: Replace the `if (type === 'reservation')` branch inside `markPaid`.**

```ts
  if (type === 'reservation') {
    // Idempotency: LiqPay can deliver duplicate callbacks. Skip notify if already paid.
    const before = await prisma.booking.findUnique({ where: { id } });
    if (!before) return;
    const alreadyPaid = before.paymentStatus === 'paid';

    const b = await prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED', paymentStatus: 'paid', paymentExternalId: externalId },
    });
    await prisma.payment.upsert({
      where: { bookingId: id },
      create: {
        provider: externalId?.startsWith('stub') ? 'stub' : 'liqpay',
        externalId, status: 'success', amount: b.totalAmount ?? 0, bookingId: id,
      },
      update: { status: 'success', externalId },
    });

    if (!alreadyPaid) {
      const payload: BookingPayload = {
        service: 'hotel',
        name: b.name, phone: b.phone, email: b.email ?? undefined,
        guests: b.guests,
        dateFrom: b.dateFrom.toISOString().slice(0, 10),
        dateTo: b.dateTo ? b.dateTo.toISOString().slice(0, 10) : undefined,
        comment: b.comment ?? undefined,
        hotelSlug: (b.hotelSlug ?? undefined) as BookingPayload['hotelSlug'],
        roomCategorySlug: b.roomCategorySlug ?? undefined,
      };
      notifyReservation(payload, b.id, { paid: true, amount: b.totalAmount ?? undefined })
        .catch((e) => console.error('[reservation] paid-notify failed', e));
    }
    return;
  }
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/payment-router.ts
git commit -m "feat(payments): notify on reservation payment success (idempotent)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: LiqPay redirect client util

**Files:**
- Create: `src/lib/liqpay-redirect.ts`

- [ ] **Step 1: Create the util (extracted from `BookingFlow.tsx`'s auto-submit pattern).**

```ts
// src/lib/liqpay-redirect.ts — client-only DOM helper
/** Auto-POST a LiqPay form to the gateway (full top-level navigation). */
export function submitLiqPayForm(endpoint: string, data: string, signature: string): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = endpoint;
  form.acceptCharset = "utf-8";
  for (const [name, value] of [["data", data], ["signature", signature]] as const) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export interface LiqPayCreateResponse {
  mode: "liqpay" | "stub" | "already-paid";
  data?: string;
  signature?: string;
  endpoint?: string;
  entity?: { successPath?: string };
}
```

- [ ] **Step 2: Typecheck + lint + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
```bash
git add src/lib/liqpay-redirect.ts
git commit -m "feat(payments): add submitLiqPayForm client util

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Room view-model assembler `hotel-rooms.ts`

**Files:**
- Create: `src/lib/hotel-rooms.ts`

Assembles, for a hotel, the per-room data the booking page needs, from the existing
sources: `HOTEL_CATALOG` (slugs + nameKey + priceKey + cover photo), i18n room copy,
`priceTiers`/overrides, `roomGallery`, `resolvedInventory`, and SiteContent price string.

> **Grounding the executor:** read these first to confirm exact APIs —
> `src/lib/hotel-catalog.ts` (shape of `HOTEL_CATALOG`, room `slug/nameKey/priceKey/photo`),
> `src/lib/room-prices.ts` (`priceTiers`, `priceFrom`, `PriceTiers`),
> `src/lib/room-gallery.ts` (`roomGallery(hotel, slug, cover)`),
> `src/lib/room-config.ts` (`getPriceOverrides`, `resolvedInventory`),
> `src/app/[locale]/hotel/central/page.tsx` (how `getText(key, fallback)` reads the
> SiteContent price, and the `hotel_central` i18n namespace + `rooms.<slug>.{name,tagline,
> capacity,bullet_1..7}` key convention), and how `getText` is imported there.

- [ ] **Step 1: Create the module.**

```ts
// src/lib/hotel-rooms.ts
import "server-only";
import { getTranslations } from "next-intl/server";
import { HOTEL_CATALOG } from "@/lib/hotel-catalog";
import { priceTiers, priceFrom, type PriceTiers } from "@/lib/room-prices";
import { roomGallery } from "@/lib/room-gallery";
import { getPriceOverrides, resolvedInventory } from "@/lib/room-config";
import { getText } from "@/lib/site-content"; // confirm import path from central/page.tsx

export type BookingHotelSlug = "aquapark" | "central" | "brewery" | "cottages";

/** i18n namespace per hotel (cottages differs from the hotel_* convention). */
const NS: Record<BookingHotelSlug, string> = {
  aquapark: "hotel_aquapark",
  central: "hotel_central",
  brewery: "hotel_brewery",
  cottages: "cottages",
};

/** SiteContent price key prefix per hotel (matches existing pages). */
const PRICE_PREFIX: Record<BookingHotelSlug, string> = {
  aquapark: "hotel.aquapark",
  central: "hotel.central",
  brewery: "hotel.brewery",
  cottages: "cottages",
};

export interface RoomVM {
  slug: string;
  name: string;
  tagline?: string;
  capacity?: string;
  amenities: string[];
  priceLabel: string;       // SiteContent string e.g. "від 3 600 грн" or «Ціна за запитом»
  tiers: PriceTiers | null; // per-occupancy
  priceFrom: number | null; // cheapest tier ₴
  gallery: string[];
  cover: string;
  inventory: number | null; // null = untracked (request-only)
}

export interface BookingHotelVM {
  slug: BookingHotelSlug;
  label: string;
  rooms: RoomVM[];
}

export function getBookingHotels(): { slug: BookingHotelSlug; nameKey: string }[] {
  return HOTEL_CATALOG.map((h) => ({ slug: h.slug as BookingHotelSlug, nameKey: h.nameKey }));
}

export async function getHotelRooms(
  hotel: BookingHotelSlug, locale: string,
): Promise<RoomVM[]> {
  const catalog = HOTEL_CATALOG.find((h) => h.slug === hotel);
  if (!catalog) return [];
  const t = await getTranslations({ locale, namespace: NS[hotel] });
  const overrides = await getPriceOverrides();

  const rooms = await Promise.all(
    catalog.rooms.map(async (r) => {
      const k = (suffix: string) => `rooms.${r.slug}.${suffix}`;
      const tiers = overrides[`${hotel}:${r.slug}`] ?? priceTiers(hotel, r.slug);
      const amenities: string[] = [];
      for (let i = 1; i <= 7; i++) {
        if (t.has(k(`bullet_${i}`))) {
          const v = t(k(`bullet_${i}`));
          if (v && v.length) amenities.push(v);
        }
      }
      const priceLabel = await getText(
        `${PRICE_PREFIX[hotel]}.${r.slug}.price`,
        tiers ? `від ${priceFrom(tiers)} грн` : "Ціна за запитом",
      );
      return {
        slug: r.slug,
        name: t.has(k("name")) ? t(k("name")) : r.slug,
        tagline: t.has(k("tagline")) ? t(k("tagline")) : undefined,
        capacity: t.has(k("capacity")) ? t(k("capacity")) : undefined,
        amenities,
        priceLabel,
        tiers,
        priceFrom: priceFrom(tiers),
        gallery: roomGallery(hotel, r.slug, r.photo),
        cover: r.photo,
        inventory: await resolvedInventory(hotel, r.slug),
      } satisfies RoomVM;
    }),
  );
  // Cheapest first (rooms «за запитом» / null go last).
  return rooms.sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity));
}
```

> **If `getText` import path differs:** open `src/app/[locale]/hotel/central/page.tsx`,
> copy its exact `getText` import, and match it here. Same for the `HOTEL_CATALOG` room
> field name for the cover photo (`photo` vs `cover` — verify in `hotel-catalog.ts`).

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS. Fix import paths/field names if tsc complains (see notes above).

- [ ] **Step 3: Commit**

```bash
git add src/lib/hotel-rooms.ts
git commit -m "feat(booking): hotel-rooms server view-model assembler

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `RoomGallery` component (carousel + thumbnails + lightbox)

**Files:**
- Create: `src/components/booking/RoomGallery.tsx`

**Contract:** `"use client"`. Props: `{ images: string[]; alt: string }`. Behavior:
- Main image area `relative w-full aspect-[16/10] rounded-[2px] ring-1 ring-[#1a3d2e]/10 overflow-hidden`, `next/image` `fill` `object-cover`, `sizes="(min-width:1024px) 60vw, 100vw"`, `priority` only on the first image, others lazy.
- Prev/next buttons (`ChevronLeft/Right`, real `<button>`, `aria-label` from i18n), wrap-around index.
- Thumbnail strip below (`flex gap-2 overflow-x-auto pb-1`), each a `<button>` setting the index; active thumb ring `ring-2 ring-[#1a3d2e]`.
- Counter overlay `bottom-2 right-2` showing `${idx+1}/${images.length}`.
- Clicking the main image opens a **lightbox**: `fixed inset-0 z-[120] bg-[#0b1410]/90` portal (`createPortal` to `document.body`), focus-trapped, `Esc` closes, `←/→` navigate, swipe via `embla-carousel-react`, a visible close `<button>` (`X`) top-right and visible prev/next; restore focus to the trigger on close. No autoplay.
- Reuse the index state for both inline and lightbox.

- [ ] **Step 1: Implement following the contract.** Mirror the gallery markup already in
`src/components/ui/BookingDialog.tsx` (lines ~762–820 — the inline carousel + thumbnail
strip) for the inline part; add the lightbox dialog using the W3C dialog pattern
(focus trap + Esc + arrows). Use `embla-carousel-react` for swipe in the lightbox.

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/booking/RoomGallery.tsx
git commit -m "feat(booking): RoomGallery carousel + lightbox

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `AvailabilityBar` (sticky hotel tabs + date range + guests, URL-synced)

**Files:**
- Create: `src/components/booking/AvailabilityBar.tsx`

**Contract:** `"use client"`. Props:
`{ hotels: { slug: string; label: string }[]; current: { hotel: string; from?: string; to?: string; adults: number; children: number } }`.
Behavior:
- Sticky wrapper: `sticky top-0 z-30 bg-[#faf6ec]/95 backdrop-blur border-b border-[#e6d9b8]`
  (sticky on this inner element only — never `html/body`).
- **Hotel tabs:** a `<button>` per hotel; active = green fill `bg-[#1a3d2e] text-[#e6d9b8]`, inactive = `ring-1 ring-[#1a3d2e]/15`. Clicking sets `?hotel=` (and clears `?room=`).
- **Dates:** a trigger button showing the selected range (or "Оберіть дати"); on click opens the repo's `Calendar` (`mode="range"`, `minDate={today}`) in a popover (desktop) / bottom sheet (mobile). On range complete, write `?from=&to=` (ISO via `toISO`).
- **Guests:** two steppers (adults 1–10, children 0–6) writing `?adults=&children=`.
- **URL writes:** use `useRouter`/`usePathname`/`useSearchParams`; build params and call
  `router.replace(\`${pathname}?${params}\`, { scroll: false })` inside `useTransition`;
  show a subtle pending state (`opacity-70`) while `isPending`.

```ts
// URL update helper (inside the component)
const router = useRouter(); const pathname = usePathname();
const sp = useSearchParams(); const [isPending, start] = useTransition();
const setParams = (kv: Record<string, string | undefined>, opts?: { clearRoom?: boolean }) => {
  const p = new URLSearchParams(sp.toString());
  for (const [k, v] of Object.entries(kv)) (v ? p.set(k, v) : p.delete(k));
  if (opts?.clearRoom) p.delete("room");
  start(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }));
};
```

- [ ] **Step 1: Implement.** Reuse `Calendar` from `src/components/ui/Calendar.tsx`
(`mode="range"`, `onRangeSelect`, `toISO`) and the i18n calendar labels. The guests
stepper can mirror the counter pattern in `BookingDialog.tsx` (`booking_dialog_counter`
aria labels). Wrap any `useSearchParams` consumer tree in `<Suspense>` at the page level
(Task 10).

- [ ] **Step 2: Typecheck + lint + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
```bash
git add src/components/booking/AvailabilityBar.tsx
git commit -m "feat(booking): sticky AvailabilityBar with URL-synced filters

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: `RoomResultCard`

**Files:**
- Create: `src/components/booking/RoomResultCard.tsx`

**Contract:** `"use client"`. Props:
`{ room: RoomVM; hotel: string; from?: string; to?: string; adults: number; children: number; selected: boolean; onReserve: () => void }`
(`RoomVM` imported as a type from `@/lib/hotel-rooms`).
Layout — desktop: `grid md:grid-cols-[minmax(0,22rem)_1fr]` (gallery left, details right);
mobile: stacked, gallery on top. Card: `bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 overflow-hidden`.
Content:
- `<RoomGallery images={room.gallery} alt={room.name} />`
- `room.name` (`font-display text-2xl text-[#1a3d2e]`), `room.tagline` (italic), `room.capacity` with `Users` icon.
- Amenities: first 5 as an icon row (`Check` + text, `text-[14px]`); if more, "+N" muted.
- **Availability badge** (computed when `from`+`to` set — see Task 10 wiring): green "Вільно"
  / amber honest scarcity "Залишився 1 номер" when `available === 1` / red "Немає вільних на ці дати"
  → disables the CTA. When dates unset, no badge.
- **Price block:** big `priceFrom` total-aware — when `from`+`to`+guests set, show
  **total for stay** (`priceForGuests(tiers, guests) * nights` ₴) as the large number with
  `за N ночей` under it, and per-night small; else show `room.priceLabel`.
- **CTA** `Забронювати`: warm-gold filled button; disabled (grey) when sold out for the
  dates; calls `onReserve()`.
- `id={\`room-${room.slug}\`}` on the card root so deep-links can scroll to it; when
  `selected`, add a highlight ring `ring-2 ring-[#1a3d2e]`.

- [ ] **Step 1: Implement.** Use `priceForGuests` from `@/lib/room-prices` and a small
local `nights` calc (`(to-from)/86400000`, min 1) for the total. Mirror the bullet/`Check`
and `Users` markup from `central/page.tsx` `RoomCard`.

- [ ] **Step 2: Typecheck + lint + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
```bash
git add src/components/booking/RoomResultCard.tsx
git commit -m "feat(booking): RoomResultCard with gallery, availability, stay total

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: `ReservePanel` (guest form + summary + reserve→LiqPay)

**Files:**
- Create: `src/components/booking/ReservePanel.tsx`

**Contract:** `"use client"`. Props:
`{ room: RoomVM; hotel: BookingHotelSlug; from: string; to: string; adults: number; children: number; onClose: () => void }`.
Renders as a focused panel (sticky on desktop right / full-width sheet on mobile) with:
- **Booking summary:** room name, dates, nights, guests, `breakfast` toggle, and the
  **total** (`priceForGuests(room.tiers, adults+children) * nights` ₴) — full breakdown, no
  hidden fees.
- **Guest form (6 fields max):** `name`*, `phone`*, `email` (optional), `comment` (optional),
  `breakfast` checkbox. Inline validation **on blur** (name ≥2; phone ≥10 digits;
  email format if present); show field errors via `aria-describedby`; no account creation.
- **Submit** "Забронювати та сплатити": calls the server action `createRoomReservation`,
  then handles the result (see Step 2). Pending state disables the button + spinner.
  Branch on **`bookingId` presence**, not just `ok`.

- [ ] **Step 1: Implement the form + validation + summary** per contract. Pull labels from
the new `booking_page` i18n namespace (Task 11). Dates/guests come from props (set by the
`AvailabilityBar`); if `from`/`to` missing, the panel shows "Спочатку оберіть дати" and the
submit is disabled.

- [ ] **Step 2: Implement submit → pay handler.**

```ts
import { createRoomReservation } from "@/app/actions/booking";
import { submitLiqPayForm, type LiqPayCreateResponse } from "@/lib/liqpay-redirect";
import { useRouter } from "next/navigation";
// ...
const [submitting, setSubmitting] = useState(false);
const [err, setErr] = useState<string | null>(null);
const router = useRouter();

async function handleSubmit() {
  setSubmitting(true); setErr(null);
  const res = await createRoomReservation({
    hotelSlug: hotel, roomCategorySlug: room.slug,
    name, phone, email: email || undefined,
    dateFrom: from, dateTo: to,
    adults, children, breakfast,
    comment: comment || undefined,
  });
  if (!res.ok || !res.bookingId) { setErr(res.error ?? "Помилка"); setSubmitting(false); return; }

  // «За запитом» room → no payment, show confirmation.
  if (res.mode === "request") { router.push(`/hotel/booking/success?id=${res.bookingId}`); return; }

  // Pay-to-confirm → create LiqPay payment then redirect.
  const r = await fetch("/api/payment/liqpay/create", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityType: "reservation", entityId: res.bookingId }),
  });
  const pay = (await r.json()) as LiqPayCreateResponse;
  if (pay.mode === "stub" || pay.mode === "already-paid") {
    router.push(pay.entity?.successPath ?? `/uk/pay/success?id=${res.bookingId}`);
    return;
  }
  if (pay.mode === "liqpay" && pay.endpoint && pay.data && pay.signature) {
    submitLiqPayForm(pay.endpoint, pay.data, pay.signature); // leaves the SPA
    return;
  }
  setErr("Не вдалося ініціювати оплату"); setSubmitting(false);
}
```

- [ ] **Step 3: Typecheck + lint + commit**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
```bash
git add src/components/booking/ReservePanel.tsx
git commit -m "feat(booking): ReservePanel guest form + reserve→LiqPay flow

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: `RoomResults` orchestrator + rewrite `page.tsx`

**Files:**
- Create: `src/app/[locale]/hotel/booking/RoomResults.tsx`
- Modify: `src/app/[locale]/hotel/booking/page.tsx` (full rewrite)

**`RoomResults.tsx` contract:** `"use client"`. Props:
`{ hotels: {slug:string;label:string}[]; hotel: BookingHotelSlug; rooms: RoomVM[]; from?: string; to?: string; adults: number; children: number; initialRoom?: string }`.
Responsibilities:
- Render `<AvailabilityBar .../>` then the list of `<RoomResultCard/>`.
- Track which room's `ReservePanel` is open (`selectedSlug` state, seeded from `initialRoom`).
- On mount, if `initialRoom`, scroll to `#room-${initialRoom}` (`scrollIntoView`).
- **Availability:** when `from`+`to` set, for each room call `checkAvailability(hotel, slug, from, to)`
  (from `@/app/actions/availability`) — debounced ~300ms inside `useTransition`, store a
  `Record<slug, AvailabilityResult>`; pass each room its result for the badge/CTA-disable.
- Empty/sold-out: if no rooms or all sold out for the dates, show a calm message + keep the
  bar editable (no dead-end). Never block editing dates.

```ts
// availability effect (inside RoomResults)
const [avail, setAvail] = useState<Record<string, AvailabilityResult>>({});
const [, startAvail] = useTransition();
useEffect(() => {
  if (!from || !to) { setAvail({}); return; }
  const id = setTimeout(() => startAvail(async () => {
    const entries = await Promise.all(
      rooms.map(async (r) => [r.slug, await checkAvailability(hotel, r.slug, from, to)] as const),
    );
    setAvail(Object.fromEntries(entries));
  }), 300);
  return () => clearTimeout(id);
}, [hotel, from, to, rooms]);
```

**`page.tsx` rewrite (server):**

```tsx
// src/app/[locale]/hotel/booking/page.tsx
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getBookingHotels, getHotelRooms, type BookingHotelSlug } from "@/lib/hotel-rooms";
import RoomResults from "./RoomResults";

const HOTELS: BookingHotelSlug[] = ["aquapark", "central", "brewery", "cottages"];

export default async function HotelBookingPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const hotel = (HOTELS.includes(sp.hotel as BookingHotelSlug) ? sp.hotel : "central") as BookingHotelSlug;
  const room = typeof sp.room === "string" ? sp.room : undefined;
  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;
  const adults = Math.max(1, Number(sp.adults) || 2);
  const children = Math.max(0, Number(sp.children) || 0);

  const t = await getTranslations("booking_page");
  const tNav = await getTranslations("nav");
  const hotels = getBookingHotels().map((h) => ({ slug: h.slug, label: tNav(h.nameKey.replace(/^nav\./, "")) }));
  const rooms = await getHotelRooms(hotel, locale);

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container mx-auto px-4 lg:px-8 pb-16">
        <header className="py-8 text-center">
          <h1 className="font-display text-3xl lg:text-4xl text-[#1a3d2e]">{t("title")}</h1>
          <p className="mt-2 text-[#0f1f18]/70">{t("subtitle")}</p>
        </header>
        <Suspense>
          <RoomResults
            hotels={hotels} hotel={hotel} rooms={rooms}
            from={from} to={to} adults={adults} children={children} initialRoom={room}
          />
        </Suspense>
      </div>
    </main>
  );
}
```

> **Note on hotel-tab labels:** confirm the exact `nav` key for each hotel name
> (`getBookingHotels()` returns `nameKey` like `nav.hotel_menu.central.title`). Adjust the
> `.replace`/namespace so the label resolves; if simpler, hard-map slugs→labels from the
> `ADMIN_HOTELS` labels in `src/lib/admin-hotels.ts` (`hotelLabel(slug)`).

- [ ] **Step 1: Create `RoomResults.tsx`** per contract.
- [ ] **Step 2: Rewrite `page.tsx`** per above (replaces the old `<BookingFlow/>` mount).
- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 4: Manual smoke** — open `http://localhost:3000/hotel/booking?hotel=central`,
confirm the page renders rooms with galleries and the sticky bar; pick a date range and
watch availability badges populate.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/hotel/booking/page.tsx src/app/[locale]/hotel/booking/RoomResults.tsx
git commit -m "feat(booking): room-results page + orchestrator at /hotel/booking

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: `booking_page` i18n namespace (uk + en)

**Files:**
- Modify: `messages/uk.json`, `messages/en.json`

- [ ] **Step 1: Add a `booking_page` object to `messages/uk.json`** (Ukrainian — primary):

```json
"booking_page": {
  "title": "Бронювання номера",
  "subtitle": "Оберіть дати, кількість гостей і номер. Оплата онлайн через захищений шлюз LiqPay.",
  "pick_dates": "Оберіть дати",
  "guests": "Гостей",
  "adults": "Дорослі",
  "children": "Діти",
  "nights_one": "{count} ніч",
  "nights_few": "{count} ночі",
  "nights_many": "{count} ночей",
  "per_night": "за ніч",
  "total_for_stay": "Разом за {nights}",
  "available": "Вільно",
  "last_room": "Залишився 1 номер",
  "sold_out": "Немає вільних на ці дати",
  "price_on_request": "Ціна за запитом",
  "reserve": "Забронювати",
  "reserve_and_pay": "Забронювати та сплатити",
  "change_dates_first": "Спочатку оберіть дати",
  "no_rooms": "На жаль, на ці дати немає вільних номерів. Спробуйте інші дати.",
  "field_name": "Ім'я",
  "field_phone": "Телефон",
  "field_email": "Email (необов'язково)",
  "field_comment": "Коментар (необов'язково)",
  "breakfast": "Зі сніданком",
  "err_name": "Введіть ім'я",
  "err_phone": "Введіть коректний телефон",
  "err_email": "Некоректний email",
  "gallery_prev": "Попереднє фото",
  "gallery_next": "Наступне фото",
  "gallery_open": "Відкрити галерею",
  "gallery_close": "Закрити галерею",
  "submitting": "Зачекайте…",
  "pay_error": "Не вдалося ініціювати оплату"
}
```

- [ ] **Step 2: Add the English mirror to `messages/en.json`** with the same keys
(translate values to English; keep placeholders `{count}`/`{nights}`).

- [ ] **Step 3: Sync + verify (project rule: never leave EN stale).**

Run: `npm run i18n:sync`
Expected: "✓ Translations in sync." (resolves any missing keys).

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: PASS.
```bash
git add messages/uk.json messages/en.json
git commit -m "i18n(booking): add booking_page namespace (uk + en)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Rewire room-card "Забронювати" → `/hotel/booking` deep link

**Files:**
- Modify: `src/components/hotel/HotelBookingTrigger.tsx`

Changing this one component rewires every hotel room card (central/brewery/aquapark/cottages)
at once, since they all render `HotelBookingTrigger`.

- [ ] **Step 1: Replace the `openBookingDialog` button with a `<Link>`.**

```tsx
// src/components/hotel/HotelBookingTrigger.tsx
import Link from "next/link";

interface Props {
  label: string;
  hotelSlug: "aquapark" | "central" | "cottages" | "brewery";
  roomCategorySlug: string;
  // roomName / priceLabel / photoUrl no longer needed for navigation; keep optional
  // so existing call sites compile, but they're unused now.
  roomName?: string;
  priceLabel?: string;
  photoUrl?: string;
}

export function HotelBookingTrigger({ label, hotelSlug, roomCategorySlug }: Props) {
  return (
    <Link
      href={`/hotel/booking?hotel=${hotelSlug}&room=${roomCategorySlug}`}
      className="inline-flex w-full items-center justify-center rounded-[2px] bg-[#1a3d2e] px-6 py-3 font-medium text-[#e6d9b8] transition-colors hover:bg-[#22503b]"
    >
      {label}
    </Link>
  );
}
```

> Keep the unused optional props in the interface so the existing call sites in
> `central/page.tsx` / `brewery/page.tsx` / `aquapark/page.tsx` still typecheck without edits.
> (They will be cleaned up in Phase 3.)

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS. If lint flags unused props in the interface, prefix with `_` or add an
eslint-disable only if necessary; prefer leaving them (they're part of the public prop API).

- [ ] **Step 3: Commit**

```bash
git add src/components/hotel/HotelBookingTrigger.tsx
git commit -m "feat(booking): room cards link to /hotel/booking page (retire modal trigger)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: End-to-end verification (Playwright + typecheck + lint + build)

**Files:**
- Create: `.playwright-audit/verify-booking-page.mjs`

- [ ] **Step 1: Write the verification script.**

```js
// .playwright-audit/verify-booking-page.mjs
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const OUT = ".playwright-audit";

const run = async () => {
  const browser = await chromium.launch();
  const out = {};

  // Desktop: deep-link to a specific room
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hotel/booking?hotel=central&room=lux-balcony`, { waitUntil: "networkidle" });

  out.bodyOverflow = await page.evaluate(() => document.body.style.overflow || "(none)");
  out.roomCards = await page.locator('[id^="room-"]').count();
  out.galleryButtons = await page.getByRole("button", { name: /фото|photo/i }).count();
  await page.screenshot({ path: `${OUT}/verify-rooms-desktop.png`, fullPage: true });

  // Pick a date range via the availability bar
  await page.getByRole("button", { name: /Оберіть дати|dates/i }).first().click().catch(() => {});
  await page.waitForTimeout(400);
  // Click two future day cells (calendar uses buttons with day numbers)
  const days = page.getByRole("button", { name: /^\d{1,2}$/ });
  if (await days.count()) { await days.nth(10).click().catch(()=>{}); await days.nth(12).click().catch(()=>{}); }
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/verify-rooms-dates.png`, fullPage: true });

  // Open reserve on the first room
  const reserve = page.getByRole("button", { name: /Забронювати/ }).first();
  await reserve.click().catch(() => {});
  await page.waitForTimeout(500);
  out.reservePanel = await page.getByText(/Ім'?я|Телефон/).count();
  await page.screenshot({ path: `${OUT}/verify-reserve.png`, fullPage: true });
  await ctx.close();

  // Mobile render
  const m = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true });
  const mp = await m.newPage();
  await mp.goto(`${BASE}/hotel/booking?hotel=central`, { waitUntil: "networkidle" });
  await mp.screenshot({ path: `${OUT}/verify-rooms-mobile.png`, fullPage: true });
  await m.close();

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
};
run().catch((e) => { console.error("ERR", e); process.exit(1); });
```

- [ ] **Step 2: Run the full gate.**

Run:
```bash
npx tsc --noEmit && npm run lint && node .playwright-audit/verify-booking-page.mjs
```
Expected:
- `tsc` + `lint`: clean.
- script JSON: `bodyOverflow: "(none)"` (no body scroll-lock — the modal anti-pattern is
  gone), `roomCards` ≥ 1, `reservePanel` ≥ 1.

- [ ] **Step 3: Review screenshots** (`verify-rooms-desktop.png`, `verify-rooms-dates.png`,
`verify-reserve.png`, `verify-rooms-mobile.png`) — confirm big galleries, readable
per-occupancy prices, availability badges after date pick, reserve panel form, and a usable
mobile layout.

- [ ] **Step 4: Production build (catches RSC/use-client boundary issues).**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add .playwright-audit/verify-booking-page.mjs
git commit -m "test(booking): Playwright verification for room-results page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Push the branch.**

```bash
git push origin feat/i18n-english
```

---

## Out of scope (Phase 1)

- Restaurant / aquapark / sauna full-page forms + `/booking` hub (Phase 2).
- Deleting `BookingDialog.tsx` and rewiring generic CTAs (Header/Footer/Hero/Floating) (Phase 3).
- Removing the orphaned `BookingFlow.tsx` / `/api/hotel/bookings` / `HotelRoom` model (separate migration PR).
- Per-day "fully booked" calendar disabling + min-nights (future enhancement).
- Carrying `en` locale into LiqPay success/fail paths (hardcoded `/uk/` today).

## Phase 1 done = working software

After Task 13: a guest can browse a hotel's rooms on a full page with large galleries and
per-occupancy prices, see live availability for chosen dates, reserve a room, pay via
LiqPay, and the operator gets a Telegram/Email notification on payment success — all on the
canonical system the admin panel already reads. The modal still exists for non-room services
(removed in Phase 3) but room cards now route to the page.
```

