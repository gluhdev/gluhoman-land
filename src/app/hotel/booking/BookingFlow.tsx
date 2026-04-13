'use client';

/**
 * Hotel booking flow — three-step interaction in a single client component:
 *
 *  1. Search   — pick check-in, check-out, guests
 *  2. Rooms    — fetch available rooms via /api/hotel/availability
 *  3. Confirm  — fill name/phone/email/comment → POST /api/hotel/bookings
 *               → POST /api/payment/liqpay/create (entityType: 'hotel')
 *               → redirect to LiqPay or stub success
 */

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DayPicker, DateRange } from 'react-day-picker';
import { uk } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import {
  Calendar,
  Users,
  Search,
  ArrowLeft,
  Lock,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Mail,
  MessageSquare,
  Bed,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice } from '@/types/cart';
import { ROOM_TYPE_LABEL } from '@/types/booking';

interface AvailableRoom {
  id: string;
  number: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  description: string | null;
  images: string[];
  total: number;
}

interface SearchState {
  checkIn: string;
  checkOut: string;
  guests: number;
}

type Step = 'search' | 'rooms' | 'confirm';

const todayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

export function BookingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('search');
  const [search, setSearch] = useState<SearchState>({
    checkIn: todayISO(1),
    checkOut: todayISO(2),
    guests: 2,
  });
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [nights, setNights] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);
  const [customer, setCustomer] = useState({ name: '', phone: '+380', email: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [fullyBooked, setFullyBooked] = useState<Date[]>([]);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(search.checkIn),
    to: new Date(search.checkOut),
  });

  useEffect(() => {
    const y = displayMonth.getFullYear();
    const m = displayMonth.getMonth() + 1;
    const controller = new AbortController();
    fetch(`/api/hotel/availability/month?year=${y}&month=${m}&guests=${search.guests}`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const booked: Date[] = [];
        for (const day of data.days as { date: string; availableRooms: number }[]) {
          if (day.availableRooms <= 0) {
            const [yy, mm, dd] = day.date.split('-').map(Number);
            booked.push(new Date(yy, mm - 1, dd));
          }
        }
        setFullyBooked(booked);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [displayMonth, search.guests]);

  useEffect(() => {
    if (range?.from && range?.to) {
      const ci = toISODate(range.from);
      const co = toISODate(range.to);
      setSearch((s) => ({ ...s, checkIn: ci, checkOut: co }));
    }
  }, [range]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!range?.from || !range?.to) {
      setError('Оберіть дати заїзду та виїзду');
      return;
    }
    if (range.to.getTime() <= range.from.getTime()) {
      setError('Дата виїзду має бути після дати заїзду');
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests.toString(),
      });
      const res = await fetch(`/api/hotel/availability?${params}`);
      if (!res.ok) throw new Error('Помилка пошуку');
      const data = (await res.json()) as { rooms: AvailableRoom[]; nights: number };
      setRooms(data.rooms);
      setNights(data.nights);
      setStep('rooms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedRoom) return;
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
      // 1. Create booking
      const createRes = await fetch('/api/hotel/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          customerEmail: customer.email.trim() || undefined,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          guests: search.guests,
          comment: customer.comment.trim() || undefined,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось створити бронювання');
      }
      const booking = (await createRes.json()) as { id: string; number: number };

      // 2. Initiate payment
      const payRes = await fetch('/api/payment/liqpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'hotel', entityId: booking.id }),
      });
      if (!payRes.ok) {
        const data = await payRes.json().catch(() => ({}));
        throw new Error(data.error ?? 'Не вдалось ініціювати оплату');
      }
      const pay = (await payRes.json()) as
        | { mode: 'liqpay'; data: string; signature: string; endpoint: string }
        | { mode: 'stub' }
        | { mode: 'already-paid' };

      // 3. Dispatch
      if (pay.mode === 'stub' || pay.mode === 'already-paid') {
        router.push(`/hotel/booking/success?id=${booking.id}`);
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

  /* ─── Render by step ─── */

  if (step === 'search') {
    return (
      <Section>
        <StepBadge step={1} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
          Оберіть дати та кількість гостей
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <Field label="Дати заїзду та виїзду" icon={<Calendar className="h-3.5 w-3.5" />}>
            <div className="rdp-wrapper rounded-2xl border border-[#1a3d2e]/15 bg-white p-2 sm:p-3 overflow-x-auto">
              <DayPicker
                mode="range"
                locale={uk}
                selected={range}
                onSelect={setRange}
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                disabled={[{ before: new Date() }, ...fullyBooked]}
                numberOfMonths={1}
                modifiersClassNames={{
                  selected: 'rdp-day_selected-custom',
                  range_start: 'rdp-day_range-start',
                  range_end: 'rdp-day_range-end',
                  range_middle: 'rdp-day_range-middle',
                  disabled: 'rdp-day_disabled-custom',
                }}
              />
            </div>
            {range?.from && range?.to && (
              <p className="text-[11px] text-[#1a3d2e]/60 mt-2">
                {range.from.toLocaleDateString('uk-UA', { dateStyle: 'long' })} →{' '}
                {range.to.toLocaleDateString('uk-UA', { dateStyle: 'long' })}
              </p>
            )}
          </Field>

          <Field label="Кількість гостей" icon={<Users className="h-3.5 w-3.5" />}>
            <select
              value={search.guests}
              onChange={(e) => setSearch((s) => ({ ...s, guests: parseInt(e.target.value, 10) }))}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'гість' : n < 5 ? 'гості' : 'гостей'}
                </option>
              ))}
            </select>
          </Field>

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? 'Шукаємо…' : 'Знайти вільні номери'}
          </button>
        </form>
      </Section>
    );
  }

  if (step === 'rooms') {
    return (
      <Section>
        <BackButton onClick={() => setStep('search')} />
        <StepBadge step={2} />
        <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-2">
          {rooms.length === 0 ? 'Немає вільних номерів' : `Знайдено ${rooms.length}`}
        </h2>
        <p className="text-sm text-[#1a3d2e]/60 mb-6">
          {new Date(search.checkIn).toLocaleDateString('uk-UA', { dateStyle: 'long' })} —{' '}
          {new Date(search.checkOut).toLocaleDateString('uk-UA', { dateStyle: 'long' })}
          {' · '}
          {nights} {nights === 1 ? 'ніч' : nights < 5 ? 'ночі' : 'ночей'}
          {' · '}
          {search.guests} {search.guests === 1 ? 'гість' : search.guests < 5 ? 'гості' : 'гостей'}
        </p>

        {rooms.length === 0 ? (
          <div className="bg-[#f4ecd8]/40 border border-[#1a3d2e]/12 rounded-2xl p-8 text-center">
            <Bed className="h-10 w-10 text-[#1a3d2e]/30 mx-auto mb-3" />
            <p className="text-sm text-[#1a3d2e]/70">
              На обрані дати немає вільних номерів. Спробуйте інші дати.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-[#1a3d2e]/12 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:shadow-xl hover:shadow-[#1a3d2e]/10 hover:border-[#1a3d2e]/30 transition-all"
              >
                {room.images?.[0] && (
                  <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
                    <Image src={room.images[0]} alt={`Номер ${room.number}`} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1a3d2e]/55">
                        {ROOM_TYPE_LABEL[room.type] ?? room.type}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#1a3d2e]">
                        Номер {room.number}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-[#1a3d2e]/60 bg-[#1a3d2e]/8 px-2 py-1 rounded-full whitespace-nowrap">
                      до {room.capacity} осіб
                    </span>
                  </div>
                  {room.description && (
                    <p className="text-xs text-[#1a3d2e]/65 leading-relaxed mb-4 line-clamp-3">
                      {room.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">
                        {nights} {nights === 1 ? 'ніч' : nights < 5 ? 'ночі' : 'ночей'} × {room.pricePerNight} ₴
                      </p>
                      <p className="font-display text-2xl font-semibold text-[#1a3d2e] tabular-nums">
                        {formatPrice(room.total)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoom(room);
                        setStep('confirm');
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
                    >
                      Обрати →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    );
  }

  // step === 'confirm'
  if (!selectedRoom) {
    setStep('rooms');
    return null;
  }

  return (
    <Section>
      <BackButton onClick={() => setStep('rooms')} />
      <StepBadge step={3} />
      <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] mb-6">
        Підтвердження бронювання
      </h2>

      <form onSubmit={handleConfirm} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <Field label="Ім'я" required icon={<User className="h-3.5 w-3.5" />}>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              placeholder="Іван Петренко"
              className={inputClass}
            />
          </Field>
          <Field label="Телефон" required icon={<Phone className="h-3.5 w-3.5" />}>
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
          <Field label="Коментар" icon={<MessageSquare className="h-3.5 w-3.5" />}>
            <textarea
              value={customer.comment}
              onChange={(e) => setCustomer((c) => ({ ...c, comment: e.target.value }))}
              rows={3}
              maxLength={500}
              placeholder="Особливі побажання…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start space-y-4">
          <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a3d2e]/10 bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
                Ваше бронювання
              </p>
              <h3 className="font-display text-lg font-semibold text-[#1a3d2e] mt-1">
                Номер {selectedRoom.number}
              </h3>
              <p className="text-xs text-[#1a3d2e]/60">{ROOM_TYPE_LABEL[selectedRoom.type] ?? selectedRoom.type}</p>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <Row label="Заїзд" value={new Date(search.checkIn).toLocaleDateString('uk-UA', { dateStyle: 'medium' })} />
              <Row label="Виїзд" value={new Date(search.checkOut).toLocaleDateString('uk-UA', { dateStyle: 'medium' })} />
              <Row label="Гостей" value={search.guests.toString()} />
              <Row label="Ночей" value={nights.toString()} />
              <Row label="Ціна за ніч" value={`${selectedRoom.pricePerNight} ₴`} />
              <div className="border-t border-[#1a3d2e]/10 pt-3 mt-3 flex justify-between text-base font-bold text-[#1a3d2e]">
                <span>До сплати</span>
                <span className="tabular-nums">{formatPrice(selectedRoom.total)}</span>
              </div>
            </div>
          </div>

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? 'Створюємо бронювання…' : `Сплатити ${formatPrice(selectedRoom.total)}`}
          </button>

          <p className="text-[10px] text-center text-[#1a3d2e]/50 leading-relaxed">
            Оплата через захищений шлюз LiqPay. Підтвердження надійде на ваш телефон.
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
          <span
            key={s}
            className={`h-1 w-6 rounded-full ${
              s <= step ? 'bg-[#1a3d2e]' : 'bg-[#1a3d2e]/15'
            }`}
          />
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
