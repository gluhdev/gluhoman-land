/**
 * Server-only assembler for the redesigned booking page.
 *
 * For a given hotel it merges the existing sources into per-room view-models:
 *   - HOTEL_CATALOG          → room slugs, cover photo, i18n nameKey, priceKey
 *   - room-prices.ts         → static per-occupancy price tiers
 *   - room-config.ts         → admin price overrides + resolved inventory
 *   - room-gallery.ts        → curated photo gallery (falls back to cover)
 *   - i18n messages          → name / tagline / capacity / amenity bullets
 *   - site-content (getText) → admin-editable price label
 *
 * i18n key conventions differ per hotel:
 *   - aquapark / central / brewery: namespace `hotel_<slug>`, room copy under
 *     `rooms.<slug>.{name,tagline,capacity,bullet_1..7}`.
 *   - cottages: namespace `cottages`, copy under `items.<slug>.{name,tagline}`;
 *     no per-room bullets or capacity translation keys exist.
 */
import "server-only";
import { getTranslations } from "next-intl/server";
import { HOTEL_CATALOG } from "@/lib/hotel-catalog";
import { priceTiers, priceFrom, type PriceTiers } from "@/lib/room-prices";
import { roomGallery } from "@/lib/room-gallery";
import { getPriceOverrides, resolvedInventory } from "@/lib/room-config";
import { getText } from "@/lib/site-content";

export type BookingHotelSlug = "aquapark" | "central" | "brewery" | "cottages";

/** next-intl namespace per hotel. */
const NS: Record<BookingHotelSlug, string> = {
  aquapark: "hotel_aquapark",
  central: "hotel_central",
  brewery: "hotel_brewery",
  cottages: "cottages",
};

/** Per-room key prefix within the namespace. */
const KEY_PREFIX: Record<BookingHotelSlug, string> = {
  aquapark: "rooms",
  central: "rooms",
  brewery: "rooms",
  cottages: "items",
};

export interface RoomVM {
  slug: string;
  name: string;
  tagline?: string;
  capacity?: string;
  amenities: string[];
  priceLabel: string;
  tiers: PriceTiers | null;
  priceFrom: number | null;
  gallery: string[];
  cover: string;
  inventory: number | null;
}

export interface BookingHotelVM {
  slug: BookingHotelSlug;
  label: string;
  rooms: RoomVM[];
}

/** The list of bookable hotels with their i18n name keys (for tabs/labels). */
export function getBookingHotels(): { slug: BookingHotelSlug; nameKey: string }[] {
  return HOTEL_CATALOG.map((h) => ({
    slug: h.slug as BookingHotelSlug,
    nameKey: h.nameKey,
  }));
}

export async function getHotelRooms(
  hotel: BookingHotelSlug,
  locale: string,
): Promise<RoomVM[]> {
  const catalog = HOTEL_CATALOG.find((h) => h.slug === hotel);
  if (!catalog) return [];

  const t = await getTranslations({ locale, namespace: NS[hotel] });
  const overrides = await getPriceOverrides();
  const prefix = KEY_PREFIX[hotel];
  const hasBullets = hotel !== "cottages";
  const hasCapacityKey = hotel !== "cottages";

  const rooms = await Promise.all(
    catalog.rooms.map(async (r) => {
      const k = (suffix: string) =>
        `${prefix}.${r.slug}.${suffix}` as Parameters<typeof t>[0];

      /** Returns the translated string, or undefined when the key is missing/empty. */
      const get = (suffix: string): string | undefined => {
        const key = k(suffix);
        const value = t(key);
        if (!value || value === String(key)) return undefined;
        return value;
      };

      const tiers = overrides[`${hotel}:${r.slug}`] ?? priceTiers(hotel, r.slug);

      const amenities: string[] = [];
      if (hasBullets) {
        for (let i = 1; i <= 7; i++) {
          const v = get(`bullet_${i}`);
          if (v) amenities.push(v);
        }
      }

      const priceLabel = await getText(
        r.priceKey,
        tiers ? `від ${priceFrom(tiers)} грн` : "Ціна за запитом",
      );

      return {
        slug: r.slug,
        name: get("name") ?? r.slug,
        tagline: get("tagline"),
        capacity: hasCapacityKey ? get("capacity") : undefined,
        amenities,
        priceLabel,
        tiers,
        priceFrom: priceFrom(tiers),
        gallery: roomGallery(hotel, r.slug, r.photo),
        cover: r.photo,
        inventory: await resolvedInventory(hotel, r.slug),
      } satisfies RoomVM;
    }),
  );

  return rooms.sort(
    (a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity),
  );
}
