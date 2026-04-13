# Header Menu — Code & Accessibility Audit

**Scope:** Top header / main navigation of the Глухомань site.
**Mode:** Read-only analysis. No code changes.
**Date:** 2026-04-11

## Files reviewed
- `src/components/layout/Header.tsx` (243 lines, the entire header)
- `src/components/ui/navigation-menu.tsx` (shadcn wrapper around Radix `@radix-ui/react-navigation-menu` v1.2.14)
- `src/constants/index.ts` — `NAVIGATION` constant (lines 104–118)
- `src/app/layout.tsx` — only line 1 inspected (prior observation: design system uses Manrope + oklch greens, heavy animation library in `globals.css`)
- `src/app/globals.css` — only line 1 inspected (`@import "tailwindcss";`); custom classes like `glass-menu`, `glass-menu-strong`, `menu-3d`, `animate-mobile-menu`, `animate-mobile-menu-item`, `menu-item-hover` are defined further down (not re-read to save tokens; they are used by Header but their internals do not change the audit conclusions)
- `package.json` — confirms Next 15.5.2, React 19.1.0, Radix nav-menu 1.2.14, Tailwind v4, lucide-react

---

## 1. Current architecture map

### How Header is mounted
Header is a **client component** (`'use client'`). It is presumably imported and rendered inside `src/app/layout.tsx` (only line 1 was re-read here; the project structure and prior observations confirm a single global Header). It is `position: fixed` at `top-0 z-50` and pads the body with a `<div className="h-24" />` spacer at the bottom of its JSX so content does not slide under it.

### How it consumes `NAVIGATION`
`NAVIGATION` (from `src/constants/index.ts`) is a flat array of `{ name, href }` plus one entry `{ name: 'Інші послуги', href: '#', children: [...] }` whose children are derived from `ADDITIONAL_SERVICES`. Header `.map`s over it twice — once for desktop, once for the mobile overlay — branching on `item.children`.

### Dropdown wiring
**The shadcn `navigation-menu.tsx` / Radix primitive is NOT used by Header.** It exists in the repo but Header rolls its own dropdown:

- Trigger: a plain `<button>` with no `aria-haspopup`, no `aria-expanded`, no `aria-controls`.
- Panel: a sibling `<div>` shown/hidden purely by Tailwind `group-hover:` + `group-focus:`-style classes (`opacity-0 invisible group-hover:opacity-100 group-hover:visible`). Notably it uses **only `group-hover`**, not `group-focus-within`, so keyboard users cannot open it.
- Z-index is forced with inline `style={{ zIndex: 9999 }}`.
- No state, no Radix, no focus management, no Escape handler, no outside-click handler (none needed since hover-only).

### Mobile menu
Driven by local `useState` (`isMobileMenuOpen`). Toggled by a hamburger `<Button>`. Renders a fixed full-screen overlay with a black 80% backdrop and a 72-wide left panel. Backdrop click closes; child link click closes; **Escape key does NOT close**, **focus is NOT trapped**, and **body scroll is NOT locked** (page behind the overlay still scrolls).

### Scroll behavior
A `useEffect` listens to `window.scroll` and flips `isScrolled` at `>20px`, swapping `glass-menu` for `glass-menu-strong`. Listener is added without `{ passive: true }`.

### SSR / hydration
Header is `'use client'`, so it ships JS and renders on the client after hydration. Initial paint uses `isScrolled = false` and `isMobileMenuOpen = false`, which matches SSR output, so there is **no hydration mismatch risk**. The `useEffect` only runs after mount, which is fine.

### Phone CTA
Both desktop and mobile phone buttons use `onClick={() => window.location.href = 'tel:...'}` instead of an `<a href="tel:...">`. This works but is not semantically a link, breaks middle-click / open-in-new-tab, and is invisible to screen readers as a phone number link.

---

## 2. Preservation contract — what the redesign MUST NOT break

