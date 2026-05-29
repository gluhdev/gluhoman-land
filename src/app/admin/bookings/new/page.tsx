import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { ADMIN_HOTELS, hotelLabel } from '@/lib/admin-hotels';
import { HOTEL_CATALOG } from '@/lib/hotel-catalog';
import { ManualBookingForm, type HotelOption } from './ManualBookingForm';

export const dynamic = 'force-dynamic';

export default async function NewBookingPage() {
  const session = await auth();
  const scopedHotel = session?.user?.hotelSlug ?? null;

  const t = await getTranslations({ locale: 'uk' });

  const hotels: HotelOption[] = HOTEL_CATALOG.filter(
    (h) => !scopedHotel || h.slug === scopedHotel
  ).map((h) => ({
    slug: h.slug,
    label: hotelLabel(h.slug),
    rooms: h.rooms.map((r) => ({
      slug: r.slug,
      name: t(r.nameKey as Parameters<typeof t>[0]),
    })),
  }));

  return (
    <ManualBookingForm
      hotels={hotels}
      scopedHotel={scopedHotel}
      allHotels={ADMIN_HOTELS}
    />
  );
}
