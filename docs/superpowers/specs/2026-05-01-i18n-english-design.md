# i18n: English Localization — Design Spec

**Status:** Draft, pending user review
**Author:** brainstorming session 2026-05-01
**Branch:** `feat/i18n-english`

## 1. Overview & Motivation

The Глухомань marketing site is currently Ukrainian-only. The owner wants to be able to share the site with any English-speaking visitor and have everything render in idiomatic English — automatically, based on the visitor's browser language, with the option to switch manually.

This spec defines the architecture, tooling, and migration plan for adding a fully-translated English version of the site (`/en/...`) alongside the existing Ukrainian default, with **automatic translation maintenance** so the English copy never silently falls behind the Ukrainian source as content evolves.

## 2. Goals & Non-Goals

### Goals

- Visitors with `Accept-Language: en` are auto-redirected to `/en/...` on first visit.
- Manual `UA / EN` switcher in the header (round flag buttons, golden ring on active).
- All user-visible Ukrainian text translated to English: navigation, hero copy, service descriptions, sauna programs, restaurant menu, booking form, error/validation messages, alt-text, page metadata.
- Every future content change automatically (or by enforced workflow) keeps the English version in sync — no silent drift.
- SEO-clean: hreflang tags, sitemap with both language versions, distinct metadata per locale.
- Brand consistency preserved: «Глухомань» transliterated, not translated; sauna program names handled per glossary; phone/address transliterated, not translated.

### Non-Goals

- No third locale (Russian, Polish, etc.) — strictly bilingual UA + EN.
- No translation management SaaS (Crowdin, Lokalise, Tolgee) — overkill for a 2-locale marketing site.
- No runtime API translation — all translations live in the repo as static JSON, generated at dev/build time.
- No new test infrastructure (Playwright config, etc.) — out of scope; manual + smoke verification only.
- No subdomain routing (`en.gluhoman.com.ua`) — premature given the domain isn't finalized; revisit after launch.

## 3. Architecture

### 3.1 Stack additions

- **`next-intl`** — routing, server-component-friendly translations, middleware-based locale detection. De-facto standard for Next.js 15 App Router.
- **DeepL API (Free tier)** — machine translation, called only by `scripts/i18n-sync.ts` at dev time. Not at runtime.
- **`husky`** — git pre-commit hook to enforce sync.

### 3.2 URL structure (`localePrefix: 'as-needed'`)

| Locale | Routes |
|---|---|
| Ukrainian (default) | `/`, `/sauna`, `/restaurant`, `/hotel`, `/aquapark` |
| English | `/en`, `/en/sauna`, `/en/restaurant`, `/en/hotel`, `/en/aquapark` |

Existing Ukrainian URLs do not change — preserves existing inbound links and SEO.

### 3.3 File reorganization

```
src/
  app/
    [locale]/                # all pages move here
      layout.tsx             # wraps in NextIntlClientProvider, sets <html lang>
      page.tsx               # was src/app/page.tsx
      sauna/page.tsx
      restaurant/page.tsx
      hotel/page.tsx
      aquapark/page.tsx
      not-found.tsx
    layout.tsx               # minimal root: just <html><body>{children}</body></html>
  middleware.ts              # NEW: next-intl middleware (locale detection + redirects)
  i18n/
    routing.ts               # locale config (locales, defaultLocale, localePrefix)
    request.ts               # loads messages/{locale}.json on the server
  components/
    layout/
      Header.tsx             # gets LanguageSwitcher
      Footer.tsx
    ui/
      LanguageSwitcher.tsx   # NEW: round flag buttons
messages/
  uk.json                    # source of truth (Ukrainian)
  en.json                    # generated/synced
  .hashes.json               # per-key source hashes for staleness detection
scripts/
  i18n/
    sync.ts                  # DeepL sync entrypoint (npm run i18n:sync)
    check.ts                 # diff-only, no writes (npm run i18n:check)
    glossary.ts              # brand-term overrides
.husky/
  pre-commit                 # blocks commits that touch uk.json without en.json
```

