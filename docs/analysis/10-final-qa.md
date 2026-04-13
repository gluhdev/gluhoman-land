# Final QA Audit — Gluhoman (2026-04-11)

Read-only regression audit of the Ukrainian Глухомань hospitality site
(Next.js 15.5.2, App Router, Turbopack).

## 1. Summary

Overall health: **amber**. Source code, metadata, structured data, images,
and page content are in good shape. The static prerender (`.next/server/app/`)
contains **all 16 target pages** and every required signal is present.

However, the production runtime is broken: `next start` cannot serve the
Turbopack build output, and the long-running dev server on :3002 had
crashed at the start of the audit. These are the blockers.

- Critical issues (P0): **3**
- Major issues (P1): **4**
- Minor issues (P2): **4**

## 2. HTTP status table

Dev server on :3002 was crashed at start of audit (every route returned 500
"Internal Server Error"; status code 500, not 200 — my first `curl -w` call
appeared to report 200 due to a transient handshake, but every subsequent
call returned 500). After a fresh `npm run build` + `next start -p 3099`,
most routes still 404:

| Page                                | next start (prod) | Prerendered HTML on disk |
|-------------------------------------|-------------------|--------------------------|
| /                                   | 404               | index.html present       |
| /aquapark                           | 404               | aquapark.html present    |
| /hotel                              | 404               | hotel.html present       |
| /restaurant                         | 404               | restaurant.html present  |
| /sauna                              | 404               | sauna.html present       |
| /menu                               | **200**           | menu.html present        |
| /privacy                            | 404               | privacy.html present     |
| /terms                              | 404               | terms.html present       |
| /sitemap.xml                        | 404               | sitemap.xml.body present |
| /robots.txt                         | 404               | robots.txt.body present  |
| /other-services/paintball           | 404               | paintball.html present   |
| /other-services/brewery-tour        | 404               | brewery-tour.html present|
| /other-services/kids-parties        | 404               | kids-parties.html present|
| /other-services/apitherapy          | 404               | apitherapy.html present  |
| /other-services/wedding             | 404               | wedding.html present     |
| /other-services/horses              | 404               | horses.html present      |
| /other-services/bbq-zone            | 404               | bbq-zone.html present    |
| /other-services/petting-zoo         | 404               | petting-zoo.html present |

Only `/menu` is actually routable through `next start`. Earlier attempts to
start prod produced:

```
[TypeError: routesManifest.dataRoutes is not iterable]
[Error: Invalid package config /.next/package.json.]
```

Signals audit below was therefore performed against the prerendered HTML
files copied from `.next/server/app/` rather than live HTTP responses.

## 3. Required signals coverage

All 16 pages PASS every required signal (counted against the prerendered
HTML in `.next/server/app/`):

| Page          | lang=uk | h1=1 | title | desc | viewport | header | footer | main | Забронювати | skip link | JSON-LD |
|---------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| /             | ok | 1 | ok | ok | ok | ok | ok | ok | 2 | ok | 2 |
| /aquapark     | ok | 1 | ok | ok | ok | ok | ok | ok | 2 | ok | 2 |
| /hotel        | ok | 1 | ok | ok | ok | ok | ok | ok | 2 | ok | 2 |
| /restaurant   | ok | 1 | ok | ok | ok | ok | ok | ok | 2 | ok | 2 |
| /sauna        | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /menu         | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /privacy      | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /terms        | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/apitherapy| ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/wedding   | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/paintball | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/horses    | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/kids-parties | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/bbq-zone  | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/brewery-tour | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |
| /os/petting-zoo | ok | 1 | ok | ok | ok | ok | ok | ok | 1 | ok | 2 |

Header dropdown probe: `"Інші послуги"` trigger text appears in every page.
`"Апітерапія"` appears in every SSR'd page (once, in the megamenu list).

Footer: brand, phones, mailto, Telegram, WhatsApp, and `/privacy` + `/terms`
links all present.

## 4. Issues found

### P0 — Critical

