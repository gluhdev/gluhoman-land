'use client';

/**
 * CheckoutForm — client component that:
 *  1. Reads the cart from Zustand
 *  2. Renders form (name/phone/type/address/scheduled/comment)
 *  3. Computes totals locally (server re-validates)
 *  4. POST /api/orders → orderId
 *  5. POST /api/payment/liqpay/create → payload
 *  6. If mode='liqpay': dynamically build a hidden form, submit to LiqPay endpoint
 *     If mode='stub' or 'already-paid': redirect to /menu/checkout/success
 *  7. Clears cart on success start
 */

import { useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Truck, Store, Phone, User, MapPin, Clock, MessageSquare, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import {
  useCartStore,
  getSubtotal,
  getDeliveryFee,
  isAboveMinimum,
  amountToMinimum,
} from '@/lib/cart-store';
import { formatPrice, MIN_ORDER, DeliveryType } from '@/types/cart';

interface FormState {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address: string;
  scheduledMode: 'asap' | 'scheduled';
  scheduledAt: string; // datetime-local string
  comment: string;
}

const INITIAL: FormState = {
  customerName: '',
  customerPhone: '+380',
  deliveryType: 'delivery',
  address: '',
  scheduledMode: 'asap',
  scheduledAt: '',
  comment: '',
};

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => getSubtotal(items), [items]);
  const deliveryFee = useMemo(
    () => getDeliveryFee(subtotal, form.deliveryType),
    [subtotal, form.deliveryType]
  );
  const total = subtotal + deliveryFee;
  const aboveMin = isAboveMinimum(subtotal);
  const toMin = amountToMinimum(subtotal);

  // Empty-cart state
  if (items.length === 0) {
    return (
      <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-12 text-center shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#1a3d2e]/8 flex items-center justify-center mb-5">
          <ShoppingBag className="h-7 w-7 text-[#1a3d2e]/40" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-2">
          Кошик порожній
        </h2>
        <p className="text-sm text-[#1a3d2e]/60 mb-6">
          Спочатку оберіть страви з меню.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Повернутись до меню
        </Link>
      </div>
    );
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const validate = (): string | null => {
    if (form.customerName.trim().length < 2) return 'Введіть ім\'я';
    if (!/^\+?[\d\s()-]{10,}$/.test(form.customerPhone.trim())) {
      return 'Введіть коректний телефон';
    }
    if (form.deliveryType === 'delivery' && form.address.trim().length < 5) {
      return 'Введіть адресу доставки';
    }
    if (form.scheduledMode === 'scheduled' && !form.scheduledAt) {
      return 'Оберіть час доставки';
    }
    if (!aboveMin) {
      return `Мінімальна сума замовлення — ${MIN_ORDER} грн`;
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          deliveryType: form.deliveryType,
          address: form.deliveryType === 'delivery' ? form.address.trim() : undefined,
          scheduledAt:
            form.scheduledMode === 'scheduled' && form.scheduledAt
              ? new Date(form.scheduledAt).toISOString()
              : null,
          comment: form.comment.trim() || undefined,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось створити замовлення');
      }
      const order = (await orderRes.json()) as { id: string; number: number };

      // 2. Get payment payload
      const payRes = await fetch('/api/payment/liqpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!payRes.ok) {
        const data = await payRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось ініціювати оплату');
      }
      const pay = (await payRes.json()) as
        | { mode: 'liqpay'; data: string; signature: string; endpoint: string; orderId: string }
        | { mode: 'stub'; orderId: string }
        | { mode: 'already-paid'; orderId: string };

      // 3. Clear cart
      clearCart();

      // 4. Dispatch by mode
      if (pay.mode === 'stub' || pay.mode === 'already-paid') {
        router.push(`/menu/checkout/success?id=${pay.orderId}`);
        return;
      }

      // Real LiqPay: build a hidden form and submit
      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = pay.endpoint;
      formEl.acceptCharset = 'utf-8';

      const dataInput = document.createElement('input');
      dataInput.type = 'hidden';
      dataInput.name = 'data';
      dataInput.value = pay.data;
      formEl.appendChild(dataInput);

      const sigInput = document.createElement('input');
      sigInput.type = 'hidden';
      sigInput.name = 'signature';
      sigInput.value = pay.signature;
      formEl.appendChild(sigInput);

      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* LEFT: form */}
      <div className="space-y-5">
        {/* Contact card */}
        <Section title="Контактні дані" icon={<User className="h-4 w-4" />}>
          <Field label="Ім'я" required>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              required
              autoComplete="name"
              placeholder="Іван Петренко"
              className={inputClass}
            />
          </Field>
          <Field label="Телефон" required icon={<Phone className="h-3.5 w-3.5" />}>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => update('customerPhone', e.target.value)}
              required
              autoComplete="tel"
              placeholder="+380 50 850 35 55"
              className={inputClass}
            />
          </Field>
        </Section>

        {/* Delivery type */}
        <Section title="Спосіб отримання" icon={<Truck className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              checked={form.deliveryType === 'delivery'}
              onClick={() => update('deliveryType', 'delivery')}
              icon={<Truck className="h-5 w-5" />}
              title="Доставка"
              hint="100 грн (від 2000 грн — безкоштовно)"
            />
            <RadioCard
              checked={form.deliveryType === 'pickup'}
              onClick={() => update('deliveryType', 'pickup')}
              icon={<Store className="h-5 w-5" />}
              title="Самовивіз"
              hint="З ресторану, безкоштовно"
            />
          </div>

          {form.deliveryType === 'delivery' && (
            <Field label="Адреса" required icon={<MapPin className="h-3.5 w-3.5" />}>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                required
                autoComplete="street-address"
                placeholder="вул. Шевченка 1, Полтава"
                className={inputClass}
              />
            </Field>
          )}
        </Section>

        {/* Time */}
        <Section title="Час" icon={<Clock className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              checked={form.scheduledMode === 'asap'}
              onClick={() => update('scheduledMode', 'asap')}
              title="Якнайшвидше"
              hint="Готуємо одразу"
            />
            <RadioCard
              checked={form.scheduledMode === 'scheduled'}
              onClick={() => update('scheduledMode', 'scheduled')}
              title="На час"
              hint="Оберіть час нижче"
            />
          </div>

          {form.scheduledMode === 'scheduled' && (
            <Field label="Коли подати" required>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => update('scheduledAt', e.target.value)}
                required
                min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
                className={inputClass}
              />
            </Field>
          )}
        </Section>

        {/* Comment */}
        <Section title="Коментар" icon={<MessageSquare className="h-4 w-4" />}>
          <textarea
            value={form.comment}
            onChange={(e) => update('comment', e.target.value)}
            placeholder="Побажання, особливості, додаткові інструкції…"
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </Section>
      </div>

      {/* RIGHT: order summary (sticky on desktop) */}
      <div className="lg:sticky lg:top-32 lg:self-start space-y-4">
        <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a3d2e]/10 bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/30">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
              Ваше замовлення
            </p>
            <h2 className="font-display text-xl font-semibold text-[#1a3d2e] mt-1">
              {items.length} {items.length === 1 ? 'позиція' : items.length < 5 ? 'позиції' : 'позицій'}
            </h2>
          </div>

          <ul className="divide-y divide-[#1a3d2e]/8 px-5">
            {items.map((i) => (
              <li key={i.menuItemId} className="py-3 flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-[#1a3d2e] line-clamp-2 leading-snug">{i.name}</p>
                  <p className="text-xs text-[#1a3d2e]/55 mt-0.5 tabular-nums">
                    {i.quantity} × {i.price} ₴
                  </p>
                </div>
                <p className="font-semibold text-[#1a3d2e] whitespace-nowrap tabular-nums">
                  {formatPrice(i.price * i.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-[#1a3d2e]/10 space-y-1.5 text-sm bg-[#f4ecd8]/30">
            <div className="flex justify-between text-[#1a3d2e]/70">
              <span>Сума</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#1a3d2e]/70">
              <span>Доставка</span>
              <span className="tabular-nums">
                {deliveryFee === 0 ? (
                  <span className="text-[#1a3d2e] font-semibold">безкоштовно</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#1a3d2e]/10 text-base font-bold text-[#1a3d2e]">
              <span>До сплати</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Min order warning */}
        {!aboveMin && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-snug">
              Мінімум <strong>{MIN_ORDER} грн</strong>. Додайте ще {formatPrice(toMin)}.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800 leading-snug">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !aboveMin}
          className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all duration-300 disabled:bg-[#1a3d2e]/15 disabled:text-[#1a3d2e]/40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Lock className="h-4 w-4" />
          {submitting ? 'Створюємо замовлення…' : `Сплатити ${formatPrice(total)}`}
        </button>

        <p className="text-[10px] text-center text-[#1a3d2e]/50 leading-relaxed">
          Натискаючи кнопку, ви погоджуєтесь з умовами обслуговування. Оплата через захищений шлюз LiqPay.
        </p>

        <Link
          href="/menu"
          className="block text-center text-xs font-semibold text-[#1a3d2e]/70 hover:text-[#1a3d2e] underline underline-offset-4"
        >
          ← Повернутись до меню
        </Link>
      </div>
    </form>
  );
}

/* ─── Small UI helpers ─── */

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:ring-2 focus:ring-[#1a3d2e]/10 transition-all';

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-display text-base font-semibold text-[#1a3d2e]">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-[#1a3d2e]/70 uppercase tracking-wider">
        {icon}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}

function RadioCard({
  checked,
  onClick,
  icon,
  title,
  hint,
}: {
  checked: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
        checked
          ? 'border-[#1a3d2e] bg-[#1a3d2e]/5 shadow-md shadow-[#1a3d2e]/10'
          : 'border-[#1a3d2e]/12 bg-white hover:border-[#1a3d2e]/30'
      }`}
    >
      {icon && (
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
            checked ? 'bg-[#1a3d2e] text-[#fdfaf0]' : 'bg-[#1a3d2e]/8 text-[#1a3d2e]'
          }`}
        >
          {icon}
        </div>
      )}
      <p className={`font-semibold text-sm ${checked ? 'text-[#1a3d2e]' : 'text-[#1a3d2e]/80'}`}>
        {title}
      </p>
      {hint && <p className="text-[10px] text-[#1a3d2e]/55 mt-0.5 leading-tight">{hint}</p>}
    </button>
  );
}
