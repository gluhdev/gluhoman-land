import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { hotelLabel } from '@/lib/admin-hotels';
import { HOTEL_CATALOG } from '@/lib/hotel-catalog';
import { ROOM_PRICES } from '@/lib/room-prices';
import { getRoomConfigMap } from '@/lib/room-config';
import { RoomsManager, type HotelGroup } from './RoomsManager';

export const dynamic = 'force-dynamic';

function maxGuestsFor(key: string, mergedTiers: Record<number, number> | null): number {
  const staticKeys = Object.keys(ROOM_PRICES[key] ?? {}).map(Number);
  const mergedKeys = Object.keys(mergedTiers ?? {}).map(Number);
  return Math.max(4, ...staticKeys, ...mergedKeys);
}

export default async function AdminRoomsPage() {
  const session = await auth();
  const scopedHotel = session?.user?.hotelSlug ?? null;

  const t = await getTranslations({ locale: 'uk' });
  const configMap = await getRoomConfigMap();

  const groups: HotelGroup[] = HOTEL_CATALOG.filter(
    (h) => !scopedHotel || h.slug === scopedHotel
  ).map((h) => ({
    slug: h.slug,
    label: hotelLabel(h.slug),
    rooms: h.rooms.map((r) => {
      const key = `${h.slug}:${r.slug}`;
      const cfg = configMap[key] ?? {
        tiers: null,
        count: 0,
        tiersOverridden: false,
        countOverridden: false,
      };
      return {
        slug: r.slug,
        name: t(r.nameKey as Parameters<typeof t>[0]),
        photo: r.photo,
        tiers: cfg.tiers,
        count: cfg.count,
        maxGuests: Math.min(6, maxGuestsFor(key, cfg.tiers)),
      };
    }),
  }));

  return <RoomsManager groups={groups} scopedHotel={scopedHotel} />;
}
