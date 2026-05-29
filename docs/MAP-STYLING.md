# 🎨 Design System & Styling

> Colors, fonts, Tailwind v4 setup, and the critical scroll gotcha. Tokens verified from `src/app/globals.css` + `src/app/mobile.css`. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index.

## Tailwind v4 setup

`src/app/globals.css` is the entry point:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./mobile.css";
...
@theme inline { /* maps CSS vars → Tailwind tokens */ }
```

- **Tailwind v4** (CSS-first config — no `tailwind.config.js` driving theme; tokens live in `@theme inline`).
- `tw-animate-css` provides animation utilities.
- `mobile.css` is imported for mobile/FCP adaptations (see scroll note below).
- shadcn/ui components consume the `--color-*` / `--radius-*` tokens.

## Brand palette

**Rule (per brand memory): green + white only. Never blue / purple / teal.** Accent is warm gold/cream. Tokens are defined in **OKLCH** (hue ≈ 142–145 = green):

| Token | OKLCH | Meaning |
|-------|-------|---------|
| `--background` | `oklch(0.99 0.003 106)` | Warm near-white |
| `--foreground` | `oklch(0.15 0.02 140)` | Dark green-black text |
| `--primary` | `oklch(0.45 0.15 142)` | **Brand green** (≈ `#22c55e` family) |
| `--secondary` | `oklch(0.35 0.12 142)` | Darker green |
| `--accent` | `oklch(0.62 0.14 145)` | Lighter green accent |
| `--muted` | `oklch(0.96 0.01 142)` | Muted green-tint surface |
| `--destructive` | `oklch(0.577 0.245 27)` | Red (errors only) |
| `--ring` | `oklch(0.45 0.15 142)` | Focus ring (green) |
| `--radius` | `0.625rem` | Base radius (sm/md/lg/xl derived) |

Raw hex tones used in the design (cream/gold accents + greens):

| Hex | Use |
|-----|-----|
| `#22c55e` | Bright brand green |
| `#1a3d2e` | Deep forest green |
| `#e6d9b8`, `#f4ecd8`, `#fdfaf0` | Warm cream / gold accents & backgrounds |
| `#ffffff` | White |

> Note: the shadcn `--accent` token is **green**; the "warm gold" of the brand shows up as the cream tones above (decorative dividers, section flourishes), not as the `--accent` token. Keep both in mind.

## Fonts

Loaded in `src/app/[locale]/layout.tsx` (next/font), exposed as CSS vars and mapped in `@theme`:

| Token | Font | Role |
|-------|------|------|
| `--font-sans` / `--font-manrope` | **Manrope** (300–800, Latin+Cyrillic) | Body & UI (also `--font-heading`/`--font-body`) |
| `--font-display` / `--font-fraunces` | **Cormorant Garamond** (300–600, italic, Latin+Cyrillic) | Serif display / editorial headings |
| `--font-mono` | Geist Mono | Monospace |

All font choices are Cyrillic-verified. The `FontSwitcher` widget + `src/constants/fontPairings.ts` provide live preview pairings.

## ⚠️ Scroll gotcha (do not regress)

`src/app/mobile.css` documents — and the [[feedback-macos-scroll-fix]] memory reinforces — a hard rule:

- **Never put `overflow` / `overscroll` / `height:100%` / `overflow-y:auto` on `html` or `body` at global (desktop) scope.** Per the CSS spec, `overflow-x:hidden` on `body` forces `overflow-y` to `auto`, turning `body` into a scroll container that **traps macOS trackpad/wheel events** → the page stops scrolling with a mouse after hydration.
- `-webkit-overflow-scrolling: touch` must be scoped to **iOS media queries only** — on macOS Safari/Chrome it breaks wheel scroll.
- Horizontal clipping lives on a `.prevent-horizontal-scroll` wrapper, not on `html`/`body`.

## Motion / UX libs

- **Lenis** smooth scroll via `src/components/providers/SmoothScrollProvider.tsx` (disabled on touch/mobile/reduced-motion via `src/lib/use-is-touch.ts`).
- **framer-motion** for reveal/parallax (`Reveal`, `HeroParallax`).
- **embla-carousel** (+ autoplay) for sliders/galleries.
- `src/lib/blur-placeholder.ts` provides `BLUR_DATA_URL` for image placeholders.
