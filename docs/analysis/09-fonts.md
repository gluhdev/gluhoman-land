# 09 — Live Font Preview

A floating "Fonts" button (bottom-left) opens a side panel with 20 hospitality-grade
font pairings. Clicking a card applies the pairing site-wide instantly by mutating
`--font-heading` and `--font-body` on `:root` and persists the choice to
`localStorage`. All fonts are loaded from Google Fonts on demand with the
`cyrillic,latin` subset and `display=swap`.

## The 20 pairings

| # | Label | Heading | Body | Mood | Cyrillic |
|---|---|---|---|---|---|
| 1 | Aman — Cormorant + Inter | Cormorant Garamond | Inter | Quiet luxury, hushed serif elegance | yes |
| 2 | Noma — Playfair Display + Source Sans 3 | Playfair Display | Source Sans 3 | High-contrast editorial | yes |
| 3 | Soho House — Fraunces + Manrope | Fraunces | Manrope | Modern members-club warmth | yes |
| 4 | Atlas — DM Serif Display + DM Sans | DM Serif Display | DM Sans | Boutique-hotel boldness | yes |
| 5 | Puglia Paradise — Marcellus + Jost | Marcellus | Jost | Sun-bleached Mediterranean calm | yes |
| 6 | Garden — EB Garamond + Work Sans | EB Garamond | Work Sans | Botanical, library-quiet | yes |
| 7 | Lakeside — Lora + Nunito Sans | Lora | Nunito Sans | Soft, friendly retreat | yes |
| 8 | Manor — Cardo + IBM Plex Sans | Cardo | IBM Plex Sans | Old-world manor with technical clarity | yes |
| 9 | Riviera — Italiana + Public Sans | Italiana | Public Sans | Couture thin serif, civic-clean body | yes |
| 10 | Salon — Tenor Sans + Rubik | Tenor Sans | Rubik | Refined gallery aesthetic | yes |
| 11 | Modern Serif — Fraunces + Inter | Fraunces | Inter | Contemporary editorial | yes |
| 12 | Soirée — Playfair Display + Manrope | Playfair Display | Manrope | Evening elegance | yes |
| 13 | Provence — Cormorant Garamond + Jost | Cormorant Garamond | Jost | French country | yes |
| 14 | Library — EB Garamond + Inter | EB Garamond | Inter | Bookish and authoritative | yes |
| 15 | Atelier — Lora + IBM Plex Sans | Lora | IBM Plex Sans | Crafted workshop | yes |
| 16 | Veranda — Marcellus + Rubik | Marcellus | Rubik | Warm classic | yes |
| 17 | Gazette — DM Serif Display + Public Sans | DM Serif Display | Public Sans | Bold headline newspaper feel | yes |
| 18 | Couture — Italiana + Manrope | Italiana | Manrope | Tall thin glamour | yes |
| 19 | Chapel — Cardo + Work Sans | Cardo | Work Sans | Stone and timber serenity | yes |
| 20 | Pavillon — Tenor Sans + Nunito Sans | Tenor Sans | Nunito Sans | Soft modernist pavilion | yes |

All fonts above ship a Cyrillic subset on Google Fonts and render Ukrainian text correctly.

## How to use the switcher

1. Open the site (any page).
2. Click the floating "🎨 Fonts" button in the bottom-left corner.
3. Click any pairing card to apply it instantly site-wide.
4. The choice persists to `localStorage` (`gluhoman:font-pairing`) and reapplies on reload.
5. Click "Reset to default (Manrope)" to revert to the original look.

## How to remove before production

1. Delete `src/components/ui/FontSwitcher.tsx`.
2. Delete `src/constants/fontPairings.ts`.
3. In `src/app/layout.tsx`, remove the `import FontSwitcher` line and the `<FontSwitcher />` mount.
4. (Optional) In `src/app/globals.css`, remove the `--font-heading` / `--font-body` variables and the `h1..h6 { font-family: var(--font-heading) }` rule, plus `font-family: var(--font-body)` from the `body` rule.
