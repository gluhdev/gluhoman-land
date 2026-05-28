/**
 * Room inventory per hotel + category, taken from the price docx
 * ("список для сайту.docx") and the room-fund counts in each hotel docx.
 * Used by the availability checker to compute "X of Y rooms free" for a
 * date range.
 *
 * Keyed by `${hotelSlug}:${roomCategorySlug}`.
 */
export const ROOM_INVENTORY: Record<string, number> = {
  // Готель-Аквапарк — 12 стандартних + 5 люкс + 1 з двома односпальними = 18
  "aquapark:lux-balcony": 1,
  "aquapark:standard-aqua": 3,
  "aquapark:standard-balcony": 4,
  "aquapark:standard-twin": 1,
  "aquapark:lux-attic": 4,
  "aquapark:standard-basic": 4,

  // Центральний Готель — 14 стандартних + 2 люкс + 1 з двома ліжками + 1 = 18→23 фонд
  "central:lux-balcony": 2,
  "central:standard-balcony-1f": 7,
  "central:standard-balcony-2f": 7,
  "central:standard-no-balcony-twin": 1,
  "central:standard-no-balcony-double": 1,

  // Корпус Броварні — 4 стандартних номери
  "central:brewery-balcony": 2, // legacy key safety
  "brewery:brewery-balcony": 2,
  "brewery:brewery-bunk": 2,

  // Будиночки — кожен унікальний, по 1
  "cottages:yaga": 1,
  "cottages:lisovyk": 1,
  "cottages:teremok": 1,
  "cottages:terem-lux": 1,
};

export function roomInventory(
  hotelSlug: string | undefined,
  roomCategorySlug: string | undefined
): number | null {
  if (!hotelSlug || !roomCategorySlug) return null;
  const key = `${hotelSlug}:${roomCategorySlug}`;
  return ROOM_INVENTORY[key] ?? null;
}
