# Performance, SEO & Accessibility Audit — Глухомань

Audit date: 2026-04-11. Stack: Next.js 15 (App Router) + TypeScript + Tailwind v4.
Scope: source under `/src/**`, assets in `/public/**`.

Priority key:
- **P0** — blocks "premium" perception or fails baseline web standards. Fix immediately.
- **P1** — significant impact, fix this sprint.
- **P2** — polish, fix when convenient.

---

## 1. Performance

### 1.1 LCP driver: 5.5MB autoplaying MP4 with no poster (P0)
File: `src/components/sections/VideoHero.tsx`, `public/videos/main.mp4` (5,475,892 bytes).

`VideoHero` renders a full-viewport `<video autoPlay muted loop playsInline>` whose only `<source>` is `/videos/main.mp4`. Issues:

- **No `poster` attribute** — until the video's first frame decodes, the user sees the dark `bg-black/40` overlay over a black void. The "Глухомань" `<h1>` text floats over nothing during LCP.
- **No `preload="metadata"`** — browser default `preload="auto"` will pull the entire 5.5MB file on every page view, including 4G mobile.
- **No mobile fallback** — autoplay forces the 5.5MB download even on a 360px phone screen.
- **No WebM/AV1 alternative source** — only `type="video/mp4"`. AV1 typically delivers the same quality at 30–50% of H.264 size; WebM/VP9 around 50–60%.
- **`'use client'`** ships the entire hero (plus its `lucide-react` icons) as JS even though only the play/mute buttons need interactivity. The hero text + video tag could be a server component with the controls extracted into a small client island.

LCP impact: on a cold cache, throttled "Slow 4G", LCP will measure roughly 6–9s (network-bound by the video). With a poster JPG (~80KB) the LCP element becomes the poster image and lands in 1.5–2.5s.

**Recommendations:**
1. Generate `main.webm` (VP9 or AV1) and `main_poster.jpg` (1920×1080, ~70KB).
2. `<video preload="metadata" poster="/videos/main_poster.jpg">` with WebM source first, MP4 fallback second.
3. Gate autoplay behind a media query: render an `<img>` poster on `(max-width: 768px)` and only mount the `<video>` on desktop, OR use `<source media="(min-width: 1024px)" ... />` so mobile never downloads it.
4. Add `<link rel="preload" as="image" href="/videos/main_poster.jpg" fetchpriority="high">` in `layout.tsx` head.
5. Split `VideoHero` into a server-rendered `HeroShell` plus a small `<VideoControls />` client island.

### 1.2 Background-image CSS bypasses Next/Image optimization (P0)
Files: `src/app/page.tsx`, `src/app/aquapark/page.tsx`, `src/app/hotel/page.tsx`, `src/app/restaurant/page.tsx`, `src/app/sauna/page.tsx`, `src/components/ui/InstagramFeed.tsx`.

Grep finds **18** `style={{ backgroundImage: ... }}` declarations across `src/**/*.tsx`. Every hero on every page and every service card on the home page uses this pattern. Consequences:

- Next.js cannot generate AVIF/WebP variants — original JPGs are served unchanged. `9.jpg` (108KB), `33.jpg` (124KB), `akvapark.webp` (208KB), `otel_gluhoman_photo31.jpg` (42KB) all bypass `/_next/image`.
- No `srcset` — a 4K monitor and a 360px phone download identical bytes.
- No `loading="lazy"` semantics for off-screen cards.
- No `width`/`height` (CLS risk on slow connections).

`next/image` is currently only imported in `Preloader.tsx`, `Header.tsx`, `Footer.tsx`. Three files out of an entire site.

**Restaurant page additionally pulls a remote Unsplash URL** as a hero background:
`https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop` — third-party DNS + TLS + image fetch on the critical path. Same `unsplash.com` URL also lives as a fallback child of the `<video>` element in `VideoHero` (which is dead code — fallback children of `<video>` are only rendered when the browser cannot play `<video>` at all).

**Recommendation:** replace every `bg-cover bg-center` div with `<Image fill sizes="..." priority?={isHero} alt="..." />`. Self-host the Unsplash hero (or replace it with a real restaurant photo). Add an explicit `images` block to `next.config.ts`.

