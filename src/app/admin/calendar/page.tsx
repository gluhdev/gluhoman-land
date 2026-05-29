import Link from 'next/link';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ADMIN_HOTELS, hotelLabel, isHotelSlug } from '@/lib/admin-hotels';
import { HOTEL_CATALOG } from '@/lib/hotel-catalog';
import { getRoomConfigMap } from '@/lib/room-config';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-[#e6d9b8]/25 text-[#7a5d20] border-[#c9a95c]/50',
  CONFIRMED: 'bg-[#1a3d2e]/10 text-[#1a3d2e] border-[#1a3d2e]/25',
  COMPLETED: 'bg-[#1a3d2e] text-[#e6d9b8] border-[#1a3d2e]',
  CANCELLED: 'bg-[#0f1f18]/5 text-[#0f1f18]/50 border-[#0f1f18]/15',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує',
  CONFIRMED: 'Підтверджено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};
const WEEKDAY = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function parseMonth(raw: string | undefined): { year: number; month: number } {
  const now = new Date();
  if (raw && /^\d{4}-\d{1,2}$/.test(raw)) {
    const [y, m] = raw.split('-').map(Number);
    if (m >= 1 && m <= 12) return { year: y, month: m - 1 };
  }
  return { year: now.getFullYear(), month: now.getMonth() };
}
function monthParam(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string; month?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const scopedHotel = session?.user?.hotelSlug ?? null;

  const requested = sp.hotel && isHotelSlug(sp.hotel) ? sp.hotel : null;
  const hotel = scopedHotel ?? requested ?? ADMIN_HOTELS[0].slug;
  const { year, month } = parseMonth(sp.month);

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const t = await getTranslations({ locale: 'uk' });
  const configMap = await getRoomConfigMap();

  const catalog = HOTEL_CATALOG.find((h) => h.slug === hotel);
  const categories = (catalog?.rooms ?? []).map((r) => ({
    slug: r.slug,
    name: t(r.nameKey as Parameters<typeof t>[0]),
    inventory: configMap[`${hotel}:${r.slug}`]?.count ?? 0,
  }));

  const bookings = await prisma.booking.findMany({
    where: {
      hotelSlug: hotel,
      service: 'HOTEL',
      status: { not: 'CANCELLED' },
      dateFrom: { lt: monthEnd },
      OR: [{ dateTo: { gt: monthStart } }, { dateTo: null, dateFrom: { gte: monthStart } }],
    },
    orderBy: { dateFrom: 'asc' },
  });

  // occupancy[categorySlug][dayKey] = number of rooms taken that night
  const occupancy: Record<string, Record<string, number>> = {};
  for (const c of categories) occupancy[c.slug] = {};
  for (const b of bookings) {
    if (!b.roomCategorySlug || !occupancy[b.roomCategorySlug]) continue;
    const from = startOfDay(b.dateFrom);
    const lastNight = b.dateTo ? startOfDay(b.dateTo) : new Date(from.getTime() + 86_400_000);
    for (let d = new Date(from); d < lastNight; d.setDate(d.getDate() + 1)) {
      if (d >= monthStart && d < monthEnd) {
        const k = dayKey(d);
        occupancy[b.roomCategorySlug][k] = (occupancy[b.roomCategorySlug][k] ?? 0) + 1;
      }
    }
  }

  const prev = month === 0 ? { y: year - 1, m: 11 } : { y: year, m: month - 1 };
  const next = month === 11 ? { y: year + 1, m: 0 } : { y: year, m: month + 1 };
  const hrefFor = (h: string, mp: string) => `/admin/calendar?hotel=${h}&month=${mp}`;
  const monthLabel = new Intl.DateTimeFormat('uk-UA', {
    month: 'long',
    year: 'numeric',
  }).format(monthStart);
  const todayKey = dayKey(new Date());

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          CRM · Завантаженість
          {scopedHotel && <span className="text-[#c9a95c]"> · {hotelLabel(scopedHotel)}</span>}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Календар <span className="italic text-[#1a3d2e]/75">бронювань</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
      </header>

      {/* Hotel tabs (super-admin only) */}
      {!scopedHotel && (
        <div className="flex flex-wrap gap-2 mb-5">
          {ADMIN_HOTELS.map((h) => (
            <Link
              key={h.slug}
              href={hrefFor(h.slug, monthParam(year, month))}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium border transition-colors ${
                h.slug === hotel
                  ? 'bg-[#1a3d2e] text-[#f4ecd8] border-[#1a3d2e]'
                  : 'bg-white text-[#1a3d2e] border-[#1a3d2e]/20 hover:border-[#1a3d2e]/45'
              }`}
            >
              {h.label}
            </Link>
          ))}
        </div>
      )}

      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href={hrefFor(hotel, monthParam(prev.y, prev.m))}
          className="inline-flex items-center gap-1 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#1a3d2e] font-medium border border-[#1a3d2e]/20 bg-white hover:border-[#1a3d2e]/45"
        >
          <ChevronLeft className="h-4 w-4" /> Попередній
        </Link>
        <p className="font-display text-2xl text-[#1a3d2e] capitalize">{monthLabel}</p>
        <Link
          href={hrefFor(hotel, monthParam(next.y, next.m))}
          className="inline-flex items-center gap-1 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#1a3d2e] font-medium border border-[#1a3d2e]/20 bg-white hover:border-[#1a3d2e]/45"
        >
          Наступний <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Availability matrix */}
      {categories.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 px-8 py-12 text-center text-sm italic text-[#1a3d2e]/50 font-display">
          Для цього готелю немає категорій номерів.
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white text-left px-4 py-3 border-b border-r border-[#1a3d2e]/10 text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/60 font-medium min-w-[180px]">
                  Категорія
                </th>
                {days.map((d) => {
                  const dow = (d.getDay() + 6) % 7; // Mon=0
                  const weekend = dow >= 5;
                  const isToday = dayKey(d) === todayKey;
                  return (
                    <th
                      key={d.getDate()}
                      className={`px-0 py-1.5 border-b border-[#1a3d2e]/10 text-center w-9 ${
                        weekend ? 'bg-[#faf6ec]' : ''
                      } ${isToday ? 'bg-[#c9a95c]/25' : ''}`}
                    >
                      <div className="text-[10px] text-[#1a3d2e]/45 leading-none">
                        {WEEKDAY[dow]}
                      </div>
                      <div className="text-xs text-[#1a3d2e] tabular-nums leading-tight mt-0.5">
                        {d.getDate()}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug}>
                  <td className="sticky left-0 z-10 bg-white px-4 py-2.5 border-b border-r border-[#1a3d2e]/10 min-w-[180px]">
                    <p className="text-[#1a3d2e] leading-snug">{c.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/45 mt-0.5">
                      {c.inventory} {c.inventory === 1 ? 'номер' : 'номерів'}
                    </p>
                  </td>
                  {days.map((d) => {
                    const taken = occupancy[c.slug]?.[dayKey(d)] ?? 0;
                    const free = Math.max(0, c.inventory - taken);
                    const full = c.inventory > 0 && free === 0;
                    return (
                      <td
                        key={d.getDate()}
                        title={`${c.name} · ${d.getDate()}.${month + 1}: вільно ${free} з ${c.inventory}`}
                        className={`border-b border-[#1a3d2e]/5 text-center tabular-nums text-xs w-9 ${
                          full
                            ? 'bg-[#8a2b2b]/15 text-[#8a2b2b]'
                            : taken > 0
                            ? 'bg-[#c9a95c]/15 text-[#7a5d20]'
                            : 'text-[#1a3d2e]/35'
                        }`}
                      >
                        {free}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/55 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-[#1a3d2e]/15" /> Вільно
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 bg-[#c9a95c]/30 border border-[#c9a95c]/40" /> Частково
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 bg-[#8a2b2b]/25 border border-[#8a2b2b]/30" /> Немає місць
        </span>
        <span className="text-[#1a3d2e]/40">Число у клітинці — скільки номерів вільно тієї ночі</span>
      </div>

      {/* Bookings list for the month */}
      <div className="mt-10">
        <h2 className="font-display text-2xl text-[#1a3d2e] mb-4">
          Бронювання за {monthLabel.toLowerCase()}{' '}
          <span className="text-[#1a3d2e]/45 text-lg">· {bookings.length}</span>
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-white border border-[#1a3d2e]/10 px-8 py-10 text-center text-sm italic text-[#1a3d2e]/50 font-display">
            Бронювань на цей місяць немає.
          </div>
        ) : (
          <ul className="bg-white border border-[#1a3d2e]/10">
            {bookings.map((b) => {
              const cat = categories.find((c) => c.slug === b.roomCategorySlug);
              const fmt = (d: Date) =>
                new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit' }).format(d);
              return (
                <li key={b.id} className="border-b border-[#1a3d2e]/10 last:border-b-0">
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#1a3d2e]/5 transition-colors"
                  >
                    <div className="font-display text-[#1a3d2e] tabular-nums whitespace-nowrap text-sm w-28">
                      {fmt(b.dateFrom)}
                      {b.dateTo ? ` – ${fmt(b.dateTo)}` : ''}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[#1a3d2e] truncate">
                        {b.name}
                        {cat && (
                          <span className="text-[#1a3d2e]/55"> · {cat.name}</span>
                        )}
                      </p>
                      <p className="text-xs text-[#1a3d2e]/50 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {b.phone} · {b.guests} гост.
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 border ${
                        STATUS_BADGE[b.status] ?? ''
                      }`}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
