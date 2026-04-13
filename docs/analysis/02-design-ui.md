# Component-Level Design Audit — Глухомань

Scope: senior-UI review of every layout, section, and UI component. Goal is to move the site from "2020s Tailwind template" to $10k premium hospitality. Analysis only, no code changes.

---

## 1. Component Inventory

### What exists
- **Layout**: `Header.tsx` (glass menu + mobile drawer), `Footer.tsx` (4-col simple).
- **Sections**: `HeroSection` (legacy gradient hero, unused on homepage), `VideoHero` (main homepage hero with local mp4), `ServicesGrid` (card grid with emoji placeholders), `ServicesSlider` (Embla carousel with Unsplash stock backgrounds), `BookingSection` (CTA band with stats), `LocationSection` (map + 4 info cards), `SectionDivider` (SVG shape dividers).
- **UI**: `button`, `card`, `navigation-menu` (shadcn primitives); custom: `BookingForm` (modal), `BookingReviews`, `GoogleReviews`, `InstagramFeed`, `FloatingButtons`, `ServiceButtons`, `Preloader`.

### What's missing for premium hospitality
- **Tasteful image gallery / lightbox** — hotel/restaurant/aquapark pages have no proper gallery. Hero pages use single background images. No `react-photoswipe` / lightbox / masonry grid.
- **Availability calendar / date-range picker** — `BookingForm.tsx:151-174` uses raw `<input type="date">`. No real availability check, no two-month calendar, no rate display.
- **Room / table type comparison cards** — no pricing table, no room cards with amenities.
- **Testimonial carousel** — `GoogleReviews` and `BookingReviews` just stack cards vertically with a "show more" button. No swipe, no autoplay, no aggregated star badge in hero.
- **Trust strip** — no partner logos, no TripAdvisor/Booking/Google rating badges grouped, no awards.
- **Menu / offerings component** — restaurant page has no menu rendering; sauna page has no service price list.
- **Sticky booking bar** (desktop) — no always-visible reservation CTA on scroll.
- **Press / awards section**, **FAQ accordion**, **newsletter signup**, **before/after or seasonal showcase** — all absent.
- **Proper hero video poster / low-data fallback** — `VideoHero.tsx:41-59` has no `poster` attribute; fallback is an Unsplash URL buried inside the `<video>` tag (invalid HTML — browsers will ignore that div).

---

## 2. Button Styles — Inconsistent, Many Look Bootstrap-y

### shadcn base (`src/components/ui/button.tsx:7-36`)
The cva base uses `rounded-md`, `h-9/h-10`, `shadow-xs`. That's fine — but **almost nothing in the codebase actually uses the base variants**. Every call site overrides with bespoke classnames, so there's effectively no design system.

### Concrete inconsistencies
- **Six different corner radii in use for the "primary CTA"**:
  - `rounded-md` default in `button.tsx:8`
  - `rounded-xl` in `Header.tsx:116,128`
  - `rounded-full` in `BookingSection.tsx:50,59`, `ServicesSlider.tsx:44`, all page heroes (e.g. `src/app/hotel/page.tsx:55,59`)
  - `rounded-2xl` implicit on some outline buttons
  - `rounded-3xl` on card wrappers used as buttons
- **Three competing gradient recipes**:
  - `from-primary to-accent` (Header, BookingForm submit, FloatingButtons)
  - `from-green-500 to-green-600` (`ServiceButtons.tsx:21`) — hardcoded Tailwind green, bypassing the oklch palette
  - `from-blue-500 to-blue-600` (`ServiceButtons.tsx:28`, `BookingReviews.tsx:224`) — color drift away from brand
- **Sizes are chaotic**: `text-lg px-8 py-6` (HeroSection `button.tsx` violations), `text-lg px-8 py-4`, `text-lg px-8 py-3`, `py-3 text-base`, `size="lg"` with no overrides. Every file invented its own.
- **"bootstrap-y" tells**:
  - `hover:scale-105` / `hover:scale-110` on almost every button (`BookingSection.tsx:50`, `FloatingButtons.tsx:74,87,107`, `ServicesSlider.tsx:101`). Premium buttons rarely scale — they shift color, elevation, or underline.
  - `shadow-2xl hover:shadow-3xl` on FloatingButtons and the modal CTA — `shadow-3xl` isn't even a Tailwind default and reads as cheap drop shadow.
  - Gradient fills + drop shadows + scale on hover + emoji in headings = 2020 Bootstrap theme energy.