### 1.3 `next.config.ts` is empty of optimization config (P1)
File: `next.config.ts` (12 lines). Currently only sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`.

What is missing:
- No `images.formats: ['image/avif', 'image/webp']`.
- No `images.remotePatterns` for Unsplash URLs.
- No `headers()` for long-lived `Cache-Control` on `/videos/*` and `/images/*` (`immutable, max-age=31536000`).
- `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are both set — this is a SEO/a11y risk multiplier because `jsx-a11y/alt-text` and similar lint rules silently fail in CI.

### 1.4 Preloader artificially delays first paint by 2.5 seconds (P0)
File: `src/components/ui/Preloader.tsx`.

```ts
const timer = setTimeout(() => {
  setIsLoading(false);
  setTimeout(() => { setIsVisible(false); }, 500);
}, 2000);
```

A `'use client'` component mounted in `layout.tsx` covers the entire viewport with `z-[9999]` for **2,000ms minimum + 500ms fade = 2,500ms** before the user sees any content, regardless of how fast the actual page loaded. On a fast device with warm cache the real page might be interactive in 400ms; the preloader hides it for an extra ~2.1s of pure waste. This destroys LCP, INP, and the perception of the site being "premium". It also injects a duplicate `<h1>Ласкаво просимо</h1>` into the document, which competes with the VideoHero `<h1>` for SEO and screen-reader attention.

Premium sites do not have splash screens. **Delete the Preloader entirely.** If a brand reveal is desired, animate the logo *into* the hero using CSS keyframes that do not block content.

### 1.5 Font loading is fine, but trim weights (P2)
`layout.tsx` correctly uses `next/font/google` Manrope with cyrillic + latin subsets and 6 weights (300/400/500/600/700/800). `next/font` self-hosts and inlines `font-display: swap`, so this is well done. **However**: 6 weights × 2 subsets means many WOFF2 files. Audit which weights are actually used in the design system; trim to 3–4 weights (e.g. 400/600/700) to cut ~30–50KB of font payload.

### 1.6 Third-party embeds are mock data, not real (P2)
- `InstagramFeed.tsx` is **mock data** (`mockInstagramPosts` array, no Instagram Graph API call). Currently zero perf cost — but uses `'use client'` and a 1s artificial loading skeleton (`setTimeout(..., 1000)`) which is pure waste. Remove the artificial delay.
- `GoogleReviews.tsx` is also **mock data** (`mockReviews` array). Same `'use client'` overhead but no real network calls.
- `LocationSection.tsx` likely embeds a Google Maps iframe — verify it uses `loading="lazy"` and `referrerpolicy="no-referrer-when-downgrade"`.

When wired up to real APIs, lazy-mount with `next/dynamic({ ssr: false })` plus an `IntersectionObserver` so they do not run during the homepage's critical path.

### 1.7 JS bundle observations (P1)
`VideoHero`, `BookingSection`, `BookingForm`, `InstagramFeed`, `GoogleReviews`, and `Preloader` are all `'use client'`. The home page pulls all of them, plus a long list of `lucide-react` icons (`Phone, MapPin, Star, ArrowRight, Sparkles, Play, Pause, Volume2, VolumeX, Calendar, MessageCircle, Instagram, Heart, Eye, ExternalLink, User, ChefHat, ...`). Tree-shaking helps but `lucide-react` is large. Either:
- Use per-icon imports (`import Phone from 'lucide-react/dist/esm/icons/phone'`), or
- Replace with inline SVG for the 5–6 hottest icons.

Run `npm run build` and inspect with `@next/bundle-analyzer` to confirm.

---

## 2. SEO

### 2.1 Per-page metadata: present but incomplete (P1)
| Page | title | description | keywords | openGraph | twitter | canonical |
|---|---|---|---|---|---|---|
| `/` (page.tsx) | yes | yes | yes | **no** | no | no |
| `/aquapark` | yes | yes | yes | yes | no | no |
| `/hotel` | yes | yes | yes | yes | no | no |
| `/restaurant` | yes | yes | yes | yes | no | no |
| `/sauna` | yes | yes | yes | yes | no | no |
| `/other-services/*` | unverified | — | — | — | — | — |

Findings:
- The **home page has no `openGraph` block** even though `layout.tsx` has one. The page-level `metadata` override silently strips OG (the merge order can confuse social crawlers).
- **No `twitter:` card** anywhere. Link previews on Twitter/X show a blank card.
- **No `openGraph.images`** — when shared on Facebook, Telegram, or Viber, the link preview has no image. Huge miss for a visual hospitality brand. Add `openGraph.images: [{ url: '/og/home.jpg', width: 1200, height: 630 }]` per page.
- **No canonical URLs** (`alternates.canonical`). Should be added before any paid traffic.
- **No `metadataBase`** in `layout.tsx` — Next will warn at build time.
- Audit `src/app/other-services/*/page.tsx` to ensure each has a `metadata` export.

### 2.2 Structured data (JSON-LD): completely missing (P0)
**Zero JSON-LD anywhere** in the codebase. For a hospitality complex, this is the single biggest organic-search win available:

- `LocalBusiness` (or more specifically `Resort`) on `/` — phone, address, geo, opening hours, price range, image, aggregateRating.
- `Hotel` on `/hotel` — starRating, amenityFeature, numberOfRooms.
- `Restaurant` on `/restaurant` — servesCuisine, menu URL, acceptsReservations, priceRange.
- `TouristAttraction` on `/aquapark`.
- `Review` / `AggregateRating` from the (currently mocked) Google Reviews data.
- `BreadcrumbList` on every non-home page.
- `Organization` with `sameAs: [instagram, facebook, ...]`.

Next App Router supports JSON-LD natively — drop a `<script type="application/ld+json">` element with the serialized schema in each `page.tsx`. Roughly 30 minutes of work for potentially 20–40% organic CTR uplift via rich results (price, stars, hours in the SERP).

### 2.3 No `sitemap.ts`, no `robots.ts` (P0)
Verified missing:
- `src/app/sitemap.ts` — does not exist.
- `src/app/robots.ts` — does not exist.
- `public/sitemap.xml` — does not exist.
- `public/robots.txt` — does not exist.

Google has nothing to crawl beyond what it discovers via internal links, and there is no crawl directive at all. App Router makes both trivial — a `sitemap.ts` returning the static route list takes five minutes. Add it now.

### 2.4 Semantic HTML (P1)
- `layout.tsx` correctly wraps content in `<main className="flex-1">`. Good.
- `VideoHero.tsx` provides the homepage `<h1>`. Good.
- Each service detail page (`/aquapark`, `/hotel`, `/restaurant`, `/sauna`) also has its own `<h1>`. Good.
- However, **`Preloader` injects an extra `<h1>Ласкаво просимо</h1>`** that competes with the page `<h1>` for the first ~2.5s. Two `<h1>`s in the document confuse screen readers and search engines. Another reason to delete the Preloader.
- Sections wrap content in `<section>`. Cards do not use `<article>` — consider adding for service cards if they are standalone content syndicated to RSS or social.

### 2.5 Hreflang / i18n (P2)
Site is Ukrainian only. `<html lang="uk">` is correctly set. When i18n arrives, add `alternates.languages` in metadata and consider middleware-based locale routing.

---

## 3. Accessibility

### 3.1 Color contrast (P1)
- White text on `bg-black/40` overlay over a video — at 40% opacity over arbitrary video frames, **contrast can drop below WCAG AA 4.5:1** when the frame is light (sky, water highlights). Increase overlay to `bg-black/55` or use a gradient `from-black/70 via-black/40 to-black/70`.
- `text-muted-foreground` on `bg-white/60` cards — `muted-foreground` in shadcn defaults to a gray that *can* fall below 4.5:1 on a white-blur background. Run a contrast check on the actual computed colors (the radial green gradient bleeds through `bg-white/60`, so the effective background varies).
- The `text-primary/text-accent` gradient text (`bg-clip-text text-transparent`) on white — green-on-white is borderline for AA on the lighter end of the gradient.
- "Прокрутіть вниз" scroll indicator uses `text-white/70` over the video — contrast risk.

Run axe-core or Lighthouse on the deployed site and fix flagged failures.

### 3.2 Image alt text (P1)
- `Preloader.tsx` `<Image alt="Глухомань">` — present, good.
- `Header.tsx`, `Footer.tsx` use `next/image` — verify alt attributes.
- **All 18 background-image divs have no alt text whatsoever** (background-image is decorative by definition to assistive tech). Hero images that *convey content* (the aquapark hero, the restaurant hero) should be `<Image>` with descriptive alt, not background-image.
- Service cards on the home page show photos of the actual aquapark/restaurant/hotel/sauna as background-image — these are content images and need alt text.

### 3.3 Focus visible (P0)
File: `src/app/globals.css` line 120: `@apply border-border outline-ring/50;`.

This is the **only** focus-related rule in `globals.css` — no `:focus-visible` overrides, no custom ring. Custom inputs in `BookingForm.tsx` use `focus:outline-none focus:ring-2 focus:ring-primary/50` — the `outline-none` removes the default browser outline and replaces it with a ring, which is acceptable. But `focus:` (not `focus-visible:`) means the ring also fires on mouse click, which is visually noisy. Migrate to `focus-visible:ring-2`.

The play/mute `<button>` elements in `VideoHero` and the close `<button>` in `BookingForm` have **no focus styles at all** beyond the browser default (which is suppressed by Tailwind preflight on most reset styles). Add explicit `focus-visible:ring-2 focus-visible:ring-primary` to every interactive element.

### 3.4 Form labels (BookingForm) (P2 — mostly good)
File: `src/components/ui/BookingForm.tsx`. **Labels are properly associated** via `htmlFor`/`id` pairs. Good.

Remaining issues:
- `alert('Дякуємо за заявку!...')` is not accessible — use a proper toast/dialog with `role="status"` and `aria-live="polite"`.
- The modal `<div>` wrapper has no `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby`. Screen reader users will not know a modal opened, and focus is not trapped — the Tab key escapes to the page behind. Use Radix Dialog (already a shadcn dependency) instead of a hand-rolled div.
- The close `<button>` has no `aria-label="Закрити"` — the `<X />` icon is invisible to screen readers.
- `required` fields are marked with `*` in the visible label but no `aria-required="true"` and no programmatic error announcement.

### 3.5 `lang` attribute (P2 — already correct)
`layout.tsx`: `<html lang="uk">`. Good.

### 3.6 Reduced motion (P0)
Grep across `src/app/globals.css`: **zero** matches for `prefers-reduced-motion`. The site has heavy animation:

- Preloader: `animate-pulse`, `animate-ping` (×4), `animate-spin`, `animate-logo-slide-in`, `animate-text-appear`, `animate-spinner-appear`.
- Page sections: `hover:-translate-y-4`, `hover:scale-110`, `transition-all duration-700`, `animate-gradient`, `group-hover:rotate-3`.
- Many decorative `blur-3xl` floating elements with `animate-pulse`.

Users with vestibular disorders or motion sensitivity can experience nausea from this. **WCAG 2.3.3 (AAA) and increasingly 2.1 (AA) require respecting `prefers-reduced-motion`.** Add to `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Also gate the `VideoHero` autoplay: only call `videoRef.current.play()` when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is false.

---

## Top 5 Highest-Impact Issues

| # | Severity | Area | Issue | Effort |
|---|---|---|---|---|
| 1 | P0 | Perf | 5.5MB autoplay MP4 with no poster, no preload control, no mobile fallback dominates LCP | 2h |
| 2 | P0 | Perf | Preloader splash artificially delays first paint by 2.5s on every navigation | 5min (delete it) |
| 3 | P0 | SEO | No JSON-LD structured data (LocalBusiness, Hotel, Restaurant) on a hospitality site | 1h |
| 4 | P0 | SEO | No `sitemap.ts`, no `robots.ts`, no `robots.txt` — search engines have no crawl directives | 30min |
| 5 | P0 | Perf | 18 background-image declarations bypass Next/Image — no AVIF/WebP, no srcset, no lazy loading | 3h |

Honourable mentions: missing `prefers-reduced-motion` rules (P0 a11y), `BookingForm` modal lacks `role="dialog"` and focus trap (P1 a11y), no Twitter Card or OG image metadata (P1 SEO).
