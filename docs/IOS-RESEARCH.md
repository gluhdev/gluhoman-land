# iOS Safari Viewport Jank — Research from `gluhdev/fcp-website`

## (a) Solution found?
**Yes.** It is a pure-CSS solution living in `app/mobile.css`, imported from `app/globals.css`. There is **no** JavaScript `visualViewport` listener, no `--vh` setter hook, no `useViewportHeight` — the fix is entirely declarative CSS.

## (b) Exact files & code

### `app/globals.css` (import line)
```css
/* Import mobile styles - comes after font imports */
@import './mobile.css';

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
body {
  overflow-x: hidden;
}
```

### `app/mobile.css` — the load-bearing parts
```css
/* Base scroll rules — lock html/body height so address-bar collapse cannot resize them */
html {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: none;
  overscroll-behavior-y: none;
  height: 100%;
  min-height: 100%;
}
body {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: none;
  overscroll-behavior-y: none;
  height: 100%;
  min-height: 100%;
}

/* Hero gets clipped + promoted to its own GPU layer so resizes don't repaint it */
@media screen and (max-width: 768px) {
  #hero-section {
    overflow: hidden !important;
    transform: translateZ(0);
  }
}

/* Use small-viewport unit where supported — it does NOT change with URL bar */
@supports (height: 100svh) {
  :root {
    --vh: 1svh;
  }
}

/* GPU-promote the fixed header so it doesn't jitter during URL-bar collapse */
header {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* On mobile the hero is shrunk to 70vh so it's never the full visual viewport */
@media screen and (max-width: 768px) {
  .hero-section { height: 70vh !important; }
  main { overflow: visible !important; height: auto !important; min-height: auto !important; }
}

/* iOS-only input fix to stop auto-zoom on focus */
@supports (-webkit-touch-callout: none) {
  input, textarea {
    font-size: 16px !important;
    -webkit-appearance: none;
    border-radius: 0;
  }
}
.form-input { font-size: 16px !important; } /* same anti-zoom rule */
```

The `HeroSection.tsx` component itself uses `className="relative h-screen w-full overflow-hidden"`. The mobile override (`.hero-section { height: 70vh }` and the `#hero-section { overflow: hidden; translateZ }` rules) wins on phones.

## (c) How it works mechanistically

1. **Lock the document box.** `html` and `body` get `height: 100%; min-height: 100%; overflow-y: auto`. Because the document is sized to the *layout viewport* (which iOS Safari does **not** change when the URL bar collapses), the page never re-flows when the bar hides/shows.
2. **Disable bounce/rubber-banding.** `overscroll-behavior: none` + `-webkit-overflow-scrolling: touch` keeps scroll inertia inside the document and stops the rubber-band that triggers the URL-bar transition repaint.
3. **GPU-promote jittery elements.** `transform: translateZ(0)` + `backface-visibility: hidden` on `header` and `#hero-section` puts them on their own composited layer, so when Safari does animate the chrome the browser can just translate the layer instead of re-laying-out/re-rasterizing it. This is what kills the visible "zoom/jerk".
4. **Avoid `100vh` on mobile entirely.** The hero is forced to `70vh` on `<=768px`, so even if the layout viewport were to change, you wouldn't see a full-height element snap. The `--vh: 1svh` declaration (gated on `@supports`) provides a future-proof small-viewport unit if any element opts in.
5. **`font-size: 16px` on inputs** prevents the unrelated iOS focus-zoom which often gets confused with viewport jank.

Net effect: there is no JS measuring `window.innerHeight`, nothing to debounce, nothing to repaint. The browser's URL bar animation becomes a pure compositor transform over a fixed-size document.

## (d) Recommended action for `gluhoman-land`

Concrete edits, smallest diff first:

1. **Create `src/app/mobile.css`** — copy the rules above (drop FCP-specific selectors like `.font-panel`, `.cards-grid`, etc.; keep the html/body lock, overscroll-behavior, `#hero-section` GPU promotion, header GPU promotion, the `@supports (height: 100svh)` block, `.hero-section { height: 70vh }`, and the iOS input rule).
2. **`src/app/globals.css`** — add `@import './mobile.css';` after the font imports / Tailwind directives.
3. **`src/components/sections/HeroSection.tsx`** and **`VideoHero`** — give the wrapping `<section>` `id="hero-section"` and class `hero-section`, and ensure it has `overflow-hidden`. Replace any `min-h-screen` / `h-screen` / `h-[100vh]` / `90vh` on the hero with `h-screen md:h-screen` plus the mobile.css override (or use `h-[100svh]`).
4. **Inputs site-wide** — verify all `<input>`/`<textarea>` use `text-base` (16px) or larger; the mobile.css rule will enforce it but Tailwind classes should match.
5. **Tailwind**: nothing required. (Optionally add `h-svh` utility via arbitrary value `h-[100svh]` for any other full-viewport sections, e.g. `LocationSection`.)
6. **Header** (`src/components/layout/Header.tsx`) — already fixed; the `header { transform: translateZ(0) }` rule will apply automatically once `mobile.css` is imported.

Files to touch:
- `src/app/globals.css` (add import)
- `src/app/mobile.css` (new)
- `src/components/sections/HeroSection.tsx` (id + class + clamp)
- `src/components/sections/VideoHero.tsx` (same treatment)
- Optionally `src/app/page.tsx` and other pages that use `min-h-screen` on top-level sections

## (e) Caveats

- `!important` is used heavily; this is intentional in fcp-website to outrank Tailwind utilities. Be aware it will override any future Tailwind `h-*` on `.hero-section`.
- `100svh` only works on iOS Safari 15.4+ / Chrome 108+. The `@supports` gate means older browsers fall back silently — they will still get the html/body lock fix, just no `--vh` variable.
- `overscroll-behavior: none` on `html/body` disables pull-to-refresh on Android Chrome. If you want PTR back, drop it from `html` and keep it only on `#hero-section`.
- `transform: translateZ(0)` on `header` creates a new stacking context. Any `position: fixed` children of header that relied on the viewport as containing block will now be contained by the header. Audit dropdowns/menus.
- Mobile hero is **70vh, not 100vh**. This is a deliberate design trade-off — there is always a sliver of the next section visible. If the design demands full-bleed, switch to `h-[100svh]` instead.
- No JS = no edge cases around resize debouncing, but also no recovery if a future iOS version reintroduces the bug. Keep this doc.

## (f) Docs written to
`/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/docs/IOS-RESEARCH.md`
