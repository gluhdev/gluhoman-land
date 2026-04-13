# 01 — Design Lead Audit: Gluhoman Recreational Complex

**Auditor role:** Lead Art Director
**Date:** 2026-04-11
**Scope:** `/`, `/aquapark`, `/restaurant`, `/hotel`, `/sauna`, `/other-services/[slug]`
**Verdict (one line):** A busy, gradient-drunk 2019 SaaS template in a rural-hospitality costume — competent engineering, almost zero brand craft.

---

## 1. Overall Visual Identity

The site markets itself as "premium hospitality in the heart of nature," but visually it reads as a generic bootstrap/Tailwind landing: glass cards, floating blurs, emoji-in-rounded-squares, gradient headlines. Nothing on screen tells me this is a Ukrainian forest retreat in Poltava. The hero video is the only moment the brand breathes. Immediately after, the page drops into a stock "features grid" that could be a SaaS, a dentist, or a crypto startup.

There is no unifying brand mark treatment beyond a white text-shadow halo on the raster `logo.png` (`src/components/layout/Header.tsx:47`, `src/components/sections/VideoHero.tsx:67-69`) — the "outline everything in white so it survives the gradient" trick is a tell-tale of a template, not a designed identity. The name "Глухомань" literally means "the middle of nowhere / the deep woods" — a beautiful, evocative word that the design never honors. No hand-drawn marks, no wordmark discipline, no earthy/forest material, no photo-led hero cards, no silence.

**Emotional tone achieved:** corporate, generic, slightly childish (emoji-as-iconography).
**Emotional tone required:** quiet, crafted, earthy, confident, slow.

## 2. Typography

Single-font stack: **Manrope** (Google Sans) loaded in `src/app/layout.tsx:9-13`, applied as the only `--font-sans` (`src/app/globals.css:9`). `--font-mono` is declared as `var(--font-geist-mono)` but never actually loaded — dead variable.

Problems:
- **No pairing.** Premium hospitality sites almost always pair a display serif (Canela, GT Sectra, Tiempos, PP Editorial, Ogg) with a quiet neutral sans. A single Manrope weight stack across h1, h2, body, buttons, and badges makes everything feel flat and web-appy.
- **Weight abuse.** Almost every heading is `font-bold` (700/800). `src/app/page.tsx:34, 165, 299`, `src/app/aquapark/page.tsx:39, 72`, etc. Premium type rarely goes above 500 for display; it relies on *size and space*, not weight.
- **Hierarchy collapse.** H1s are `text-5xl lg:text-7xl`, H2s are also `text-5xl lg:text-6xl xl:text-7xl` (`src/app/page.tsx:165, 299`). When h1 and h2 are the same, there is no hierarchy.
- **No italic, no small-caps, no tracking discipline.** Every heading is default tracking. No eyebrow labels in uppercase tracked caps (a signature of hospitality type systems).
- **No tabular/display numerals** for the "15+/5000+/12+/24/7" stat block (`src/app/page.tsx:346-349`) — these should be in a display serif, not a gradient clip.

**Does it feel crafted?** No. It feels like the default Next.js + shadcn starter picked a cyrillic-ready Google font and moved on.

## 3. Color System

Defined in `src/app/globals.css:46-82`:

