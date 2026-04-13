# UX Audit — Глухомань (gluhoman-land)

**Auditor:** Senior UX (analysis only, no code changes)
**Date:** 2026-04-11
**Scope:** Homepage, 4 main service pages, 8 additional-service stub pages, global Header/Footer, booking flow.

---

## 1. Primary Conversion Goal — What Is It?

**Finding: the site has no declared primary conversion.** Three CTAs compete on nearly every hero:

- `Phone` (tel: link) — `src/components/layout/Header.tsx:112`, `src/app/aquapark/page.tsx:51`, `src/app/hotel/page.tsx:51`, `src/app/other-services/[slug]/page.tsx:78`
- `Забронювати онлайн` modal — `src/components/sections/BookingSection.tsx:47` launching `BookingForm.tsx:26` (note: form `console.log`s then `alert()`s — not wired to any backend)
- `Як дістатися` (map) — `src/app/aquapark/page.tsx:60`, `src/app/hotel/page.tsx:60` (note: on the hotel page this button is relabelled `Booking.com` — `hotel/page.tsx:60` — yet isn't a link)
- `Booking.com` button — `hotel/page.tsx:60`, `:262` — rendered as a `<Button>` with **no href**, so it does nothing

On the hotel hero alone, three near-equal-weight pills say `Забронювати номер`, `Booking.com`, and (in the CTA at `:246`) the same pair again. Nothing indicates to the user whether the brand prefers a call, an online form, or an OTA.

**Implication:** CTA hierarchy is flat. Cognitive load is high. Owner-side, there is no analytics funnel because multiple equal actions fragment intent.

---

## 2. Information Architecture — Homepage

Current render order (`src/app/page.tsx`):

| # | Section | File:Line |
|---|---|---|
| 1 | VideoHero fullscreen | `page.tsx:23` → `VideoHero.tsx` |
| 2 | Main services grid (4 cards with features) | `page.tsx:26` |
| 3 | Google Reviews | `page.tsx:142` |
| 4 | Additional services (8 cards, two grids) | `page.tsx:146` |
| 5 | "Про нас" + stats (15+ years, 5000+ guests) | `page.tsx:279` |
| 6 | Instagram Feed | `page.tsx:366` |
| 7 | LocationSection (map, hours, phones) | `page.tsx:374` |

`BookingSection.tsx` is **imported nowhere on the homepage** (grep: only rendered indirectly, not mounted in `page.tsx`). The dedicated booking CTA section is orphaned — a major conversion miss.

**Problems:**
- Hero does **not state location, price range, or what Глухомань actually is**. Voice-over video only.
- Social proof (reviews, years-of-operation stats) appears *after* additional services — too late.
- The "About" block is at position 5 — buried; it should anchor credibility near the top for a destination brand.
- "How to get there" is at the very bottom — high-intent guests have to scroll past 8 additional-service cards and Instagram to learn the venue is in Poltava oblast.
- No pricing anywhere on the homepage (except $1200-2500 hotel rates on the hotel detail page — `hotel/page.tsx:92-111`).

---

## 3. Main Service Pages

All 4 pages follow nearly identical template: full-bleed hero → features grid → secondary block → Instagram/CTA. Strengths and gaps:

### `/aquapark` (`src/app/aquapark/page.tsx`)
- Strengths: zones grid (`:81`), rules/safety block with **working hours** (`:155`)
- **Missing:** ticket prices, capacity, season (open year-round?), photo gallery of the real park (uses stock Unsplash at `:211`)
- Instagram block is a static placeholder — six `animate-pulse` skeletons at `:246` that never resolve.

### `/hotel` (`src/app/hotel/page.tsx`)
- Strengths: three room types **with prices** (`:92-111`), amenity icons (`:199`)
- **Critical:** room images are Unsplash photos of unrelated hotels (`:118`). No real photography.
- Booking.com button has no `href` (`:60`, `:262`) — dead link.
- No availability calendar, no date picker, no "nights" calculator.

### `/restaurant` (`src/app/restaurant/page.tsx`)
- Uses an **Unsplash stock image as the hero** (`:27`) — critical trust failure for a restaurant.
- Content structure fine, but no menu, no price ranges, no allergen info, no reservation slot-picker.

### `/sauna` (`src/app/sauna/page.tsx`)
- Standard template; status unchecked in detail but same class of gaps (pricing, session length, group size).

**Generic gaps across all 4:**
- No real photo galleries (the `public/images/` folder *does* have 45+ real jpgs — `images/3.jpg` through `images/45.jpg`, `otel_gluhoman_photo31.jpg`, `akvapark.webp` — but they are underused)
- No pricing consistency (only hotel shows prices)
- No "what's included / what's extra"
- No availability or booking slot selection
- No capacity/group limits (important for paintball, bbq, sauna)

---

## 4. "Інші послуги" — 8 Stub Pages

All 8 additional services route to a single dynamic stub: `src/app/other-services/[slug]/page.tsx`. Every page renders the same literal placeholder:

```
"Деталі незабаром"  — line 103
"Ми готуємо розгорнуту інформацію про цю послугу…" — line 107
```

Navigation **promotes** all 8 stubs as full menu items (`src/components/layout/Header.tsx:110` → `NAVIGATION` from `constants/index.ts:110-117`), and homepage shows them as large premium cards (`page.tsx:175`, `:225`). Users click → land on empty page → must call.

**UX implications:**
- **Broken promise pattern.** Each click is a dead end; breaks trust.
- **Recommendation:** Until content exists, either (a) collapse all 8 into a single `/other-services` overview page with expandable sections (no per-slug routes), or (b) keep the routes but replace stub content with at least 2 real photos, a 3-sentence description, and a specific phone CTA with pre-filled subject. Ideally group into 3 buckets:
  - *Активний відпочинок*: paintball, horses, brewery-tour
  - *Події*: wedding, kids-parties, bbq-zone
  - *Здоров'я/родина*: apitherapy, petting-zoo

---

## 5. Trust Signals

| Signal | Present? | Location | Prominence |
|---|---|---|---|
| Years of operation (15+) | Yes, hard-coded | `page.tsx:344` | Buried in "About", section 5 |
| Guest count (5000+) | Yes, hard-coded | `page.tsx:344`, `BookingSection.tsx:73` | Buried |
| Google Reviews | Component `GoogleReviews` rendered | `page.tsx:143` | Mid-page; component content not verified |
| Booking.com reviews | `BookingReviews` on hotel | `hotel/page.tsx:218` | Mid-page, hotel only |
| Instagram embed | `InstagramFeed` x2 | `page.tsx:366`, `aquapark:279` | Late; placeholder skeletons on /aquapark |
| Awards / press | None | — | — |
| Real photos of venue | Exist in repo, under-used | `/public/images/` | Missing from restaurant hero, hotel room cards |
| Certifications (food safety, lifeguard) | Mentioned only in copy | `aquapark:181` | Not a badge |

**The stats (15+ / 5000+) should live in the hero or immediately below it**, not 2000px down.

---

## 6. Contact / Booking Friction

**Path to "I will visit" — shortest route:**
1. Land on `/` → see video (no info, no phone visible until header loads)
2. Scroll past hero → see services grid (no prices)
3. Click service → hero + details (still often no price)
4. Click `Phone` button → opens dialer

**Click-to-commit: 2–3 clicks + scroll.** Acceptable. But for actual reservation:
- `BookingForm.tsx:25` submits to `console.log` + `alert()` — **zero real submission.** Any user who fills the form believes they booked; nobody receives the data. **This is the single largest conversion blocker.**
- No confirmation email, no calendar add, no WhatsApp/Viber/Telegram alternative (Ukrainian market relies heavily on Viber/Telegram — missing entirely).
- 4 phone numbers listed (`constants/index.ts:4-9`) — choice paralysis. Users don't know which to call; pick one primary.

---

## 7. Content Gaps — "Weekend Family Trip" Scenario

A parent planning a Saturday visit needs to know:

| Need | Present? |
|---|---|
| Is it open this weekend? | Partial (`LocationSection:147` shows hours) |
| What does a day cost for 2 adults + 2 kids? | **No** |
| Can we eat there? Kids menu? | No menu |
| Are there shaded areas / changing rooms? | Mentioned vaguely |
| Can we bring our own food? | No |
| Is there a package (aquapark + lunch + sauna)? | **No bundles** |
| Will there be a birthday party group there? | No calendar |
| Pet policy? | No |
| Parking cost? | Free — mentioned `LocationSection:96` |
| Distance from Poltava city? | **No** ("15 min from center" missing) |
| Accessibility (wheelchair, stroller)? | No |

**Recommendation:** Add a "Plan Your Visit" single page covering these + a `Пакети` (packages) section with 3 bundles (Family Day, Couple Retreat, Corporate).

---

## 8. Multilingual Readiness

- Site is Ukrainian only. `layout.tsx` has `lang="uk"`. No `next-intl` / `next-i18next` installed (verify: `package.json`).
- Metadata openGraph has `locale: 'uk_UA'` hard-coded (e.g. `aquapark/page.tsx:14`).
- Ukrainian diaspora + Polish/Romanian border tourism is a realistic market once borders normalize. Recommend at minimum `uk` + `en` + `pl`.
- Phone numbers are in Ukrainian format only; add `+380` explicit international dialing.
- Copy contains idiomatic Ukrainian ("щира українська гостинність", `page.tsx:323`) that would need cultural translation, not literal.

---

## 9. Error / Empty States

- **No `src/app/not-found.tsx`** (verified: `ls src/app/not-found*` returns no match) → Next.js default 404 used. Bad brand fit.
- **No `error.tsx`** boundary.
- **No `loading.tsx`** — bad Core Web Vitals for the video hero.
- `BookingForm.tsx:27` uses a browser `alert()` on submit — no success UI, no error state, no validation hints.
- Instagram feed fallback on `/aquapark:246` is 6 infinite `animate-pulse` skeletons — looks permanently broken.
- `notFound()` is called in `other-services/[slug]/page.tsx:47` but there is no custom 404 page to catch it.

---

## Recommended Homepage Section Order (Revised)

| # | Section | Why |
|---|---|---|
| 1 | **VideoHero** — overlay with H1 "Ресторанно-готельний комплекс у Полтаві", 1-line value prop, **single primary CTA** (`Забронювати візит`) + secondary (`Зателефонувати`) | Anchor value immediately |
| 2 | **Trust bar** — "15 років · 5000+ гостей · Google 4.8 · Booking 9.1" (thin strip) | Instant credibility |
| 3 | **Main services** — 4 cards, each with price-from and 1 photo from `/public/images/` | Scannable offer |
| 4 | **Packages / bundles** (NEW) — 3 packages (Family Day, Romantic Escape, Corporate) | Decision scaffolding |
| 5 | **Social proof** — Google + Booking.com reviews side by side | Reassurance |
| 6 | **About (Про нас)** — shortened, 2 paragraphs + photo of the owners/building | Humanize |
| 7 | **Additional services** — grouped into 3 buckets (not 8 separate cards) | Reduce noise |
| 8 | **Instagram feed** — real, not placeholder | Aspirational |
| 9 | **Location + hours + directions + trip from Poltava** | Final commit trigger |
| 10 | **Sticky footer CTA** (mobile) — "Зателефонувати" or "Забронювати" | Always-available |

---

## Recommended Booking Funnel

```
Entry (any page)
   │
   ▼
[Sticky "Забронювати" button] ──► Modal wizard (BookingForm.tsx rewrite)
   │
   ├─ Step 1: What? (Hotel / Aquapark / Restaurant / Sauna / Package)
   ├─ Step 2: When? (date picker; nights or time-slot based on service)
   ├─ Step 3: Who? (adults, children, ages)
   ├─ Step 4: Contact (name, phone — validate +380 format, Viber/Telegram toggle)
   └─ Step 5: Confirm ──► POST to /api/booking
                         │
                         ├─ Email to owners (Resend / SendGrid)
                         ├─ Email / SMS to guest (confirmation)
                         ├─ Telegram bot ping to staff channel (instant)
                         └─ Success screen with "Add to Calendar" + "Share"
```

**Fallbacks at every step:** (a) "Зателефонувати" button, (b) "Написати у Viber/Telegram" deep link. For hotel-only: external link to Booking.com with correct `href`.

**Target:** reduce from current "fill form → nothing happens" to "3 taps → human response in 15 min".

---

## Top 5 UX Problems (ranked)

1. **Booking form is a black hole** — `BookingForm.tsx:25` fires `console.log` + `alert()`, no backend wiring, no confirmation. Every submitted lead is lost.
2. **CTA hierarchy is flat** — Phone / Booking / Map / Booking.com all compete at equal weight across hero sections (e.g. `hotel/page.tsx:51-67`). No primary conversion goal declared.
3. **8 stub pages promoted as premium cards** — `other-services/[slug]/page.tsx` serves identical "Деталі незабаром" placeholder (`:103`). Every click from homepage/nav is a dead end.
4. **Real photos exist but aren't used on key pages** — restaurant hero uses Unsplash (`restaurant/page.tsx:27`), hotel rooms use Unsplash (`hotel/page.tsx:118`), despite 45+ real venue photos in `/public/images/`.
5. **No pricing, no packages, no bundles** — users cannot self-qualify. Only the hotel page shows any numbers. No "Family Day" or "Weekend Escape" packages even though the venue literally offers 12+ services that cry out for bundling.

### #1 Conversion Blocker

**The booking form does not submit anywhere.** `src/components/ui/BookingForm.tsx:25-29` logs to console and shows a JS `alert()`. Every user who "books" believes they booked; staff receives nothing; no email, no SMS, no CRM. Until this is wired to a real handler (Resend/Telegram bot/CRM webhook), every other UX improvement is academic — you are leaking 100% of online leads.
