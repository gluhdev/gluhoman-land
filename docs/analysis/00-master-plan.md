# Глухомань — Master Improvement Plan

Synthesized from 10 parallel specialist audits in `docs/analysis/01-09`. This plan groups findings into phases ordered by impact-per-effort and dependency. Each item includes its source audit, rough estimate, and acceptance criteria. **Nothing here should be changed without the owner's per-phase approval** — the plan is a menu, not a contract.

> **Verdict from the lead audit (01):** _"Competent Next.js engineering wearing a 2020 shadcn-landing-page template costume — zero art direction; needs aggressive subtraction and a real type/color system before anything else."_

---

## Phase 0 — Stop the bleeding (must do first, ~½ day)

These are **revenue-bleeding or fatal-UX bugs**. Every other phase is academic until Phase 0 lands.

| # | Finding | Source | Fix | Accept |
|---|---|---|---|---|
| 0.1 | **BookingForm submits to nothing.** `console.log` + `alert()` at `BookingForm.tsx:25-29`. 100% of online leads silently dropped. | 03 UX | Wire to `/api/booking` that relays to Resend/Telegram bot; validate with zod. | Real submission round-trip in dev + staging telegram ping |
| 0.2 | **`viewport` export missing** from `src/app/layout.tsx`. iOS Safari uses 980px fallback; safe-area insets = 0. Root cause of 5× `overflow-x: hidden !important` bandages in `globals.css:122,145,721,725,734`. | 07 Mobile | Add `export const viewport = { width:'device-width', initialScale:1, viewportFit:'cover' }`. | 375px curl returns mobile HTML; remove the 5 `overflow-x:hidden` overrides and verify no regression |
| 0.3 | **5.5MB `main.mp4` autoplays unconditionally** on cellular. No `poster`, no `preload="metadata"`, no WebM/AV1. LCP ~6-9s on Slow 4G. | 07/08 | Add poster JPG (first frame); `preload="metadata"`; desktop-only `<source media>` gate; transcode to webm@1.5MB. | Mobile 3G trace < 3s LCP |
| 0.4 | **Preloader fakes 2s of loading** on every navigation. `Preloader.tsx` blocks paint at `z-[9999]` + duplicate `<h1>`. | 02/08 | **Delete the component and its mounts.** | Lighthouse TTI drops; no duplicate h1 |
| 0.5 | **`FloatingButtons.tsx:28,35` hardcodes wrong phone** `+380501234567`. Not a real company number. | 02 UI | Replace with `CONTACT_INFO.phone[0]`. | Matches `src/constants/index.ts` |
| 0.6 | ✅ **Dropdown "Інші послуги" invisible on hover.** `.container { overflow-x:hidden }` clipped the absolute panel. | 04/06 + fix agent | **DONE.** `Header.tsx:36` got `!overflow-visible`. | Verified in live DOM |
| 0.7 | ✅ **Font preview tool.** 20 hospitality font pairings with Cyrillic support. | 09 fonts | **DONE.** `FontSwitcher` mounted bottom-left; owner can live-preview. | Floating "🎨 Fonts" button on every page |

---

## Phase 1 — Design system foundation (~2-3 days)

**Do this before any visual redesign.** You cannot restyle a house whose bricks aren't consistent. Every audit flagged this: no color tokens, no type scale, no component variants.

### 1.1 Color palette rebuild (Source: 01 Lead)
- **Current:** `--primary` green + `--accent: oklch(0.55 0.15 220)` **blue**. A forest retreat with a SaaS-blue accent. Plus hardcoded `#22c55e` radial in `globals.css:715` bypassing tokens.
- **Proposal:** forest palette — deep green (`oklch(0.35 0.04 150)`), warm cream (`oklch(0.97 0.01 80)`), single ember accent (`oklch(0.62 0.12 40)`), charcoal text (`oklch(0.22 0.01 80)`). Zero blue.
- **Files:** `src/app/globals.css` (replace `--primary`, `--accent`, `--background`, delete hardcoded hex).
- **Accept:** no `from-primary to-accent` gradients in hero HTML; no `#22c55e` literals in codebase.