- **Outline button on dark backgrounds** repeats `border-white/50 text-white hover:bg-white/10 hover:border-white rounded-full backdrop-blur-sm` verbatim in `aquapark/page.tsx:60`, `hotel/page.tsx:59`, `restaurant/page.tsx:59`, `sauna/page.tsx:59`, `other-services/[slug]/page.tsx:89`, `BookingSection.tsx:59`. Should be a single variant.

### Concrete fix
- Extend `buttonVariants` in `src/components/ui/button.tsx` with project variants: `hero` (solid brand, `rounded-full`, `h-12 px-7`), `heroOutline` (the white/50 outline above), `pill`, `iconGhost`. Delete all per-call-site overrides.
- Standardize on **one** radius per role: `rounded-full` for hero CTAs only, `rounded-lg` (not `xl`) for inline buttons, no mixing.
- Remove all `hover:scale-*` from buttons. Replace with a subtle `hover:-translate-y-0.5` + `transition-[box-shadow,transform] duration-200` and a darker shadow.
- Kill the blue/green literal gradients in `ServiceButtons.tsx:21,28` — use `bg-primary` and `bg-secondary` from the oklch theme.

---

## 3. Card Patterns — `bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl` Is a Plague

This exact class combination (or near-identical) appears **30+ times**:

| File | Lines |
|---|---|
| `src/components/sections/LocationSection.tsx` | 49, 80, 112, 137 |
| `src/components/ui/BookingReviews.tsx` | 138 |
| `src/components/ui/GoogleReviews.tsx` | 121 |
| `src/components/ui/InstagramFeed.tsx` | 108, 157 |
| `src/app/page.tsx` | 57, 185, 233, 353 |
| `src/app/aquapark/page.tsx` | 112 |
| `src/app/restaurant/page.tsx` | 105, 200, 212, 225 |
| `src/app/sauna/page.tsx` | 115, 167, 202, 216 |
| `src/app/hotel/page.tsx` | 220 |

### Problems
1. **Zero visual hierarchy**. A testimonial card, a service tile, an address card, and an Instagram post all wear the same skin. Nothing reads as "more important than" anything else.
2. **`rounded-3xl` everywhere** (24px radius) blunts all personality. Premium hospitality typically uses 2 radii: something like `rounded-sm` for inputs/chips and `rounded-2xl` for hero elements — never one giant radius uniformly.
3. **Frosted glass on a light background** is mostly invisible. `bg-white/70 backdrop-blur-sm` over an off-white gradient page produces an extremely subtle, soupy effect that looks like a rendering bug on low-contrast displays.
4. The shadcn `Card` in `src/components/ui/card.tsx:10` (`rounded-xl border py-6 shadow-sm`) is **bypassed entirely** — it's imported only in `ServicesGrid.tsx:2`, which itself is never the card pattern the rest of the site uses.

### Concrete fix
- Introduce a single `<SurfaceCard>` wrapper in `src/components/ui/card.tsx` with 3 variants: `elevated` (solid white, 1px border, soft `shadow-[0_1px_2px_rgba(0,0,0,.04),0_8px_24px_-12px_rgba(0,0,0,.08)]`, `rounded-2xl`), `muted` (cream fill, no shadow), `outlined` (transparent, 1px border only).
- **Delete `bg-white/70 backdrop-blur-sm border-white/30` from every file listed above.** Replace with the `elevated` variant.
- Downgrade all `rounded-3xl` → `rounded-2xl` site-wide. Image wrappers (`src/app/aquapark/page.tsx:192`, `restaurant/page.tsx:139`, `sauna/page.tsx:181`, `hotel/page.tsx:117`) → `rounded-xl` for a more editorial feel.
- On reviews, differentiate structurally: pull-quote typography + thin rule separators, not card boxes.

---

## 4. Icon Usage — Lucide Overused, Sizes Drift

