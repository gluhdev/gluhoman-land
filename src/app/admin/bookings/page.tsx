import Link from 'next/link';
import { Phone, Calendar, Users, Mail, MessageSquare } from 'lucide-react';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує',
  CONFIRMED: 'Підтверджено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900 border-amber-200',
  CONFIRMED: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  COMPLETED: 'bg-blue-100 text-blue-900 border-blue-200',
  CANCELLED: 'bg-neutral-100 text-neutral-700 border-neutral-200',
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

const STATUS_FILTERS = [
  { id: 'all', label: 'Усі' },
  { id: 'PENDING', label: 'Очікують' },
  { id: 'CONFIRMED', label: 'Підтверджені' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'CANCELLED', label: 'Скасовані' },
];

const HOTEL_FILTERS = [
  { id: 'all', label: 'Усі готелі' },
  { id: 'aquapark', label: 'Аквапарк' },
  { id: 'central', label: 'Центральний' },
  { id: 'cottages', label: 'Будиночки' },
];

const SERVICE_FILTERS = [
  { id: 'all', label: 'Усі послуги' },
  { id: 'HOTEL', label: 'Готель' },
  { id: 'AQUAPARK', label: 'Аквапарк' },
  { id: 'RESTAURANT', label: 'Ресторан' },
  { id: 'SAUNA', label: 'Лазня' },
];

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default async function AdminBookingsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    service?: string;
    hotel?: string;
    from?: string;
    to?: string;
    q?: string;
  }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? 'all';
  const service = sp.service ?? 'all';
  const hotel = sp.hotel ?? 'all';

  const where: Prisma.BookingWhereInput = {};
  if (status !== 'all')
    where.status = status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  if (service !== 'all')
    where.service = service as 'HOTEL' | 'AQUAPARK' | 'RESTAURANT' | 'SAUNA';
  if (hotel !== 'all') where.hotelSlug = hotel;
  if (sp.from || sp.to) {
    const and: Prisma.BookingWhereInput[] = [];
    if (sp.from) and.push({ dateFrom: { gte: new Date(sp.from) } });
    if (sp.to) and.push({ dateFrom: { lte: new Date(sp.to) } });
    where.AND = and;
  }
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q } },
      { phone: { contains: sp.q } },
      { email: { contains: sp.q } },
    ];
  }

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ]);

  const totalByStatus = counts.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = c._count.status;
    return acc;
  }, {});
  const totalAll = Object.values(totalByStatus).reduce((a, b) => a + b, 0);

  function makeFilterHref(
    overrides: Record<string, string | undefined>
  ): string {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      status: sp.status,
      service: sp.service,
      hotel: sp.hotel,
      from: sp.from,
      to: sp.to,
      q: sp.q,
      ...overrides,
    };
    for (const [k, v] of Object.entries(current)) {
      if (v && v !== 'all') params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/admin/bookings?${qs}` : '/admin/bookings';
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display text-neutral-900">Заявки із сайту</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Бронювання, надіслані через форми сайту. Усього{' '}
            <strong>{totalAll}</strong>, очікує підтвердження{' '}
            <strong>{totalByStatus.PENDING ?? 0}</strong>.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] items-end">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-500">
          Пошук
          <input
            type="text"
            name="q"
            defaultValue={sp.q ?? ''}
            placeholder="Імʼя, телефон або email"
            className="border border-neutral-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-500">
          З дати
          <input
            type="date"
            name="from"
            defaultValue={sp.from ?? ''}
            className="border border-neutral-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-neutral-500">
          По дату
          <input
            type="date"
            name="to"
            defaultValue={sp.to ?? ''}
            className="border border-neutral-300 px-3 py-2 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.service && <input type="hidden" name="service" value={sp.service} />}
        {sp.hotel && <input type="hidden" name="hotel" value={sp.hotel} />}
        <button
          type="submit"
          className="px-5 py-2 bg-neutral-900 text-white rounded-md text-sm hover:bg-neutral-700 transition-colors"
        >
          Застосувати
        </button>
      </form>

      <div className="mb-3 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.id}
            href={makeFilterHref({ status: f.id })}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              status === f.id
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f.label}
            {f.id !== 'all' && totalByStatus[f.id] != null && (
              <span className="ml-1.5 opacity-75">({totalByStatus[f.id]})</span>
            )}
          </Link>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {SERVICE_FILTERS.map((f) => (
          <Link
            key={f.id}
            href={makeFilterHref({ service: f.id })}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              service === f.id
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {HOTEL_FILTERS.map((f) => (
          <Link
            key={f.id}
            href={makeFilterHref({ hotel: f.id })}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              hotel === f.id
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* List */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-10 text-center text-neutral-500">
          За вибраними фільтрами заявок не знайдено.
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/admin/bookings/${b.id}`}
                className="block bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-display text-lg text-neutral-900">
                        {b.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wide border ${
                          STATUS_COLOR[b.status] ?? STATUS_COLOR.PENDING
                        }`}
                      >
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                        {SERVICE_LABEL[b.service] ?? b.service}
                      </span>
                      {b.hotelSlug && (
                        <span className="text-[11px] uppercase tracking-wide text-emerald-800">
                          {HOTEL_LABEL[b.hotelSlug] ?? b.hotelSlug}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 flex-wrap mb-2">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {b.phone}
                      </span>
                      {b.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {b.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {b.guests}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(b.dateFrom)}
                        {b.dateTo ? ` – ${formatDate(b.dateTo)}` : ''}
                      </span>
                    </div>
                    {b.roomCategorySlug && (
                      <p className="text-xs text-neutral-500 mb-1">
                        Категорія: <strong>{b.roomCategorySlug}</strong>
                      </p>
                    )}
                    {b.comment && (
                      <p className="text-sm text-neutral-700 line-clamp-2 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 mt-1 flex-shrink-0 text-neutral-400" />
                        {b.comment}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-neutral-500 flex-shrink-0">
                    <div>#{b.id.slice(0, 8)}</div>
                    <div className="mt-1">{formatDate(b.createdAt)}</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
