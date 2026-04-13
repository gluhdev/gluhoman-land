import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, User, MapPin, Store, Clock, MessageSquare, CreditCard } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { StatusActions } from './StatusActions';

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

const PAY_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Оплачено',
  failed: 'Помилка',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до списку
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Замовлення
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">
            №{order.number}
          </h1>
          <p className="text-sm text-[#1a3d2e]/55 mt-1">
            {new Date(order.createdAt).toLocaleString('uk-UA', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              order.paymentStatus === 'paid'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : order.paymentStatus === 'failed'
                ? 'bg-red-100 text-red-900 border-red-200'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            {PAY_LABEL[order.paymentStatus] ?? order.paymentStatus}
          </span>
          <p className="font-display text-3xl font-semibold text-[#1a3d2e] tabular-nums">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT: Items + customer */}
        <div className="space-y-5">
          {/* Items */}
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <div className="px-6 py-4 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30">
              <h2 className="font-display text-base font-semibold text-[#1a3d2e]">
                Позиції замовлення
              </h2>
            </div>
            <ul className="divide-y divide-[#1a3d2e]/8">
              {order.items.map((i) => (
                <li key={i.id} className="px-6 py-3 flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-[#1a3d2e]">{i.name}</p>
                    <p className="text-xs text-[#1a3d2e]/55 tabular-nums">
                      {i.quantity} × {i.price} ₴
                    </p>
                  </div>
                  <p className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/30 space-y-1.5 text-sm">
              <div className="flex justify-between text-[#1a3d2e]/70">
                <span>Сума замовлення</span>
                <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#1a3d2e]/70">
                <span>Доставка</span>
                <span className="tabular-nums">
                  {order.deliveryFee === 0 ? (
                    <span className="text-[#1a3d2e] font-semibold">безкоштовно</span>
                  ) : (
                    formatPrice(order.deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1a3d2e]/10 text-base font-bold text-[#1a3d2e]">
                <span>До сплати</span>
                <span className="tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">
              Інформація про клієнта
            </h2>
            <div className="space-y-3">
              <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Ім'я" value={order.customerName} />
              <DetailRow
                icon={<Phone className="h-3.5 w-3.5" />}
                label="Телефон"
                value={
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-[#1a3d2e] hover:underline"
                  >
                    {order.customerPhone}
                  </a>
                }
              />
              <DetailRow
                icon={
                  order.deliveryType === 'delivery' ? (
                    <MapPin className="h-3.5 w-3.5" />
                  ) : (
                    <Store className="h-3.5 w-3.5" />
                  )
                }
                label={order.deliveryType === 'delivery' ? 'Адреса доставки' : 'Самовивіз'}
                value={order.deliveryType === 'delivery' ? order.address ?? '—' : 'З ресторану'}
              />
              {order.scheduledAt && (
                <DetailRow
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Час"
                  value={new Date(order.scheduledAt).toLocaleString('uk-UA', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                />
              )}
              {order.comment && (
                <DetailRow
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                  label="Коментар"
                  value={order.comment}
                />
              )}
              {order.paymentExternalId && (
                <DetailRow
                  icon={<CreditCard className="h-3.5 w-3.5" />}
                  label="LiqPay ID"
                  value={<span className="font-mono text-xs">{order.paymentExternalId}</span>}
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Status actions */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-1">Статус</h2>
            <p className="text-xs text-[#1a3d2e]/55 mb-4">
              Поточний: <strong className="text-[#1a3d2e]">{STATUS_LABEL[order.status] ?? order.status}</strong>
            </p>
            <StatusActions orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-7 h-7 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">
          {label}
        </p>
        <div className="text-[#1a3d2e]">{value}</div>
      </div>
    </div>
  );
}
