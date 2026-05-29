/**
 * Canonical list of the four bookable hotels, for admin UI (filters, labels,
 * per-hotel access scoping). Slugs match Booking.hotelSlug, User.hotelSlug,
 * room-inventory.ts, room-prices.ts and hotel-catalog.ts.
 */
export interface AdminHotel {
  slug: string;
  label: string;
}

export const ADMIN_HOTELS: AdminHotel[] = [
  { slug: "aquapark", label: "Готель-Аквапарк" },
  { slug: "central", label: "Центральний Готель" },
  { slug: "brewery", label: "Корпус Броварні" },
  { slug: "cottages", label: "Будиночки" },
];

export const HOTEL_LABEL: Record<string, string> = Object.fromEntries(
  ADMIN_HOTELS.map((h) => [h.slug, h.label])
);

export function hotelLabel(slug: string | null | undefined): string {
  if (!slug) return "Усі готелі";
  return HOTEL_LABEL[slug] ?? slug;
}

export function isHotelSlug(slug: string | null | undefined): slug is string {
  return !!slug && slug in HOTEL_LABEL;
}
