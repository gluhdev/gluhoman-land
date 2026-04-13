# Header / Menu UX Analysis — Глухомань

Scope: navigation UX of the global header in `src/components/layout/Header.tsx`. Visual styling and mobile-deep-dives belong to other agents.

---

## 1. Current structure (as-built)

NAVIGATION (`src/constants/index.ts:104`):

1. Головна — `/`
2. Аквапарк — `/aquapark`
3. Ресторан — `/restaurant`
4. Готель — `/hotel`
5. Лазня — `/sauna`
6. Інші послуги (dropdown, 8 children):
   - Апітерапія
   - Виїзні весільні церемонії
   - Пейнтбол
   - Прогулянки на конях
   - Дитячі свята
   - Мангальна зона
   - Тур по пивоварні
   - Контактний зоопарк

Header layout (left → right):
- Logo (links to `/`)
- Center nav (desktop ≥ md): pill-shaped gradient bar containing all 6 items
- Right cluster: phone CTA button (≥ lg only) + mobile hamburger (< md)

Behavioral notes from `Header.tsx`:
- `fixed top-0`, `h-24`, transitions between `glass-menu` and `glass-menu-strong` after `scrollY > 20`. Header is **always sticky**, never hides.
- A spacer `<div className="h-24">` reserves layout space.
- Dropdown is **CSS-only via `group-hover`** — `<button>` trigger has no `onClick`, no `aria-expanded`, no `aria-haspopup`. Touch devices outside the mobile breakpoint (e.g. iPad landscape) cannot reliably open it. Keyboard users **cannot open it at all** (no focus-within handling, no Radix). Hover bridging is only the 8px `mt-2` gap, which is small but present — risk of dropdown closing as the user diagonally moves toward it.
- shadcn `navigation-menu.tsx` primitive exists in the repo but **is not used** by the current header. Radix-based accessible nav is sitting on the shelf.
- No active-state highlight at all. There is no `usePathname()` import; the current page is indistinguishable from the others.
- No skip-to-content link, no landmark `<nav aria-label>`.
- Phone button only appears at `lg:` (≥1024px). Between md and lg the nav exists but the CTA disappears, and no booking/CTA is in the bar at any breakpoint.
- Mobile hamburger opens a left-side drawer `w-72`; "Інші послуги" is rendered as a static label with children indented — **the parent label is not a link and not a toggle**, so on mobile the section is permanently expanded (8 items always visible, eating vertical space).
- Logo is wrapped in `<Link href="/">` ✓ (standard). Quirk: heavy 4-direction `drop-shadow` filter and explicit `marginTop: 10px` push the logo visually off-center inside an `h-24` bar.

## 2. Item ordering

Order today: Головна → Аквапарк → Ресторан → Готель → Лазня → Інші послуги.

Assessment:
- Putting **Аквапарк first** is correct: it is the headline draw of the complex and the most-searched service.
- **Ресторан before Готель** is debatable. For a destination-resort site, Готель usually has higher commercial intent (overnight bookings = highest revenue per visit). Recommend testing **Готель → Ресторан → Лазня** order.
- **Лазня before Інші послуги** is correct — Лазня is a flagship service, not a side activity.
- "Головна" as an explicit nav item is redundant when the logo already links home; this is a holdover from older Ukrainian web conventions. It can be dropped to free space, OR kept for users unfamiliar with the logo-as-home convention (the target audience skews older/family, so keeping it is defensible).

Recommended order (option A): Головна · Аквапарк · Готель · Ресторан · Лазня · Інші послуги
Recommended order (option B, drop Головна): Аквапарк · Готель · Ресторан · Лазня · Інші послуги · [Забронювати]

## 3. "Інші послуги" dropdown — 8 items

8 flat items in a 288px-wide vertical list is the single biggest UX problem. There is no scent of category, the list is alphabetical-by-accident, and a wedding ceremony sits next to paintball. Grouping options:

