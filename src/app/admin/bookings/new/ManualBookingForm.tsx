'use client';

import { useState, useMemo, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarPlus, Loader2, X } from 'lucide-react';
import type { AdminHotel } from '@/lib/admin-hotels';
import { createManualBooking, type BookingStatusValue } from '../actions';

export interface HotelOption {
  slug: string;
  label: string;
  rooms: { slug: string; name: string }[];
}

interface Props {
  hotels: HotelOption[];
  scopedHotel: string | null;
  allHotels: AdminHotel[];
}

const STATUS_OPTIONS: { value: BookingStatusValue; label: string }[] = [
  { value: 'CONFIRMED', label: 'Підтверджено' },
  { value: 'PENDING', label: 'Очікує' },
  { value: 'COMPLETED', label: 'Виконано' },
];

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function ManualBookingForm({ hotels, scopedHotel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [hotel, setHotel] = useState(scopedHotel ?? hotels[0]?.slug ?? '');
  const rooms = useMemo(
    () => hotels.find((h) => h.slug === hotel)?.rooms ?? [],
    [hotels, hotel]
  );
  const [room, setRoom] = useState(rooms[0]?.slug ?? '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState('2');
  const [dateFrom, setDateFrom] = useState(todayISO());
  const [dateTo, setDateTo] = useState(todayISO(1));
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<BookingStatusValue>('CONFIRMED');
  const [error, setError] = useState<string | null>(null);

  // Keep the selected room valid when the hotel changes.
  function onHotelChange(slug: string) {
    setHotel(slug);
    const next = hotels.find((h) => h.slug === slug)?.rooms ?? [];
    setRoom(next[0]?.slug ?? '');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createManualBooking({
        hotelSlug: hotel,
        roomCategorySlug: room,
        name,
        phone,
        email,
        guests: parseInt(guests, 10) || 1,
        dateFrom,
        dateTo: dateTo || undefined,
        comment,
        status,
      });
      if (!res.ok) {
        setError(res.error ?? 'Помилка');
        return;
      }
      router.push('/admin/bookings');
      router.refresh();
    });
  }

  const inputCls =
    'w-full px-3.5 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] placeholder:text-[#1a3d2e]/35 focus:outline-none focus:border-[#1a3d2e]/45 transition-colors';
  const labelCls =
    'text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium';

  return (
    <div className="p-6 lg:p-10">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> До заявок
      </Link>

      <header className="mb-8">
        <p className={labelCls}>CRM · Ручне бронювання</p>
        <h1 className="font-display text-4xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Нове <span className="italic text-[#1a3d2e]/75">бронювання</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
        <p className="mt-5 text-sm text-[#1a3d2e]/70 max-w-xl leading-relaxed">
          Додайте бронювання, отримане телефоном або особисто. Воно зʼявиться у
          списку заявок і враховуватиметься у завантаженості номера.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="max-w-2xl bg-white border border-[#1a3d2e]/10 p-6 lg:p-8 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Готель</span>
            <select
              value={hotel}
              onChange={(e) => onHotelChange(e.target.value)}
              disabled={!!scopedHotel}
              className={`${inputCls} disabled:opacity-60`}
            >
              {hotels.map((h) => (
                <option key={h.slug} value={h.slug}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className={labelCls}>Номер / категорія</span>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className={inputCls}
            >
              {rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Заїзд</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              required
              className={inputCls}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelCls}>Виїзд</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelCls}>Гостей</span>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={inputCls}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Імʼя гостя</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Олена"
              className={inputCls}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelCls}>Телефон</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+380…"
              className={inputCls}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Email (необовʼязково)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
              className={inputCls}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={labelCls}>Статус</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatusValue)}
              className={inputCls}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className={labelCls}>Коментар (необовʼязково)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Побажання гостя, деталі оплати…"
            className={`${inputCls} resize-y`}
          />
        </label>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200">
            <X className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a3d2e] text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
            Створити бронювання
          </button>
          <Link
            href="/admin/bookings"
            className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 font-medium hover:text-[#1a3d2e]"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}
