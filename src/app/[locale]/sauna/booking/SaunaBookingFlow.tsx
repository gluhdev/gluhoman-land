'use client';

/**
 * Sauna booking flow — 3 steps:
 *  1. Date    — pick date
 *  2. Slot    — see grid (Small | Big × 7 time windows), pick a free one
 *  3. Confirm — name/phone/email/comment → POST /api/sauna/bookings → LiqPay
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
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
  MessageSquare,
  Flame,
  Clock,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatPrice } from '@/types/cart';
import { SaunaType, VirtualSlot } from '@/types/sauna';

type Step = 'date' | 'slot' | 'confirm';

const todayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

interface SelectedSlot {
  startTime: string;
  endTime: string;
  saunaType: SaunaType;
  price: number;
}

export function SaunaBookingFlow() {
  const tc = useTranslations('flow.common');
  const ts = useTranslations('flow.sauna');
  const locale = useLocale();
  const dateLocale = locale === 'en' ? 'en-GB' : 'uk-UA';
  const typeLabel = (type: SaunaType) => ts(type === 'small' ? 'type_small' : 'type_big');
  const router = useRouter();
  const [step, setStep] = useState<Step>('date');
  const [date, setDate] = useState(todayISO(0));
  const [slots, setSlots] = useState<VirtualSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [customer, setCustomer] = useState({ name: '', phone: '+380', email: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setError(null);
    try {
      const res = await fetch(`/api/sauna/availability?date=${date}`);
      if (!res.ok) throw new Error(tc('error_load'));
      const data = (await res.json()) as { slots: VirtualSlot[] };
      setSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : tc('error_generic'));
    } finally {
      setLoadingSlots(false);
    }
  };

  // Auto-fetch when entering step 'slot'
  useEffect(() => {
    if (step === 'slot') fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, date]);

  const handleDate = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (new Date(date) < new Date(todayISO())) {
      setError(tc('error_date_future'));
      return;
    }
    setStep('slot');
  };

  const slotsByType = useMemo(() => {
    const small = slots.filter((s) => s.saunaType === 'small');
    const big = slots.filter((s) => s.saunaType === 'big');
    return { small, big };
  }, [slots]);

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedSlot) return;
    if (customer.name.trim().length < 2) {
      setError(tc('error_name'));
      return;
    }
    if (!/^\+?[\d\s()-]{10,}$/.test(customer.phone.trim())) {
      setError(tc('error_phone'));
      return;
    }

    setSubmitting(true);
    try {
      const createRes = await fetch('/api/sauna/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          saunaType: selectedSlot.saunaType,
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          customerEmail: customer.email.trim() || undefined,
          comment: customer.comment.trim() || undefined,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error ?? tc('error_booking_create'));
      }
      const booking = (await createRes.json()) as { id: string };

      const payRes = await fetch('/api/payment/liqpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'sauna', entityId: booking.id }),
      });
      if (!payRes.ok) {
        const data = await payRes.json().catch(() => ({}));
        throw new Error(data.error ?? tc('error_payment_init'));
      }
      const pay = (await payRes.json()) as
        | { mode: 'liqpay'; data: string; signature: string; endpoint: string }
        | { mode: 'stub' }
        | { mode: 'already-paid' };

      if (pay.mode === 'stub' || pay.mode === 'already-paid') {
        router.push(`/sauna/booking/success?id=${booking.id}`);
        return;
      }
      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = pay.endpoint;
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
      setError(err instanceof Error ? err.message : tc('error_generic'));
      setSubmitting(false);
    }
  };

  /* ─── Render ─── */

  if (step === 'date') {
    return (
      <Section>
        <StepBadge step={1} label={tc('step_of', { step: 1, total: 3 })} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
          {ts('step1_heading')}
        </h2>
        <form onSubmit={handleDate} className="space-y-4 max-w-md">
          <Field label={tc('field_date')} icon={<Calendar className="h-3.5 w-3.5" />} required>
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
            {ts('step1_next')}
          </button>
        </form>
      </Section>
    );
  }

  if (step === 'slot') {
    return (
      <Section>
        <BackButton onClick={() => setStep('date')} label={tc('back')} />
        <StepBadge step={2} label={tc('step_of', { step: 2, total: 3 })} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-1">
          {ts('step2_heading')}
        </h2>
        <p className="text-sm text-[#1a3d2e]/60 mb-6">
          {ts('step2_date_slot', { date: new Date(date).toLocaleDateString(dateLocale, { dateStyle: 'long' }) })}
        </p>

        {loadingSlots ? (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 text-[#1a3d2e]/40 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {(['small', 'big'] as const).map((type) => {
              const typeSlots = type === 'small' ? slotsByType.small : slotsByType.big;
              return (
                <div key={type} className="bg-white border border-[#1a3d2e]/12 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#1a3d2e]">
                        {typeLabel(type)}
                      </h3>
                      <p className="text-[10px] text-[#1a3d2e]/60 uppercase tracking-wider">
                        {ts('price_per_2h', { price: typeSlots[0]?.price ?? 0 })}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {typeSlots.map((slot) => {
                      const isSelected =
                        selectedSlot?.startTime === slot.startTime &&
                        selectedSlot?.saunaType === slot.saunaType;
                      const isFree = slot.status === 'free';
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!isFree}
                          onClick={() => {
                            setSelectedSlot({
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                              saunaType: slot.saunaType,
                              price: slot.price,
                            });
                          }}
                          className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            !isFree
                              ? 'bg-[#1a3d2e]/5 text-[#1a3d2e]/30 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#1a3d2e] text-[#fdfaf0] shadow-md scale-[1.02]'
                              : 'bg-[#f4ecd8]/60 text-[#1a3d2e] hover:bg-[#1a3d2e]/12 border border-[#1a3d2e]/15'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {slot.startTime}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && <div className="mt-4"><ErrorBox message={error} /></div>}

        {selectedSlot && (
          <div className="mt-6 flex items-center justify-between gap-4 bg-[#f4ecd8]/40 border border-[#1a3d2e]/12 rounded-2xl p-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/60 font-semibold">
                {ts('slot_selected')}
              </p>
              <p className="text-sm font-semibold text-[#1a3d2e]">
                {typeLabel(selectedSlot.saunaType)} · {selectedSlot.startTime}–{selectedSlot.endTime}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep('confirm')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
            >
              {ts('step2_next')}
            </button>
          </div>
        )}
      </Section>
    );
  }

  // step === 'confirm'
  if (!selectedSlot) {
    setStep('slot');
    return null;
  }

  return (
    <Section>
      <BackButton onClick={() => setStep('slot')} label={tc('back')} />
      <StepBadge step={3} label={tc('step_of', { step: 3, total: 3 })} />
      <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
        {ts('step3_heading')}
      </h2>

      <form onSubmit={handleConfirm} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <Field label={tc('field_name')} icon={<User className="h-3.5 w-3.5" />} required>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              placeholder={tc('placeholder_name')}
              className={inputClass}
            />
          </Field>
          <Field label={tc('field_phone')} icon={<Phone className="h-3.5 w-3.5" />} required>
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
              placeholder="example@gmail.com"
              className={inputClass}
            />
          </Field>
          <Field label={tc('field_comment')} icon={<MessageSquare className="h-3.5 w-3.5" />}>
            <textarea
              value={customer.comment}
              onChange={(e) => setCustomer((c) => ({ ...c, comment: e.target.value }))}
              rows={3}
              maxLength={500}
              placeholder={tc('placeholder_comment')}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start space-y-4">
          <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a3d2e]/10 bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
                {tc('your_booking')}
              </p>
              <h3 className="font-display text-lg font-semibold text-[#1a3d2e] mt-1">
                {typeLabel(selectedSlot.saunaType)}
              </h3>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <Row
                label={ts('row_date')}
                value={new Date(date).toLocaleDateString(dateLocale, { dateStyle: 'medium' })}
              />
              <Row label={ts('row_time')} value={`${selectedSlot.startTime} — ${selectedSlot.endTime}`} />
              <Row label={ts('row_duration')} value={ts('duration_value')} />
              <div className="border-t border-[#1a3d2e]/10 pt-3 mt-3 flex justify-between text-base font-bold text-[#1a3d2e]">
                <span>{tc('amount_due')}</span>
                <span className="tabular-nums">{formatPrice(selectedSlot.price)}</span>
              </div>
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting ? ts('creating') : tc('pay_label', { price: formatPrice(selectedSlot.price) })}
          </button>
        </div>
      </form>
    </Section>
  );
}

/* ─── Helpers ─── */

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:ring-2 focus:ring-[#1a3d2e]/10 transition-all';

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-6 lg:p-10 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
      {children}
    </div>
  );
}

function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
          <span key={s} className={`h-1 w-6 rounded-full ${s <= step ? 'bg-[#1a3d2e]' : 'bg-[#1a3d2e]/15'}`} />
        ))}
      </div>
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-4 -mt-2"
    >
      <ArrowLeft className="h-3 w-3" />
      {label}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#1a3d2e]/70">
      <span>{label}</span>
      <span className="tabular-nums text-[#1a3d2e]">{value}</span>
    </div>
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
