# 05 — Header / Menu Visual Analysis

**Scope:** Top header only. Goal: take it from "free Tailwind template" to a $10k boutique hospitality feel (Aman, Soho House, Borgo Egnazia tier).

**Files reviewed**
- `src/components/layout/Header.tsx`
- `src/components/ui/navigation-menu.tsx` (shadcn primitive — currently NOT used by Header.tsx, dead-ish)
- `src/app/globals.css` (lines 372–384 `.glass-menu`, 744–764 `.menu-3d`)
- `public/images/logo.png`

---

## 1. Current state (the JSX that ships)

```tsx
<header className={`fixed top-0 z-50 w-full transition-all duration-500
  ${isScrolled ? 'glass-menu-strong' : 'glass-menu'}`}>
  <div className="container max-w-7xl mx-auto flex h-24 items-center
                  justify-between px-4 sm:px-6 lg:px-8 w-full max-w-full">

    {/* Logo — PNG with 4-direction white drop-shadow stroke */}
    <Link href="/" className="flex items-center">
      <Image src="/images/logo.png" width={200} height={60}
        className="h-12 sm:h-14 md:h-16 w-auto object-contain max-w-[200px]"
        style={{ filter:
          'drop-shadow(2px 2px 0px white) drop-shadow(-2px -2px 0px white)
           drop-shadow(2px -2px 0px white) drop-shadow(-2px 2px 0px white)',
          marginTop:'10px', marginBottom:'10px' }} />
    </Link>

    {/* Desktop nav — items live INSIDE a green gradient pill */}
    <nav className="hidden md:flex items-center space-x-2 relative z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary
                      to-accent rounded-xl shadow-lg -z-10"></div>
      <div className="flex items-center space-x-2 px-2 py-1 relative">
        {/* trigger */}
        <button className="flex items-center space-x-1 px-4 py-2 rounded-xl
                           menu-3d hover:bg-white/10 transition-all duration-300">
          <span>{item.name}</span>
          <ChevronDown className="h-4 w-4 ..." />
        </button>
        {/* dropdown */}
        <div className="bg-white backdrop-blur-xl border border-gray/20
                        rounded-2xl p-2 shadow-2xl ring-1 ring-black/5">
          <Link className="block rounded-xl px-4 py-3 text-sm font-medium
                           text-gray-700 hover:bg-green-50 ...">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent
                            rounded-full"></div>
            <span>{child.name}</span>
          </Link>
        </div>
      </div>
    </nav>

    {/* CTA — gradient pill button */}
    <Button className="bg-gradient-to-r from-primary to-accent
                       hover:from-primary/90 hover:to-accent/90 text-white
                       rounded-xl px-6 shadow-lg ...">
      <Phone className="h-4 w-4 mr-2" />
      {CONTACT_INFO.phone[0]}
    </Button>
  </div>
</header>
```

**Supporting CSS (globals.css):**

```css
.glass-menu          { background: rgba(255,255,255,0.1);
                       backdrop-filter: blur(20px) saturate(180%);
                       border: 1px solid rgba(255,255,255,0.2);
                       box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
.glass-menu-strong   { background: rgba(255,255,255,0.2);
                       backdrop-filter: blur(30px) saturate(200%); ... }

.menu-3d {
  font-size: 0.875rem;        /* 14px */
  font-weight: 700;            /* heavy */
  color: #fff;
  text-shadow: 1px 1px 0 #000c, -1px -1px 0 #000c,
                1px -1px 0 #000c, -1px 1px 0 #000c;   /* 4-way black stroke */
}
.menu-3d:hover { transform: translateY(-1px); ... }
```

Font family: **Manrope** (sans-serif, geometric humanist).

---

## 2. What's wrong (ranked)

### A. Logo treatment — cramped + amateur stroke effect (CRITICAL)
- The PNG logo gets a **4-direction white `drop-shadow` "sticker outline"** because the underlying mark wasn't designed to sit on a translucent header. This is the single biggest "homemade" tell on the page. Boutique hotels never outline their logos — they commission a vector that works on any background and switch its color (dark on light, white on dark).
- Manual `marginTop/marginBottom: 10px` inline styles indicate the logo isn't aligned with the optical baseline of the nav row.
- A `.svg` exists at `/public/images/logo.svg` but the header still pulls the `.png`. Wrong asset.
- 200px wide × 96px tall row = decent footprint, but the white sticker-stroke makes it feel like clip-art rather than owning the corner.

### B. Nav lives inside a green gradient pill (CRITICAL)
- Wrapping the nav items in `bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg` makes the menu look like a **toy button bar** glued to the header. No premium hospitality site does this. Aman/Soho House/Borgo all let nav items breathe directly on the (transparent or solid) header surface.
- It also fights the `.glass-menu` blur behind it — you've got two competing surfaces in 90px of vertical space.

