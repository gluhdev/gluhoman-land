import Link from 'next/link';
import {
  ShoppingBag,
  Hotel,
  Waves,
  Flame,
  Phone,
  Clock,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { ROOM_TYPE_LABEL } from '@/types/booking';
import { SAUNA_TYPE_LABEL, SaunaType } from '@/types/sauna';

export const dynamic = 'force-dynamic';

async function loadToday() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 86_400_000);

  const [orders, hotelCheckIns, hotelCheckOuts, aquaTickets, saunaSlots] = await Promise.all([
    // Orders created today (delivery/pickup)
    prisma.order.findMany({
      where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }),
    // Hotel check-ins today
    prisma.hotelBooking.findMany({
      where: {
        checkIn: { gte: startOfDay, lt: endOfDay },
        status: { not: 'cancelled' },
      },
      include: { room: true },
      orderBy: { checkIn: 'asc' },
    }),
    // Hotel check-outs today
    prisma.hotelBooking.findMany({
      where: {
        checkOut: { gte: startOfDay, lt: endOfDay },
        status: { not: 'cancelled' },
      },
      include: { room: true },
      orderBy: { checkOut: 'asc' },
    }),
    // Aquapark tickets for today (visit date)
    prisma.aquaparkTicket.findMany({
      where: {
        date: { gte: startOfDay, lt: endOfDay },
        status: { not: 'cancelled' },
      },
      include: { items: true },
      orderBy: { number: 'asc' },
    }),
    // Sauna slots for today
    prisma.saunaSlot.findMany({
      where: {
        date: { gte: startOfDay, lt: endOfDay },
        status: { not: 'cancelled' },
      },
      orderBy: { startTime: 'asc' },
    }),
  ]);

  return { orders, hotelCheckIns, hotelCheckOuts, aquaTickets, saunaSlots };
}

