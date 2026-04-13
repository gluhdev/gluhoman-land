import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, User, Calendar, Bed, Users, Mail, MessageSquare, CreditCard } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { ROOM_TYPE_LABEL, getNights } from '@/types/booking';
import { BookingStatusActions } from './BookingStatusActions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Сплачено',
  confirmed: 'Підтверджено',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};

const PAY_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Оплачено',
  failed: 'Помилка',
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.hotelBooking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking) notFound();

  const nights = getNights(booking.checkIn.toISOString(), booking.checkOut.toISOString());

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/hotel/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до списку
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Бронювання
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">
            №{booking.number}
          </h1>
          <p className="text-sm text-[#1a3d2e]/55 mt-1">
            Створено: {booking.createdAt.toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              booking.paymentStatus === 'paid'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : booking.paymentStatus === 'failed'
                ? 'bg-red-100 text-red-900 border-red-200'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            {PAY_LABEL[booking.paymentStatus] ?? booking.paymentStatus}
          </span>
          <p className="font-display text-3xl font-semibold text-[#1a3d2e] tabular-nums">
            {formatPrice(booking.total)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">
              Деталі бронювання
            </h2>
            <div className="space-y-3">
              {booking.room && (
                <DetailRow
                  icon={<Bed className="h-3.5 w-3.5" />}
                  label="Номер"
                  value={`${booking.room.number} · ${ROOM_TYPE_LABEL[booking.room.type] ?? booking.room.type} · ${booking.room.pricePerNight} ₴/ніч`}
                />
              )}
              <DetailRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Заїзд → Виїзд"
                value={`${booking.checkIn.toLocaleDateString('uk-UA', { dateStyle: 'long' })} → ${booking.checkOut.toLocaleDateString('uk-UA', { dateStyle: 'long' })} (${nights} ${nights === 1 ? 'ніч' : nights < 5 ? 'ночі' : 'ночей'})`}
              />
              <DetailRow icon={<Users className="h-3.5 w-3.5" />} label="Гостей" value={booking.guests.toString()} />
            </div>
          </div>

          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">Клієнт</h2>
            <div className="space-y-3">
              <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Ім'я" value={booking.customerName} />
              <DetailRow
                icon={<Phone className="h-3.5 w-3.5" />}
                label="Телефон"
                value={
                  <a href={`tel:${booking.customerPhone}`} className="hover:underline">
                    {booking.customerPhone}
                  </a>
                }
              />
              {booking.customerEmail && (
                <DetailRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={
                    <a href={`mailto:${booking.customerEmail}`} className="hover:underline">
                      {booking.customerEmail}
                    </a>
                  }
                />
              )}
              {booking.comment && (
                <DetailRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Коментар" value={booking.comment} />
              )}
              {booking.paymentStatus === 'paid' && (
                <DetailRow icon={<CreditCard className="h-3.5 w-3.5" />} label="Оплата" value="LiqPay" />
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-1">Статус</h2>
            <p className="text-xs text-[#1a3d2e]/55 mb-4">
              Поточний: <strong className="text-[#1a3d2e]">{STATUS_LABEL[booking.status] ?? booking.status}</strong>
            </p>
            <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-7 h-7 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">
          {label}
        </p>
        <div className="text-[#1a3d2e]">{value}</div>
      </div>
    </div>
  );
}
