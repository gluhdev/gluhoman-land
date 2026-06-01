"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { Check, Clock, ArrowRight, Phone, Loader2 } from "lucide-react";
import { CONTACT_INFO } from "@/constants";
import { SaunaSlot } from "@/types/sauna";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 60_000;

export function SaunaSuccessClient({ slotId }: { slotId: string }) {
  const t = useTranslations('booking.sauna');
  const tc = useTranslations('booking.common');
  const [slot, setSlot] = useState<SaunaSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  useEffect(() => {
    if (!slotId) {
      setError('Бронювання не знайдено');
      return;
    }
    let cancelled = false;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const res = await fetch(`/api/sauna/bookings/${slotId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('not found');
        const data = (await res.json()) as SaunaSlot;
        if (cancelled) return;
        setSlot(data);
        if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed') return;
        if (Date.now() - startedAt > MAX_POLL_MS) {
          setPollingTimedOut(true);
          return;
        }
        setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setError('Не вдалося завантажити бронювання');
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [slotId]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e]">{error}</h1>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-[#1a3d2e] animate-spin mx-auto mb-4" />
        <p className="text-[#0f1f18]/70">{tc('loading')}</p>
      </div>
    );
  }

  if (slot.paymentStatus === 'pending') {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-8">
          <Clock className="w-10 h-10 text-amber-700" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-[0.95] mb-6">
          {tc('payment_pending_heading')}
        </h1>
        <p className="text-lg text-[#0f1f18]/75 leading-relaxed mb-8 max-w-lg mx-auto">
          {pollingTimedOut ? tc('payment_timeout') : tc('payment_check_status')}
        </p>
        {!pollingTimedOut && (
          <Loader2 className="h-6 w-6 text-[#1a3d2e]/40 animate-spin mx-auto" />
        )}
      </div>
    );
  }

  if (slot.paymentStatus === 'failed') {
    return (
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-[0.95] mb-6">
          {tc('payment_failed_heading')}
        </h1>
        <p className="text-lg text-[#0f1f18]/75 leading-relaxed mb-8 max-w-lg mx-auto">
          {t('fail_body')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sauna/booking"
            className="inline-flex items-center justify-center gap-3 bg-[#1a3d2e] text-[#f4ecd8] px-8 py-4 font-medium tracking-wide hover:bg-[#0f1f18] transition"
          >
            <ArrowRight className="w-4 h-4" />
            {tc('try_again')}
          </Link>
          <a
            href={`tel:+${CONTACT_INFO.phone[0].replace(/\D/g, "")}`}
            className="inline-flex items-center justify-center gap-3 border border-[#1a3d2e] text-[#1a3d2e] px-8 py-4 font-medium tracking-wide hover:bg-[#1a3d2e] hover:text-[#f4ecd8] transition"
          >
            <Phone className="w-4 h-4" />
            {CONTACT_INFO.phone[0]}
          </a>
        </div>
      </div>
    );
  }

  // PAID — original confirmation
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e6d9b8] mb-8">
        <Check className="w-10 h-10 text-[#0f1f18]" strokeWidth={1.5} />
      </div>

      <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
        {t('success_eyebrow')}
      </p>
      <h1 className="font-display text-5xl md:text-6xl text-[#1a3d2e] leading-[0.9] mb-6">
        {t('success_heading')}
        <span className="block italic text-[#1a3d2e]/70 text-4xl md:text-5xl mt-2">
          {t('success_subheading')}
        </span>
      </h1>

      <p className="text-lg text-[#0f1f18]/75 leading-relaxed mb-8 max-w-lg mx-auto">
        {t('success_body')}
      </p>

      {slot.number ? (
        <p className="font-mono text-sm text-[#1a3d2e] bg-[#f4ecd8] border border-[#e6d9b8] px-4 py-3 inline-block mb-10">
          {t('booking_ref_label')} <span className="font-semibold">{slot.number}</span>
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`tel:+${CONTACT_INFO.phone[0].replace(/\D/g, "")}`}
          className="inline-flex items-center justify-center gap-3 bg-[#1a3d2e] text-[#f4ecd8] px-8 py-4 font-medium tracking-wide hover:bg-[#0f1f18] transition"
        >
          <Phone className="w-4 h-4" />
          {CONTACT_INFO.phone[0]}
        </a>
        <Link
          href="/sauna"
          className="inline-flex items-center justify-center gap-3 border border-[#1a3d2e] text-[#1a3d2e] px-8 py-4 font-medium tracking-wide hover:bg-[#1a3d2e] hover:text-[#f4ecd8] transition"
        >
          <ArrowRight className="w-4 h-4" />
          {t('back_to_sauna')}
        </Link>
      </div>
    </div>
  );
}