### 1.2 Type system (Source: 01/05)
- **Current:** single Manrope weight-stack; every h1/h2 is `text-5xl→7xl font-bold` with `bg-gradient-to-r from-primary to-accent bg-clip-text` (**71 usages across the codebase**).
- **Proposal:** display serif for headings + quiet sans for body. Owner to pick from `FontSwitcher` (Phase 0.7) — likely direction: **Fraunces/Cormorant Garamond + Inter/Manrope**.
- **Type scale:** 11-13px uppercase eyebrow (tracking 0.22em), 16px body, 28/40/56/72 heading ramp.
- **Rule:** delete `bg-clip-text` gradient from **every** heading. One feature text treatment site-wide, used sparingly.
- **Files:** `src/app/globals.css` (tokens), then sweep `bg-clip-text` across `src/app/**/*.tsx`.
- **Accept:** `rg "bg-clip-text"` returns 0 matches or 1.

### 1.3 `<SurfaceCard>` component (Source: 02 UI)
- **Current:** `bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl` repeated in 30+ files (LocationSection 49/80/112/137, GoogleReviews 121, BookingReviews 138, InstagramFeed 157, page.tsx 57/185/233/353, every service page).
- **Proposal:** one `<SurfaceCard variant="elevated|bordered|flat">` with `rounded-2xl` (drop 3xl), no default backdrop-blur.
- **Files:** new `src/components/ui/SurfaceCard.tsx`; sweep replacements.
- **Accept:** `rg "bg-white/70 backdrop-blur-sm"` returns 0 matches.

### 1.4 Button variants (Source: 02 UI)
- **Current:** `button.tsx` cva is bypassed by every call site. 6 border radii, 3 gradient recipes, `hover:scale-105/110` everywhere. `ServiceButtons.tsx:21,28` uses `green-500/600` and `blue-500/600` literals.
- **Proposal:** 4 variants in cva: `hero` (full-width pill), `heroOutline`, `pill` (ghost), `iconGhost`. Ban `hover:scale-*`. One duration (`duration-200`), one easing.
- **Accept:** `rg "hover:scale-"` returns 0 in `src/`.

### 1.5 Delete dead CSS & components
- `globals.css` has ~20 unused keyframes, 5 `overflow-x:hidden !important` overrides (kept in sync with 0.2).
- `BookingSection.tsx` — orphaned, not imported anywhere (03 UX).
- `Preloader.tsx` — done in Phase 0.4.

---

## Phase 2 — Header & menu rebuild (~1 day)

This is the highest-visibility piece and also the riskiest (dropdown must not re-break). Code agent (06) established the preservation contract.

### 2.1 Swap Header to shadcn/Radix NavigationMenu
- **Current:** custom CSS-only `group-hover` dropdown. No ARIA, keyboard unreachable, WCAG 2.1.1 fail. The Radix primitive `src/components/ui/navigation-menu.tsx` is installed but **imported nowhere**.
- **Proposal:** rebuild `Header.tsx` on top of Radix NavigationMenu. Preserve the `h-24` spacer contract or every page jumps.
- **Accept:** keyboard can Tab to trigger → Enter opens → Arrow navigates → Escape closes; `aria-expanded`, `aria-haspopup`, `aria-controls` all present.

### 2.2 Information architecture
- **Nav order:** drop "Головна" (logo goes home), reorder to `Аквапарк · Готель · Ресторан · Лазня · Інші послуги`.
- **"Інші послуги" dropdown:** group the 8 children into 3 categories:
  - **Active:** Пейнтбол, Прогулянки на конях, Тур по пивоварні
  - **Wellness:** Апітерапія, Мангальна зона
  - **Events:** Виїзні весільні церемонії, Дитячі свята, Контактний зоопарк
- Add a permanent **"Забронювати"** CTA button in the header (missing today per 04).

### 2.3 Visual direction: Editorial Boutique (05)
- Transparent over hero + warm-white `#FBFAF6/95` with 1px hairline on scroll.
- `logo.svg` (drop the PNG with sticker-outline).
- Nav: `text-[11px] uppercase tracking-[0.22em] font-medium` with underline-grow on hover.
- Shrink-on-scroll: 96px → 64px.
- Active-state via `usePathname`.
- Dropdown panel: square-cornered cream, hairline dividers, eyebrow captions, no gradient bullets.

### 2.4 Mobile drawer a11y (06)
- Promote the mobile `<div>` drawer to `role="dialog" aria-modal="true"` with focus trap, Escape-to-close, body scroll-lock, focus restoration to the hamburger on close.
- `aria-label` on hamburger and mobile phone button.
- Mobile "Інші послуги" becomes a collapsible accordion (not always-expanded).

