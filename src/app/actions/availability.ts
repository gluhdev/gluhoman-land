"use server";

import { prisma } from "@/lib/prisma";
import { resolvedInventory, getPriceOverrides } from "@/lib/room-config";
import type { PriceTiers } from "@/lib/room-prices";

/**
 * Admin price overrides (from /admin/rooms), keyed `${hotel}:${slug}`.
 * The booking dialog merges these over the static room-prices.ts defaults so
 * edits made in the admin take effect immediately. A key present with value
 * null means «Ціна за запитом».
 */
export async function getRoomPriceOverrides(): Promise<
  Record<string, PriceTiers | null>
> {
  return getPriceOverrides();
}

/**
 * Load every room-price string from SiteContent in one query, keyed by the
 * `*.price` content key. Used by the booking dialog's room picker so each
 * room card shows its admin-editable price. Missing keys simply won't appear
 * (caller falls back to a default label).
 */
export async function getAllRoomPrices(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteContent.findMany({
      where: { key: { endsWith: ".price" } },
      select: { key: true, value: true },
    });
    const out: Record<string, string> = {};
    for (const r of rows) {
      let parsed: unknown = r.value;
      try {
        parsed = JSON.parse(r.value);
      } catch {
        /* value stored as plain string */
      }
      if (typeof parsed === "string" && parsed.trim()) out[r.key] = parsed;
    }
    return out;
  } catch {
    return {};
  }
}

// Grace window for an unpaid pay-to-confirm hold before it stops counting
// against inventory. Matches the legacy hotel-availability stale sweep.
const STALE_UNPAID_MS = 30 * 60 * 1000;

export interface AvailabilityResult {
  ok: boolean;
  /** total rooms of this category */
  total: number;
  /** rooms already requested/booked for the overlapping range */
  booked: number;
  /** total - booked, clamped at 0 */
  available: number;
  /** true when this category has known inventory */
  tracked: boolean;
}

/**
 * Compute real occupancy for a room category over a date range.
 *
 * Counts existing Booking rows for the same hotelSlug+roomCategorySlug whose
 * [dateFrom, dateTo) overlaps the requested [from, to) and that are not
 * CANCELLED. Returns remaining availability against the configured inventory.
 *
 * Overlap rule: existing.dateFrom < requested.to AND existing.dateTo > requested.from
 */
export async function checkAvailability(
  hotelSlug: string,
  roomCategorySlug: string,
  fromISO: string,
  toISO: string
): Promise<AvailabilityResult> {
  const total = await resolvedInventory(hotelSlug, roomCategorySlug);
  if (total == null) {
    return { ok: true, total: 0, booked: 0, available: 0, tracked: false };
  }

  const from = new Date(fromISO);
  const to = toISO ? new Date(toISO) : new Date(from.getTime() + 86400000);

  // Pay-to-confirm holds that were never paid must not block inventory forever.
  // A PENDING + unpaid booking that carries a price (totalAmount) and is older
  // than the grace window is an abandoned checkout — exclude it so the room
  // becomes bookable again. (Request bookings have no totalAmount and genuine
  // PENDING admin-managed holds are kept.)
  const staleCutoff = new Date(Date.now() - STALE_UNPAID_MS);

  try {
    const booked = await prisma.booking.count({
      where: {
        hotelSlug,
        roomCategorySlug,
        status: { not: "CANCELLED" },
        dateFrom: { lt: to },
        OR: [{ dateTo: { gt: from } }, { dateTo: null, dateFrom: { gte: from } }],
        NOT: {
          status: "PENDING",
          paymentStatus: "unpaid",
          totalAmount: { not: null },
          createdAt: { lt: staleCutoff },
        },
      },
    });

    const available = Math.max(0, total - booked);
    return { ok: true, total, booked, available, tracked: true };
  } catch {
    return { ok: false, total, booked: 0, available: total, tracked: true };
  }
}
