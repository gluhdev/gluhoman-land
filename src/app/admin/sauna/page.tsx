import Link from 'next/link';
import { Flame, Calendar, Banknote, Clock, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { SAUNA_TYPE_LABEL, SaunaType } from '@/types/sauna';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  free: 'Вільно',
  reserved: 'Зарезервовано',
  paid: 'Сплачено',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};

const STATUS_COLOR: Record<string, string> = {
  free: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  reserved: 'bg-amber-100 text-amber-900 border-amber-200',
  paid: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  completed: 'bg-blue-100 text-blue-900 border-blue-200',
  cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

async function loadStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(startOfDay.getTime() + 86_400_000);

  const [todayCount, monthCount, monthSum, recent] = await Promise.all([
    prisma.saunaSlot.count({
      where: {
        date: { gte: startOfDay, lt: tomorrow },
        status: { not: 'cancelled' },
      },
    }),
    prisma.saunaSlot.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.saunaSlot.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'paid' },
    }),
    prisma.saunaSlot.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  return {
    todayCount,
    monthCount,
    monthSum: monthSum._sum.total ?? 0,
    recent,
  };
}

export default async function AdminSaunaPage() {
  const stats = await loadStats();

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Лазня
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Управління лазнею
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat icon={<Calendar className="h-5 w-5" />} label="Сьогодні" value={stats.todayCount} hint="броньовано" accent />
        <Stat icon={<Clock className="h-5 w-5" />} label="За місяць" value={stats.monthCount} hint="бронювань" />
        <Stat icon={<Banknote className="h-5 w-5" />} label="Дохід" value={formatPrice(stats.monthSum)} hint="за місяць" />
        <Stat icon={<Flame className="h-5 w-5" />} label="Лазень" value={2} hint="мала + велика" />
      </div>

      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a3d2e]/10 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[#1a3d2e]">
            Останні бронювання
          </h2>
          <Link
            href="/admin/sauna/slots"
            className="text-xs font-semibold text-[#1a3d2e] hover:text-[#0f2a1e] inline-flex items-center gap-1"
          >
            Усі <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#1a3d2e]/50">
            Бронювань ще немає
          </div>
        ) : (
          <ul className="divide-y divide-[#1a3d2e]/8">
            {stats.recent.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/sauna/slots/${s.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors"
                >
                  <div className="font-display text-base font-semibold text-[#1a3d2e] tabular-nums w-16">
                    №{s.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a3d2e] truncate">
                      {s.customerName ?? '—'}
                    </p>
                    <p className="text-xs text-[#1a3d2e]/55">
                      {SAUNA_TYPE_LABEL[s.saunaType as SaunaType]}{' '}
                      · {s.date.toLocaleDateString('uk-UA', { dateStyle: 'short' })}{' '}
                      {s.startTime}–{s.endTime}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      STATUS_COLOR[s.status] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {STATUS_LABEL[s.status] ?? s.status}
                  </span>
                  {s.total !== null && (
                    <span className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      {formatPrice(s.total)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border ${
        accent ? 'bg-[#1a3d2e] text-[#fdfaf0] border-[#1a3d2e]' : 'bg-white text-[#1a3d2e] border-[#1a3d2e]/10'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          accent ? 'bg-white/15 text-white' : 'bg-[#1a3d2e]/8 text-[#1a3d2e]'
        }`}
      >
        {icon}
      </div>
      <p className={`text-[10px] uppercase tracking-wider font-semibold ${accent ? 'text-white/60' : 'text-[#1a3d2e]/55'}`}>
        {label}
      </p>
      <p className="font-display text-3xl font-semibold mt-1 tabular-nums">{value}</p>
      {hint && <p className={`text-xs mt-1 ${accent ? 'text-white/60' : 'text-[#1a3d2e]/55'}`}>{hint}</p>}
    </div>
  );
}
