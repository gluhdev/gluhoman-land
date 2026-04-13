'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Clock,
  Calendar,
  Phone,
  Loader2,
  ArrowRight,
  Ticket as TicketIcon,
  Download,
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatPrice } from '@/types/cart';
import { AquaparkTicket } from '@/types/aquapark';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 60_000;

export function TicketSuccessClient({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<AquaparkTicket | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  useEffect(() => {
    if (!ticketId) {
      setError('Не вказано номер квитка');
      return;
    }
    let cancelled = false;
    const startedAt = Date.now();

    const tick = async () => {
      try {
        const res = await fetch(`/api/aquapark/tickets/${ticketId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('not found');
        const data = (await res.json()) as AquaparkTicket;
        if (cancelled) return;
        setTicket(data);
        if (data.paymentStatus === 'paid' || data.paymentStatus === 'failed') return;
        if (Date.now() - startedAt > MAX_POLL_MS) {
          setPollingTimedOut(true);
          return;
        }
        setTimeout(tick, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setError('Не вдалось завантажити квиток');
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  // Generate QR data URL when ticket is paid
  useEffect(() => {
    if (ticket?.paymentStatus === 'paid' && ticket.qrCode) {
      QRCode.toDataURL(ticket.qrCode, {
        width: 280,
        margin: 2,
        color: { dark: '#0f1f18', light: '#fdfaf0' },
      })
        .then(setQrDataUrl)
        .catch((err) => console.error('QR generation failed:', err));
    }
  }, [ticket]);

  if (error) return <Card><h1 className="font-display text-2xl font-semibold text-[#1a3d2e]">{error}</h1></Card>;

  if (!ticket) {
    return (
      <Card>
        <Loader2 className="h-10 w-10 text-[#1a3d2e] animate-spin mx-auto mb-4" />
        <p className="text-[#1a3d2e]/70">Завантажуємо…</p>
      </Card>
    );
  }

  if (ticket.paymentStatus === 'pending') {
    return (
      <Card>
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <Clock className="h-8 w-8 text-amber-700" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
          Квиток №{ticket.number}
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          Очікуємо оплату…
        </h1>
        <p className="text-sm text-[#1a3d2e]/70 mb-6 max-w-md mx-auto">
          {pollingTimedOut
            ? 'Підтвердження ще не надійшло. Зв\'яжіться з нами якщо оплатили.'
            : 'Перевіряємо статус оплати.'}
        </p>
        {!pollingTimedOut && <Loader2 className="h-6 w-6 text-[#1a3d2e]/40 animate-spin mx-auto" />}
      </Card>
    );
  }

  if (ticket.paymentStatus === 'failed') {
    return (
      <Card>
        <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
          Оплата не пройшла
        </h1>
        <Link
          href="/aquapark/buy"
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
        Квиток оплачено
      </p>
      <h1 className="font-display text-4xl font-semibold text-[#1a3d2e] mb-2">
        №{ticket.number}
      </h1>
      <p className="text-sm text-[#1a3d2e]/70 mb-6 max-w-md mx-auto">
        Покажіть QR-код на вході в аквапарк{' '}
        {new Date(ticket.date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}.
      </p>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="inline-block bg-white p-5 rounded-2xl border-2 border-[#1a3d2e]/15 shadow-lg mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR-код квитка" width={280} height={280} />
          <p className="text-[10px] text-[#1a3d2e]/50 font-mono mt-2 break-all">
            {ticket.qrCode}
          </p>
        </div>
      )}

      {/* Download button */}
      {qrDataUrl && (
        <div className="mb-6">
          <a
            href={qrDataUrl}
            download={`gluhoman-aquapark-${ticket.number}.png`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1a3d2e] hover:text-[#0f2a1e] underline underline-offset-4"
          >
            <Download className="h-3 w-3" />
            Завантажити QR
          </a>
        </div>
      )}

      <div className="border-t border-[#1a3d2e]/10 pt-6 text-left space-y-3 mb-6">
        <SummaryRow
          icon={<Calendar className="h-4 w-4" />}
          label="Дата візиту"
          value={new Date(ticket.date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}
        />
        <SummaryRow icon={<Phone className="h-4 w-4" />} label="Телефон" value={ticket.customerPhone} />
      </div>

      <ul className="divide-y divide-[#1a3d2e]/10 my-6 text-left">
        {ticket.items.map((i) => (
          <li key={i.id ?? i.tariffId} className="py-2 flex items-baseline justify-between text-sm">
            <span className="text-[#1a3d2e]/80">
              <TicketIcon className="h-3.5 w-3.5 inline mr-1.5 text-[#1a3d2e]/40" />
              {i.name} × {i.quantity}
            </span>
            <span className="font-semibold text-[#1a3d2e] tabular-nums">
              {formatPrice(i.price * i.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-baseline justify-between border-t border-[#1a3d2e]/10 pt-4 mb-8">
        <span className="font-display text-base font-semibold text-[#1a3d2e]">Сплачено</span>
        <span className="font-display text-2xl font-bold text-[#1a3d2e] tabular-nums">
          {formatPrice(ticket.total)}
        </span>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
      >
        На головну
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
