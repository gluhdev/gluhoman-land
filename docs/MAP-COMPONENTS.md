# 🧩 Component Inventory

> Every component under `src/components/`, grouped by folder, with a one-line purpose. See [MAP-ROUTES.md](MAP-ROUTES.md) for which pages compose them.

## `layout/`
| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Fixed, scroll-reactive nav: desktop dropdowns (Hotel/Other services), mobile drawer, language switcher, phone |
| `Footer.tsx` | Brand + social, services columns, contact, copyright |

## `sections/` — page sections
| Component | Purpose |
|-----------|---------|
| `HomeHero.tsx` / `HeroSlider.tsx` | Home full-viewport hero (video/image, parallax) |
| `HomeStory.tsx` | Editorial "chapter" block (serif title, drop-cap, pull quote, photos) |
| `HomeFeatures.tsx` | 4 headline-service feature cards |
| `HomeServices.tsx` | Grid of additional-service cards |
| `HomeConferenceTeaser.tsx` | Teaser → `/conference-hall` |
| `HomeGallery.tsx` | Embla autoplay photo carousel |
| `HomeLocation.tsx` | Address / hours / phone / map |
| `HomeReviews.tsx` | Review cards |
| `HomeBookingCta.tsx` | Final CTA → opens `BookingDialog` |
| `HeroSection.tsx` | Generic hero used by inner pages |
| `LocationSection.tsx` | Reusable location/map block |
| `ServicesGrid.tsx` | Reusable services grid |
| `SectionDivider.tsx` | Decorative divider |
| `RestaurantCtaStrip.tsx` | Restaurant CTA strip |
| `RestaurantHallsFromClient.tsx` | Restaurant halls (client-driven data) |
| `RestaurantKidsMusic.tsx`, `RestaurantKidsRoom.tsx` | Restaurant kids' music / room blocks |
| `SaunaFromClientFull.tsx` | Sauna section (full, client data) |

## `ui/` — shadcn primitives + project widgets
| Component | Purpose |
|-----------|---------|
| `button.tsx`, `card.tsx`, `navigation-menu.tsx` | shadcn/Radix primitives |
| `BookingDialog.tsx` | **The global booking modal** — central to hotel/cottage bookings (room picker, per-tier prices, availability) |
| `BookingButton.tsx` | Trigger that opens `BookingDialog` |
| `Calendar.tsx` | react-day-picker calendar (date selection) |
| `LanguageSwitcher.tsx` | uk/en switch (locale-aware) |
| `FontSwitcher.tsx` | Live font-pairing preview (dev/design tool; uses `fontPairings.ts`) |
| `FloatingButtons.tsx` | Floating action buttons (book / call / messengers) |
| `GalleryGrid.tsx`, `Lightbox.tsx` | Gallery grid + lightbox viewer |
| `CookieConsent.tsx` | Cookie consent banner |
| `SurfaceCard.tsx` | Styled surface/card wrapper |
| `BookingReviews.tsx`, `GoogleReviews.tsx` | Review widgets |
| `InstagramFeed.tsx` | Instagram feed embed |

## `hotel/` & `cottages/`
| Component | Purpose |
|-----------|---------|
| `hotel/HotelBookingTrigger.tsx` | Opens booking pre-set to a hotel/room |
| `hotel/HotelOverviewCard.tsx` | Hotel card on the `/hotel` overview |
| `hotel/RoomPrice.tsx` | Per-occupancy price block on room cards |
| `cottages/CottageBookingTrigger.tsx` | Booking trigger for cottages |

## `menu/` — restaurant ordering
| Component | Purpose |
|-----------|---------|
| `EmbeddedMenu.tsx` | Embeddable menu view |
| `MenuHero.tsx`, `MenuFooter.tsx` | Menu page hero / footer |
| `CategoryNav.tsx`, `CategorySection.tsx` | Category navigation + section rendering |
| `DishCard.tsx`, `DishListItem.tsx` | Dish presentations (card / list) |
| `AddToCartButton.tsx` | Adds an item to the zustand cart |
| `CartButton.tsx`, `CartDrawer.tsx` | Cart toggle + slide-out drawer |
| `BackToTop.tsx` | Scroll-to-top control |

## `restaurant/`
| Component | Purpose |
|-----------|---------|
| `HeroParallax.tsx` | Parallax hero (also reused by hotel/conference pages) |
| `HallSlider.tsx` | Hall/photo slider |
| `MenuPreview.tsx`, `MenuDialog.tsx`, `MenuTrigger.tsx`, `MenuScrollButton.tsx` | Menu preview + modal + triggers on the restaurant page |
| `FloatingNav.tsx` | In-page anchor nav |
| `Reveal.tsx` | framer-motion scroll-reveal wrapper |
| `SectionFlourish.tsx` | Decorative flourish (the warm-gold accent motif) |

## `sauna/`
| Component | Purpose |
|-----------|---------|
| `PriceGrid.tsx`, `PriceList.tsx` | Sauna pricing displays |

## `content/` — live CMS editing
| Component | Purpose |
|-----------|---------|
| `EditableText.tsx` | Renders a SiteContent text value; inline-editable for authed admins |
| `EditableImage.tsx` | Same for images (ties into upload API) |

## `admin/`
| Component | Purpose |
|-----------|---------|
| `ImageUploader.tsx` | react-dropzone uploader → `/api/admin/upload` |

> Admin **pages** and their page-local components (`RoomsManager`, `StaffManager`, `BookingForm`, `ScannerClient`, etc.) live under `src/app/admin/` — see [MAP-ADMIN.md](MAP-ADMIN.md).

## `seo/`, `analytics/`, `providers/`, `dev/`
| Component | Purpose |
|-----------|---------|
| `seo/StructuredData.tsx` | `<LocalBusinessJsonLd>` schema.org markup |
| `analytics/Plausible.tsx` | Plausible analytics loader |
| `providers/SmoothScrollProvider.tsx` | Lenis smooth scroll (off on touch/mobile/reduced-motion) |
| `dev/BuildMarker.tsx` | Dev-only build info overlay |
