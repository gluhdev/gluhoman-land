# Mobile Audit — Глухомань (Gluhoman Land)

Date: 2026-04-11
Scope: Mobile UX audit at 375px / 414px / 768px viewports. Analysis only, no code changes.
Stack: Next.js 15, Tailwind v4, shadcn/ui. Dev server on port 3002.

Breakpoint reminder (Tailwind defaults):
- base = 0–639px (mobile)
- sm = 640px+
- md = 768px+
- lg = 1024px+
- xl = 1280px+

So anything marked `lg:` or `xl:` only applies on tablet/desktop. `md:` only kicks in at 768px, meaning 375px and 414px phones get the mobile base styles.

---

## Global / Cross-Page Issues

### CRITICAL

1. **No `viewport` export anywhere in `src/app/`** — `src/app/layout.tsx:15` only exports `metadata`. Next.js 15 requires a separate `export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }` for proper mobile scaling and for notch-safe areas. Without it, iOS Safari uses its 980px fallback width and `env(safe-area-inset-*)` values are zero — every "horizontal overflow" hack downstream is a symptom of this.
   - File: `src/app/layout.tsx` (missing export)

2. **VideoHero forces 100vw on a fixed-width element** — `src/components/sections/VideoHero.tsx:39` sets `style={{width: '100vw', maxWidth: '100vw'}}` on the hero `<section>`. On iOS, `100vw` includes the scrollbar gutter and, combined with the `html, body { overflow-x: hidden !important }` bandages in `globals.css:122` and `:145`, this is the smell of a layout that already overflows. Root cause is likely #1 above plus `container` elements without responsive padding.
   - File: `src/components/sections/VideoHero.tsx:39`
   - File: `src/app/globals.css:122,145,721,725,734` (five separate `overflow-x: hidden` overrides)

3. **`main.mp4` (~5.5 MB) autoplays on mobile with no poster and no mobile fallback** — `VideoHero.tsx:41–51` always loads `/videos/main.mp4` regardless of connection type. Ukrainian mobile users on 3G/4G will be charged ~5.5 MB before the page is interactive. No `preload="metadata"`, no `poster` attribute, no `<source media>` switch, no `navigator.connection` gating, no image fallback for reduced-motion users.
   - File: `src/components/sections/VideoHero.tsx:41-59`
   - Also: iOS will refuse to autoplay if the video has an audio track even with `muted`, unless `muted` is set *before* the element is parsed. It is set inline, which is fine, but the belt-and-braces `videoRef.current.muted = true` in `useEffect` at line 15 only runs after hydration — first-paint race condition.

### MAJOR

4. **FloatingButtons are not safe-area-aware** — `src/components/ui/FloatingButtons.tsx:49` uses `fixed bottom-6 right-6`. On iPhones with a home indicator (iPhone X–16) and on iOS Safari with the dynamic bottom bar, the button can be clipped or sit on top of the browser chrome. Should use `bottom: calc(1.5rem + env(safe-area-inset-bottom))`.
   - File: `src/components/ui/FloatingButtons.tsx:49`
   - Additionally, the main FAB is 64×64 (`w-16 h-16`) — fine — but it overlaps the last line of every page's footer copyright. There is no `padding-bottom` added to `<main>` to compensate.

5. **Raw `background-image` on all hero sections — no responsive sourcing** — every service page hero uses inline `backgroundImage: url(...)` instead of `next/image` with `sizes`:
   - `src/app/aquapark/page.tsx:28` → `/images/akvapark.webp`
   - `src/app/hotel/page.tsx:27` → `/images/9.jpg`
   - `src/app/restaurant/page.tsx:27` → `https://images.unsplash.com/...?w=1200&h=800`
   - `src/app/sauna/page.tsx:27` → `/images/33.jpg`
   - `src/components/sections/HeroSection.tsx` (fallback) — pure gradient, no image
   
   Consequence: 375px phones download the same full-size asset as desktop. No AVIF/WebP negotiation, no `sizes` hint, no lazy-loading (hero is above fold so lazy is irrelevant, but size selection is not). Next.js Image would emit `srcset` and serve a 640w variant automatically.