The redesign of the menu must keep all of the following observable behaviors:

1. **Logo → home.** Clicking `/images/logo.png` navigates to `/` via Next `<Link>`.
2. **Logo white outline.** The 4-direction `drop-shadow` filter producing a white sticker outline on the logo.
3. **Fixed header + spacer.** Header is fixed `top-0` `z-50`, height `h-24` (96px), and a 96px spacer pushes content down.
4. **Glass effect swap on scroll.** `glass-menu` below 20px scrollY, `glass-menu-strong` above.
5. **Container constraints.** `max-w-7xl mx-auto`, responsive horizontal padding `px-4 sm:px-6 lg:px-8`.
6. **Desktop nav visible at `md:` and up.** Hidden below.
7. **Gradient pill behind desktop nav.** `bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg` sits behind all nav items.
8. **Six top-level items in order:** Головна, Аквапарк, Ресторан, Готель, Лазня, Інші послуги.
9. **"Інші послуги" dropdown** lists all 8 `ADDITIONAL_SERVICES` and each child links to `/other-services/<id>`.
10. **Dropdown opens on hover** (current behavior — note: keyboard does not work today; redesign must add keyboard support without removing hover).
11. **Chevron rotates 180°** when the dropdown opens.
12. **Desktop phone CTA** visible at `lg:` and up, shows `CONTACT_INFO.phone[0]` (`+38 053 264 8548`), tap dials it.
13. **Mobile phone icon button** visible below `md:`, taps to dial `phone[0]`.
14. **Mobile hamburger** visible below `md:`, toggles overlay.
15. **Mobile overlay** — dark backdrop, 72-wide left drawer, closes on backdrop click and on link click, animates in via `animate-mobile-menu` / `animate-mobile-menu-item`.
16. **Mobile dropdown items** for "Інші послуги" render as a non-link header followed by an indented list of children.
17. **Mobile contact block** at the bottom of the drawer shows the first two phone numbers as `tel:` links under the heading "Зв'яжіться з нами".
18. **No console errors / no hydration warnings.** Current build is clean on this front; do not regress.
19. **Constants-driven content.** `NAVIGATION` and `CONTACT_INFO` remain the single source of truth.
20. **Ukrainian-only labels.** All visible strings and any new aria-labels must be Ukrainian.

---

## 3. Accessibility audit

### Semantic HTML
- Desktop `<nav>` has **no `aria-label`**. With two `<nav>` elements on the page (desktop + mobile drawer also uses `<nav>`), this is a WCAG 1.3.1 / 4.1.2 problem; SR users hear "navigation, navigation" with no way to distinguish.
- Mobile drawer container is a `<div>`, not a `<dialog>` or `role="dialog"` with `aria-modal="true"` and `aria-labelledby`.
- The hamburger `<Button>` has **no `aria-label`** and **no `aria-expanded`** / `aria-controls`. Its only content is a lucide icon — to a screen reader the button is unlabeled.
- The mobile phone icon `<Button>` is also icon-only with no `aria-label` ("Зателефонувати").
- "Інші послуги" trigger is a `<button>` with text but is missing `aria-haspopup="menu"` (or `"true"`), `aria-expanded`, and `aria-controls` pointing at the panel id.
- The dropdown panel has no `role="menu"` and its children no `role="menuitem"`. (Acceptable if treated as a navigation disclosure rather than a menu, but then it still needs `aria-expanded` on the trigger and an `id`-linked panel.)
- The desktop and mobile nav both use `<div>` wrappers around items rather than `<ul><li>`. Lists communicate item count to AT users; divs do not.

