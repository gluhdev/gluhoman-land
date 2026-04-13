import Link from 'next/link';
import {
  ShoppingBag,
  UtensilsCrossed,
  Hotel,
  Banknote,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';

export const dynamic = 'force-dynamic';

async function loadStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayCount, todaySum, monthCount, monthSum, pendingCount, totalOrders, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfDay }, paymentStatus: 'paid' },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfMonth }, paymentStatus: 'paid' },
      }),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

  return {
    today: { count: todayCount, sum: todaySum._sum.total ?? 0 },
    month: { count: monthCount, sum: monthSum._sum.total ?? 0 },
    pending: pendingCount,
    total: totalOrders,
    recentOrders,
  };
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Очікує оплати',
  PAID: 'Сплачено',
  CONFIRMED: 'Підтверджено',
  PREPARING: 'Готується',
  DELIVERING: 'В дорозі',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

export default async function AdminDashboard() {
  const stats = await loadStats();

  return (
    <div className="p-6 lg:p-10">
      {/* Editorial header */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          Огляд · Dashboard
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Ласкаво просимо{' '}
          <span className="italic text-[#1a3d2e]/80">до CRM</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
      </div>

      {/* Editorial stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-[#1a3d2e]/15 mb-12">
        <StatCell
          eyebrow="Сьогодні"
          value={stats.today.count.toString()}
          hint={formatPrice(stats.today.sum)}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatCell
          eyebrow="За місяць"
          value={stats.month.count.toString()}
          hint={formatPrice(stats.month.sum)}
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatCell
          eyebrow="До роботи"
          value={stats.pending.toString()}
          hint="оплачено, чекає"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCell
          eyebrow="Всього"
          value={stats.total.toString()}
          hint="за весь час"
          icon={<CheckCircle2 className="h-4 w-4" />}
          last
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Recent activity */}
        <section className="lg:col-span-3">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
                Хронологія · I
              </p>
              <h2 className="font-display text-2xl text-[#1a3d2e] mt-1">
                Останні <span className="italic">замовлення</span>
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] font-medium hover:text-[#0b1410]"
            >
              Усі <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="border-t border-[#1a3d2e]/15">
            {stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm italic text-[#1a3d2e]/50 font-display">
                Замовлень ще немає
              </div>
            ) : (
              <ul>
                {stats.recentOrders.map((o) => (
                  <li key={o.id} className="border-b border-[#1a3d2e]/10">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex items-center justify-between gap-4 py-4 hover:bg-[#1a3d2e]/5 transition-colors px-1"
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-5">
                        <div className="font-display text-lg text-[#1a3d2e] tabular-nums w-14">
                          №{o.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-[#1a3d2e] truncate">
                            {o.customerName}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/50 font-medium mt-0.5">
                            {STATUS_LABEL[o.status] ?? o.status}
                          </p>
                        </div>
                      </div>
                      <span className="font-display text-[#1a3d2e] tabular-nums whitespace-nowrap">
                        {formatPrice(o.total)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section className="lg:col-span-2">
          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
              Розділи · II
            </p>
            <h2 className="font-display text-2xl text-[#1a3d2e] mt-1">
              Швидкий <span className="italic">доступ</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#1a3d2e]/15 border border-[#1a3d2e]/15">
            <QuickTile
              href="/admin/orders?status=PENDING"
              eyebrow="I"
              label="Нові заявки"
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <QuickTile
              href="/admin/menu"
              eyebrow="II"
              label="Меню"
              icon={<UtensilsCrossed className="h-4 w-4" />}
            />
            <QuickTile
              href="/admin/hotel/rooms"
              eyebrow="III"
              label="Номери"
              icon={<Hotel className="h-4 w-4" />}
            />
            <QuickTile
              href="/admin/aquapark/tariffs"
              eyebrow="IV"
              label="Тарифи"
              icon={<Banknote className="h-4 w-4" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCell({
  eyebrow,
  value,
  hint,
  icon,
  last,
}: {
  eyebrow: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`px-5 py-6 ${
        last ? '' : 'lg:border-r border-[#1a3d2e]/15'
      } border-b lg:border-b-0`}
    >
      <div className="flex items-center gap-2 text-[#1a3d2e]/60 mb-3">
        {icon}
        <p className="text-[11px] uppercase tracking-[0.22em] font-medium">{eyebrow}</p>
      </div>
      <p className="font-display text-4xl text-[#1a3d2e] tabular-nums">{value}</p>
      {hint && (
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/50 font-medium mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}

function QuickTile({
  href,
  eyebrow,
  label,
  icon,
}: {
  href: string;
  eyebrow: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="bg-[#faf6ec] p-5 flex flex-col justify-between min-h-[120px] hover:bg-[#f4ecd8] transition-colors group"
    >
      <div className="flex items-center justify-between text-[#1a3d2e]/60">
        <p className="text-[11px] uppercase tracking-[0.22em] font-medium">{eyebrow}</p>
        {icon}
      </div>
      <div>
        <p className="font-display text-xl text-[#1a3d2e] italic">{label}</p>
        <div className="mt-2 h-px w-8 bg-[#1a3d2e]/40 group-hover:w-12 transition-all" />
      </div>
    </Link>
  );
}
