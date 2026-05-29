# 🌐 Public Routes & i18n

> Everything user-facing. All pages live under `src/app/[locale]/`. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index.

## i18n setup

- **Locales:** `uk` (Ukrainian, default) and `en` (English).
- **Prefix strategy:** `localePrefix: 'as-needed'` → Ukrainian pages have no prefix (`/aquapark`), English pages are prefixed (`/en/aquapark`).
- **Auto-detection:** custom strict rule in `src/middleware.ts` — only an `Accept-Language` header starting with `en` routes to `/en`; everything else (uk, ru, de, …) falls back to Ukrainian.
- **Messages:** `messages/uk.json` + `messages/en.json`, loaded dynamically in `src/i18n/request.ts` (`getRequestConfig`). `.hashes.json` tracks which strings changed so `i18n:sync` only re-translates deltas.
- **Navigation helpers:** `src/i18n/routing.ts` exports `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` (locale-aware versions — use these, not raw `next/link`, for internal nav).
- **Wiring:** `next.config.ts` wraps the config in `withNextIntl()` (and `withSentryConfig()` in prod).

**Files:** `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `next.config.ts`, `messages/{uk,en}.json`

### Keeping translations in sync
After ANY UI copy change: `npm run i18n:sync` (DeepL, hash-tracked, uses glossary in `scripts/i18n/glossary.ts`). Menu copy: `npm run i18n:sync:menu`. Validate: `npm run i18n:check`. **Never leave `en.json` stale.**

## Layouts

| File | Role |
|------|------|
| `src/app/layout.tsx` | Minimal root — just passes `children` through to the locale layout |
| `src/app/[locale]/layout.tsx` | The real layout: loads fonts (**Manrope** sans `--font-manrope`, **Cormorant Garamond** serif `--font-fraunces`), builds metadata/OG/hreflang/canonical, injects `<LocalBusinessJsonLd>`, wraps in `NextIntlClientProvider` + `SmoothScrollProvider` (Lenis), renders `Header` / `<main>` / `Footer` / `FloatingButtons` / `BookingDialog`. `generateStaticParams` → `[{locale:'uk'},{locale:'en'}]` |

**SEO infra:** `src/app/sitemap.ts` (`/sitemap.xml`, both locales + hreflang), `src/app/robots.ts` (`/robots.txt`), `src/components/seo/StructuredData.tsx` (`<LocalBusinessJsonLd>`).

## Public routes (uk path shown; prefix `/en` for English)

### Home & core
| File | URL | Description |
|------|-----|-------------|
| `page.tsx` | `/` | Home: hero slider, story, features, services, conference teaser, gallery, location, reviews, booking CTA |
| `aquapark/page.tsx` | `/aquapark` | Aquapark overview: photos, features, pricing, booking trigger |
| `restaurant/page.tsx` | `/restaurant` | Restaurant: parallax hero, hall slider, menu preview/dialog, floating nav |
| `menu/page.tsx` | `/menu` | Full digital menu: categories, dishes, cart, link to checkout |
| `sauna/page.tsx` | `/sauna` | Sauna: hall slider, price grid, booking integration |
| `gallery/page.tsx` | `/gallery` | Photo gallery with category tabs + lightbox |

### Hotel & accommodation
| File | URL | Description |
|------|-----|-------------|
| `hotel/page.tsx` | `/hotel` | Overview of all hotels (`HotelOverviewCard` ×N) + booking CTA |
| `hotel/aquapark/page.tsx` | `/hotel/aquapark` | "Aquapark" villa detail (rooms, amenities, booking) |
| `hotel/central/page.tsx` | `/hotel/central` | "Central" villa detail |
| `hotel/brewery/page.tsx` | `/hotel/brewery` | "Brewery" villa detail (extracted as 4th hotel) |
| `cottages/page.tsx` | `/cottages` | Fairy-tale cottages (yaga, lisovyk, teremok, terem-lux) with `CottageBookingTrigger` |

### Commerce sub-flows (details in [MAP-COMMERCE.md](MAP-COMMERCE.md))
| File | URL | Description |
|------|-----|-------------|
| `hotel/booking/{page,success,fail}` | `/hotel/booking[/success\|/fail]` | Hotel booking stepper + result pages (`BookingFlow.tsx`, `BookingSuccessClient.tsx`) |
| `sauna/booking/{page,success,fail}` | `/sauna/booking[/...]` | Sauna slot booking (`SaunaBookingFlow.tsx`, `SaunaSuccessClient.tsx`) |
| `aquapark/buy/{page,success,fail}` | `/aquapark/buy[/...]` | Aquapark ticket purchase + QR (`BuyFlow.tsx`, `TicketSuccessClient.tsx`) |
| `menu/checkout/{page,success,fail}` | `/menu/checkout[/...]` | Restaurant order checkout (`CheckoutForm.tsx`, `SuccessClient.tsx`) |

### Other services
| File | URL | Description |
|------|-----|-------------|
| `conference-hall/page.tsx` | `/conference-hall` | 45-person conference hall, AV, pricing, booking |
| `other-services/[slug]/page.tsx` | `/other-services/{slug}` | Dynamic fallback driven by `ADDITIONAL_SERVICES` |
| `other-services/{apitherapy,wedding,paintball,horses,kids-parties,bbq-zone,brewery-tour,petting-zoo}/page.tsx` | `/other-services/<name>` | Dedicated pages for each extra service |

> Historical note: these 8 `/other-services/*` pages used to 404 (per old CLAUDE.md). They now exist as real pages.

### Legal & meta
| File | URL | Description |
|------|-----|-------------|
| `privacy/page.tsx` | `/privacy` | Privacy policy |
| `terms/page.tsx` | `/terms` | Terms of service |
| `error.tsx` | (boundary) | Error boundary with reset + "home" link |
| `loading.tsx` | (suspense) | Skeleton loader |
| `not-found.tsx` | 404 | 404 with home link + contact phone |
| `src/app/global-error.tsx` | (root boundary) | Root-level error boundary |

## Home page sections (`src/components/sections/`)

| Component | Renders |
|-----------|---------|
| `HeroSlider.tsx` / `HomeHero.tsx` | Full-viewport hero (image/video, parallax) |
| `HomeStory.tsx` | Editorial "chapter": serif title, drop-cap prose, pull quote, asymmetric photos |
| `HomeFeatures.tsx` | 4 headline-service feature cards |
| `HomeServices.tsx` | Grid of additional-service cards |
| `HomeConferenceTeaser.tsx` | Teaser linking to `/conference-hall` |
| `HomeGallery.tsx` | Embla autoplay photo carousel |
| `HomeLocation.tsx` | Address, hours, phone, map |
| `HomeReviews.tsx` | Google / booking review cards |
| `HomeBookingCta.tsx` | Final CTA → opens `BookingDialog` |

Other shared sections: `HeroSection`, `LocationSection`, `ServicesGrid`, `SectionDivider`, `RestaurantCtaStrip`, `RestaurantHallsFromClient`, `RestaurantKidsMusic`, `RestaurantKidsRoom`, `SaunaFromClientFull`.

## Header & Footer (`src/components/layout/`)

**Header** (`Header.tsx`, client): fixed, scroll-reactive; desktop `NavigationMenu` with a Hotel dropdown (All / Aquapark / Central / Brewery / Cottages) and an "Other services" grouping (active / wellness / events); mobile hamburger drawer (focus trap, Esc, scroll lock); `LanguageSwitcher`; phone icon. Nav data derives from `src/constants/index.ts`.

**Footer** (`Footer.tsx`, client): brand column + social links (Instagram, Facebook, Telegram, WhatsApp), services column (main + other), contact column, copyright.

## Shared UI widgets (`src/components/ui/`)

`BookingDialog` (the global booking modal — central to all hotel/cottage bookings), `BookingButton`, `Calendar` (react-day-picker), `LanguageSwitcher`, `FontSwitcher`, `FloatingButtons`, `GalleryGrid`, `Lightbox`, `CookieConsent`, `SurfaceCard`, `BookingReviews`, `GoogleReviews`, `InstagramFeed`, plus shadcn primitives (`button`, `card`, `navigation-menu`).

> ⚠️ macOS scroll: never put `overflow`/`overscroll` on `html`/`body` at desktop scope (see memory `feedback_macos_scroll_fix`).