export default async function TodayPage() {
  const data = await loadToday();
  const today = new Date();

  const totalRevenue =
    data.orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0) +
    data.hotelCheckIns.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + b.total, 0) +
    data.aquaTickets.filter((t) => t.paymentStatus === 'paid').reduce((s, t) => s + t.total, 0) +
    data.saunaSlots
      .filter((s) => s.paymentStatus === 'paid' && s.total)
      .reduce((s, x) => s + (x.total ?? 0), 0);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Сьогодні
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-[#1a3d2e]/40" />
            {today.toLocaleDateString('uk-UA', { dateStyle: 'long' })}
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1a3d2e]/55">
            Дохід (оплачено)
          </p>
          <p className="font-display text-3xl font-bold text-[#1a3d2e] tabular-nums">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Замовлень"
          value={data.orders.length}
          href="/admin/orders"
        />
        <Stat
          icon={<Hotel className="h-5 w-5" />}
          label="Заїздів готелю"
          value={data.hotelCheckIns.length}
          href="/admin/hotel/bookings"
        />
        <Stat
          icon={<Waves className="h-5 w-5" />}
          label="Квитків аквапарку"
          value={data.aquaTickets.length}
          href="/admin/aquapark/tickets"
        />
        <Stat
          icon={<Flame className="h-5 w-5" />}
          label="Бронювань лазні"
          value={data.saunaSlots.length}
          href="/admin/sauna/slots"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders */}
        <Section
          title="Замовлення на доставку"
          icon={<ShoppingBag className="h-4 w-4" />}
          href="/admin/orders"
        >
          {data.orders.length === 0 ? (
            <Empty text="Замовлень сьогодні ще немає" />
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8">
              {data.orders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a3d2e]/4 transition-colors"
                  >
                    <div className="font-display text-base font-bold text-[#1a3d2e] tabular-nums w-12">
                      №{o.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-[#1a3d2e]/55 inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {o.customerPhone}
                      </p>
                    </div>
                    <PaymentBadge status={o.paymentStatus} />
                    <span className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      {formatPrice(o.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Hotel check-ins */}
        <Section
          title="Заїзди в готель"
          icon={<Hotel className="h-4 w-4" />}
          href="/admin/hotel/bookings"
        >
          {data.hotelCheckIns.length === 0 ? (
            <Empty text="Заїздів сьогодні немає" />
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8">
              {data.hotelCheckIns.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/hotel/bookings/${b.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a3d2e]/4 transition-colors"
                  >
                    <div className="font-display text-base font-bold text-[#1a3d2e] tabular-nums w-12">
                      №{b.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                        {b.customerName}
                      </p>
                      <p className="text-xs text-[#1a3d2e]/55">
                        Номер {b.room?.number}
                        {' · '}
                        {ROOM_TYPE_LABEL[b.room?.type ?? ''] ?? ''}
                      </p>
                    </div>
                    <PaymentBadge status={b.paymentStatus} />
                    <span className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      {formatPrice(b.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Hotel check-outs */}
        {data.hotelCheckOuts.length > 0 && (
          <Section
            title="Виїзди з готелю"
            icon={<Hotel className="h-4 w-4" />}
            href="/admin/hotel/bookings"
          >
            <ul className="divide-y divide-[#1a3d2e]/8">
              {data.hotelCheckOuts.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/hotel/bookings/${b.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a3d2e]/4 transition-colors"
                  >
                    <div className="font-display text-base font-bold text-[#1a3d2e] tabular-nums w-12">
                      №{b.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                        {b.customerName}
                      </p>
                      <p className="text-xs text-[#1a3d2e]/55">
                        Номер {b.room?.number}
                      </p>
                    </div>
                    <PaymentBadge status={b.paymentStatus} />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Aquapark visitors today */}
        <Section
          title="Відвідувачі аквапарку"
          icon={<Waves className="h-4 w-4" />}
          href="/admin/aquapark/tickets"
        >
          {data.aquaTickets.length === 0 ? (
            <Empty text="Квитків на сьогодні немає" />
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8">
              {data.aquaTickets.map((t) => {
                const totalQty = t.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <li key={t.id}>
                    <Link
                      href={`/admin/aquapark/tickets/${t.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a3d2e]/4 transition-colors"
                    >
                      <div className="font-display text-base font-bold text-[#1a3d2e] tabular-nums w-12">
                        №{t.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                          {t.customerName}
                        </p>
                        <p className="text-xs text-[#1a3d2e]/55">
                          {totalQty}{' '}
                          {totalQty === 1 ? 'квиток' : totalQty < 5 ? 'квитки' : 'квитків'}
                        </p>
                      </div>
                      <PaymentBadge status={t.paymentStatus} />
                      <span className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                        {formatPrice(t.total)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Sauna slots today */}
        <Section
          title="Лазня — графік"
          icon={<Flame className="h-4 w-4" />}
          href="/admin/sauna/slots"
        >
          {data.saunaSlots.length === 0 ? (
            <Empty text="Бронювань на сьогодні немає" />
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8">
              {data.saunaSlots.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/sauna/slots/${s.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#1a3d2e]/4 transition-colors"
                  >
                    <div className="font-display text-base font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      <Clock className="h-3 w-3 inline mr-1 text-[#1a3d2e]/40" />
                      {s.startTime}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                        {s.customerName ?? '—'}
                      </p>
                      <p className="text-xs text-[#1a3d2e]/55">
                        {SAUNA_TYPE_LABEL[s.saunaType as SaunaType]}
                      </p>
                    </div>
                    <PaymentBadge status={s.paymentStatus} />
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
        </Section>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href?: string;
}) {
  const inner = (
    <>
      <div className="w-9 h-9 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1a3d2e]/55">{label}</p>
      <p className="font-display text-3xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">{value}</p>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="block p-5 rounded-2xl bg-white border border-[#1a3d2e]/10 hover:border-[#1a3d2e]/30 hover:shadow-lg transition-all"
      >
        {inner}
      </Link>
    );
  }
  return <div className="p-5 rounded-2xl bg-white border border-[#1a3d2e]/10">{inner}</div>;
}

function Section({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1a3d2e]/10 flex items-center justify-between bg-[#f4ecd8]/30">
        <h2 className="font-display text-base font-semibold text-[#1a3d2e] flex items-center gap-2">
          <span className="text-[#1a3d2e]/60">{icon}</span>
          {title}
        </h2>
        <Link
          href={href}
          className="text-xs font-semibold text-[#1a3d2e]/70 hover:text-[#1a3d2e] inline-flex items-center gap-1"
        >
          Усі <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="px-5 py-10 text-center text-xs text-[#1a3d2e]/45">{text}</div>;
}

function PaymentBadge({ status }: { status: string }) {
  const cls =
    status === 'paid'
      ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
      : status === 'failed'
      ? 'bg-red-100 text-red-900 border-red-200'
      : 'bg-amber-100 text-amber-900 border-amber-200';
  const label = status === 'paid' ? 'Оплачено' : status === 'failed' ? 'Помилка' : 'Очікує';
  return (
    <span
      className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border whitespace-nowrap ${cls}`}
    >
      {label}
    </span>
  );
}