### Keyboard
- **Dropdown is unreachable by keyboard.** The reveal is `group-hover:opacity-100 group-hover:visible` only. There is no `group-focus-within:` variant, no `onFocus`/`onBlur` state, no Radix. Tabbing to the "Інші послуги" button does nothing; tab continues to the next top-level item, completely skipping the 8 child links. This is a **WCAG 2.1.1 (Keyboard) failure**.
- No Escape handler anywhere — neither for the dropdown nor the mobile drawer.
- No Arrow-key traversal inside the dropdown.
- No focus trap in the mobile overlay; Tab leaks behind the backdrop into the now-hidden page content.
- No focus return: opening then closing the mobile menu does not restore focus to the hamburger.

### Focus visibility
- No explicit `:focus-visible` styles anywhere in Header. The shadcn `Button` provides a default ring, but the bare `<button>` for the dropdown trigger and the bare `<Link>`s in the desktop nav rely on the browser default outline, which on a green gradient background may be invisible. Custom `menu-3d` class (in `globals.css`, not re-read) likely does not include a focus ring.

### Color contrast (estimated; computed values not measured here)
- Desktop nav text is white-on-`from-primary to-accent` green gradient. Project palette is oklch green (per prior observation). With white foreground on a mid-saturation green this is **borderline** — typically 3.5–4.2:1, which fails WCAG AA (4.5:1) for normal text at the lighter end of the gradient.
- Dropdown panel text is `text-gray-700` on white — passes AA comfortably.
- Mobile drawer text is `text-white/80` on `bg-black/40` over a `bg-black/80` backdrop — effectively white on near-black, passes.
- The "white sticker" logo outline relies on filter drop-shadows; readable.

### Skip link
- **No "skip to main content" link** anywhere. WCAG 2.4.1 failure.

### Other
- The phone CTA is a `<button>` that does `window.location.href = 'tel:'` instead of `<a href="tel:">`. SR users do not hear it as a phone number link, and it cannot be opened in a new tab or copied.
- Dropdown links use `style={{ animationDelay }}` referencing an animation that the `block rounded-xl ...` class set does not actually declare (`animate-*` is missing on the desktop child links — only mobile uses `animate-mobile-menu-item`). Cosmetic dead code, not an a11y bug, but worth noting.
- No `prefers-reduced-motion` handling anywhere; `transition-all duration-300/500` and the mobile slide animation will run for users who opted out.
- No `lang` attribute audit done at the Header level (handled in `<html lang>` in `layout.tsx` — only line 1 was re-read, not verified here; flag as TODO for redesign).

---

## 4. Code smells / risks

1. **Dead shadcn dependency.** `src/components/ui/navigation-menu.tsx` and `@radix-ui/react-navigation-menu` are installed and imported nowhere. Header reimplements everything by hand. The accessible primitive is sitting unused on disk.
2. **Hover-only disclosure.** Pure CSS `group-hover` reveal; no JS state for the dropdown. Touch devices get a "tap to open, tap link to navigate" double-tap quirk on iOS Safari, and keyboard users get nothing.
3. **Two parallel renderers.** Desktop and mobile each `.map(NAVIGATION)` independently with different markup, classes, and animation logic. Any change to navigation shape (e.g. nested children, badges, icons) must be made twice.
4. **`index` captured but never used as React `key`** — keys are `item.name`, which is fine, but `index` is destructured in both maps and only used for `animationDelay`. Not a bug, just noise.
5. **Inline z-index `9999`** on the dropdown is a code smell that suggests a stacking-context fight elsewhere; redesign should resolve via tokens, not magic numbers.
6. **Inline filter style on the logo** with four drop-shadows is duplicated logic that belongs in a CSS utility or a wrapper component.
7. **`window.location.href` for phone dial** instead of `<a href="tel:">` — semantics + SR + middle-click loss.
8. **Scroll listener is not passive** — `addEventListener('scroll', handleScroll)` should pass `{ passive: true }`. Minor perf smell on mobile.
9. **No throttle/raf on scroll handler** — fires on every scroll event to `setState`. React 19 batches well, but still unnecessary churn.
10. **Hardcoded breakpoints in two places.** "Show desktop nav at `md`" and "show phone CTA at `lg`" are spread across class strings; if the menu grows it will overflow at `md` widths because the gradient pill has no min-width safety.
11. **`href: '#'` for the dropdown parent** in `NAVIGATION` is a sentinel that the renderer must remember to ignore. If a future dev forgets the `item.children` branch they will render a real `<a href="#">`, which is a known a11y anti-pattern.
12. **Tight coupling Header ↔ `NAVIGATION` shape.** The renderer assumes one level of nesting and exactly the keys `name`, `href`, `children`. There are no TypeScript types for `NAVIGATION` (it is implicit). Adding a third level would silently break.
13. **No tests.** Playwright is in `devDependencies` but no header test exists (not searched exhaustively, but no test imports of Header surfaced). The redesign will have no safety net.
14. **`Image` `alt` is "Глухомань логотип"** — fine, but the redesign should consider whether the logo link itself needs an `aria-label` like "Глухомань — на головну" since the alt repeats "logo".