- Lucide icons appear in virtually every component, often as **decorative badges**, not functional affordances: `Sparkles` in `BookingSection.tsx:32`, `MapPin` as a "Booking.com" pill icon in `BookingReviews.tsx:105` (wrong metaphor entirely), `Instagram` icon stacked 3x in a single Instagram card (`InstagramFeed.tsx:128,186,196`).
- Sizes drift: `h-4 w-4`, `h-5 w-5`, `h-6 w-6`, `size-4`, with no rationale. Phone icons in Header (`h-4`), Footer (`h-4`), FloatingButtons (`h-6`), and BookingForm (`h-5`) are all different.
- **Stroke weight is default (2px)** — lucide's default is fine for UI but too heavy for decorative/hero use. Premium sites use custom strokes (1.25–1.5).
- Emoji used *alongside* lucide icons: `HeroSection.tsx:62-71` has 🏊‍♀️ 🍽️ 🏨 🌳, `LocationSection.tsx:58-64` prints 📞 before every phone number, `BookingReviews.tsx:150,165`, `InstagramFeed.tsx:29,38,47`. This is the biggest single "template" giveaway.

### Concrete fix
- Create `src/components/ui/Icon.tsx` exporting a thin wrapper that fixes `strokeWidth={1.5}` and enforces 3 sizes (`sm:16`, `md:20`, `lg:24`). Replace all raw `<Phone className="h-..."/>` with `<Icon name="phone" size="md"/>`.
- **Purge all emoji from JSX** (grep for 📞 🏊 🍽️ 🏨 🌳 🔥 🌊 🇺🇦 📱 ✨). Replace with lucide or Unicode bullets.
- Decorative "pill" badges (`Sparkles` in `BookingSection.tsx:32`, `MapPin` in every section header) — drop the icon entirely, keep the uppercase eyebrow label.

---

## 5. Form Inputs — `BookingForm` Feels Cheap

`src/components/ui/BookingForm.tsx:42-254`

- **All inputs are raw `<input>` / `<select>` / `<textarea>` with a single utility string** (`BookingForm.tsx:85,101,117,133,158,172,188,208`): `w-full p-4 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50`. No shadcn `Input`, `Select`, `Textarea` primitives — those aren't even installed.
- **No floating labels, no helper text, no inline validation**, only `required`. Error state = browser default bubble. For a premium booking flow this reads as "contact form from a WordPress theme."
- **Native `<select>`** on `:127-142` and `:182-195` exposes OS-level pickers that look wildly different on Mac/Windows/iOS — immediately breaks the premium illusion.
- **Native `<input type="date">`** on `:151-174` does the same and cannot show availability, blackout dates, or ranges. The label even says "Дата виїзду (для готелю)" in a subtitle — exposing that the form is a generic grab-bag rather than a proper hotel booking widget.
- Modal shell (`BookingForm.tsx:43`): `bg-white rounded-3xl p-8 ... shadow-2xl` — again the 3xl radius; the dialog has no header/body/footer separation, no focus trap, no ESC handler.
- Gradient submit button `BookingForm.tsx:218` repeats the whole-site primary gradient — generic.
- Fake Mail/Phone strip at `:240-249` uses placeholder strings `+380 XX XXX XX XX` and `info@gluhoman.com.ua`. These are live on the homepage modal — should pull from `CONTACT_INFO`.

### Concrete fix
- `npx shadcn@latest add input label select textarea dialog form calendar popover`. Replace every native element.
- Use `react-day-picker` (shadcn Calendar) inside a Popover for a two-month range picker. Track `checkin`/`checkout` as a single `DateRange`.
- Split the form into **contextual variants**: HotelBooking (rooms + dates + guests), TableBooking (time + party size + seating), EventBooking (type + date + guests + budget). One giant "service" select is the tell of a template.
- Add zod + react-hook-form for real validation, inline error text under each field.
- Pipe contact strings from `@/constants` to kill `BookingForm.tsx:243,247` placeholders.

---

## 6. Micro-Interactions, Hover States, Transitions

- **Durations are wildly inconsistent**: `duration-200`, `duration-300`, `duration-500`, `duration-700`, `duration-1000` all coexist. `src/app/page.tsx:57,185,233` use `duration-700` for card hover, which feels sluggish on desktop. `BookingForm.tsx:85` uses `duration-200` for inputs, which feels abrupt.
- **Scale transforms everywhere**: `hover:scale-105`, `hover:-translate-y-2`, `hover:-translate-y-3`, `hover:-translate-y-4` (`src/app/page.tsx:57`!). Cards literally leaping 16px off the page on hover.
- **Pulses galore**: `BookingSection.tsx:25-27` has three `animate-pulse` blobs; `Preloader.tsx:31-33,72-75` has four `animate-ping` and three `animate-pulse` blobs; `VideoHero.tsx:104` pulses the "Scroll down" text. Premium sites generally have *one* ambient motion at a time.
- **Group hover chains** that never pay off: `ServicesGrid.tsx:45` has `group-hover:translate-x-1` on an arrow, but the parent card has no `group` class, so it never fires. Confirmed non-working hover.
- Header dropdown in `Header.tsx:73-96` uses `opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0` with `duration-300` — fine on desktop but on touch it flashes because there's no `focus-within`.
- `globals.css` contains **20+ custom keyframes** (`@keyframes slideUp, slideInLeft, fadeInUp, scaleIn, float, gradientShift, shimmer, breathe, gentleFloat, staggerFadeIn, mobileMenuSlide, glassShimmer, menuItemHover, aurora, logoFloat, haloPulse, auroraBg, logo-appear, text-appear, spinner-appear, logo-slide-in`). This is animation-library sprawl; most are used once or not at all.

