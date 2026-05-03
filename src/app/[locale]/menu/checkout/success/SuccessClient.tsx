'use client';

/**
 * SuccessClient — polls /api/orders/[id] every 2 seconds until paymentStatus = 'paid'.
 *
 * Why polling: LiqPay sends the callback server-to-server (S2S). It usually arrives
 * within a few seconds, but there's no client signal. Polling is the simplest way
 * to bridge that gap. Stops after 60 seconds with a "перевірте пошту" fallback.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Clock, Phone, Truck, Store, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/types/cart';

interface OrderSnapshot {
  id: string;
  number: number;
  status: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  scheduledAt?: string | null;
  items: { menuItemId: string; name: string; price: number; quantity: number }[];
}

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 60_000;

export function SuccessClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('Не вказано номер замовлення');
      return;
    }
    let cancelled = false;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('not found');
        const data = (await res.json()) as OrderSnapshot;
        if (cancelled) return;
        setOrder(data);
        if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed') {
          return; // stop polling
        }
        if (Date.now() - startedAt > MAX_POLL_MS) {
          setPollingTimedOut(true);
          return;
        }
        setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) {
          setError('Не вдалось завантажити замовлення');
        }
      }
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (error) {
    return (
      <Card>
        <h1 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-2">{error}</h1>
        <Link
          href="/menu"
          className="inline-flex mt-6 items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
        >
          Повернутись до меню
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <Loader2 className="h-10 w-10 text-[#1a3d2e] animate-spin mx-auto mb-4" />
        <p className="text-[#1a3d2e]/70">Завантажуємо замовлення…</p>
      </Card>
    );
  }

  // Pending state — waiting for LiqPay callback
  if (order.paymentStatus === 'pending') {
    return (
      <Card>
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <Clock className="h-8 w-8 text-amber-700" />
        </div>
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
          Замовлення №{order.number}
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          Очікуємо оплату…
        </h1>
        <p className="text-sm text-[#1a3d2e]/70 mb-6 max-w-md mx-auto">
          {pollingTimedOut
            ? 'Підтвердження ще не надійшло. Якщо ви оплатили — перевірте пошту або зв\'яжіться з нами.'
            : 'Перевіряємо статус оплати. Це може зайняти кілька секунд.'}
        </p>
        {!pollingTimedOut && (
          <Loader2 className="h-6 w-6 text-[#1a3d2e]/40 animate-spin mx-auto" />
        )}
      </Card>
    );
  }

  if (order.paymentStatus === 'failed') {
    return (
      <Card>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          Оплата не пройшла
        </h1>
        <p className="text-sm text-[#1a3d2e]/70 mb-6">
          Спробуйте ще раз або зв&apos;яжіться з нами по телефону.
        </p>
        <Link
          href="/menu/checkout"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
        >
          Спробувати знову
        </Link>
      </Card>
    );
  }

  // PAID
  return (
    <Card>
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <Check className="h-8 w-8 text-emerald-700" strokeWidth={3} />
      </div>
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
        Замовлення прийнято
      </p>
      <h1 className="font-display text-4xl font-semibold text-[#1a3d2e] mb-2">
        №{order.number}
      </h1>
      <p className="text-sm text-[#1a3d2e]/70 mb-8 max-w-md mx-auto">
        Дякуємо! Ми вже отримали ваше замовлення і скоро з вами зв&apos;яжемось.
      </p>

      <div className="border-t border-[#1a3d2e]/10 pt-6 text-left space-y-3">
        <SummaryRow
          icon={order.deliveryType === 'delivery' ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
          label={order.deliveryType === 'delivery' ? 'Доставка' : 'Самовивіз'}
          value={order.deliveryType === 'delivery' ? order.address ?? '—' : 'З ресторану'}
        />
        <SummaryRow
          icon={<Phone className="h-4 w-4" />}
          label="Телефон"
          value={order.customerPhone}
        />
        {order.scheduledAt && (
          <SummaryRow
            icon={<Clock className="h-4 w-4" />}
            label="Час"
            value={new Date(order.scheduledAt).toLocaleString('uk-UA', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          />
        )}
      </div>

      <ul className="divide-y divide-[#1a3d2e]/10 my-6 text-left">
        {order.items.map((i) => (
          <li key={i.menuItemId} className="py-2 flex items-baseline justify-between text-sm">
            <span className="text-[#1a3d2e]/80">
              {i.name} × {i.quantity}
            </span>
            <span className="font-semibold text-[#1a3d2e] tabular-nums">
              {formatPrice(i.price * i.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between border-t border-[#1a3d2e]/10 pt-4 mb-8">
        <span className="font-display text-base font-semibold text-[#1a3d2e]">До сплати</span>
        <span className="font-display text-2xl font-bold text-[#1a3d2e] tabular-nums">
          {formatPrice(order.total)}
        </span>
      </div>

      <Link
        href="/menu"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
      >
        Повернутись до меню
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-10 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] text-center">
      {children}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
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
        <p className="text-[#1a3d2e] font-medium">{value}</p>
      </div>
    </div>
  );
}