6. **Hero H1 `text-5xl lg:text-7xl` (48px → 72px) is too large at 375px** — on a 375px screen with 24px container padding, `text-5xl` (48px/1 line-height) for a single-word title like "Глухомань" is borderline but acceptable; however the service pages also stack a subtitle line ("на дровах", "чекає на вас") and the combined two-line block plus a `text-xl` (20px) paragraph and two CTAs pushes the primary CTA below the fold on iPhone SE (667px tall) once you subtract the 96px header spacer (`h-24` at `Header.tsx:240`).
   - Files: `aquapark/page.tsx:39`, `hotel/page.tsx:38`, `restaurant/page.tsx:38`, `sauna/page.tsx:38`, `VideoHero.tsx:66`
   - Effect at 375×667 minus 96px header = 571px usable. Hero is `h-[80vh]` ≈ 534px, which hides the scroll indicator and part of the CTA pair on shorter devices.

7. **`grid lg:grid-cols-2 xl:grid-cols-4` patterns collapse to single column on every phone** — this is correct fallback behavior, but several grids skip the `md:` intermediate step, meaning 768px iPad portrait gets a single column too:
   - `src/app/aquapark/page.tsx:83` — `grid lg:grid-cols-2 xl:grid-cols-4` (no `md:grid-cols-2`)
   - `src/app/restaurant/page.tsx:82` — `grid lg:grid-cols-2 xl:grid-cols-3`
   - `src/app/hotel/page.tsx:114` — `grid lg:grid-cols-2` only
   - `src/components/sections/LocationSection.tsx:27` — `grid lg:grid-cols-1 gap-8` (useless class, always 1 col)
   
   Single-column on phone is fine; the issue is wasted tablet real estate and inconsistent spacing.

8. **Booking form modal is too tall for mobile viewport** — `src/components/ui/BookingForm.tsx:43` uses `max-h-[90vh]` with `overflow-y-auto` — OK — but the form body contains 8 fields including two native `<input type="date">` pickers and two `<select>` elements inside a `p-8` container that also has a 32px title block. At 375×667, `max-h-[90vh]` ≈ 600px, and the form content is ~900px tall → user must scroll inside a scroll container inside an iOS page that ALSO scrolls. Double-scroll traps are a known iOS Safari problem. Additionally the grid `grid md:grid-cols-2 gap-4` at lines 73 and 146 stacks properly on mobile, but the `p-8` (32px all sides) in the modal container eats 64px horizontal — at 375px that leaves ~311px for inputs.
   - File: `src/components/ui/BookingForm.tsx:42-43, 73, 146`

9. **Header logo is oversized on mobile** — `src/components/layout/Header.tsx:45` is `h-12 sm:h-14 md:h-16` (48/56/64px). Combined with the `h-24` (96px) header container at line 37, the header eats 14% of an iPhone SE screen before any content. Premium brands typically use 40–48px headers on mobile.
   - File: `src/components/layout/Header.tsx:37, 45, 240`

10. **Mobile menu drawer is acceptable but has issues**:
    - Good: off-canvas drawer at `Header.tsx:160-237`, hamburger toggle at line 138, proper backdrop click-to-close at line 164, keyboard-accessible.
    - Bad: no `Escape`-to-close, no focus trap, no `aria-expanded`, no `aria-label` on the menu button, no `role="dialog"`. The `X` icon button has no accessible name.
    - Bad: dropdown submenu items from `NAVIGATION[].children` are shown *inline expanded* on mobile (line 175–197) — OK — but the parent item itself is NOT a link, just a label, so users on mobile cannot tap the parent "Інші послуги" to go to a listing page. Only touch-hover works on desktop (`group-hover`), and on mobile there is no hover, so the *desktop* dropdown at line 73 is completely inaccessible by touch.
    - File: `src/components/layout/Header.tsx:63-97, 138-152, 175-197`

### MINOR