**Acceptance test (preservation contract from 06):**
- ✅ logo click → `/`
- ✅ all 5 top-level routes reachable
- ✅ dropdown visible on hover AND focus
- ✅ h-24 spacer still present (no content jump)
- ✅ mobile hamburger works
- ✅ no horizontal scroll

---

## Phase 3 — Content, media, photography (~1-2 days)

The single biggest "$10k" signal isn't CSS — it's **real photography of a real place**.

### 3.1 Migrate to `next/image`
- **Current:** 18 inline `background-image` declarations bypass next/image. 3 files in the codebase use `<Image>`. (08 Perf)
- **Files:** every service page hero (`aquapark:28`, `hotel:27`, `restaurant:27`, `sauna:27`), `src/app/page.tsx` service cards (lines 70-73), `ServicesSlider.tsx:22`, all `LocationSection`/`HeroSection` decorative images.
- **Replace with:** `<Image fill>` + `priority` on hero, `sizes="..."`, AVIF/WebP.

### 3.2 Real photos only
- **Restaurant page still uses Unsplash** (`restaurant/page.tsx:27`) on the critical path. Hotel room cards also Unsplash.
- **Decision required from owner:** which of the 8 photos in `/public/images/` go where. If there aren't enough, schedule a photo shoot — no "$10k site" survives stock photos.

### 3.3 Video hero strategy
- `VideoHero.tsx`: add `poster="/images/hero-poster.jpg"`, `preload="metadata"`, `playsInline`, `muted`, `loop`. Produce a second `.webm` source at 1.5MB. Gate autoplay behind `(min-width: 768px)` via `<source media>`.

### 3.4 Delete emoji-as-UI
- `src/app/page.tsx:198-256` uses 💒🛁🎯🐎🎈🔥🐝🍺🦌 in gradient squares.
- `ServicesGrid.tsx:17-24` ships 📸 placeholder cards.
- `FloatingButtons` phone/flag emoji.
- **Replace with:** lucide-react icons (already a dep) at consistent 24px, single weight.

### 3.5 Fill the 8 stub pages — or hide them
- `/other-services/[slug]` all render "Деталі незабаром". Owner must decide:
  - (a) Write real content for each (paragraph, 2-3 photos, phone CTA). Preferred.
  - (b) Remove the dropdown group until content exists. Zero dead ends but shrinks the offering.
- Recommendation: **(a)** — even 100 words + 2 photos per service beats a stub.

---

## Phase 4 — SEO, structured data, metadata (~½ day)

Hospitality SEO gold that's currently on the floor.

### 4.1 JSON-LD structured data (08 SEO)
- Add `LocalBusiness` schema at the root (`src/app/layout.tsx` or per-page `<Script type="application/ld+json">`).
- Per-page schemas: `Hotel` on `/hotel`, `Restaurant` on `/restaurant`, `TouristAttraction` on `/aquapark`, `HealthAndBeautyBusiness` on `/sauna`.
- Include `address`, `geo`, `telephone`, `priceRange`, `image`, `aggregateRating` (if reviews exist).

### 4.2 Sitemap & robots
- New `src/app/sitemap.ts` — enumerate static routes + the 8 `other-services` slugs.
- New `src/app/robots.ts` — allow all, point to sitemap.
- Delete `public/robots.txt` if it exists (App Router supersedes).

### 4.3 Metadata sweep
- Every page needs unique `title`, `description`, `openGraph`, `twitter`. Some pages (`hotel/page.tsx` — TBD) have none.
- Add OG image (1200x630) per top page.
- `lang="uk"` on `<html>` — verify.

### 4.4 Tighten build config
- `next.config.ts` currently ignores TS and ESLint errors at build. Keep it for Vercel survival but **run `tsc --noEmit` + `npm run lint` in a pre-commit hook** so errors never land in `main`.

---

## Phase 5 — Accessibility & motion (~½ day)

### 5.1 Skip link, focus rings, landmarks
- Add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to content</a>` at top of `layout.tsx`.
- `:focus-visible` ring tokens in `globals.css`.
- `<nav aria-label>`, `<main id="main">`, `<footer>`.

### 5.2 `prefers-reduced-motion`
- Currently zero `@media (prefers-reduced-motion)` rules in `globals.css`. Animations include `animate-pulse`, `animate-ping`, multiple hover scales.
- Add a global override: `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### 5.3 BookingForm dialog
- Promote to `role="dialog" aria-modal="true"`, label via `aria-labelledby`, focus trap, Escape.
- Use shadcn Dialog primitive (add if missing).

