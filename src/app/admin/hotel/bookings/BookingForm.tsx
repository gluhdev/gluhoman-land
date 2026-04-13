'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  pricePerNight: number;
}

interface Initial {
  roomId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string | null;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  comment?: string | null;
}

interface Props {
  mode: 'create' | 'edit';
  bookingId?: string;
  rooms: Room[];
  initial?: Initial;
}

const TYPE_LABEL: Record<string, string> = {
  standard: 'Стандарт',
  lux: 'Люкс',
  family: 'Сімейний',
  suite: 'Світ',
};

export function BookingForm({ mode, bookingId, rooms, initial = {} }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    roomId: initial.roomId ?? rooms[0]?.id ?? '',
    customerName: initial.customerName ?? '',
    customerPhone: initial.customerPhone ?? '',
    customerEmail: initial.customerEmail ?? '',
    checkIn: initial.checkIn ?? '',
    checkOut: initial.checkOut ?? '',
    guests: initial.guests ?? 2,
    comment: initial.comment ?? '',
    paymentMode: 'cash' as 'online' | 'cash' | 'paid-offline',
  });

  const selectedRoom = rooms.find((r) => r.id === form.roomId);
  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
          )
        )
      : 0;
  const total = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        const url =
          mode === 'create'
            ? '/api/admin/hotel/bookings/manual'
            : `/api/admin/hotel/bookings/${bookingId}`;
        const method = mode === 'create' ? 'POST' : 'PUT';
        const body =
          mode === 'create'
            ? form
            : {
                roomId: form.roomId,
                customerName: form.customerName,
                customerPhone: form.customerPhone,
                customerEmail: form.customerEmail,
                checkIn: form.checkIn,
                checkOut: form.checkOut,
                guests: form.guests,
                comment: form.comment,
              };
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(
            typeof j.error === 'string' ? j.error : 'Не вдалося зберегти бронювання'
          );
        }
        const { booking } = await res.json();
        router.push(`/admin/hotel/bookings/${booking.id}`);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Помилка');
      }
    });
  };

  return (
    <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Номер" required>
          <select
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            className={inputClass}
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                №{r.number} · {TYPE_LABEL[r.type] ?? r.type} · {r.pricePerNight} ₴/ніч · до {r.capacity} гостей
              </option>
            ))}
          </select>
        </Field>
        <Field label="Гостей" required>
          <input
            type="number"
            min={1}
            max={10}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Заїзд" required>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Виїзд" required>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Ім'я клієнта" required>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="Іван Петренко"
            className={inputClass}
          />
        </Field>
        <Field label="Телефон" required>
          <input
            type="tel"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            placeholder="+380 50 123 4567"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          value={form.customerEmail ?? ''}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          placeholder="client@example.com"
          className={inputClass}
        />
      </Field>

      <Field label="Коментар">
        <textarea
          rows={3}
          value={form.comment ?? ''}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {mode === 'create' && (
        <Field label="Оплата">
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { v: 'cash', l: 'Готівка' },
                { v: 'paid-offline', l: 'Вже оплачено' },
                { v: 'online', l: 'Онлайн (LiqPay)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setForm({ ...form, paymentMode: opt.v })}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  form.paymentMode === opt.v
                    ? 'bg-[#1a3d2e] text-[#fdfaf0] border-[#1a3d2e]'
                    : 'bg-white border-[#1a3d2e]/20 text-[#1a3d2e]/70 hover:border-[#1a3d2e]/50'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </Field>
      )}

      {nights > 0 && selectedRoom && (
        <div className="bg-[#f4ecd8]/60 border border-[#1a3d2e]/10 rounded-2xl px-5 py-4 flex justify-between items-center">
          <span className="text-sm text-[#1a3d2e]/75">
            {nights} {nights === 1 ? 'ніч' : nights < 5 ? 'ночі' : 'ночей'} × {selectedRoom.pricePerNight} ₴
          </span>
          <span className="font-display text-2xl font-semibold text-[#1a3d2e] tabular-nums">
            {total} ₴
          </span>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md disabled:opacity-60"
        >
          {isPending ? 'Збереження…' : mode === 'create' ? 'Створити' : 'Зберегти зміни'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-full border border-[#1a3d2e]/20 text-[#1a3d2e]/70 font-semibold text-sm hover:bg-[#1a3d2e]/5 transition"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:bg-white transition-all';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-[#1a3d2e]/70 uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}