**Grouping proposal — 3 categories:**

- **Активний відпочинок** (Active)
  - Пейнтбол
  - Прогулянки на конях
  - Тур по пивоварні
- **Релакс і здоров'я** (Wellness)
  - Апітерапія
  - Контактний зоопарк
  - Мангальна зона
- **Події та свята** (Events)
  - Виїзні весільні церемонії
  - Дитячі свята

Each group becomes a column in a mega-menu, or a labeled section in a single-column dropdown.

## 4. CTAs in the header

Currently: phone button only at ≥ lg. There is **no "Забронювати" (Book) CTA in the header at any breakpoint**, which is a serious commercial miss for a hotel/aquapark.

Recommendation:
- Always-visible "Забронювати" primary button on the right of the nav, all breakpoints ≥ md.
- Phone collapses to an icon-only button at md, full number at lg+. Tap-to-call works on mobile — keep the icon button there.
- On mobile drawer: pin "Забронювати" + phone numbers to the bottom of the drawer so they remain reachable when scrolled.

## 5. Scroll behavior

- Sticky ✓ (`fixed top-0`).
- No height-shrink on scroll. The header stays `h-24` (96px), which is tall — eats ~12% of a 800px laptop viewport. Recommend shrinking to `h-16` (64px) once `scrollY > 80`, with the logo scaling correspondingly. Transition already exists (`transition-all duration-500`) so no perf cost.
- Background: `glass-menu` → `glass-menu-strong`. Over a video hero this means the header is semi-transparent at the top. Acceptable, but verify legibility against the brightest frame of `main.mp4` — the white text-shadow trick used on mobile buttons (`textShadow: '1px 1px 0px white...'`) suggests there were already legibility complaints.
- No "hide on scroll down, show on scroll up" pattern. For a long landing page this would reclaim screen real estate; consider as polish.

## 6. Active-state indication

**Missing entirely.** No `usePathname()` use anywhere in `Header.tsx`. Users on `/hotel` cannot tell which section they are in. This is the cheapest possible win:

```tsx
const pathname = usePathname();
const isActive = (href: string) => pathname === href;
```

Then add `aria-current="page"` and a visible underline / pill background for the active item. For dropdown children, the parent "Інші послуги" should also light up when any child route is active (`pathname.startsWith('/other-services')`).

## 7. Keyboard navigation & accessibility — issues

Concrete defects in current `Header.tsx`:

1. Dropdown trigger is a `<button>` with no `onClick`, no `aria-expanded`, no `aria-haspopup`, no `aria-controls`. **Not openable by keyboard.** Tab moves past it; Enter/Space do nothing.
2. Dropdown panel uses `opacity-0 invisible group-hover:...` only — no `:focus-within` fallback. Focus can never enter the panel.
3. No `aria-label` on `<nav>`. Two nav landmarks (desktop + mobile drawer) will both be unnamed and indistinguishable to screen readers.
4. Mobile drawer has no focus trap, no `role="dialog"`, no `aria-modal`, no Escape-to-close handler, no return-focus-on-close.
5. Mobile drawer backdrop click closes ✓, but the X button has no `aria-label`.
6. Logo `<Image>` has alt text ✓, but the link wrapping it has no `aria-label="Глухомань — на головну"`.
7. No skip-link before the header.
8. Hover-only dropdown fails WCAG 2.1 SC 1.4.13 (Content on Hover or Focus) — content must be dismissible, hoverable, persistent. The current implementation fails "persistent" (any pointer move out closes it instantly) and "dismissible" (no Escape).
9. Animation distances on dropdown items (`animationDelay`) ignore `prefers-reduced-motion`.

**Fix path:** swap to the existing `src/components/ui/navigation-menu.tsx` (Radix) which gives keyboard, focus management, and ARIA for free.

## 8. Breadcrumbs

