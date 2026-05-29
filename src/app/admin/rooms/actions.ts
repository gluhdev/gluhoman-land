'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { isHotelSlug } from '@/lib/admin-hotels';
import { tiersKey, countKey } from '@/lib/room-config';
import type { PriceTiers } from '@/lib/room-prices';

type Result = { ok: boolean; error?: string };

/** Caller may edit a hotel if super-admin, or a hotel-admin of that same hotel. */
async function canEditHotel(hotel: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const scoped = session.user.hotelSlug;
  if (!scoped) return true; // super-admin
  return scoped === hotel;
}

export async function saveRoomConfig(input: {
  hotel: string;
  slug: string;
  /** map guests→price; empty object or onRequest=true means «Ціна за запитом» */
  tiers: Record<string, number>;
  onRequest: boolean;
  count: number;
}): Promise<Result> {
  const { hotel, slug, onRequest } = input;
  if (!isHotelSlug(hotel)) return { ok: false, error: 'Невідомий готель' };
  if (!slug) return { ok: false, error: 'Missing room' };
  if (!(await canEditHotel(hotel))) return { ok: false, error: 'Немає доступу' };

  const count = Number.isFinite(input.count) ? Math.max(0, Math.trunc(input.count)) : 0;

  // Build the tiers object (drop non-positive / invalid entries).
  let tiersValue: PriceTiers | null = null;
  if (!onRequest) {
    const t: PriceTiers = {};
    for (const [g, p] of Object.entries(input.tiers)) {
      const guests = Number(g);
      const price = Number(p);
      if (Number.isFinite(guests) && guests > 0 && Number.isFinite(price) && price > 0) {
        t[guests] = Math.trunc(price);
      }
    }
    tiersValue = Object.keys(t).length ? t : null;
  }

  try {
    await prisma.$transaction([
      prisma.siteContent.upsert({
        where: { key: tiersKey(hotel, slug) },
        create: {
          key: tiersKey(hotel, slug),
          type: 'text',
          value: JSON.stringify(tiersValue),
        },
        update: { value: JSON.stringify(tiersValue) },
      }),
      prisma.siteContent.upsert({
        where: { key: countKey(hotel, slug) },
        create: {
          key: countKey(hotel, slug),
          type: 'number',
          value: JSON.stringify(count),
        },
        update: { value: JSON.stringify(count) },
      }),
    ]);
    revalidatePath('/admin/rooms');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка збереження' };
  }
}
