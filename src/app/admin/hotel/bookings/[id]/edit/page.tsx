import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { BookingForm } from '../../BookingForm';

export const dynamic = 'force-dynamic';

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [booking, rooms] = await Promise.all([
    prisma.hotelBooking.findUnique({ where: { id }, include: { room: true } }),
    prisma.hotelRoom.findMany({
      where: { active: true },
      orderBy: [{ pricePerNight: 'asc' }, { number: 'asc' }],
      select: { id: true, number: true, type: true, capacity: true, pricePerNight: true },
    }),
  ]);

  if (!booking) notFound();

  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return (
      <div className="p-6 lg:p-10 max-w-4xl">
        <Link
          href={`/admin/hotel/bookings/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Назад
        </Link>
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-10 text-center text-sm text-[#1a3d2e]/60">
          Бронювання завершене або скасоване — редагування недоступне.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link
        href={`/admin/hotel/bookings/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до бронювання
      </Link>

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Редагування
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">
          Бронювання №{booking.number}
        </h1>
      </div>

      <BookingForm
        mode="edit"
        bookingId={booking.id}
        rooms={rooms}
        initial={{
          roomId: booking.roomId,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          checkIn: toISODate(booking.checkIn),
          checkOut: toISODate(booking.checkOut),
          guests: booking.guests,
          comment: booking.comment,
        }}
      />
    </div>
  );
}
