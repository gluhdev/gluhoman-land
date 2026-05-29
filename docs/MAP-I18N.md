# 🌍 i18n Guide — Namespaces & Sync Workflow

> How translations are structured and kept in sync. See [MAP-ROUTES.md](MAP-ROUTES.md#i18n-setup) for the routing/middleware side. **Always keep `en.json` current** ([[feedback-i18n-sync-required]]).

## Files

| File | Role |
|------|------|
| `messages/uk.json` | Ukrainian — the **source of truth** (edit this) |
| `messages/en.json` | English — **generated** from uk via DeepL; never hand-edit out of band |
| `messages/.hashes.json` | Per-string hashes so `i18n:sync` only re-translates changed strings |
| `messages/.menu-hashes.json` | Same, for the menu sync |
| `src/i18n/routing.ts` | `defineRouting` (`uk` default, `en`; `localePrefix: as-needed`) + nav helpers |
| `src/i18n/request.ts` | `getRequestConfig` — loads `messages/<locale>.json` per request |
| `src/middleware.ts` | Strict locale detection (only `Accept-Language` starting `en` → `/en`) |
| `scripts/i18n/sync.ts` | DeepL translate uk→en, hash-tracked, throttled, retry+backoff, glossary |
| `scripts/i18n/sync-menu.ts` | Same for `src/data/menu.json` (`*_en` keys) |
| `scripts/i18n/check.ts` | Validates completeness/structure |
| `scripts/i18n/glossary.ts` | Pre/post glossary for domain terms (keeps brand/place names correct) |

## Workflow

```bash
# 1. Edit Ukrainian copy in messages/uk.json (or add a key)
# 2. Sync English (needs DEEPL_API_KEY in .env.local):
npm run i18n:sync          # site copy
npm run i18n:sync:menu     # restaurant menu (data/menu.json)
# 3. Validate:
npm run i18n:check
```

The sync only sends **changed** strings to DeepL (hash diff), saves every ~10 translations, and applies the glossary so terms like «Глухомань» aren't mistranslated.

> **State as of 2026-05-29:** `uk.json` and `en.json` both have **32 top-level namespaces, fully in sync** (no keys missing from en). Keep it that way.

## Top-level namespaces (32)

| Namespace | Covers |
|-----------|--------|
| `nav`, `header` | Navigation + header chrome |
| `footer` | Footer columns, social labels |
| `constants` | Service names / contact strings mirrored from `src/constants` |
| `layout` | Page `<title>`/description/keywords, skip-link |
| `home` | All home-page sections (`home.story`, etc.) |
| `aquapark` | `/aquapark` page + `aquapark.meta` |
| `restaurant` | `/restaurant` page |
| `menu`, `embedded_menu`, `category_nav` | `/menu` digital menu UI |
| `sauna` | `/sauna` page + pricing labels |
| `hotel`, `hotels_overview` | Hotel hub + overview |
| `hotel_aquapark`, `hotel_central`, `hotel_brewery` | Per-hotel detail pages (incl. room name keys) |
| `cottages` | `/cottages` page |
| `conference_hall` | `/conference-hall` |
| `other_services`, `slug_page` | Other-services pages + dynamic `[slug]` |
| `gallery`, `gallery_data` | Gallery page + image captions/categories |
| `hall_slider` | Shared hall-slider component copy |
| `booking`, `flow` | Booking dialog + multi-step flow copy (used across hotel/sauna/aquapark) |
| `ui` | Shared widget strings |
| `privacy`, `terms` | Legal pages |
| `loading`, `error`, `not_found` | Suspense / error boundary / 404 |

## Conventions

- **Edit `uk.json` only**; let the script produce `en.json`.
- Room/price display strings: `hotel_<slug>.rooms.<room>.name` (i18n) vs the **price** which comes from SiteContent (`hotel.<slug>.<room>.price`) — see [MAP-DATA.md](MAP-DATA.md#hotel--room-domain). Don't put live prices in the message files.
- Use the locale-aware `Link`/`useRouter` from `src/i18n/routing.ts` for internal navigation, not raw `next/link`.
- Menu items carry their English inline in `src/data/menu.json` (`name_en`, `description_en`), synced separately via `i18n:sync:menu`.
