import Link from 'next/link';
import { Phone, MapPin, Store } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує оплати',
  PAID: 'Сплачено',
  CONFIRMED: 'Підтверджено',
  PREPARING: 'Готується',
  DELIVERING: 'В дорозі',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900 border-amber-200',
  PAID: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  CONFIRMED: 'bg-blue-100 text-blue-900 border-blue-200',
  PREPARING: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  DELIVERING: 'bg-purple-100 text-purple-900 border-purple-200',
  COMPLETED: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  CANCELLED: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

const STATUS_FILTERS = [
  { id: 'all', label: 'Усі' },
  { id: 'PENDING', label: 'Очікують' },
  { id: 'PAID', label: 'Сплачені' },
  { id: 'CONFIRMED', label: 'Підтверджені' },
  { id: 'PREPARING', label: 'Готуються' },
  { id: 'DELIVERING', label: 'В дорозі' },
  { id: 'COMPLETED', label: 'Виконані' },
  { id: 'CANCELLED', label: 'Скасовані' },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status ?? 'all';

  const orders = await prisma.order.findMany({
    where: filter === 'all' ? {} : { status: filter },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Замовлення
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Усі замовлення
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <Link
              key={f.id}
              href={f.id === 'all' ? '/admin/orders' : `/admin/orders?status=${f.id}`}
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

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-12 text-center text-sm text-[#1a3d2e]/50">
          Замовлень не знайдено
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
          <ul className="divide-y divide-[#1a3d2e]/8">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums w-16 flex-shrink-0">
                      №{o.number}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-[#1a3d2e] truncate">{o.customerName}</p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border whitespace-nowrap ${
                            STATUS_COLOR[o.status] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#1a3d2e]/60">
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {o.customerPhone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {o.deliveryType === 'delivery' ? (
                            <MapPin className="h-3 w-3" />
                          ) : (
                            <Store className="h-3 w-3" />
                          )}
                          {o.deliveryType === 'delivery' ? o.address ?? '—' : 'Самовивіз'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#1a3d2e]/45 mt-1">
                        {o.items.length}{' '}
                        {o.items.length === 1 ? 'позиція' : o.items.length < 5 ? 'позиції' : 'позицій'}
                        {' · '}
                        {new Date(o.createdAt).toLocaleString('uk-UA', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                        {formatPrice(o.total)}
                      </p>
                      {o.deliveryFee > 0 && (
                        <p className="text-[10px] text-[#1a3d2e]/45">
                          + {formatPrice(o.deliveryFee)} доставка
                        </p>
                      )}
                    </div>
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