---

## 5. Refactor safety notes — blast radius

If Header is replaced wholesale:

- **Single import site (very likely just `src/app/layout.tsx`).** Confirm before deleting; the file was only sampled at line 1 in this audit. A grep for `from '@/components/layout/Header'` will give the full list.
- **No props.** Header takes none, so swapping the implementation is purely an internal change.
- **Constants are stable.** `NAVIGATION` and `CONTACT_INFO` already centralize content; the new component should consume the same shape (or a typed superset).
- **Spacer.** The `<div className="h-24" />` spacer lives inside Header. If the new header changes height, update the spacer in lockstep or every page below the fold will jump. Better: move the spacer responsibility into `layout.tsx` or use CSS `padding-top` on `<main>`.
- **Global CSS classes.** `glass-menu`, `glass-menu-strong`, `menu-3d`, `animate-mobile-menu`, `animate-mobile-menu-item`, `menu-item-hover` are defined in `globals.css`. If the redesign abandons them, they become dead CSS — safe to delete only after grepping for other consumers.
- **Z-index.** The `z-50` on the header and `9999` on the dropdown interact with `z-40` on the mobile overlay and any modals/toasts elsewhere. Audit before changing.
- **shadcn navigation-menu.** Either start using it (recommended — gives keyboard, ARIA, focus mgmt for free) or delete `src/components/ui/navigation-menu.tsx` plus the `@radix-ui/react-navigation-menu` dependency from `package.json`.
- **Phone CTA semantics.** Switching from `<button onClick=tel:>` to `<a href="tel:">` is a behavior change for analytics/click-tracking if any exists. None observed, but verify before flipping.
- **Mobile menu state.** Currently lives in Header. If the redesign splits Header and MobileDrawer into separate components, hoist state to a small context or keep it co-located — but do not let two components own it.

---

## 6. Preservation checklist (acceptance test for redesign)

Use this as a pass/fail gate for the redesigned header. Each item must be verified manually or via Playwright before merging.

### Functional
- [ ] Clicking the logo navigates to `/`.
- [ ] Header is fixed to top, full width, `z-index` at least 50, never overlapped by page content.
- [ ] Total header height stays ~96px (or page spacer is updated to match).
- [ ] Background visually changes when `window.scrollY > 20`.
- [ ] All 6 top-level nav items render in correct order with correct labels.
- [ ] All 8 "Інші послуги" children render and link to the correct `/other-services/...` URLs.
- [ ] Desktop nav appears at `md` (≥768px) and disappears below.
- [ ] Desktop phone button appears at `lg` (≥1024px) with `CONTACT_INFO.phone[0]`, tapping dials it.
- [ ] Mobile phone icon and hamburger appear below `md`.
- [ ] Hamburger opens a left drawer overlay with backdrop.
- [ ] Backdrop click closes the drawer.
- [ ] Tapping any link in the drawer closes the drawer and navigates.
- [ ] Drawer shows the first two phone numbers as `tel:` links under "Зв'яжіться з нами".
- [ ] No hydration warnings in the console on any page.
- [ ] All labels are in Ukrainian; no English leaked in.
- [ ] `NAVIGATION` and `CONTACT_INFO` remain the only sources of nav/contact data — no hardcoded duplication.