### 3.4 Locale detection (middleware)

`src/middleware.ts` runs on every request. Logic:

1. If path starts with `/en/` → English.
2. Else if cookie `NEXT_LOCALE` is set → use cookie value (user previously chose).
3. Else parse `Accept-Language` header — if first preference is `en*`, respond with 302 to `/en${pathname}`.
4. Else serve Ukrainian (no redirect).

When the user clicks the switcher, we set `NEXT_LOCALE` cookie and `router.push` to the corresponding URL in the new locale.

## 4. Translation Infrastructure

### 4.1 Source of truth

`messages/uk.json` holds every user-visible string keyed by feature/screen:

```json
{
  "common": { "book": "Забронювати", "phone_label": "або за тел", "loading": "Завантаження…" },
  "nav":    { "home": "Головна", "sauna": "Сауна", "restaurant": "Ресторан", ... },
  "sauna":  {
    "hero_title": "Глухомань — баня та сауна",
    "prices_title": "Прайс саун",
    "rental_per_hour": "1000 грн/год",
    "programs": {
      "health":  { "name": "Здоров'я",  "description": "..." },
      "classic": { "name": "Класична", "description": "..." }
    }
  }
}
```

`messages/en.json` is structurally identical with English values. Schema is enforced by `next-intl`'s strict mode — missing keys cause a build-time error, not a runtime fallback to Ukrainian.

### 4.2 DeepL sync script

`scripts/i18n/sync.ts`, run via `npm run i18n:sync`:

1. Load `uk.json`, `en.json`, `.hashes.json`.
2. For each leaf key, compute SHA-1 of the Ukrainian value.
3. Diff against `.hashes.json`:
   - **New key** (not in en.json) → translate with DeepL.
   - **Changed source** (hash differs) → re-translate, overwrite English value.
   - **Unchanged** → leave English value as-is (manual edits preserved).
4. Send batched DeepL requests with `tag_handling=xml` and `<x>...</x>` placeholders for ICU variables (e.g. `{count}`, `{name}`) so DeepL doesn't translate variable names.
5. Apply glossary (see 4.3) before sending and after receiving.
6. Write back updated `en.json` + new `.hashes.json`.
7. Exit code 0 on success, 1 on any DeepL error (CI catches this).

**Idempotency:** running twice with no changes is a no-op.

**Rate limits:** Free tier is 500k chars/month. Site is well under 50k chars total, so margin is huge.

### 4.3 Glossary (`scripts/i18n/glossary.ts`)

Pre-translation substitutions to protect brand terms from machine translation:

| Ukrainian | English | Reason |
|---|---|---|
| Глухомань | Glukhoman | Brand name — transliterate, not translate |
| Здоров'я (program) | Zdorovya | Sauna program — transliterate + optional gloss |
| Класична (program) | Klasychna | Sauna program — transliterate |
| с. Нижні Млини | Nyzhni Mlyny village | Place name |
| Полтавська область | Poltava region | Place name |
| грн (price) | UAH | Currency code |
| грн/год (price) | UAH/hour | Unit |

Glossary is applied via DeepL's `glossary_id` for term-level substitutions and via pre/post-string-replace for context-sensitive cases. Easily extensible — add a row, re-run sync.

For sauna program names specifically, the resolved English form will be reviewed during initial sync — user may prefer `Zdorovya — Health Ritual` style with a gloss suffix. To be confirmed by inspecting the first sync output.

### 4.4 Staleness check

`npm run i18n:check` (read-only) compares hashes and prints:

- Keys present in `uk.json` but missing in `en.json`.
- Keys whose source hash differs from the snapshot.
- Keys flagged `needs_review` from prior sync.

Used in CI and locally before commits.

## 5. Language Switcher