### Concrete fix
- Adopt a 3-duration system: `120ms` (inputs/ghosts), `220ms` (buttons/cards), `420ms` (page-level reveals). Delete every other duration utility.
- Ban `hover:scale-*` on content cards. Allow only: color shift, `translate-y-0.5`, and shadow elevation.
- Delete unused keyframes in `globals.css` (any of the ~20 that aren't referenced). Keep at most 4: `fadeInUp`, `logoSlideIn`, `mobileMenuSlide`, and one ambient `breathe`.
- Remove the three background `animate-pulse` blobs in `BookingSection.tsx:25-27`.
- Replace `animate-ping` dots in `Preloader.tsx:72-75` with a single motion: logo fade-in only.

---

## 7. Image Treatment — Aspect Ratios & Treatments Drift

- `ServicesGrid.tsx:17` renders every card as `h-48 bg-gradient-to-br from-gray-100 to-gray-200` with an emoji placeholder `📸` — literally ships a placeholder to production.
- `ServicesSlider.tsx:22-27` pulls **Unsplash stock** (`photo-1571902943202-507ec2618e8f`, etc.) at runtime inside a CSS `background-image` url. Unoptimized, hotlinked, and not `next/image`.
- `VideoHero.tsx` `<video>` tag has no `poster` attribute; the fallback div on `:53-58` is invalid HTML inside `<video>` and never renders.
- Aspect ratios: `aspect-square` on some hero images (`aquapark/page.tsx:192`, `restaurant/page.tsx:139`, `sauna/page.tsx:181`), `h-48`, `h-80 lg:h-96` (`hotel/page.tsx:117`), `h-[300px]` (`LocationSection.tsx:30`), `h-screen` (VideoHero). No ratio system.
- Corner radii on images: `rounded-t-lg`, `rounded-3xl`, `rounded-2xl`, no consistent rule.
- Shadows: `shadow-2xl` on image containers (`LocationSection.tsx:30`, `hotel/page.tsx:117`, `aquapark/page.tsx:192`, `restaurant/page.tsx:139`, `sauna/page.tsx:181`) — the same heavy dropshadow regardless of context.
- `Header.tsx:46-50` applies a 4-direction `drop-shadow` white outline to the logo in inline style. Works, but brittle and ugly on Retina.

### Concrete fix
- Define ratio tokens: `ratio-hero` (21:9), `ratio-card` (4:3), `ratio-square`, `ratio-portrait` (3:4 for staff/room portraits). Never mix within a section.
- Replace every `bg-cover bg-center` div with `next/image` + `fill` + `sizes`. Move the Unsplash URLs in `ServicesSlider.tsx:22-27` into the constants layer and replace with local `/images/*` files.
- One image radius: `rounded-xl` for cards, `rounded-2xl` for hero, no exceptions.
- Replace `shadow-2xl` on images with a 2-layer custom shadow (one tight, one long) defined once in `globals.css`.
- Delete the 4× `drop-shadow` white outline on the logo (`Header.tsx:46-50`, `Preloader.tsx:48`). Instead commission a proper 2-color PNG/SVG logo that reads on both dark and light.
- Remove emoji placeholder in `ServicesGrid.tsx:21` — ship real photography or remove the section.

---

## 8. Footer — Sparse, Dated, Typographically Flat

`src/components/layout/Footer.tsx`

- **Four columns with identical weight**: logo/description, services, services, contacts. No newsletter, no social icons row, no payment/trust marks, no language switcher (despite the i18n aspiration), no secondary links (privacy, terms, sitemap).
- **`bg-muted border-t`** (`:8`) — a flat grey band. Given the rest of the site is gradient-heavy, the footer abruptly becomes dull.
- Typography: all text is `text-sm text-muted-foreground`; headings are `text-lg font-semibold`. There's no tonal hierarchy, no mixed weights, no numeric treatments for phone numbers.
- Copyright is centered and bland (`:98-101`).
- `NAVIGATION.filter(item => !item.children).map` on `:31` — filters out dropdown items so additional services show only the first 5 (`:47`). The other additional services are unreachable from the footer.
- No Glühomann address in a map context, no opening hours block formatted as a table, no operator/company number for legal requirements.

### Concrete fix
- Redesign as a **5-row footer**: (1) large brand statement + newsletter, (2) link grid with ALL services, (3) contact strip with formatted phones + hours + address + get-directions button, (4) social row + Booking/TripAdvisor/Google review scores, (5) legal fine print.
- Typography: pair a display serif (headings) with Manrope (body) — since the site already loads Manrope. Use tabular numerals for phones/hours.
- Replace `bg-muted` with a deep brand-color dark panel (or ivory cream on dark sites). Give the footer a deliberate mood, not a default.
- Show all additional services or group them under "Other experiences".

---

## 9. Preloader & FloatingButtons — Gimmicky

### Preloader (`src/components/ui/Preloader.tsx`)
- **2-second hardcoded timer** (`:16`) that runs on every page navigation — actively slows the site down. This is the #1 thing that screams "template" to a returning visitor.
- 4 `animate-ping` dots + 3 `animate-pulse` blurred blobs + `animate-logo-slide-in` + `animate-text-appear` + spinner — five concurrent motions.
- Gradient `from-primary via-primary/90 to-accent` cover is the same gradient used on BookingSection and half the buttons — no differentiation.
- A premium hospitality site should load instantly; a fake preloader is the opposite signal.

**Fix**: delete `Preloader.tsx` and its usage in `layout.tsx`. If a reveal is truly wanted, use a genuine content-aware one (wait for `window.load` + `document.fonts.ready`), show it *only on first visit* (sessionStorage), and limit to a single fade of the logo at 400ms.

### FloatingButtons (`src/components/ui/FloatingButtons.tsx`)
- Stacks 4 floating pills (main FAB + WhatsApp + Telegram + Call + Scroll-to-top). On mobile this eats 25% of vertical space.
- `shadow-2xl hover:shadow-3xl hover:scale-110` (`:74,87,107`) on every button — toy-ish.
- Hardcoded phone `+380501234567` (`:28,35`) — placeholder, not from constants. Ships a wrong number to production.
- Telegram handle `t.me/gluhoman_ukraine` (`:42`) — may or may not exist, not in constants.
- The "red X close" state (`:89`) is garish against the brand palette.
- WhatsApp and Telegram buttons use raw `bg-green-500` and `bg-blue-500` — breaking the brand palette.

**Fix**: replace with a single brand-colored pill that reveals 2 options max (Call, WhatsApp). Delete Telegram unless verified. Pull phones from `CONTACT_INFO`. Use `rounded-2xl` pill, not round FABs. No scale on hover — just shadow elevation. Hide on `/` above the fold to preserve the hero.

---

## Summary: Top 5 Highest-Impact Component Issues (Ranked)

1. **The `bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl` skin on 30+ elements** flattens all hierarchy. Replace with a 3-variant `<SurfaceCard>` and downgrade to `rounded-2xl`.
2. **`BookingForm.tsx` uses native `<input type="date">` and `<select>`** — the single biggest trust-killer on a hospitality site. Replace with shadcn Calendar + range picker + proper Select primitives.
3. **Buttons have no design system** — six radii, three gradient recipes, `hover:scale-*` everywhere, and hardcoded `green-500`/`blue-500` in `ServiceButtons.tsx:21,28`. Consolidate into 4 cva variants in `button.tsx`.
4. **`Preloader.tsx` fires a 2s fake loader on every navigation** with 5 concurrent animations. Delete it outright.
5. **`ServicesSlider.tsx:22-27` hotlinks Unsplash stock**, `ServicesGrid.tsx:17-24` ships 📸 emoji placeholders, and `VideoHero.tsx:41-59` has no poster/fallback. The site is literally rendering placeholder photography and stock images in production.

Honorable mentions: emoji used as UI (LocationSection, BookingReviews, InstagramFeed), `FloatingButtons.tsx` hardcoded phone number `+380501234567`, unused Unsplash gradients in `HeroSection.tsx:19`, footer `bg-muted` flatness.
