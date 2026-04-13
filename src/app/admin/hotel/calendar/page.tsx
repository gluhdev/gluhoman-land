import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ROOM_TYPE_LABEL } from '@/types/booking';

export const dynamic = 'force-dynamic';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-200 text-amber-900 border-amber-400',
  paid: 'bg-blue-200 text-blue-900 border-blue-400',
  confirmed: 'bg-emerald-300 text-emerald-950 border-emerald-500',
  completed: 'bg-neutral-200 text-neutral-700 border-neutral-400',
};

function parseMonth(s?: string): { year: number; month: number } {
  const now = new Date();
  if (!s) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  if (!m) return { year: now.getFullYear(), month: now.getMonth() + 1 };
  return { year: Number(m[1]), month: Number(m[2]) };
}

function shiftMonth(y: number, m: number, delta: number): string {
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

export default async function HotelCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp.month);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const monthEnd = new Date(year, month, 1);

  const rooms = await prisma.hotelRoom.findMany({
    where: { active: true },
    orderBy: [{ number: 'asc' }],
    select: { id: true, number: true, type: true, pricePerNight: true },
  });

  const bookings = await prisma.hotelBooking.findMany({
    where: {
      status: { notIn: ['cancelled'] },
      AND: [{ checkIn: { lt: monthEnd } }, { checkOut: { gt: firstDay } }],
    },
    select: {
      id: true,
      roomId: true,
      checkIn: true,
      checkOut: true,
      status: true,
      customerName: true,
      number: true,
    },
  });

  const grid = new Map<string, Map<number, (typeof bookings)[number]>>();
  for (const b of bookings) {
    if (!grid.has(b.roomId)) grid.set(b.roomId, new Map());
    const roomMap = grid.get(b.roomId)!;
    const start = new Date(Math.max(b.checkIn.getTime(), firstDay.getTime()));
    const end = new Date(Math.min(b.checkOut.getTime(), monthEnd.getTime()));
    const startDay =
      start.getMonth() === month - 1 && start.getFullYear() === year ? start.getDate() : 1;
    const endDay =
      end.getMonth() === month - 1 && end.getFullYear() === year ? end.getDate() : daysInMonth + 1;
    for (let d = startDay; d < endDay; d++) {
      roomMap.set(d, b);
    }
  }

  const prevMonth = shiftMonth(year, month, -1);
  const nextMonth = shiftMonth(year, month, 1);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-6 lg:p-10">
      <Link
        href="/admin/hotel"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Готель
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Календар бронювань
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/hotel/calendar?month=${prevMonth}`}
            className="p-2 rounded-full bg-white border border-[#1a3d2e]/15 hover:bg-[#1a3d2e]/5"
            aria-label="Попередній місяць"
          >
            <ChevronLeft className="h-4 w-4 text-[#1a3d2e]" />
          </Link>
          <div className="px-4 py-2 bg-white border border-[#1a3d2e]/15 rounded-full text-sm font-semibold text-[#1a3d2e] min-w-[160px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </div>
          <Link
            href={`/admin/hotel/calendar?month=${nextMonth}`}
            className="p-2 rounded-full bg-white border border-[#1a3d2e]/15 hover:bg-[#1a3d2e]/5"
            aria-label="Наступний місяць"
          >
            <ChevronRight className="h-4 w-4 text-[#1a3d2e]" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap text-[11px]">
        {Object.entries({
          pending: 'Очікує',
          paid: 'Сплачено',
          confirmed: 'Підтверджено',
          completed: 'Виконано',
        }).map(([k, label]) => (
          <span key={k} className={`px-2 py-0.5 rounded border ${STATUS_COLOR[k]}`}>
            {label}
          </span>
        ))}
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-10 text-center text-sm text-[#1a3d2e]/60">
          Немає активних номерів.{' '}
          <Link href="/admin/hotel/rooms/new" className="underline">
            Створіть перший
          </Link>
          .
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-2xl overflow-x-auto shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#1a3d2e]/5">
                <th className="sticky left-0 z-10 bg-[#1a3d2e]/5 text-left text-[11px] uppercase tracking-wider text-[#1a3d2e]/70 px-3 py-2 border-b border-[#1a3d2e]/10 min-w-[150px]">
                  Номер
                </th>
                {dayNumbers.map((d) => (
                  <th
                    key={d}
                    className="text-center text-[10px] font-semibold text-[#1a3d2e]/60 border-b border-l border-[#1a3d2e]/10 px-0 py-1 w-8"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const roomGrid = grid.get(room.id) ?? new Map();
                return (
                  <tr key={room.id}>
                    <td className="sticky left-0 z-10 bg-white text-xs text-[#1a3d2e] px-3 py-2 border-b border-[#1a3d2e]/10 whitespace-nowrap">
                      <div className="font-semibold">№{room.number}</div>
                      <div className="text-[10px] text-[#1a3d2e]/55">
                        {ROOM_TYPE_LABEL[room.type] ?? room.type}
                      </div>
                    </td>
                    {dayNumbers.map((d) => {
                      const b = roomGrid.get(d);
                      if (b) {
                        return (
                          <td
                            key={d}
                            className={`border-b border-l border-[#1a3d2e]/10 p-0 w-8 h-12 ${STATUS_COLOR[b.status] ?? ''}`}
                            title={`№${b.number} · ${b.customerName}`}
                          >
                            <Link
                              href={`/admin/hotel/bookings/${b.id}`}
                              className="block w-full h-full"
                            />
                          </td>
                        );
                      }
                      return (
                        <td
                          key={d}
                          className="border-b border-l border-[#1a3d2e]/10 p-0 w-8 h-12 bg-white hover:bg-[#1a3d2e]/5 group"
                        >
                          <Link
                            href={`/admin/hotel/bookings/new?roomId=${room.id}&checkIn=${isoDate(year, month, d)}`}
                            className="flex items-center justify-center w-full h-full opacity-0 group-hover:opacity-100 transition"
                            aria-label="Створити бронювання"
                          >
                            <Plus className="h-3 w-3 text-[#1a3d2e]/60" />
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