### Accessibility (must improve, not regress)
- [ ] Each `<nav>` has a unique `aria-label` (e.g. `aria-label="Головне меню"` and `aria-label="Мобільне меню"`).
- [ ] "Інші послуги" trigger has `aria-haspopup`, `aria-expanded` (toggling), `aria-controls`.
- [ ] Dropdown is **fully usable by keyboard**: Tab focuses the trigger, Enter/Space/Arrow-Down opens it, Tab/Arrow-Down moves through children, Escape closes and returns focus to the trigger.
- [ ] Dropdown also still opens on hover for mouse users.
- [ ] Mobile drawer is `role="dialog" aria-modal="true"` with `aria-labelledby`.
- [ ] Mobile drawer traps focus while open and restores focus to the hamburger on close.
- [ ] Escape key closes the mobile drawer.
- [ ] Body scroll is locked while the mobile drawer is open.
- [ ] Hamburger button has `aria-label="Відкрити меню"` / `"Закрити меню"` and `aria-expanded`.
- [ ] Mobile phone icon button has `aria-label="Зателефонувати"`.
- [ ] All interactive elements have a visible `:focus-visible` ring that meets 3:1 contrast against the header background.
- [ ] Nav text on the green gradient measures ≥4.5:1 contrast (verify with a checker against the lightest stop of the gradient).
- [ ] A "skip to main content" link is present as the first focusable element of the page.
- [ ] Phone CTA is an `<a href="tel:...">`, not a `<button onClick>`.
- [ ] Animations respect `prefers-reduced-motion: reduce`.
- [ ] Nav items render inside a `<ul><li>` structure.

### Code quality
- [ ] Single render path for nav data (one component handles desktop and mobile, or two components share a typed prop).
- [ ] `NAVIGATION` has an explicit TypeScript type (`NavItem[]`) and supports the `children` branch via discriminated union.
- [ ] No magic z-index values; uses theme tokens.
- [ ] No `href: '#'` sentinels — dropdown parents are typed differently from leaves.
- [ ] Either uses the existing shadcn `NavigationMenu` primitives, or removes them and the Radix dependency.
- [ ] Scroll listener is `{ passive: true }` and ideally rAF-throttled.
- [ ] At least one Playwright smoke test covers: logo click, dropdown open by keyboard, mobile drawer open/close, phone link href.

---

## Top findings (executive summary)

**Top 3 a11y issues**
1. **Dropdown is keyboard-inaccessible.** `group-hover`-only reveal with no focus state, no Radix, no ARIA. 8 child links are unreachable without a mouse. WCAG 2.1.1 fail.
2. **Icon-only buttons (hamburger, mobile phone) have no `aria-label`** and the hamburger has no `aria-expanded` / `aria-controls`. Mobile drawer is a `<div>`, not a `role="dialog" aria-modal`, with no focus trap, no Escape, no scroll lock, no focus return.
3. **No skip link, no `aria-label` on either `<nav>`, no visible `:focus-visible` styles**, and white-on-green-gradient nav text is borderline for 4.5:1 contrast.

**#1 refactor risk**
The accessible Radix/shadcn `NavigationMenu` primitive is installed but **completely unused** — Header hand-rolls a hover-only dropdown with two parallel desktop/mobile renderers and a `<div className="h-24" />` spacer baked into Header itself. Replacing the component is mechanically easy (no props, single mount site), but the redesign must (a) re-own that spacer height contract or every page jumps, and (b) decide whether to adopt the existing Radix primitive or delete it from `package.json` — leaving both implementations around is how this state happened in the first place.
