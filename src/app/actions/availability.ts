"use server";

import { prisma } from "@/lib/prisma";
import { roomInventory } from "@/lib/room-inventory";

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
  const total = roomInventory(hotelSlug, roomCategorySlug);
  if (total == null) {
    return { ok: true, total: 0, booked: 0, available: 0, tracked: false };
  }

  const from = new Date(fromISO);
  const to = toISO ? new Date(toISO) : new Date(from.getTime() + 86400000);

  try {
    const booked = await prisma.booking.count({
      where: {
        hotelSlug,
        roomCategorySlug,
        status: { not: "CANCELLED" },
        dateFrom: { lt: to },
        OR: [{ dateTo: { gt: from } }, { dateTo: null, dateFrom: { gte: from } }],
      },
    });

    const available = Math.max(0, total - booked);
    return { ok: true, total, booked, available, tracked: true };
  } catch {
    return { ok: false, total, booked: 0, available: total, tracked: true };
  }
}
