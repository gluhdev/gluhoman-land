/**
 * Server-side room configuration: merges the static, docx-derived defaults
 * (room-prices.ts + room-inventory.ts) with admin overrides stored in
 * SiteContent. Lets the /admin/rooms page edit per-occupancy prices and the
 * room count without touching code, while keeping the static values as a
 * safe fallback when no override exists.
 *
 * SiteContent override keys (JSON-encoded values):
 *   room.<hotel>.<slug>.tiers  → { "1": 3600, "2": 3900, ... }  or  null
 *   room.<hotel>.<slug>.count  → 3
 */
import "server-only";
import { prisma } from "@/lib/prisma";
import { ROOM_PRICES, type PriceTiers } from "@/lib/room-prices";
import { ROOM_INVENTORY } from "@/lib/room-inventory";

export interface RoomConfig {
  tiers: PriceTiers | null; // null = «Ціна за запитом»
  count: number;
  tiersOverridden: boolean;
  countOverridden: boolean;
}

export const tiersKey = (hotel: string, slug: string) =>
  `room.${hotel}.${slug}.tiers`;
export const countKey = (hotel: string, slug: string) =>
  `room.${hotel}.${slug}.count`;

function staticConfig(key: string): RoomConfig {
  return {
    tiers: ROOM_PRICES[key] ?? null,
    count: ROOM_INVENTORY[key] ?? 0,
    tiersOverridden: false,
    countOverridden: false,
  };
}

function parseTiers(raw: unknown): PriceTiers | null {
  if (raw === null) return null;
  if (!raw || typeof raw !== "object") return null;
  const tiers: PriceTiers = {};
  for (const [gk, gv] of Object.entries(raw as Record<string, unknown>)) {
    const guests = Number(gk);
    const price = Number(gv);
    if (Number.isFinite(guests) && Number.isFinite(price) && price > 0) {
      tiers[guests] = price;
    }
  }
  return Object.keys(tiers).length ? tiers : null;
}

/** Full config for every known room key (`${hotel}:${slug}`), overrides applied. */
export async function getRoomConfigMap(): Promise<Record<string, RoomConfig>> {
  const out: Record<string, RoomConfig> = {};
  const keys = new Set([
    ...Object.keys(ROOM_PRICES),
    ...Object.keys(ROOM_INVENTORY),
  ]);
  for (const key of keys) out[key] = staticConfig(key);

  try {
    const rows = await prisma.siteContent.findMany({
      where: { key: { startsWith: "room." } },
      select: { key: true, value: true },
    });
    for (const r of rows) {
      const m = r.key.match(/^room\.([^.]+)\.(.+)\.(tiers|count)$/);
      if (!m) continue;
      const [, hotel, slug, field] = m;
      const mapKey = `${hotel}:${slug}`;
      if (!out[mapKey]) out[mapKey] = staticConfig(mapKey);

      let val: unknown = r.value;
      try {
        val = JSON.parse(r.value);
      } catch {
        /* stored as plain string */
      }

      if (field === "count") {
        const n =
          typeof val === "number" ? val : parseInt(String(val ?? ""), 10);
        if (Number.isFinite(n) && n >= 0) {
          out[mapKey].count = n;
          out[mapKey].countOverridden = true;
        }
      } else {
        out[mapKey].tiers = parseTiers(val);
        out[mapKey].tiersOverridden = true;
      }
    }
  } catch {
    /* DB unavailable — fall back to static defaults */
  }
  return out;
}

/** Just the overridden price tiers, keyed `${hotel}:${slug}`. For the booking dialog. */
export async function getPriceOverrides(): Promise<
  Record<string, PriceTiers | null>
> {
  const out: Record<string, PriceTiers | null> = {};
  try {
    const rows = await prisma.siteContent.findMany({
      where: { key: { startsWith: "room." } },
      select: { key: true, value: true },
    });
    for (const r of rows) {
      const m = r.key.match(/^room\.([^.]+)\.(.+)\.tiers$/);
      if (!m) continue;
      const [, hotel, slug] = m;
      let val: unknown = r.value;
      try {
        val = JSON.parse(r.value);
      } catch {
        /* ignore */
      }
      out[`${hotel}:${slug}`] = parseTiers(val);
    }
  } catch {
    /* ignore */
  }
  return out;
}

/** Resolved inventory count for one room (override → static). null = untracked. */
export async function resolvedInventory(
  hotelSlug: string | undefined,
  roomSlug: string | undefined
): Promise<number | null> {
  if (!hotelSlug || !roomSlug) return null;
  const key = `${hotelSlug}:${roomSlug}`;
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: countKey(hotelSlug, roomSlug) },
      select: { value: true },
    });
    if (row) {
      let val: unknown = row.value;
      try {
        val = JSON.parse(row.value);
      } catch {
        /* ignore */
      }
      const n = typeof val === "number" ? val : parseInt(String(val ?? ""), 10);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  } catch {
    /* ignore */
  }
  return ROOM_INVENTORY[key] ?? null;
}