11. **`FloatingButtons` tooltip labels are permanently visible on mobile** — lines 66–69 render a `bg-black/80` label next to each button when the menu is expanded. On a 375px screen these labels plus the 56px button push off-screen to the left horizontally because the container is right-anchored. The `whitespace-nowrap` on line 67 guarantees overflow if the label is long (`Написати в WhatsApp` is ~180px wide). Visually OK because they are right-to-left, but they can collide with the content column padding.

12. **`BookingSection` CTA "Забронювати онлайн" stats grid** — at `BookingSection.tsx:68` `grid-cols-1 sm:grid-cols-3` correctly stacks on mobile, but the `mt-16 pt-16` (128px vertical) after the CTA row is excessive on phones and doubles the perceived section length.

13. **Footer grid collapses fine** — `Footer.tsx:10` is `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`. On 375px all four columns stack. Contact info is legible. Minor: `container px-4 py-12` at line 9 has no `max-w-7xl mx-auto` wrapper, so on tablet it stretches full width — minor aesthetic.

14. **Video hero controls are `opacity-0 hover:opacity-100`** — `VideoHero.tsx:81`. Mobile has no hover, so the pause/mute buttons are completely inaccessible on touch devices. Also: the `onMouseEnter`/`onMouseLeave` at line 82–83 are dead code on touch.
    - File: `src/components/sections/VideoHero.tsx:80-100`

15. **Phone links in `Header` mobile drawer are `py-3` (12px) → ~44px tall** — meets the 44px minimum. Footer phone links at `Footer.tsx:76-82` are `text-sm` (14px) with no explicit padding, wrapped in a `div.flex.items-center.space-x-2` → click target is only the text glyph width + ~20px height. **Fails WCAG 2.5.5 (44×44).**
    - File: `src/components/layout/Footer.tsx:73-84`

16. **`BookingForm` inputs are `p-4` (16px padding)** — 16px + ~20px text = ~52px height. Good. BUT `<select>` on iOS 16+ opens native picker — the emoji labels ("🏊‍♀️ Аквапарк") in the form at `BookingForm.tsx:136-141` are fine. Minor: `<input type="date">` has notoriously different sizes across iOS/Android and can break the grid alignment at `line 146`.

17. **`container max-w-7xl mx-auto px-6 lg:px-8`** — used everywhere. At 375px that is 24px padding per side = 327px content width. Acceptable but tight for the `grid md:grid-cols-2 gap-4` + two CTAs flow in the hero.