### C. Typography is wrong for the segment (CRITICAL)
- `.menu-3d` uses **700 weight, 14px, sentence case Cyrillic, with a 4-way black text-shadow stroke**. This is the Fortnite HUD treatment, not boutique hotel.
- Boutique standard for nav: **11–13px, weight 400–500, uppercase, letter-spacing 0.15–0.22em**, OR an elegant serif (Canela, GT Sectra, Tiempos) at 15–17px in sentence case.
- The text-shadow stroke exists because the white text is illegible over the video hero. The right fix isn't a stroke — it's a darkening scrim or a properly designed transparent-to-solid scroll state.

### D. Dropdown is generic shadcn-with-bullets
- Plain white card, `rounded-2xl`, `shadow-2xl`, `ring-1 ring-black/5`, with **green-gradient bullet dots** next to each link. The bullets are kitsch. Real boutique dropdowns either (a) use a full-width "mega" panel with imagery + meta copy, or (b) a tight column with hairline dividers, no bullets, with a small caption above ("Розваги / Experiences").

### E. CTA button is the same gradient as the nav pill
- Phone button uses `bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg` — visually identical to the nav background, so it doesn't read as a CTA at all. It's just "more green pill." Premium CTAs are usually outlined (ghost) or solid in a single contrasting tone (ink/charcoal/cream).

### F. Spacing & rhythm
- `h-24` (96px) is tall, which is fine, but the gradient pill is vertically centered in a way that wastes the height.
- `space-x-2` (8px) between nav items is too tight for an uppercase tracked treatment, and too loose for a button-bar treatment — it sits in no-man's-land.
- Container is `max-w-7xl` with `px-4 sm:px-6 lg:px-8`. Boutique sites typically push to `max-w-[1440px]` or full-bleed with `px-8 lg:px-12`, so the logo "owns" the corner instead of being inset.

### G. Hover/focus animations
- `hover:bg-white/10` + `translateY(-1px)` + `group-hover:rotate-180` chevron. The translate-Y on a nav link is a **dead giveaway of a template**. Premium hover is either: underline grow (`scaleX(0)→scaleX(1)` from-left, 300ms ease-out), or a slow color fade from 70% → 100% opacity. Never bouncy.

### H. Decorative cruft
- Gradient bullet dots in dropdown items (and again in mobile menu).
- 4-way text-shadow strokes on every menu item, the mobile button, the mobile X icon.
- `shadow-2xl`, `shadow-lg`, `ring-1 ring-black/5`, `backdrop-blur-xl` — every shadow turned to 11.
- The shadcn `navigation-menu.tsx` primitive is imported nowhere; Header rolls its own. Dead code.

---

## 3. Visual direction proposals

### Direction A — "Editorial Boutique" (recommended)
Inspired by Aman, Borgo Egnazia, Le Sirenuse. **Serif wordmark, hairline nav, ink-on-cream.**

- **Header surface:** transparent on hero, solid `bg-[#FBFAF6]/95` (warm white) with a **1px hairline bottom border** `border-b border-black/8` after 60px of scroll. No blur, no shadow. Crossfade `transition-colors duration-700`.
- **Logo:** SVG only. On hero use `text-white` / white SVG. On scrolled state, swap to dark version. **Drop the 4-way drop-shadow entirely.** Add a 1px scrim gradient over the top 120px of the hero (`bg-gradient-to-b from-black/30 to-transparent`) so the white logo + nav are legible without strokes. Logo height `h-9 lg:h-11`. Container `max-w-[1440px] px-8 lg:px-12`.
- **Nav typography:** add a serif (Cormorant Garamond, or paid: GT Sectra / Canela) for the *wordmark only*. Nav items stay in Manrope but become:
  `text-[11px] uppercase tracking-[0.22em] font-medium text-white/90` (hero state) → `text-neutral-800` (solid state).
- **Nav layout:** items sit directly on the header, `gap-10` (40px) between them. **Kill the gradient pill.**
- **Hover:** underline grow from left.
  `relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100`
- **Dropdown:** wide panel `w-[420px]`, `bg-[#FBFAF6] border border-black/8 rounded-none shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]`. Tiny eyebrow caption at top: `text-[10px] uppercase tracking-[0.25em] text-neutral-500`. Items: `py-3 border-b border-black/5 last:border-0`, **no bullets**, with a small chevron arrow that translates 4px right on hover.
- **CTA:** ghost button — `border border-current px-6 py-2.5 text-[11px] uppercase tracking-[0.2em]` on the right. Phone number and "Забронювати" stacked or comma-separated. On scrolled state it inverts to dark border.
- **Height:** `h-20` on hero, shrinks to `h-16` on scroll for the editorial feel.