- `--primary`: `oklch(0.45 0.15 142)` — mid-saturation green
- `--secondary`: `oklch(0.35 0.12 142)` — darker green
- `--accent`: `oklch(0.55 0.15 220)` — **mid-saturation blue** (!)
- Background: `.bg-radial-gradient-green` uses `radial-gradient(125% 125% at 50% 10%, #fff 40%, #22c55e 100%)` (`src/app/globals.css:715-722`) — hard-coded Tailwind `green-500` (#22c55e), the "generic SaaS success-green."

Problems:
- **Green + blue is not a forest palette.** It's the Sprite/Grammarly palette. A nature retreat's palette should be *monochromatic and muddy*: moss, bark, linen, stone, ember, smoke. One accent. The blue-green duality here is a 2018 "tech gradient" trope (`from-primary to-accent` appears **71 times** across the five pages audited).
- **No neutrals.** There is no bone, linen, stone, or charcoal. Everything is either white, gradient, or muted-green. Premium sites live in the neutrals; color is a seasoning.
- **OKLCH values are mid-chroma.** At 0.15 chroma, both primary and accent are loud enough to fight with photography and never recede.
- **Hardcoded #22c55e fights the OKLCH token system** — the background doesn't even use the primary variable. Two color systems coexisting is a symptom of unfinished design work.
- **Gradient is fixed/attachment** (`background-attachment: fixed`) which causes jank on mobile Safari and makes every section sit on the same loud green wash. There is nowhere for the eye to rest.

## 4. Spacing, Rhythm, Proportions

- Section padding is `py-24` almost universally (`src/app/page.tsx:26`, `:153`, aquapark `:69`, hotel `:68`, restaurant `:70`, sauna `:70`). No rhythm — every section breathes the same.
- Headlines sit on `mb-6/mb-8`, subheads on `mb-16`. There is no true "editorial white space" — the kind where an h1 has 20vh of emptiness above it.
- Everything is inside `max-w-7xl` (`src/app/page.tsx:31, 157, 289`). Premium sites mix full-bleed, `max-w-4xl` reading columns, and asymmetric grids. Here, every section is the same 1280px column.
- Grids are flat 2/4-col card grids repeated on every page. No editorial asymmetry, no overlapping images, no offset type.
- `rounded-3xl` (24px) is stamped on every card, every button, every image, every pill (22 uses on `page.tsx`, 12 on aquapark, 17 on restaurant). Nothing is sharp, nothing is square. Everything is soft in exactly the same way.

## 5. Hero Sections

**Home (`src/components/sections/VideoHero.tsx`):** Full-bleed autoplay video is the single best thing on the site. Then it's ruined by:
- A `bg-black/40` flat overlay (`:62`) — not a gradient, not a vignette, just a gray sheet.
- The word "Глухомань" stroked in white via an 8-direction `textShadow` hack (`:67-69`). This is the webmaster-1999 outline trick. A designed wordmark would be a handled SVG, or — better — would rely on compositing contrast against a controlled gradient.
- The sub-headline "чекає на вас" set in the *same size* as the brand name breaks the lockup.
- Hero has no scroll-linked parallax, no image-to-type overlap, no cinematic letterboxing — all trivially premium moves that are missing.

**Service pages (`/aquapark:23`, `/hotel:22`, `/restaurant:23`, `/sauna:23`):** All four are literally the same template:
```
h-[80vh] + bg-cover image + bg-gradient-to-r from-primary/80 to-accent/60 + white/20 backdrop-blur pill + 7xl title + /90 subtitle + two rounded-full buttons
```
The `from-primary/80 to-accent/60` overlay **tints every hero image green-to-blue**, destroying whatever beauty the real photography might have. In `src/app/restaurant/page.tsx:28` the image is still an Unsplash stock URL (`photo-1414235077428`). A premium site would never ship stock heroes.

**Other-services hero** (`src/app/other-services/[slug]/page.tsx:52-60`) is a solid gradient with a polka-dot radial pattern. Dots on a gradient is a 2020 Webflow template.

## 6. Decorative Elements (the worst offenders)

### 6a. The `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent` epidemic
Used on *every single h1/h2 on every page*:
- `src/app/page.tsx:35, 166, 300, 359`
- `src/app/aquapark/page.tsx:73, 151` (and the page title word "пріоритет")
- `src/app/hotel/page.tsx:74`
- `src/app/restaurant/page.tsx:75`
- `src/app/sauna/page.tsx:75`
- `src/app/other-services/[slug]/page.tsx:104`

When everything is gradient-clipped, nothing is. It becomes the visual equivalent of shouting every word.

### 6b. Floating blur orbs
`blur-3xl` radial decorations appear in every hero and every section: `src/app/page.tsx:28-29, 62, 194, 285-287`. This is shadcn-landing-page tutorial syntax. Aman, Soho House, Six Senses never do this.

### 6c. `backdrop-blur-sm` glass cards
Every card is a `bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl`. `src/app/page.tsx:57, 185, 233, 353`, aquapark `:112`, sauna `:120`. This is iOS 14 glassmorphism — a trend that peaked in 2021.

### 6d. Gradient icon tiles with emoji
`src/app/page.tsx:198-208, 246-256` renders `w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl` squares with 💒 🛁 🎯 🐎 🎈 🔥 🐝 🍺 🦌 as iconography. **Emoji is not an icon system.** Ever. A premium site commissions a custom line-icon family or uses a consistent stroke-icon library with intent (Phosphor Duotone, Iconoir, Lucide at a disciplined stroke width).

Lucide icons *are* imported (`Waves, Droplets, Baby, Users` etc.) but they sit in the same gradient squares with the same `rounded-2xl` `group-hover:scale-110 rotate-3` treatment across all five pages — indistinguishable.

### 6e. Pill badges with Sparkles icon
`src/app/page.tsx:160-163` — `inline-flex ... bg-gradient-to-r from-accent/10 to-primary/10 text-accent rounded-full ... <Sparkles />`. This exact pattern is the default Vercel/Linear/shadcn template badge. It appears on every section header.

### 6f. `menu-3d` text-shadow stack in the header
`src/app/globals.css:744-764` outlines navigation text with a 4-direction black text-shadow to make it legible against the gradient nav bar. This is a sign the header contrast was never designed — it was patched.

### 6g. Halo-pulse / aurora / gentle-float animations
`globals.css:515-653` — 140 lines of auroraBg, haloPulse, logoFloat, gentleFloat, shimmer, gradientShift. Most of these are unused or used once. Dead CSS and a sign the project tried every trend.

**Are any of these modern?** No. They are all *2019-2021 SaaS template language*. A 2026 premium hospitality site uses: large editorial type, generous silence, real photography at full bleed, muted earth palettes, tasteful micro-interactions, and restraint.

## 7. Top 5 Changes That Would Most Elevate the Site

1. **Kill every gradient-clip headline and every `from-primary to-accent` gradient.** Replace with a single display serif (Canela / PP Editorial New / GT Sectra) at `font-weight: 400`, solid foreground color (a deep forest `oklch(0.22 0.04 150)`), with real tracking discipline. Delete `.bg-radial-gradient-green` and `.text-gradient-green-blue` from `globals.css:256-265, 715-722`. The single biggest "template → custom" win.

2. **Rebuild the palette around earth + silence.** Drop the blue accent entirely. New system: `bone #F4F1EA`, `linen #E8E2D5`, `moss #4A5D3A`, `bark #2B2118`, one ember accent `#B5532A` used sparingly. Photography carries the color; UI recedes. Rewrite `globals.css:46-82`.

3. **Lead with photography, not decoration.** Remove every `blur-3xl` orb, every glass card, every gradient overlay on hero images. The service heroes (`src/app/aquapark/page.tsx:23-67`, hotel, restaurant, sauna) should be full-bleed editorial photography with a subtle 0→40% bottom-gradient for legibility — nothing more. Commission or curate 15 hero-grade real photos (the `/public/images/*.jpg` set exists — use it, don't stock-Unsplash it as restaurant still does at `:28`).

4. **Typographic hierarchy with a real serif/sans pairing.** Display serif for h1/h2/stats, Manrope (or better: Söhne / Inter Tight / GT America) at 300–500 for body and UI. Introduce an uppercase-tracked eyebrow label (`text-xs tracking-[0.2em] uppercase text-bark/60`) to replace the Sparkles-icon pills. Establish an 8-step type scale with rhythm — h1 ≠ h2 ≠ h3 at a glance.

5. **Delete the emoji-in-gradient-square icon grid.** Replace `src/app/page.tsx:198-208, 246-256` with a single hand-drawn or custom line-icon family (or no icons — just numbered 01/02/03 editorial sections). Same for the `FloatingButtons`, `menu-3d` nav, and the polka-dot radial hero at `other-services/[slug]/page.tsx:55-60`. Every decorative shortcut must go.

**Bonus (6):** Break the `max-w-7xl` prison. Introduce full-bleed image sections, `max-w-[680px]` reading columns for prose, and asymmetric 7/12 + 4/12 editorial grids. Cinema-grade sites vary their container; template sites don't.

## 8. Reference Sites

1. **aman.com** — The gold standard for quiet hospitality. Notice: almost no color in UI, serif display, massive silent hero photography, zero gradient clipping, zero floating orbs. Letting the landscape *be* the design. This should be the north star.

2. **sixsenses.com** — Very close brand parallel (nature-led retreats). Great example of editorial typography, earthy palette, and how to handle a multi-service menu (spa/dining/activities) without card-grid generic-ness.

3. **heckfieldplace.com** — British countryside retreat. Best-in-class example of a *single-property* site that feels bespoke: type-led hero, muted olive/bone palette, slow scroll storytelling, tactile photo treatment. Exactly the scale Глухомань needs.

4. **blackberryfarm.com** — US rural-luxury retreat. Shows how to present dining + lodging + activities + events as one coherent brand story without reducing each to a card in a grid.

5. **monc.studio** or **goiko-studio.com** — For contemporary Ukrainian/European design discipline: how to pair a display serif with a quiet sans, how to use real color-theory neutrals, how to animate with restraint. Even if the sector is different, the typographic rigor is directly transferable.

**Honorable mention:** **reschio.com** (Umbrian estate) — proves that a site with *almost nothing on screen* can out-premium a site with everything on screen. The current Глухомань site is the opposite lesson.

---

## Closing Note

The engineering is fine. The content architecture is fine. The language is authentic Ukrainian. What's missing is **an art director's hand** — someone to say *no* to the fifth gradient, the second emoji icon, the third rounded-3xl card, the fourth `from-primary to-accent` clip. Premium design is 80% subtraction. This site needs aggressive subtraction before any new additions.