### 5.4 Contrast audit
- White text on `from-primary to-accent` gradient is borderline at the lighter stop — run axe on the new palette (Phase 1.1) before accepting Phase 2.

---

## Phase 6 — Homepage IA & booking funnel (~1 day)

### 6.1 Homepage section order (03 UX proposal)
Currently: `VideoHero → ServicesGrid → ServicesSlider → Reviews → Instagram → Location → Booking`.
Proposed: `VideoHero → AtAGlanceStrip (distance from Poltava, contact, hours) → MainServices(4) → SignatureExperience(rotating feature) → Testimonials → Gallery → BookingForm → Location → Footer`.

### 6.2 Booking funnel (5 steps, 03 UX)
1. Landing → see Забронювати in header AND below fold.
2. Click → inline form (no modal, no nav-away).
3. Form → service selector (prefilled if came from a service page).
4. Submit → server action → Resend/Telegram notification.
5. Confirmation screen with phone fallback + map.

### 6.3 Trust signals
- Years of operation badge, certifications, aggregate review count at top of fold.
- "Booking.com" button on `/hotel` currently has **no `href`** (03). Either wire it or delete.

---

## Phase 7 — Nice-to-haves (optional, later)

- **i18n readiness** — extract Ukrainian strings to `src/messages/uk.json`, prep `next-intl` for RU/EN. Mentioned by 01, 03.
- **Error/empty states** — `not-found.tsx`, `error.tsx`, `loading.tsx` missing (03).
- **Viber/Telegram contact buttons** alongside phone (03).
- **Gallery lightbox** for the 48+ jpg photos.
- **Blog/Journal section** — classic premium hospitality SEO play.

---

## Risk register

| Risk | Mitigation |
|---|---|
| Breaking the dropdown again during Phase 2 header rewrite | Preservation checklist (06) as acceptance test; keep the `!overflow-visible` token until Radix viewport is confirmed working |
| Owner picks a font in `FontSwitcher` without Cyrillic support | All 20 pairings in `fontPairings.ts` are pre-verified; don't add unvetted fonts |
| Photography gap (not enough real photos for 12 services × multiple sections) | Decide early: phase 3.5 (a) vs (b); book a photo shoot if (a) |
| `BookingForm` backend choice (Resend vs Telegram vs CRM) | Quick decision needed before Phase 0.1 can land; Telegram is fastest path |
| Palette change (Phase 1.1) cascades through every gradient on every page | Do Phase 1 as a single large PR with full visual regression smoke test across all routes |
| `.container { overflow-x:hidden }` removal may resurface horizontal-scroll bugs | Keep it until Phase 0.2 viewport fix lands AND Phase 1 deletes the offending `width:100vw` from `VideoHero.tsx` |

---

## Suggested execution order

1. **Phase 0** — today-tomorrow. Ships the bug fixes and revenue-saving booking backend. Requires owner decision on booking destination.
2. **Owner uses `FontSwitcher` to pick font pairing.** (30 minutes, owner-driven.)
3. **Phase 1** — design tokens + components. Largest single-phase risk/reward.
4. **Phase 2** — header rebuild. Depends on Phase 1 tokens.
5. **Phase 3** — media migration + content. Depends on owner photo decisions.
6. **Phase 4** — SEO + metadata.
7. **Phase 5** — a11y polish.
8. **Phase 6** — IA/funnel. Depends on Phase 1 components + Phase 3 content.
9. **Phase 7** — as capacity allows.

Rough total: **7-10 focused working days** to get from current state to a defensible "premium hospitality" site. Phase 0 alone takes ½ day and unblocks revenue.

---

## Source documents

- `01-design-lead.md` — art direction
- `02-design-ui.md` — component audit
- `03-design-ux.md` — flows & booking funnel
- `04-menu-ux.md` — navigation UX
- `05-menu-visual.md` — menu aesthetics
- `06-menu-code.md` — a11y & refactor safety
- `07-mobile.md` — mobile responsive
- `08-perf-seo.md` — perf/SEO/a11y
- `09-fonts.md` — 20 font pairings + switcher docs
