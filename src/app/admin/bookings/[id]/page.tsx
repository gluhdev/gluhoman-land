import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, Mail, Calendar, Users, Hash, MessageSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { StatusActions } from './StatusActions';
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

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        До списку заявок
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-display text-neutral-900">{booking.name}</h1>
          <span className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600 font-mono">
            #{booking.id.slice(0, 8)}
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          {SERVICE_LABEL[booking.service] ?? booking.service}
          {booking.hotelSlug && ` · ${HOTEL_LABEL[booking.hotelSlug] ?? booking.hotelSlug}`}
          {' · Подано '}
          {formatDateTime(booking.createdAt)}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-3">
          Статус
        </h2>
        <p className="text-sm text-neutral-700 mb-3">
          Поточний: <strong>{STATUS_LABEL[booking.status] ?? booking.status}</strong>
        </p>
        <StatusActions
          id={booking.id}
          current={booking.status as BookingStatusValue}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-4">
            Контакт
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <a
                href={`tel:${booking.phone}`}
                className="text-neutral-900 hover:underline"
              >
                {booking.phone}
              </a>
            </div>
            {booking.email && (
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
                <a
                  href={`mailto:${booking.email}`}
                  className="text-neutral-900 hover:underline"
                >
                  {booking.email}
                </a>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <span>{booking.guests} гостей</span>
            </div>
          </dl>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-4">
            Деталі бронювання
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
              <div>
                <div>З: {formatDate(booking.dateFrom)}</div>
                {booking.dateTo && <div>До: {formatDate(booking.dateTo)}</div>}
                {booking.time && <div>Час: {booking.time}</div>}
              </div>
            </div>
            {booking.hotelSlug && (
              <div className="flex items-start gap-2.5">
                <Hash className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" />
                <div>
                  <div>
                    Готель:{' '}
                    <strong>{HOTEL_LABEL[booking.hotelSlug] ?? booking.hotelSlug}</strong>
                  </div>
                  {booking.roomCategorySlug && (
                    <div>
                      Категорія: <strong>{booking.roomCategorySlug}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </dl>
        </div>
      </section>

      {booking.comment && (
        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-3">
            Коментар
          </h2>
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <MessageSquare className="w-4 h-4 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
              {booking.comment}
            </p>
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-3">
          Доставка повідомлень
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Telegram
            </div>
            <div className="font-medium">
              {DELIVERY_LABEL[booking.telegramStatus] ?? booking.telegramStatus}
            </div>
            {booking.telegramError && (
              <div className="mt-1 text-xs text-red-600">{booking.telegramError}</div>
            )}
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Email
            </div>
            <div className="font-medium">
              {DELIVERY_LABEL[booking.emailStatus] ?? booking.emailStatus}
            </div>
            {booking.emailError && (
              <div className="mt-1 text-xs text-red-600">{booking.emailError}</div>
            )}
          </div>
        </div>
      </section>

      {(booking.ipAddress || booking.userAgent) && (
        <section className="text-xs text-neutral-500 space-y-1">
          {booking.ipAddress && <p>IP: {booking.ipAddress}</p>}
          {booking.userAgent && <p className="line-clamp-1">UA: {booking.userAgent}</p>}
        </section>
      )}
    </div>
  );
}
