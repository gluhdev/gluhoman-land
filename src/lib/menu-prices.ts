// Server-side source of truth for menu prices. The order API must NEVER trust
// the price a client sends — a tampered request could pay 1 грн for a 550 грн
// dish. We resolve every line's price from the same menu.json the UI renders,
// keyed by item id. An id that isn't here is no longer on the menu (reject it).
import menuData from "@/data/menu.json";

interface RawMenuItem {
  id: string;
  price: number;
}
interface RawMenu {
  categories: { items?: RawMenuItem[] }[];
}

const PRICE_BY_ID: Map<string, number> = (() => {
  const map = new Map<string, number>();
  for (const cat of (menuData as RawMenu).categories ?? []) {
    for (const item of cat.items ?? []) {
      if (typeof item.price === "number" && item.price > 0) {
        map.set(item.id, item.price);
      }
    }
  }
  return map;
})();

/** Canonical price (UAH integer) for a menu item id, or undefined if it's no
 *  longer on the menu. */
export function menuPriceFor(id: string): number | undefined {
  return PRICE_BY_ID.get(id);
}