1. **Prod server cannot serve Turbopack build output.**
   `next start -p 3099` against a successful `npm run build --turbopack`
   returns 404 for every route except `/menu`. Build artifacts exist under
   `.next/server/app/aquapark.html`, `.next/server/app/index.html`, etc.,
   but the routes manifest written by Turbopack is incomplete. First run
   produced `TypeError: routesManifest.dataRoutes is not iterable`; second
   run produced `[Error: Invalid package config .next/package.json]`.
   Hitting `/aquapark` on the running server returns `x-nextjs-prerender: 1`
   *and* `404 Not Found` simultaneously — the prerender cache is keyed
   correctly but the route is not registered. Root cause: Turbopack
   production build in Next 15.5.2 produces a `routes-manifest.json` missing
   `dataRoutes` and related fields:
   ```
   /.next/routes-manifest.json:
   {"version":3,"caseSensitive":false,"basePath":"",
    "rewrites":{"beforeFiles":[],"afterFiles":[],"fallback":[]},
    "redirects":[{...}],"headers":[]}
   ```
   No `dataRoutes`, no `staticRoutes`, no `dynamicRoutes`.
   → Site will not run in production on a standard Node host as-is.
   File: `next.config.ts`, `package.json` build script
   (`next build --turbopack`).

2. **Dev server on :3002 was crashed throughout audit.**
   Returned `HTTP/1.1 500 Internal Server Error` body "Internal Server
   Error" for every single path including `/`, `/sitemap.xml`, `/robots.txt`,
   and nonexistent paths. The process was still holding port 3002 but not
   functioning. Needs a hard restart; almost certainly related to the same
   Turbopack routes-manifest bug above, since Next 15 dev also consumes
   that manifest.

3. **Non-turbopack build fails on `favicon.ico`.**
   `npx next build` (no Turbopack) aborts with:
   ```
   [Error [PageNotFoundError]: Cannot find module for page: /favicon.ico]
   > Build error occurred
   [Error: Failed to collect page data for /favicon.ico]
   ```
   Workaround is therefore blocked: the user cannot trivially fall back to
   the non-Turbopack compiler while the Turbopack runtime is broken.
   File: `src/app/favicon.ico` (perms 0700 may also be a factor).

### P1 — Major

4. **3 megamenu services are missing from SSR HTML**
   (`Контактний зоопарк`, `Тур по пивоварні`, `Мангальна зона`, and
   — second check — also `Весілля` and `Коні`). Root `index.html` grep:
   ```
   1 Апітерапія
   0 Весілля
   1 Пейнтбол
   0 Коні
   1 Дитячі свята
   0 Мангальна зона
   0 Пивоварня
   0 Контактний зоопарк
   ```
   Only 3 of 8 additional-service names (Апітерапія, Пейнтбол,
   Дитячі свята — i.e. the first entry of each editorial column) reach
   the server-rendered DOM. Radix `NavigationMenu` is rendering the
   remaining `NavigationMenuContent` children lazily / client-only.
   → SEO impact: links to 5 of 8 sub-pages are not discoverable by
   crawlers that don't execute JS, and those 5 pages lose internal-link
   juice from every page header.
   File: `src/components/layout/Header.tsx:244-289`
   (`NavigationMenuContent` for "Інші послуги" megamenu).

5. **Broken image reference `/images/22.jpg`.**
   `src/app/hotel/page.tsx:453` uses `src="/images/22.jpg"` but
   `public/images/22.jpg` does not exist. (`public/images/9.jpg`,
   `33.jpg`, `akvapark.webp`, `logo.png` do exist.)
   → Hotel page will 404 that image at runtime.

6. **Broken image reference `/images/otel_gluhoman_photo31.jpg`.**
   Referenced from `src/components/sections/HomeHero.tsx:112` (video poster)
   and `src/app/restaurant/page.tsx` three times. `public/images/otel_gluhoman_photo31.jpg`
   does not exist.
   → Home hero video has no poster fallback; `/restaurant` OG image
   metadata and a content image are broken.

