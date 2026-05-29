import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { hotelLabel } from '@/lib/admin-hotels';
import { HOTEL_CATALOG } from '@/lib/hotel-catalog';
import { PayClient } from './PayClient';

export const dynamic = 'force-dynamic';

function fmt(d: Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking || !booking.totalAmount || booking.totalAmount <= 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 pt-28 md:pt-36 pb-20">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl text-[#1a3d2e]">
            Посилання недійсне
          </h1>
          <p className="mt-4 text-[#1a3d2e]/70 leading-relaxed">
            Це посилання на оплату не знайдено або термін його дії минув.
            Зверніться до адміністратора готелю.
          </p>
        </div>
      </div>
    );
  }

  const t = await getTranslations({ locale });
  const room = HOTEL_CATALOG.find((h) => h.slug === booking.hotelSlug)?.rooms.find(
    (r) => r.slug === booking.roomCategorySlug
  );
  const roomName = room ? t(room.nameKey as Parameters<typeof t>[0]) : '';

  return (
    <PayClient
      id={booking.id}
      hotel={hotelLabel(booking.hotelSlug)}
      roomName={roomName}
      guestName={booking.name.split(' ')[0]}
      dateFrom={fmt(booking.dateFrom)}
      dateTo={booking.dateTo ? fmt(booking.dateTo) : null}
      guests={booking.guests}
      amount={booking.totalAmount}
      paid={booking.paymentStatus === 'paid'}
      locale={locale}
    />
  );
}