Pages like `/other-services/paintball` have **no breadcrumbs and no active highlight**, so the user has zero in-page indication that paintball lives under "Інші послуги". A single-line breadcrumb directly under the header on every `/other-services/*` page would:

- Reinforce taxonomy after the dropdown grouping change above.
- Give a one-click escape upward.
- Improve SEO (BreadcrumbList structured data).

Recommended pattern: `Головна / Інші послуги / Пейнтбол`. Don't bother on top-level pages (`/aquapark`, etc.) — they'd just say `Головна / Аквапарк`, which is noise.

## 9. Logo behavior

- Wraps `<Link href="/">` ✓.
- `alt="Глухомань логотип"` — fine, but the link itself should carry `aria-label="Глухомань — на головну"` for screen readers.
- Heavy 4-direction `drop-shadow` filter is a visual concern (other agent), but UX-wise the logo's hit target is fine: `h-12 sm:h-14 md:h-16` × intrinsic width ≈ comfortably above the 44×44 minimum.
- One quirk: `marginTop: 10px` inside an `h-24` bar means the logo is **not vertically centered**. Tab-focused outline will look offset.

## 10. Mobile hamburger — quick note (deeper coverage by mobile agent)

- Drawer is `w-72 max-w-[90vw]`, slides from the left, dark glass.
- Hamburger button uses `variant="outline"` — its border is barely visible on the gradient nav background.
- "Інші послуги" parent is **not collapsible** on mobile; all 8 children are always rendered. With Головна+4 mains+8 others = 13 tap targets always visible, which on a 360px-wide phone needs scrolling and obscures the contact section below the fold.
- No Escape, no focus trap, no return-focus (see §7).
- Recommend: collapsible accordion for "Інші послуги" with the 3-category grouping from §3.

---

# Redesign Option A — Minimal Cleanup ("don't break it")

Goal: keep the current visual shell, fix the load-bearing UX defects only. Low risk, ~1 day of work.

Changes:
1. Replace the hand-rolled hover dropdown with Radix `NavigationMenu` from the existing shadcn primitive. Keyboard + ARIA + focus-within for free.
2. Add `usePathname()`-based active state with `aria-current="page"`. Active item gets a stronger background fill; "Інші послуги" lights up on any `/other-services/*` route.
3. Reorder to: **Аквапарк · Готель · Ресторан · Лазня · Інші послуги**. Drop "Головна" — logo handles it.
4. Add a permanent **"Забронювати"** primary button on the right at ≥ md. Phone becomes icon-only at md, icon+number at lg.
5. Group the 8 "Інші послуги" children into 3 labeled sections inside the dropdown (single column, with category headings — not yet a mega-menu):

   ```
   ┌─ Інші послуги ─────────────────┐
   │ АКТИВНИЙ ВІДПОЧИНОК            │
   │   • Пейнтбол                   │
   │   • Прогулянки на конях        │
   │   • Тур по пивоварні           │
   │ ─────────────────────────────  │
   │ РЕЛАКС І ЗДОРОВ'Я              │
   │   • Апітерапія                 │
   │   • Контактний зоопарк         │
   │   • Мангальна зона             │
   │ ─────────────────────────────  │
   │ ПОДІЇ ТА СВЯТА                 │
   │   • Весільні церемонії         │
   │   • Дитячі свята               │
   └────────────────────────────────┘
   ```

6. Mobile drawer: make "Інші послуги" a collapsible accordion with the same 3 groupings; pin Забронювати + phones to the bottom of the drawer; add Escape-to-close, focus trap, `role="dialog"`.
7. Header shrinks `h-24 → h-16` after `scrollY > 80`.
8. Add breadcrumbs to `/other-services/*` pages only.
9. Add skip-link `<a href="#main">Перейти до контенту</a>`.

Wireframe-in-text (desktop, scrolled state):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LOGO]   Аквапарк  Готель  Ресторан  Лазня  Інші послуги ▾    📞 +38…  ❰Забронювати❱ │
└──────────────────────────────────────────────────────────────────────────────┘
                                                  ↑
                                       active item has filled pill
