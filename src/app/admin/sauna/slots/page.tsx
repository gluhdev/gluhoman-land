import Link from 'next/link';
import { Phone, Calendar, Flame } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { SAUNA_TYPE_LABEL, SaunaType } from '@/types/sauna';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  reserved: 'Зарезервовано',
  paid: 'Сплачено',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};

const STATUS_COLOR: Record<string, string> = {
  reserved: 'bg-amber-100 text-amber-900 border-amber-200',
  paid: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  completed: 'bg-blue-100 text-blue-900 border-blue-200',
  cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

const FILTERS = [
  { id: 'all', label: 'Усі' },
  { id: 'reserved', label: 'Зарезервовано' },
  { id: 'paid', label: 'Сплачені' },
  { id: 'completed', label: 'Виконані' },
  { id: 'cancelled', label: 'Скасовані' },
];

export default async function AdminSaunaSlotsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status ?? 'all';

  const slots = await prisma.saunaSlot.findMany({
    where: filter === 'all' ? {} : { status: filter },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Лазня
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Бронювання
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <Link
              key={f.id}
              href={f.id === 'all' ? '/admin/sauna/slots' : `/admin/sauna/slots?status=${f.id}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#1a3d2e] text-[#fdfaf0] shadow-md'
                  : 'bg-white border border-[#1a3d2e]/15 text-[#1a3d2e]/70 hover:bg-[#1a3d2e]/5'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {slots.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-12 text-center text-sm text-[#1a3d2e]/50">
          Бронювань не знайдено
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
          <ul className="divide-y divide-[#1a3d2e]/8">
            {slots.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/sauna/slots/${s.id}`}
                  className="block px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums w-16 flex-shrink-0">
                      №{s.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="font-semibold text-[#1a3d2e]">{s.customerName ?? '—'}</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border whitespace-nowrap ${
                            STATUS_COLOR[s.status] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                        <span className="text-[10px] text-[#1a3d2e]/55 bg-[#1a3d2e]/8 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {SAUNA_TYPE_LABEL[s.saunaType as SaunaType]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#1a3d2e]/60 flex-wrap">
                        {s.customerPhone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {s.customerPhone}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {s.date.toLocaleDateString('uk-UA', { dateStyle: 'short' })}{' '}
                          {s.startTime}–{s.endTime}
                        </span>
                      </div>
                    </div>
                    {s.total !== null && (
                      <p className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                        {formatPrice(s.total)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
