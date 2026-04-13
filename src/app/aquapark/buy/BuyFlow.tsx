'use client';

/**
 * Aquapark ticket purchase flow — single page with stepper.
 *
 *  1. Date    — pick visit date
 *  2. Tariffs — select quantities for each tariff
 *  3. Confirm — name/phone/email → POST /api/aquapark/tickets → POST /api/payment/liqpay/create
 */

import { useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  ArrowLeft,
  Lock,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Mail,
  Plus,
  Minus,
  Ticket,
} from 'lucide-react';
import { formatPrice } from '@/types/cart';
import { AquaparkTariff } from '@/types/aquapark';

type Step = 'date' | 'tariffs' | 'confirm';

const todayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export function BuyFlow({ tariffs }: { tariffs: AquaparkTariff[] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('date');
  const [date, setDate] = useState(todayISO(0));
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customer, setCustomer] = useState({ name: '', phone: '+380', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return tariffs.reduce((sum, t) => sum + t.price * (quantities[t.id] ?? 0), 0);
  }, [tariffs, quantities]);

  const totalCount = useMemo(() => {
    return Object.values(quantities).reduce((sum, q) => sum + q, 0);
  }, [quantities]);

  const setQty = (id: string, delta: number) => {
    setQuantities((q) => {
      const current = q[id] ?? 0;
      const next = Math.max(0, Math.min(20, current + delta));
      const updated = { ...q };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const handleDate = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (new Date(date) < new Date(todayISO())) {
      setError('Дата має бути сьогодні або в майбутньому');
      return;
    }
    setStep('tariffs');
  };

  const handleTariffs = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (totalCount === 0) {
      setError('Оберіть хоча б один квиток');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (customer.name.trim().length < 2) {
      setError("Введіть ім'я");
      return;
    }
    if (!/^\+?[\d\s()-]{10,}$/.test(customer.phone.trim())) {
      setError('Введіть коректний телефон');
      return;
    }

    setLoading(true);
    try {
      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([tariffId, quantity]) => ({ tariffId, quantity }));

      const createRes = await fetch('/api/aquapark/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          customerEmail: customer.email.trim() || undefined,
          items,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось створити квиток');
      }
      const ticket = (await createRes.json()) as { id: string };

      const payRes = await fetch('/api/payment/liqpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'aquapark', entityId: ticket.id }),
      });
      if (!payRes.ok) {
        const data = await payRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось ініціювати оплату');
      }
      const pay = (await payRes.json()) as
        | { mode: 'liqpay'; data: string; signature: string; endpoint: string }
        | { mode: 'stub' }
        | { mode: 'already-paid' };

      if (pay.mode === 'stub' || pay.mode === 'already-paid') {
        router.push(`/aquapark/buy/success?id=${ticket.id}`);
        return;
      }

      // Real LiqPay
      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = pay.endpoint;
      formEl.acceptCharset = 'utf-8';
      const di = document.createElement('input');
      di.type = 'hidden';
      di.name = 'data';
      di.value = pay.data;
      formEl.appendChild(di);
      const si = document.createElement('input');
      si.type = 'hidden';
      si.name = 'signature';
      si.value = pay.signature;
      formEl.appendChild(si);
      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
      setLoading(false);
    }
  };

  /* ─── Render ─── */

  if (step === 'date') {
    return (
      <Section>
        <StepBadge step={1} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
          Оберіть дату візиту
        </h2>
        <form onSubmit={handleDate} className="space-y-4 max-w-md">
          <Field label="Дата" icon={<Calendar className="h-3.5 w-3.5" />} required>
            <input
              type="date"
              required
              min={todayISO()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>
          {error && <ErrorBox message={error} />}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all"
          >
            Далі — обрати квитки →
          </button>
        </form>
      </Section>
    );
  }

  if (step === 'tariffs') {
    return (
      <Section>
        <BackButton onClick={() => setStep('date')} />
        <StepBadge step={2} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-2">
          Оберіть квитки
        </h2>
        <p className="text-sm text-[#1a3d2e]/60 mb-6">
          Дата візиту: {new Date(date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}
        </p>

        <form onSubmit={handleTariffs} className="space-y-3">
          {tariffs.map((tariff) => {
            const qty = quantities[tariff.id] ?? 0;
            return (
              <div
                key={tariff.id}
                className="flex items-center gap-4 bg-white border border-[#1a3d2e]/12 rounded-2xl p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-[#1a3d2e]">
                    {tariff.name}
                  </h3>
                  {tariff.description && (
                    <p className="text-xs text-[#1a3d2e]/60 leading-snug mt-0.5">
                      {tariff.description}
                    </p>
                  )}
                  <p className="text-sm font-bold text-[#1a3d2e] mt-1 tabular-nums">
                    {formatPrice(tariff.price)}
                  </p>
                </div>
                <div className="inline-flex items-center bg-[#f4ecd8]/60 border border-[#1a3d2e]/15 rounded-full">
                  <button
                    type="button"
                    onClick={() => setQty(tariff.id, -1)}
                    aria-label="Менше"
                    disabled={qty === 0}
                    className="w-9 h-9 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-[#1a3d2e] tabular-nums min-w-[2em] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(tariff.id, 1)}
                    aria-label="Більше"
                    className="w-9 h-9 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-[#f4ecd8]/40 border border-[#1a3d2e]/12 rounded-2xl p-4 flex items-center justify-between mt-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/60 font-semibold">
                Підсумок
              </p>
              <p className="text-sm text-[#1a3d2e]/70">
                {totalCount} {totalCount === 1 ? 'квиток' : totalCount < 5 ? 'квитки' : 'квитків'}
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-[#1a3d2e] tabular-nums">
              {formatPrice(subtotal)}
            </p>
          </div>

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={totalCount === 0}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all disabled:bg-[#1a3d2e]/15 disabled:text-[#1a3d2e]/40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Далі — оформити →
          </button>
        </form>
      </Section>
    );
  }

  // step === 'confirm'
  return (
    <Section>
      <BackButton onClick={() => setStep('tariffs')} />
      <StepBadge step={3} />
      <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
        Оформлення замовлення
      </h2>

      <form onSubmit={handleConfirm} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <Field label="Ім'я" icon={<User className="h-3.5 w-3.5" />} required>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              placeholder="Іван Петренко"
              className={inputClass}
            />
          </Field>
          <Field label="Телефон" icon={<Phone className="h-3.5 w-3.5" />} required>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              placeholder="+380 50 850 35 55"
              className={inputClass}
            />
          </Field>
          <Field label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
              placeholder="example@gmail.com (для отримання QR)"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start space-y-4">
          <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a3d2e]/10 bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
                Ваше замовлення
              </p>
              <p className="text-xs text-[#1a3d2e]/70 mt-1">
                {new Date(date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}
              </p>
            </div>
            <ul className="px-5 py-3 space-y-2 text-sm">
              {tariffs
                .filter((t) => quantities[t.id] > 0)
                .map((t) => (
                  <li key={t.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-[#1a3d2e]">
                      {t.name} × {quantities[t.id]}
                    </span>
                    <span className="font-semibold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      {formatPrice(t.price * quantities[t.id])}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="px-5 py-4 border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/30 flex justify-between text-base font-bold text-[#1a3d2e]">
              <span>До сплати</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? 'Створюємо квиток…' : `Сплатити ${formatPrice(subtotal)}`}
          </button>

          <p className="text-[10px] text-center text-[#1a3d2e]/50 leading-relaxed">
            Після оплати QR-код з&apos;явиться на наступному екрані. Покажете його на вході в аквапарк.
          </p>
        </div>
      </form>
    </Section>
  );
}

/* ─── UI helpers ─── */

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:ring-2 focus:ring-[#1a3d2e]/10 transition-all';

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-6 lg:p-10 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
      {children}
    </div>
  );
}

function StepBadge({ step }: { step: number }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
        Крок {step} з 3
      </span>
      <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
          <span key={s} className={`h-1 w-6 rounded-full ${s <= step ? 'bg-[#1a3d2e]' : 'bg-[#1a3d2e]/15'}`} />
        ))}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-4 -mt-2"
    >
      <ArrowLeft className="h-3 w-3" />
      Назад
    </button>
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

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-800 leading-snug">{message}</p>
    </div>
  );
}
