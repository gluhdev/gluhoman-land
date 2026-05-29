import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Users,
  Hash,
  MessageSquare,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { StatusActions } from './StatusActions';
import { PaymentLinkPanel } from './PaymentLinkPanel';
import { suggestedReservationAmount, nightsBetween } from '@/lib/room-config';
import type { BookingStatusValue } from '../actions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує',
  CONFIRMED: 'Підтверджено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

const SERVICE_LABEL: Record<string, string> = {
  HOTEL: 'Готель',
  AQUAPARK: 'Аквапарк',
  RESTAURANT: 'Ресторан',
  SAUNA: 'Лазня',
};

const HOTEL_LABEL: Record<string, string> = {
  aquapark: 'Готель-Аквапарк',
  central: 'Центральний Готель',
  cottages: 'Будиночки',
};

const DELIVERY_LABEL: Record<string, string> = {
  PENDING: 'Очікує',
  SENT: 'Доставлено',
  FAILED: 'Помилка',
};

const DELIVERY_BADGE: Record<string, string> = {
  PENDING: 'bg-[#e6d9b8]/30 text-[#7a5d20] border-[#c9a95c]/45',
  SENT: 'bg-[#1a3d2e] text-[#e6d9b8] border-[#1a3d2e]',
  FAILED: 'bg-[#7a1d1d]/10 text-[#7a1d1d] border-[#7a1d1d]/30',
};

function formatDateTime(d: Date | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  const nights = nightsBetween(booking.dateFrom, booking.dateTo);
  const suggestedAmount =
    booking.service === 'HOTEL'
      ? await suggestedReservationAmount(
          booking.hotelSlug ?? undefined,
          booking.roomCategorySlug ?? undefined,
          booking.guests,
          nights
        )
      : 0;

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/65 hover:text-[#1a3d2e] mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        До списку заявок
      </Link>

      {/* Header */}
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          Заявка{' '}
          <span className="font-display italic normal-case tracking-normal text-[#1a3d2e]/45">
            · #{booking.id.slice(0, 8)}
          </span>
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          {booking.name}
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
        <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 font-medium">
          {SERVICE_LABEL[booking.service] ?? booking.service}
          {booking.hotelSlug &&
            ` · ${HOTEL_LABEL[booking.hotelSlug] ?? booking.hotelSlug}`}
          <span className="text-[#1a3d2e]/30"> · </span>
          <span className="normal-case tracking-normal font-display italic text-[#1a3d2e]/55">
            подано {formatDateTime(booking.createdAt)}
          </span>
        </p>
      </header>

      {/* Status */}
      <section className="mb-10 bg-white border border-[#1a3d2e]/10 p-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            Статус
          </p>
          <p className="text-sm text-[#1a3d2e]/75">
            Поточний:{' '}
            <strong className="font-display text-[#1a3d2e] not-italic">
              {STATUS_LABEL[booking.status] ?? booking.status}
            </strong>
          </p>
        </div>
        <StatusActions
          id={booking.id}
          current={booking.status as BookingStatusValue}
        />
      </section>

      {booking.service === 'HOTEL' && (
        <PaymentLinkPanel
          bookingId={booking.id}
          currentAmount={booking.totalAmount ?? null}
          suggestedAmount={suggestedAmount}
          paymentStatus={booking.paymentStatus}
        />
      )}

      {/* Two-column meta */}
      <section className="grid md:grid-cols-2 gap-px bg-[#1a3d2e]/10 border border-[#1a3d2e]/10 mb-10">
        <div className="bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium mb-5">
            Контакт
          </p>
          <dl className="space-y-3 text-sm text-[#0f1f18]/85">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 mt-0.5 text-[#1a3d2e]/45 flex-shrink-0" />
              <a
                href={`tel:${booking.phone}`}
                className="text-[#1a3d2e] hover:underline underline-offset-2"
              >
                {booking.phone}
              </a>
            </div>
            {booking.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-[#1a3d2e]/45 flex-shrink-0" />
                <a
                  href={`mailto:${booking.email}`}
                  className="text-[#1a3d2e] hover:underline underline-offset-2"
                >
                  {booking.email}
                </a>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 mt-0.5 text-[#1a3d2e]/45 flex-shrink-0" />
              <span>{booking.guests} гостей</span>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium mb-5">
            Деталі бронювання
          </p>
          <dl className="space-y-3 text-sm text-[#0f1f18]/85">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 mt-0.5 text-[#1a3d2e]/45 flex-shrink-0" />
              <div>
                <div>З: {formatDate(booking.dateFrom)}</div>
                {booking.dateTo && <div>До: {formatDate(booking.dateTo)}</div>}
                {booking.time && <div>Час: {booking.time}</div>}
              </div>
            </div>
            {booking.hotelSlug && (
              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 mt-0.5 text-[#1a3d2e]/45 flex-shrink-0" />
                <div>
                  <div>
                    Готель:{' '}
                    <strong className="text-[#1a3d2e]">
                      {HOTEL_LABEL[booking.hotelSlug] ?? booking.hotelSlug}
                    </strong>
                  </div>
                  {booking.roomCategorySlug && (
                    <div>
                      Категорія:{' '}
                      <strong className="font-display italic text-[#1a3d2e]">
                        {booking.roomCategorySlug}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </dl>
        </div>
      </section>

      {booking.comment && (
        <section className="mb-10 bg-white border border-[#1a3d2e]/10 p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium mb-4 inline-flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#1a3d2e]/45" />
            Коментар
          </p>
          <p className="text-sm text-[#0f1f18]/85 leading-[1.7] whitespace-pre-wrap font-display italic">
            {booking.comment}
          </p>
        </section>
      )}

      {/* Delivery channels */}
      <section className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium mb-4">
          Доставка повідомлень
        </p>
        <div className="grid sm:grid-cols-2 gap-px bg-[#1a3d2e]/10 border border-[#1a3d2e]/10">
          <DeliveryCard
            label="Telegram"
            status={booking.telegramStatus}
            error={booking.telegramError}
          />
          <DeliveryCard
            label="Email"
            status={booking.emailStatus}
            error={booking.emailError}
          />
        </div>
      </section>

      {(booking.ipAddress || booking.userAgent) && (
        <section className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/40 font-medium space-y-1 mb-4">
          {booking.ipAddress && <p>IP · {booking.ipAddress}</p>}
          {booking.userAgent && (
            <p className="line-clamp-1 normal-case tracking-normal font-display italic">
              UA · {booking.userAgent}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function DeliveryCard({
  label,
  status,
  error,
}: {
  label: string;
  status: string;
  error: string | null;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 font-medium">
          {label}
        </p>
        <span
          className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] border ${
            DELIVERY_BADGE[status] ?? DELIVERY_BADGE.PENDING
          }`}
        >
          {DELIVERY_LABEL[status] ?? status}
        </span>
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#7a1d1d] font-display italic">{error}</p>
      )}
    </div>
  );
}
