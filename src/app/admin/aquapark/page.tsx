import Link from 'next/link';
import { Waves, Ticket, Banknote, Calendar, ArrowRight, ScanLine, Settings } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Сплачено',
  used: 'Використано',
  cancelled: 'Скасовано',
  refunded: 'Повернено',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  paid: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  used: 'bg-blue-100 text-blue-900 border-blue-200',
  cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  refunded: 'bg-purple-100 text-purple-900 border-purple-200',
};

async function loadStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(startOfDay.getTime() + 86_400_000);

  const [todayCount, monthCount, monthSum, totalTariffs, recent] = await Promise.all([
    prisma.aquaparkTicket.count({
      where: {
        date: { gte: startOfDay, lt: tomorrow },
        status: { not: 'cancelled' },
      },
    }),
    prisma.aquaparkTicket.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.aquaparkTicket.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'paid' },
    }),
    prisma.aquaparkTariff.count({ where: { active: true } }),
    prisma.aquaparkTicket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { items: true },
    }),
  ]);

  return {
    todayCount,
    monthCount,
    monthSum: monthSum._sum.total ?? 0,
    totalTariffs,
    recent,
  };
}

export default async function AdminAquaparkPage() {
  const stats = await loadStats();

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Аквапарк
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Управління аквапарком
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/aquapark/tariffs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] font-semibold text-sm hover:bg-[#1a3d2e]/5 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Тарифи
          </Link>
          <Link
            href="/admin/aquapark/scan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-md hover:bg-[#0f2a1e] transition-colors"
          >
            <ScanLine className="h-4 w-4" />
            Сканер квитків
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat icon={<Calendar className="h-5 w-5" />} label="Сьогодні" value={stats.todayCount} hint="квитків" accent />
        <Stat icon={<Ticket className="h-5 w-5" />} label="За місяць" value={stats.monthCount} hint="квитків" />
        <Stat icon={<Banknote className="h-5 w-5" />} label="Дохід" value={formatPrice(stats.monthSum)} hint="за місяць" />
        <Stat icon={<Waves className="h-5 w-5" />} label="Тарифів" value={stats.totalTariffs} />
      </div>

      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a3d2e]/10 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[#1a3d2e]">
            Останні квитки
          </h2>
          <Link
            href="/admin/aquapark/tickets"
            className="text-xs font-semibold text-[#1a3d2e] hover:text-[#0f2a1e] inline-flex items-center gap-1"
          >
            Усі <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#1a3d2e]/50">
            Квитків ще немає
          </div>
        ) : (
          <ul className="divide-y divide-[#1a3d2e]/8">
            {stats.recent.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/admin/aquapark/tickets/${t.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors"
                >
                  <div className="font-display text-base font-semibold text-[#1a3d2e] tabular-nums w-16">
                    №{t.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a3d2e] truncate">{t.customerName}</p>
                    <p className="text-xs text-[#1a3d2e]/55">
                      {t.items.length} позицій · {t.date.toLocaleDateString('uk-UA', { dateStyle: 'short' })}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      STATUS_COLOR[t.status] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {STATUS_LABEL[t.status] ?? t.status}
                  </span>
                  <span className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                    {formatPrice(t.total)}
                  </span>
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
