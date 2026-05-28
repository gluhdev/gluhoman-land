/**
 * Structured per-occupancy room prices (грн / ніч), from the price docx
 * "список для сайту.docx" (сезон 16.05–15.09). Keyed by `${hotelSlug}:${slug}`,
 * inner map = adults → price. null entry = "Ціна за запитом".
 *
 * Used by the booking dialog to (a) show each tier on its own line and
 * (b) auto-select the price for the chosen number of guests.
 */
export type PriceTiers = Record<number, number>;

export const ROOM_PRICES: Record<string, PriceTiers | null> = {
  // ── Готель-Аквапарк ──
  "aquapark:lux-balcony": { 1: 3600, 2: 3900, 3: 4450, 4: 5000 },
  "aquapark:standard-aqua": null, // docx: «на цю категорію ціна буде пізніше»
  "aquapark:standard-balcony": { 1: 3200, 2: 3500, 3: 4050 },
  "aquapark:standard-twin": { 1: 3200, 2: 3500, 3: 4050 },
  "aquapark:lux-attic": { 1: 3600, 2: 3900, 3: 4450, 4: 5000 },
  "aquapark:standard-basic": { 1: 3200, 2: 3500, 3: 4050 },

  // ── Центральний Готель ──
  "central:lux-balcony": { 1: 3600, 2: 3900, 3: 4450, 4: 5000 },
  "central:standard-balcony-1f": { 1: 3200, 2: 3500, 3: 4050 },
  "central:standard-balcony-2f": { 1: 3200, 2: 3500, 3: 4050 },
  "central:standard-no-balcony-twin": { 1: 3200, 2: 3500, 3: 4050 },
  "central:standard-no-balcony-double": { 1: 3150, 2: 3450, 3: 4000 },

  // ── Корпус Броварні ──
  "brewery:brewery-balcony": { 1: 3150, 2: 3450, 3: 4000 },
  "brewery:brewery-bunk": { 1: 3150, 2: 3450, 3: 4000 },

  // ── Будиночки ──
  "cottages:yaga": { 1: 4200, 2: 4500, 3: 5050 }, // з карпатським чаном
  "cottages:lisovyk": { 1: 4200, 2: 4500, 3: 5050 }, // з карпатським чаном
  "cottages:teremok": { 1: 3150, 2: 3450, 3: 4000 },
  "cottages:terem-lux": { 1: 3600, 2: 3900, 3: 4450, 4: 5000 },
};

export function priceTiers(
  hotelSlug: string | undefined,
  roomSlug: string | undefined
): PriceTiers | null {
  if (!hotelSlug || !roomSlug) return null;
  return ROOM_PRICES[`${hotelSlug}:${roomSlug}`] ?? null;
}

/** Цена для конкретного числа гостей (берём ближайший доступный тариф ≤ guests, иначе максимальный). */
export function priceForGuests(
  tiers: PriceTiers | null,
  guests: number
): number | null {
  if (!tiers) return null;
  const counts = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b);
  if (counts.length === 0) return null;
  const exact = tiers[guests];
  if (exact != null) return exact;
  // clamp: below min → min tier; above max → max tier
  if (guests < counts[0]) return tiers[counts[0]];
  const maxCount = counts[counts.length - 1];
  if (guests > maxCount) return tiers[maxCount];
  // between defined tiers → nearest lower
  let chosen = counts[0];
  for (const c of counts) if (c <= guests) chosen = c;
  return tiers[chosen];
}

/** Минимальная цена («від X грн») для карточек. */
export function priceFrom(tiers: PriceTiers | null): number | null {
  if (!tiers) return null;
  const vals = Object.values(tiers);
  return vals.length ? Math.min(...vals) : null;
}

export function formatUAH(n: number): string {
  return n.toLocaleString("uk-UA").replace(/ /g, " ");
}
