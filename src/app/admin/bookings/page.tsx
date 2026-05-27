import Link from 'next/link';
import { Phone, Calendar, Users, Mail, MessageSquare, Search } from 'lucide-react';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує',
  CONFIRMED: 'Підтверджено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

// Status badges in brand palette (forest green + warm gold + cream)
const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-[#e6d9b8]/25 text-[#7a5d20] border-[#c9a95c]/50',
  CONFIRMED: 'bg-[#1a3d2e]/10 text-[#1a3d2e] border-[#1a3d2e]/25',
  COMPLETED: 'bg-[#1a3d2e] text-[#e6d9b8] border-[#1a3d2e]',
  CANCELLED: 'bg-[#0f1f18]/5 text-[#0f1f18]/50 border-[#0f1f18]/15',
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
      {/* Header */}
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          CRM · Замовлення з сайту
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Заявки <span className="italic text-[#1a3d2e]/75">на бронювання</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
        <p className="mt-6 text-sm text-[#1a3d2e]/70 max-w-xl leading-relaxed">
          Бронювання, надіслані гостями через форми сайту. Усього{' '}
          <strong className="font-display text-[#1a3d2e]">{totalAll}</strong>, очікує
          підтвердження{' '}
          <strong className="font-display text-[#1a3d2e]">
            {totalByStatus.PENDING ?? 0}
          </strong>
          .
        </p>
      </header>

      {/* Search form (brand panel) */}
      <form className="mb-8 bg-white border border-[#1a3d2e]/10 p-5 lg:p-6 grid gap-4 md:grid-cols-[1fr_auto_auto_auto] items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            Пошук
          </span>
          <span className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#1a3d2e]/40" />
            <input
              type="text"
              name="q"
              defaultValue={sp.q ?? ''}
              placeholder="Імʼя, телефон або email"
              className="w-full pl-9 pr-3 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] placeholder:text-[#1a3d2e]/35 focus:outline-none focus:border-[#1a3d2e]/45 transition-colors"
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            З дати
          </span>
          <input
            type="date"
            name="from"
            defaultValue={sp.from ?? ''}
            className="px-3 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] focus:outline-none focus:border-[#1a3d2e]/45 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            По дату
          </span>
          <input
            type="date"
            name="to"
            defaultValue={sp.to ?? ''}
            className="px-3 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] focus:outline-none focus:border-[#1a3d2e]/45 transition-colors"
          />
        </label>
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.service && <input type="hidden" name="service" value={sp.service} />}
        {sp.hotel && <input type="hidden" name="hotel" value={sp.hotel} />}
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#1a3d2e] text-[#e6d9b8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors"
        >
          Застосувати
        </button>
      </form>

      {/* Filter pills — three rows by dimension */}
      <FilterRow label="Статус">
        {STATUS_FILTERS.map((f) => (
          <FilterPill
            key={f.id}
            href={makeFilterHref({ status: f.id })}
            active={status === f.id}
            count={
              f.id !== 'all' && totalByStatus[f.id] != null
                ? totalByStatus[f.id]
                : undefined
            }
          >
            {f.label}
          </FilterPill>
        ))}
      </FilterRow>

      <FilterRow label="Послуга">
        {SERVICE_FILTERS.map((f) => (
          <FilterPill
            key={f.id}
            href={makeFilterHref({ service: f.id })}
            active={service === f.id}
          >
            {f.label}
          </FilterPill>
        ))}
      </FilterRow>

      <FilterRow label="Готель">
        {HOTEL_FILTERS.map((f) => (
          <FilterPill
            key={f.id}
            href={makeFilterHref({ hotel: f.id })}
            active={hotel === f.id}
          >
            {f.label}
          </FilterPill>
        ))}
      </FilterRow>

      {/* List */}
      {bookings.length === 0 ? (
        <div className="mt-10 bg-white border border-[#1a3d2e]/10 px-10 py-16 text-center">
          <p className="font-display italic text-xl text-[#1a3d2e]/50">
            За вибраними фільтрами заявок не знайдено.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-2 bg-white border border-[#1a3d2e]/10">
          {bookings.map((b) => (
            <li key={b.id} className="border-b border-[#1a3d2e]/10 last:border-b-0">
              <Link
                href={`/admin/bookings/${b.id}`}
                className="block px-5 lg:px-6 py-5 hover:bg-[#1a3d2e]/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-display text-lg text-[#1a3d2e]">
                        {b.name}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] border ${
                          STATUS_BADGE[b.status] ?? STATUS_BADGE.PENDING
                        }`}
                      >
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 font-medium">
                        {SERVICE_LABEL[b.service] ?? b.service}
                      </span>
                      {b.hotelSlug && (
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#7a5d20] font-medium">
                          · {HOTEL_LABEL[b.hotelSlug] ?? b.hotelSlug}
                        </span>
                      )}
                    </div>

                    {/* Contact + meta */}
                    <div className="flex items-center gap-4 text-sm text-[#0f1f18]/70 flex-wrap mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1a3d2e]/50" />
                        {b.phone}
                      </span>
                      {b.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#1a3d2e]/50" />
                          {b.email}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1a3d2e]/50" />
                        {b.guests}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1a3d2e]/50" />
                        {formatDate(b.dateFrom)}
                        {b.dateTo ? ` – ${formatDate(b.dateTo)}` : ''}
                      </span>
                    </div>

                    {b.roomCategorySlug && (
                      <p className="text-[12px] text-[#1a3d2e]/65 mb-1">
                        <span className="uppercase tracking-[0.18em] font-medium">
                          Категорія:
                        </span>{' '}
                        <span className="font-display italic">
                          {b.roomCategorySlug}
                        </span>
                      </p>
                    )}

                    {b.comment && (
                      <p className="text-sm text-[#0f1f18]/75 line-clamp-2 flex items-start gap-1.5 leading-relaxed">
                        <MessageSquare className="w-3.5 h-3.5 mt-1 flex-shrink-0 text-[#1a3d2e]/40" />
                        {b.comment}
                      </p>
                    )}
                  </div>

                  {/* Right meta */}
                  <div className="text-right text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/45 font-medium flex-shrink-0">
                    <div className="font-display text-sm normal-case tracking-normal text-[#1a3d2e]/65">
                      #{b.id.slice(0, 8)}
                    </div>
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

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-3 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/45 font-medium min-w-[60px]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium border transition-colors ${
        active
          ? 'bg-[#1a3d2e] text-[#e6d9b8] border-[#1a3d2e]'
          : 'bg-white text-[#1a3d2e]/75 border-[#1a3d2e]/15 hover:bg-[#1a3d2e]/5 hover:border-[#1a3d2e]/35 hover:text-[#1a3d2e]'
      }`}
    >
      {children}
      {count != null && (
        <span className={active ? 'ml-1.5 opacity-70' : 'ml-1.5 text-[#1a3d2e]/45'}>
          ({count})
        </span>
      )}
    </Link>
  );
}