7. **`data-booking-trigger` dead-code workaround still in source.**
   `src/components/ui/ServiceButtons.tsx:12`:
   ```ts
   const bookingButton = document.querySelector('[data-booking-trigger]') as HTMLElement;
   ```
   The `BookingDialog` no longer emits that attribute (it dispatches
   `gluhoman:booking:open` CustomEvent instead). The selector returns
   `null` and any click path through `ServiceButtons` that relied on it
   is dead. The attribute does not appear in rendered HTML on any page,
   which means the query selector finds nothing at runtime.
   File: `src/components/ui/ServiceButtons.tsx:12`.

### P2 — Minor

8. **Anti-pattern `hover:scale-*` present on every rendered page.**
   Not a hard failure, but the audit spec listed it as forbidden.
   Hits in source:
   - `src/components/sections/HeroSlider.tsx:268, 286, 293`
   - `src/components/sections/HomeServices.tsx:132`
   - `src/components/sections/HomeHero.tsx:112`
   - `src/components/sections/HomeBookingCta.tsx:60`
   - `src/components/sections/ServicesSlider.tsx:44, 101, 108`
   - `src/components/menu/CategoryNav.tsx:90, 102`
   - `src/components/menu/DishCard.tsx:16`
   - `src/components/menu/BackToTop.tsx:25`
   - `src/components/ui/FloatingButtons.tsx:85, 98, 118`
   - `src/components/ui/GalleryGrid.tsx:55, 63`
   - `src/components/ui/InstagramFeed.tsx:162`
   Every HTML file contains at least one `hover:scale-` class token.

