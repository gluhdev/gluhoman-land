/**
 * Catalog of all bookable hotels + room categories for the booking dialog.
 * Slugs match room-inventory.ts (availability) and the i18n room keys.
 *
 * - nameKey / hotelNameKey are FULL dotted i18n keys resolved via a root
 *   useTranslations() in the dialog.
 * - priceKey is the SiteContent key edited in /admin/content.
 * - photo is the room's cover image.
 */

export type HotelSlug = "aquapark" | "central" | "brewery" | "cottages";

export interface CatalogRoom {
  slug: string;
  nameKey: string;
  priceKey: string;
  photo: string;
}

export interface CatalogHotel {
  slug: HotelSlug;
  nameKey: string;
  rooms: CatalogRoom[];
}

const aq = (slug: string, photo: number): CatalogRoom => ({
  slug,
  nameKey: `hotel_aquapark.rooms.${slug}.name`,
  priceKey: `hotel.aquapark.${slug}.price`,
  photo: `/images/hotels/aquapark/${slug}/${photo}.jpg`,
});

const ce = (slug: string): CatalogRoom => ({
  slug,
  nameKey: `hotel_central.rooms.${slug}.name`,
  priceKey: `hotel.central.${slug}.price`,
  photo: "/images/hotels/central/1.jpg",
});

const br = (slug: string, photo: number): CatalogRoom => ({
  slug,
  nameKey: `hotel_brewery.rooms.${slug}.name`,
  priceKey: `hotel.brewery.${slug}.price`,
  photo: `/images/hotels/central/${photo}.jpg`,
});

const co = (slug: string): CatalogRoom => ({
  slug,
  nameKey: `cottages.items.${slug}.name`,
  priceKey: `cottages.${slug}.price`,
  photo: `/images/cottages/${slug}/1.jpg`,
});

export const HOTEL_CATALOG: CatalogHotel[] = [
  {
    slug: "aquapark",
    nameKey: "nav.hotel_menu.aquapark.title",
    rooms: [
      aq("lux-balcony", 8),
      aq("standard-aqua", 19),
      aq("standard-balcony", 30),
      aq("standard-twin", 35),
      aq("lux-attic", 39),
      aq("standard-basic", 47),
    ],
  },
  {
    slug: "central",
    nameKey: "nav.hotel_menu.central.title",
    rooms: [
      ce("lux-balcony"),
      ce("standard-balcony-1f"),
      ce("standard-balcony-2f"),
      ce("standard-no-balcony-twin"),
      ce("standard-no-balcony-double"),
    ],
  },
  {
    slug: "brewery",
    nameKey: "nav.hotel_menu.brewery.title",
    rooms: [br("brewery-balcony", 49), br("brewery-bunk", 56)],
  },
  {
    slug: "cottages",
    nameKey: "nav.hotel_menu.cottages.title",
    rooms: [co("yaga"), co("lisovyk"), co("teremok"), co("terem-lux")],
  },
];