### 5.1 Behavior

- Two round flag buttons in `Header.tsx`: 🇺🇦 (UA) and 🇬🇧 (EN).
- Active locale: full-color flag, ~28px diameter desktop / 24px mobile, with a 1.5px golden ring (warm gold accent, matches existing brand) and slight scale-up (1.05).
- Inactive locale: 50% opacity, grayscale filter, no ring, normal scale.
- Hover on inactive: opacity → 90%, color returns, ring fades in.
- All transitions ~200ms ease-out.
- Click on inactive:
  1. Set cookie `NEXT_LOCALE` (path=/, max-age=1y, samesite=lax).
  2. Navigate to the same path in the other locale (e.g. `/sauna#prices` ↔ `/en/sauna#prices`).
  3. `next-intl`'s `useRouter` handles the path-mapping.

### 5.2 Visual implementation

Component: `src/components/ui/LanguageSwitcher.tsx`. Uses inline SVG flags (not raster) for crispness at any DPR. Soft drop-shadow for subtle depth. The visual polish pass will be done with the `frontend-design` skill once the wiring is in place.

### 5.3 Header layout

On desktop: switcher sits to the right of the phone number in the top bar.
On mobile: switcher moves into the burger menu drawer header (above nav links).

## 6. Migration Scope

### 6.1 Strings to extract

**Constants (`src/constants/index.ts`):**
- `CONTACT_INFO.workingHours` and any human-readable strings.
- `MAIN_SERVICES[].title` / `.description` (4 cards).
- `ADDITIONAL_SERVICES[].title` / `.description` (8 cards).
- `NAVIGATION` is derived — moves automatically with its source arrays.

**Layout (`src/components/layout/`):**
- `Header.tsx` — nav labels, phone label.
- `Footer.tsx` — column headings, contact lines, copyright.

**Sections (`src/components/sections/`):**
- `VideoHero`, `HeroSection`, `ServicesGrid`, `ServicesSlider`, `BookingSection`, `LocationSection`, `SectionDivider` — all titles, subtitles, CTA labels.

**UI widgets (`src/components/ui/`):**
- `BookingForm` — field labels, placeholders, validation messages, success/error toasts, button labels.
- `BookingReviews`, `GoogleReviews`, `InstagramFeed` — section headings.
- `FloatingButtons`, `ServiceButtons`, `Preloader` — all strings.
- `BookingCTA` — button label.

**Pages (`src/app/[locale]/.../page.tsx`):**
- `/` — hero, intro paragraph, services overview.
- `/sauna` — programs (`Здоров'я`, `Класична`, descriptions, pricing copy, technical paragraph), booking CTAs, prices section, all `«або за тел»` labels.
- `/restaurant` — intro, menu sections, ambiance copy.
- `/hotel` — rooms, amenities, descriptions.
- `/aquapark` — intro, attractions, pricing copy.

**Data files:**
- `src/data/menu.json` — restaurant items. Names in original (Ukrainian/Italian), English description as a paired field. Schema gains `name_en`, `description_en` (or moves to keyed translation).
- `src/data/sauna.ts` (`SAUNA_PRICE` constant + any text) — verify during implementation.

**Metadata:**
- `generateMetadata` per page — translated `<title>`, `<meta description>`, OG tags.
- Root layout — `<link rel="alternate" hreflang="uk|en|x-default">` for every URL pair.
- `app/sitemap.ts` — emits both UA and EN URL entries with `<xhtml:link>` alternates.

### 6.2 What does NOT change

- Phone numbers, raw addresses (only transliterated when displayed in EN context).
- Currency (UAH stays UAH).
- Image filenames, alt-text-bearing image references (alt is translated, file path is not).
- Brand SVGs, Instagram/Google handles, map embed src.
- Existing analytics, GTM, structured data identifiers.

## 7. Drift Prevention (Process Guarantees)

Three layers of enforcement so the English version cannot silently lag:

1. **`husky` pre-commit hook (`.husky/pre-commit`)**: if `git diff --cached --name-only` includes `messages/uk.json` but not `messages/en.json`, abort with a message instructing to run `npm run i18n:sync`.
2. **CI check (`.github/workflows/i18n-check.yml`)**: on every PR, runs `npm run i18n:check`. Fails the build if any keys are missing or hashes diverge.
3. **ESLint custom rule** (`eslint-plugin-i18n-no-cyrillic-jsx` or inline rule): warns when a JSX text node or string attribute contains Cyrillic characters outside translation files. Catches accidental hardcoded Ukrainian copy in components.

Optional layer (deferred): GitHub Action that auto-runs `i18n:sync` on push to `main` and opens an auto-PR with the regenerated `en.json`. Not in initial scope; can add later if manual sync becomes annoying.

## 8. Implementation Phases

To be detailed by `writing-plans` skill in the next step. High-level outline:

1. **Foundation**: install `next-intl`, set up `[locale]` route segment, middleware, root layout split.
2. **Translation tooling**: `messages/uk.json` skeleton, sync/check scripts, glossary, husky hook, CI workflow.
3. **String extraction (UA)**: walk every component listed in §6.1, replace hardcoded Ukrainian with `t('key')` calls. Done in vertical slices (per page) to keep PRs reviewable.
4. **Initial English generation**: run `npm run i18n:sync`, review output, hand-tune glossary terms and program names. Commit `en.json`.
5. **Language switcher UI**: build `LanguageSwitcher`, wire into Header (desktop + mobile).
6. **SEO**: hreflang in root layout, `generateMetadata` per page, sitemap update.
7. **Verification**: dev-server smoke (UA and EN, every page, every interactive flow), production deploy, verify both locales live on `72.60.16.73`.

## 9. Acceptance Criteria

- [ ] Visiting `/` with `Accept-Language: en-US` redirects to `/en` (302) on first visit.
- [ ] Visiting `/` with `Accept-Language: uk-UA` (or unspecified) stays on `/`.
- [ ] Cookie `NEXT_LOCALE=uk` overrides English browser detection.
- [ ] All 5 page routes (`/`, `/sauna`, `/restaurant`, `/hotel`, `/aquapark`) render in both locales without missing-key errors.
- [ ] No Cyrillic text appears anywhere on `/en/*` pages (visual audit + grep on rendered HTML).
- [ ] Language switcher in header: clicking inactive flag navigates to the same path in the other locale, preserves hash fragments, updates cookie.
- [ ] `npm run i18n:check` exits 0 on a clean tree.
- [ ] Editing a value in `uk.json` and trying to commit without re-syncing is blocked by the pre-commit hook.
- [ ] `view-source` of each page shows correct `<html lang>` + `<link rel="alternate" hreflang="...">` tags.
- [ ] Sitemap includes both UA and EN URLs with `xhtml:link` alternates.
- [ ] Production deploy on `72.60.16.73` serves `/en/sauna` correctly with 200 OK.

## 10. Open Questions

- **Sauna program names**: `Zdorovya` alone, or `Zdorovya — Health Ritual`? Decide after seeing first sync output, with user.
- **Menu items**: dual display (`«Маргарита» / Margherita` mode) vs. switched display (Ukrainian on UA site, English on EN site). Lean toward switched per locale; confirm with user during implementation.
- **English currency formatting**: `1000 UAH/hour` is the default. User may prefer `≈ $25 USD` annotations — out of scope unless requested.

## 11. Out of Scope (Explicitly)

- Russian or other languages.
- Currency conversion / multi-currency display.
- Right-to-left scripts.
- Translation of admin/CMS interfaces (those areas are owner-only).
- Booking confirmation emails / Telegram bot messages — separate localization concern, deferred.
- Dynamic content from any CMS — current site is static-only, no dynamic copy to translate.