9. **Dead-code `ServicesSlider.tsx` still contains Unsplash URL.**
   `src/components/sections/ServicesSlider.tsx:22`
   ```ts
   backgroundImage: `url('https://images.unsplash.com/${...}')`
   ```
   File is not imported anywhere — confirmed by full-repo grep. Unsplash
   does **not** leak to rendered HTML (so the audit rule "no unsplash URLs
   in any rendered page" passes), but the source still contains the
   forbidden token and should be deleted.

10. **`!overflow-visible` token still present in Header container.**
    `src/components/layout/Header.tsx:151` — the audit spec asked whether
    the `!overflow-visible` workaround was cleaned up. It has **not** been
    cleaned up.

11. **`next.config.ts` has `typescript.ignoreBuildErrors: true` and
    `eslint.ignoreDuringBuilds: true`.** Known, but worth flagging — it's
    hiding the real problem under issue #1/#3.

## 5. Anti-patterns found

| Pattern            | In HTML (rendered) | In source (src/**) |
|--------------------|:------------------:|:------------------:|
| `bg-clip-text`     | none               | none (only in docs/analysis archive notes) |
| `data-booking-trigger` | none           | 1× `ServiceButtons.tsx:12` (dead selector) |
| `data-book-hotel`  | none               | none               |
| `hover:scale-`     | **every page**     | 17 occurrences     |
| `unsplash.com`     | none               | 1× `ServicesSlider.tsx:22` (dead file) |
| `!overflow-visible`| (class emitted)    | 1× `Header.tsx:151`|

## 6. JSON-LD validation

All `<script type="application/ld+json">` blocks parse successfully.
Per-file block count (root + each service = `LocalBusinessJsonLd` once +
page-specific structured data on the 3 biggest pages):

- `/` — 2 blocks, both valid, `@type`: `LodgingBusiness` present.
- `/aquapark`, `/hotel`, `/restaurant` — 2 blocks each, all valid.
- All 8 `/other-services/*` pages — 2 blocks each, all valid.
- `/menu`, `/privacy`, `/terms`, `/sauna` — 2 blocks each, all valid.

Total parsed OK: **32 / 32**.

`LocalBusinessJsonLd` lives in
`src/components/seo/StructuredData.tsx:6-38` and is injected via
`src/app/layout.tsx:54` inside `<head>`. `@type` is `LodgingBusiness` as
required.

## 7. Build report

### `npm run build` (turbopack) — from the only successful run

```
▲ Next.js 15.5.2 (Turbopack)
Creating an optimized production build ...
✓ Finished writing to disk in 238ms
✓ Compiled successfully in 1447ms
Skipping validation of types
Skipping linting
Collecting page data ...
Generating static pages (0/23) ...
✓ Generating static pages (23/23)

Route (app)                          Size  First Load JS
┌ ○ /                             62.1 kB         229 kB
├ ○ /_not-found                       0 B         167 kB
├ ○ /aquapark                     3.19 kB         170 kB
├ ○ /gallery                          0 B         167 kB
├ ○ /hotel                            0 B         167 kB
├ ○ /menu                         2.07 kB         169 kB
├ ● /other-services/[slug]            0 B         167 kB
│  ├ /other-services/apitherapy
│  ├ /other-services/wedding
│  ├ /other-services/paintball
│  └ [+5 more paths]
├ ○ /privacy                          0 B         167 kB
├ ○ /restaurant                   2.46 kB         169 kB
├ ○ /robots.txt                       0 B            0 B
├ ○ /sauna                        2.32 kB         169 kB
├ ○ /sitemap.xml                      0 B            0 B
└ ○ /terms                            0 B         167 kB
+ First Load JS shared by all      193 kB
```

**The build is flaky.** Three consecutive runs produced:
1. Success (23/23 pages).
2. Parser error:
   `./src/components/menu/CategoryNav.tsx:182:1 Unexpected token` —
   but the file parses fine with a normal JSX reader, and a subsequent
   build does not reproduce the error. This is a Turbopack intermittent.
3. `Invalid package config /.next/package.json` during page-data
   collection.

### `npx next build` (no turbopack)
```
✓ Compiled successfully in 3.8s
Collecting page data ...
[Error [PageNotFoundError]: Cannot find module for page: /favicon.ico]
[Error: Failed to collect page data for /favicon.ico]
```
Fails deterministically. (See P0 #3.)

### Warnings
None surfaced by the build output (ESLint and TypeScript are both
silenced via `next.config.ts`).

## 8. Recommendations (top 5)

1. **Fix the production runtime.** The site currently cannot be served by
   `next start` from a Turbopack build in Next 15.5.2 because
   `routes-manifest.json` is missing `dataRoutes`. Options, in order of
   preference:
   - Upgrade Next.js (15.5.2 is mid-ladder; later patches may fix it).
   - Drop `--turbopack` from `build` in `package.json` and first repair
     the favicon.ico issue so non-turbopack build succeeds.
   - Switch deployment target to `output: 'export'` and serve the
     prerendered HTML directly, bypassing `next start` entirely.
2. **Fix `src/app/favicon.ico` so non-turbopack build works.** Re-export
   the icon via `next/font`/`metadata.icons` in `layout.tsx` and delete
   the bare `src/app/favicon.ico` file, or at minimum `chmod 644` the
   existing one and re-commit as a fresh binary — current `0700` perms
   and the 2025 mtime suggest it may have been touched by git LFS or
   similar.
3. **Render the full megamenu on the server.** Either drop Radix
   `NavigationMenuContent` for a plain `<ul>` inside a `<details>` (SEO
   wins, progressive enhancement), or force the content to render
   unconditionally by moving the `ADDITIONAL_SERVICES` list outside the
   Radix `NavigationMenuContent` wrapper (still enhanced by Radix JS).
   Affects `src/components/layout/Header.tsx:244-289`.
4. **Repair broken image references.** Add
   `public/images/22.jpg` and `public/images/otel_gluhoman_photo31.jpg`,
   or change the 4 call sites to existing assets
   (`src/app/hotel/page.tsx:453`,
   `src/components/sections/HomeHero.tsx:112`,
   `src/app/restaurant/page.tsx` ×3).
5. **Delete dead code and stale workarounds.**
   - Remove `src/components/sections/ServicesSlider.tsx` (not imported,
     contains Unsplash URL).
   - Remove the `data-booking-trigger` querySelector in
     `src/components/ui/ServiceButtons.tsx:12` and have `ServiceButtons`
     call `openBookingDialog()` from
     `src/components/ui/BookingDialog.tsx:51` directly.
   - Remove `!overflow-visible` from
     `src/components/layout/Header.tsx:151` (container overflow is no
     longer clipped anywhere the megamenu needs to escape).
   - Replace `hover:scale-*` with `hover:-translate-y-0.5` or a
     boxshadow-based affordance site-wide (17 call sites).