### Direction B — "Forest Lodge" (more on-brand for "Глухомань")
Inspired by Lefay Dolomiti, Sextantio, Six Senses. **Dark green chrome + tan accent, mid-weight sans, wide tracking.**

- **Header surface:** `bg-[#0E1F17]/95` (deep forest, almost black) at all times — committed, not transparent. `backdrop-blur-md` allowed. 1px bottom border `border-b border-[#C9A876]/15` (warm tan hairline).
- **Logo:** SVG version, force `fill-[#F2EBD9]` (parchment cream). No stroke, no shadow. `h-10`.
- **Nav typography:** Manrope `text-[12px] uppercase tracking-[0.18em] font-semibold text-[#F2EBD9]/85`. `gap-8`.
- **Hover:** color shift to `#C9A876` (tan) with a 250ms `ease-out`, plus a 1px tan dot appearing centered below the item: `after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-2 after:size-1 after:rounded-full after:bg-[#C9A876] after:opacity-0 hover:after:opacity-100 after:transition`.
- **Dropdown:** same forest panel, `bg-[#162A20]` with tan hairline dividers, links in cream → tan on hover. Tiny tan number prefix `01 / 02 / 03` next to each item (Six Senses / Aesop trick). No bullets, no rounded-2xl.
- **CTA:** Solid tan pill — `bg-[#C9A876] text-[#0E1F17] rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold`. Phone icon allowed but in a thinner stroke (lucide `Phone` with `strokeWidth={1.25}`).
- **Container:** `max-w-[1440px] px-10`, `h-[72px]`. Tighter, more confident.

### Direction C — "Minimal Swiss" (safest fallback)
Inspired by Plaza Athénée, Hôtel Costes, Standard Hotels.

- All-white header always (`bg-white/90 backdrop-blur` over hero, fully white on scroll). Logo always dark. Nav `text-[12px] uppercase tracking-[0.16em] font-medium text-neutral-700`. CTA is a black pill `bg-black text-white rounded-full px-5 h-9`. No gradients anywhere. Borrow nothing from current design.

---

## 4. Reference sites (specific things to steal)

1. **Aman — https://www.aman.com**
   *Steal:* the way the wordmark sits as a centered 11px tracked uppercase logo, with quiet flanking nav, transparent over hero, fading to white on scroll without a heavy shadow.

2. **Borgo Egnazia — https://www.borgoegnazia.com**
   *Steal:* the warm-white (`#F8F4EC`) header surface on scroll, hairline bottom border, serif wordmark + sans nav combo, and the "ghost outline" CTA button on the right.

3. **Lefay Resorts — https://dolomiti.lefayresorts.com**
   *Steal:* the dark forest-green chrome with cream type — directly applicable to a brand called "Глухомань" (literally "the wilds"). Also the way they handle the sub-menu as a quiet panel with hairline dividers and a small image thumbnail on the left.

4. **Le Sirenuse Positano — https://www.sirenuse.it**
   *Steal:* the editorial dropdown with a section caption ("ROOMS & SUITES") in tiny tracked caps above the link list, and the way they use horizontal-rule dividers between submenu groups.

5. **Six Senses — https://www.sixsenses.com**
   *Steal:* numbered list prefixes (`01 / 02 / 03`) inside dropdowns; the slow underline-grow on hover; the right-side CTA that's a thin outline button rather than a filled gradient.

6. **Soho House — https://www.sohohouse.com** (bonus)
   *Steal:* extreme letter-spacing (≈0.25em) on uppercase nav, narrow `h-14` header, single-color treatment (no gradients).

---

## 5. Quick-win checklist (if doing only 6 things)

1. Delete the gradient pill wrapper `<div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg -z-10" />`.
2. Swap `logo.png` → `logo.svg`, delete the 4-direction `drop-shadow(... white)` filter, delete the inline `marginTop/marginBottom`.
3. Replace `.menu-3d` with `text-[11px] uppercase tracking-[0.22em] font-medium` and use a `before:`/`after:` scrim on the hero instead of a text stroke.
4. Replace dropdown bullet dots with hairline dividers; change `rounded-2xl shadow-2xl` → `rounded-none border border-black/8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]`.
5. Convert phone button from gradient pill to ghost outline: `border border-current bg-transparent text-current rounded-none px-6 h-10 text-[11px] uppercase tracking-[0.2em]`.
6. Add a true scroll-state crossfade on the header: hero = transparent + white text + bottom-scrim on the page; scrolled = `bg-[#FBFAF6]/95 border-b border-black/8` + ink text. Drop both `.glass-menu` variants — the saturated blur reads "iOS widget," not "hotel."
