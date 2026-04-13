import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { BookingForm } from '../BookingForm';

export const dynamic = 'force-dynamic';

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string; checkIn?: string }>;
}) {
  const sp = await searchParams;
  const rooms = await prisma.hotelRoom.findMany({
    where: { active: true },
    orderBy: [{ pricePerNight: 'asc' }, { number: 'asc' }],
    select: { id: true, number: true, type: true, capacity: true, pricePerNight: true },
  });

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link
        href="/admin/hotel/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до списку
      </Link>

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Нове бронювання
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Створити вручну
        </h1>
        <p className="text-sm text-[#1a3d2e]/55 mt-2">
          Для клієнтів, що бронюють телефоном або офлайн
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-10 text-center text-sm text-[#1a3d2e]/60">
          Немає активних номерів. Спочатку{' '}
          <Link href="/admin/hotel/rooms/new" className="underline">
            створіть номер
          </Link>
          .
        </div>
      ) : (
        <BookingForm
          mode="create"
          rooms={rooms}
          initial={{ roomId: sp.roomId, checkIn: sp.checkIn }}
        />
      )}
    </div>
  );
}