```

---

# Redesign Option B — Ambitious Mega-Menu

Goal: move from "links in a bar" to a destination-marketing surface. Higher effort, bigger payoff for conversion.

Changes (additive on top of Option A):

1. **Mega-menu panel** triggered by "Інші послуги": full-width (or `max-w-5xl` centered), 3 columns, each column = a category, each item = card with thumbnail + 1-line description + small chevron CTA. Pull `description` from `ADDITIONAL_SERVICES` (already in `constants/index.ts:45`).
2. Right-most "Featured" column inside the mega-menu: a single hero card promoting whichever service the owner wants pushed this season (e.g. summer = Аквапарк sauna combo, winter = Лазня + Готель weekend). Editable from `constants/index.ts`.
3. Add a **second mega-menu** under a new top-level item: **"Забронювати"** opens a panel with:
   - Quick-pick: Аквапарк / Готель / Лазня / Стіл у ресторані
   - Date picker stub
   - Phone numbers
   - "Заповнити форму" link

   This converts the header from navigation into a booking funnel.
4. Reorder, with explicit Book entry:
   **Аквапарк · Готель · Ресторан · Лазня · Інші послуги ▾ · Забронювати ▾**
5. Header behavior: transparent over hero, solid glass after scroll, hides on scroll-down / reveals on scroll-up.
6. Active-state: animated underline that slides between items (Radix `NavigationMenuIndicator` is built for this).
7. Desktop: secondary utility row above main bar with working hours + address + language switcher placeholder (i18n is mentioned as a future need in CLAUDE.md). Hides on scroll, primary bar stays.
8. Mobile: full-screen takeover (not 90vw drawer). Two-level navigation with smooth slide between levels. Bottom-pinned Забронювати + tap-to-call.
9. Breadcrumbs on every non-home page.

Wireframe-in-text (desktop, top of page):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ⌚ Щодня 9:00–22:00     📍 с. Нижні Млини, Полтавщина             UA / EN ▾ │ ← utility row
├──────────────────────────────────────────────────────────────────────────────┤
│ [LOGO]    Аквапарк  Готель  Ресторан  Лазня  Інші послуги ▾   ❰Забронювати ▾❱│
└──────────────────────────────────────────────────────────────────────────────┘
                       ──── slide indicator under active ────

Mega-menu (Інші послуги):
┌──────────────────────────────────────────────────────────────────────────────┐
│ АКТИВНИЙ ВІДПОЧИНОК      РЕЛАКС І ЗДОРОВ'Я     ПОДІЇ ТА СВЯТА      ▎ FEATURED │
│ ┌────┐ Пейнтбол           ┌────┐ Апітерапія    ┌────┐ Весілля       ▎ ┌──────┐│
│ │img │ командна гра…     │img │ оздоровлення… │img │ на природі…    ▎ │ HERO ││
│ └────┘                    └────┘               └────┘                ▎ │ img  ││
│ ┌────┐ Коні               ┌────┐ Зоопарк       ┌────┐ Дитячі свята  ▎ │      ││
│ │img │ прогулянки…       │img │ для дітей…    │img │ день народж.… ▎ │ CTA  ││
│ └────┘                    └────┘               └────┘                ▎ └──────┘│
│ ┌────┐ Пивоварня          ┌────┐ Мангал                              ▎         │
│ │img │ тур + дегуст.…    │img │ оренда зони…                         ▎         │
│ └────┘                    └────┘                                     ▎         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Recommendation

**Ship Option A first**, then layer Option B's mega-menu and booking panel as a follow-up. Option A retires every accessibility and clarity defect with ~1 day of work and zero new design assets. Option B needs thumbnails, copy, a date-picker decision, and i18n scaffolding — worth doing, but not blocking.
