'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Check, Clock, Phone, Calendar, Bed, Loader2, ArrowRight, Users } from 'lucide-react';
import { formatPrice } from '@/types/cart';
import { HotelBooking, ROOM_TYPE_LABEL, getNights } from '@/types/booking';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 60_000;

export function BookingSuccessClient({ bookingId }: { bookingId: string }) {
  const t = useTranslations('booking.hotel');
  const tc = useTranslations('booking.common');
  const [booking, setBooking] = useState<HotelBooking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError(t('error_no_id'));
      return;
    }
    let cancelled = false;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const res = await fetch(`/api/hotel/bookings/${bookingId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('not found');
        const data = (await res.json()) as HotelBooking;
        if (cancelled) return;
        setBooking(data);
        if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed') return;
        if (Date.now() - startedAt > MAX_POLL_MS) {
          setPollingTimedOut(true);
          return;
        }
        setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setError(t('error_load'));
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [bookingId, t]);

  if (error) {
    return <Card><h1 className="font-display text-2xl font-semibold text-[#1a3d2e]">{error}</h1></Card>;
  }
  if (!booking) {
    return (
      <Card>
        <Loader2 className="h-10 w-10 text-[#1a3d2e] animate-spin mx-auto mb-4" />
        <p className="text-[#1a3d2e]/70">{tc('loading')}</p>
      </Card>
    );
  }

  if (booking.paymentStatus === 'pending') {
    return (
      <Card>
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <Clock className="h-8 w-8 text-amber-700" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
          {t('pending_ref', { number: booking.number })}
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          {tc('payment_pending_heading')}
        </h1>
        <p className="text-sm text-[#1a3d2e]/70 mb-6 max-w-md mx-auto">
          {pollingTimedOut ? t('pending_timeout') : t('pending_checking')}
        </p>
        {!pollingTimedOut && <Loader2 className="h-6 w-6 text-[#1a3d2e]/40 animate-spin mx-auto" />}
      </Card>
    );
  }

  if (booking.paymentStatus === 'failed') {
    return (
      <Card>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          {tc('payment_failed_heading')}
        </h1>
        <Link
          href="/hotel/booking"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
        >
          {tc('try_again')}
        </Link>
      </Card>
    );
  }

  // PAID
  const nights = getNights(booking.checkIn, booking.checkOut);
  const nightsLabel = nights === 1 ? t('nights_one') : nights < 5 ? t('nights_few') : t('nights_many');
  return (
    <Card>
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <Check className="h-8 w-8 text-emerald-700" strokeWidth={3} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
        {tc('booking_accepted_label')}
      </p>
      <h1 className="font-display text-4xl font-semibold text-[#1a3d2e] mb-2">
        №{booking.number}
      </h1>
      <p className="text-sm text-[#1a3d2e]/70 mb-8 max-w-md mx-auto">
        {t('paid_body')}{' '}
        {new Date(booking.checkIn).toLocaleDateString('uk-UA', { dateStyle: 'long' })}.
      </p>

      <div className="border-t border-[#1a3d2e]/10 pt-6 text-left space-y-3 mb-6">
        {booking.room && (
          <SummaryRow
            icon={<Bed className="h-4 w-4" />}
            label={t('room_label')}
            value={`${booking.room.number} (${ROOM_TYPE_LABEL[booking.room.type] ?? booking.room.type})`}
          />
        )}
        <SummaryRow
          icon={<Calendar className="h-4 w-4" />}
          label={t('checkin_checkout_label')}
          value={`${new Date(booking.checkIn).toLocaleDateString('uk-UA', { dateStyle: 'medium' })} → ${new Date(booking.checkOut).toLocaleDateString('uk-UA', { dateStyle: 'medium' })} (${nights} ${nightsLabel})`}
        />
        <SummaryRow icon={<Users className="h-4 w-4" />} label={t('guests_label')} value={booking.guests.toString()} />
        <SummaryRow icon={<Phone className="h-4 w-4" />} label={tc('phone_label')} value={booking.customerPhone} />
      </div>

      <div className="flex items-baseline justify-between border-t border-[#1a3d2e]/10 pt-4 mb-8">
        <span className="font-display text-base font-semibold text-[#1a3d2e]">{tc('amount_due_label')}</span>
        <span className="font-display text-2xl font-bold text-[#1a3d2e] tabular-nums">
          {formatPrice(booking.total)}
        </span>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
      >
        {tc('back_home')}
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

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-7 h-7 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">{label}</p>
        <p className="text-[#1a3d2e] font-medium">{value}</p>
      </div>
    </div>
  );
}