18. **Excessive `overflow-x: hidden !important` in `globals.css`** — lines 122, 145, 721, 725, 734 all override. This hides horizontal overflow bugs rather than fixing them. When the viewport meta is added (issue #1), several of these can likely be removed and the real culprits fixed. Smells: `w-screen`, fixed pixel widths, and the `100vw` in VideoHero.tsx:39.

---

## Page-by-Page Issues

### `/` (Home)
- `VideoHero.tsx` — issues #2, #3, #6, #14
- `src/app/page.tsx` — Section headers `text-4xl lg:text-5xl xl:text-6xl` — acceptable on mobile.
- `LocationSection.tsx:30` — map iframe `h-[300px]` is fine on mobile but the `grid lg:grid-cols-1` at line 27 is nonsensical (always one column). Minor.
- `BookingSection.tsx` — issue #12. CTA button pair at line 45 is `flex-col sm:flex-row` — correct stacking.

### `/aquapark`
- Hero issues #5 (backgroundImage), #6 (text sizing).
- `grid lg:grid-cols-2 xl:grid-cols-4 gap-8` at line 83 — issue #7. On tablet (768px) this shows single column with `gap-8` = 32px wasted.
- Zone cards `p-8` at line 112 + `rounded-3xl` — card feels cramped at 375px because `p-8` = 64px horizontal padding inside a ~327px container = ~263px content.
- `aspect-square` image at line 191 — renders as 263×263px, OK.

### `/hotel`
- Hero issues #5, #6.
- Room grid `grid lg:grid-cols-2 gap-12` at line 114 — stacks to 1 column on mobile; `gap-12` (48px) between sections is large but acceptable.
- Alternating layout at line 114 (`lg:grid-flow-col-dense`) — only applies at `lg:`, so mobile ordering is default DOM order. Fine.
- Room image `h-80 lg:h-96` = 320px on mobile. Reasonable.
- **Unsplash URL for room images at line 121** — external CDN, no Next.js Image optimization, large payload.

### `/restaurant`
- Hero issues #5 (uses **Unsplash URL**, not even a local image), #6.
- `grid lg:grid-cols-2 xl:grid-cols-3 gap-8` at line 82 — same tablet waste as aquapark.
- `aspect-square` unsplash image at line 139 — external asset, not optimized.

### `/sauna`
- Hero issues #5, #6.
- `grid md:grid-cols-2 lg:grid-cols-3 gap-8` at line 82 — **better than others** because it has `md:grid-cols-2` breakpoint.
- Procedure cards at line 167 have `flex items-start justify-between` → on 375px the title + two badges (`duration`, `temp`) can wrap awkwardly. Minor.

### `/other-services/paintball` (dynamic `[slug]`)
- Hero `min-h-[60vh]` at line 53 — better than `h-[80vh]` because min-h lets content grow. Good.
- Inline SVG dot pattern at line 56 — lightweight, fine.
- No issues beyond the global ones (#6, #10).

---

## Summary of Fails to Fix, in Priority Order

| # | Severity | Issue | File |
|---|---|---|---|
| 1 | CRITICAL | Missing `viewport` export | `src/app/layout.tsx` |
| 2 | CRITICAL | `100vw` on VideoHero + body `overflow-x: hidden` patches | `VideoHero.tsx:39`, `globals.css:122,145` |
| 3 | CRITICAL | 5.5 MB `main.mp4` unconditionally autoplays on cellular | `VideoHero.tsx:41-51` |
| 4 | MAJOR | FloatingButtons ignore `env(safe-area-inset-bottom)` | `FloatingButtons.tsx:49` |
| 5 | MAJOR | All service-page heroes use inline `background-image` instead of `next/image` | `aquapark/page.tsx:28`, `hotel/page.tsx:27`, `restaurant/page.tsx:27`, `sauna/page.tsx:27` |
| 6 | MAJOR | Hero CTAs pushed below fold on short phones | all hero files |
| 7 | MAJOR | Grids skip `md:` breakpoint → wasted tablet space | `aquapark/page.tsx:83`, `restaurant/page.tsx:82`, `hotel/page.tsx:114` |
| 8 | MAJOR | BookingForm modal scroll-within-scroll on mobile | `BookingForm.tsx:42-43` |
| 9 | MAJOR | Header `h-24` + `h-16` logo consume 14% of iPhone SE | `Header.tsx:37,45` |
| 10 | MAJOR | Desktop dropdown `group-hover` unreachable on touch; mobile drawer lacks a11y | `Header.tsx:63-97,138` |
| 11 | MINOR | FAB labels can overflow | `FloatingButtons.tsx:66-69` |
| 12 | MINOR | Excessive section padding on CTA blocks | `BookingSection.tsx:68` |
| 13 | MINOR | Video controls hidden on touch devices | `VideoHero.tsx:80-100` |
| 14 | MINOR | Footer phone links below 44×44 target | `Footer.tsx:73-84` |
| 15 | MINOR | 5× `overflow-x: hidden !important` in CSS hides bugs | `globals.css:122,145,721,725,734` |

## The #1 Critical Fix

**Add a `viewport` export to `src/app/layout.tsx`:**

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#...',
};
```

Without this, iOS Safari renders the page at ~980px wide and downscales, which is why the codebase has five `overflow-x: hidden !important` overrides and an inline `100vw` style. Fixing the viewport will expose and cascade-fix several of the overflow symptoms, enable safe-area insets for the FAB, and let the mobile drawer and booking modal size correctly. It is a one-line change with the highest mobile-experience leverage of anything on this list.
