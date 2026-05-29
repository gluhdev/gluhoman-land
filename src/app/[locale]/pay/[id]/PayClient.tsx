'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BedDouble, CalendarRange, Users, Loader2, ShieldCheck, Check } from 'lucide-react';

interface Props {
  id: string;
  hotel: string;
  roomName: string;
  guestName: string;
  dateFrom: string;
  dateTo: string | null;
  guests: number;
  amount: number;
  paid: boolean;
  locale: string;
}

export function PayClient({
  id,
  hotel,
  roomName,
  guestName,
  dateFrom,
  dateTo,
  guests,
  amount,
  paid,
  locale,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/payment/liqpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'reservation', entityId: id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Не вдалося розпочати оплату');
      }
      const data = (await res.json()) as
        | { mode: 'liqpay'; data: string; signature: string; endpoint: string }
        | { mode: 'stub' }
        | { mode: 'already-paid' };

      if (data.mode === 'stub' || data.mode === 'already-paid') {
        router.push(`/${locale}/pay/success?id=${id}`);
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.endpoint;
      form.acceptCharset = 'utf-8';
      for (const [name, value] of [
        ['data', data.data],
        ['signature', data.signature],
      ]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 pt-28 md:pt-36 pb-16">
      <div className="w-full max-w-md bg-white border border-[#1a3d2e]/12 shadow-sm">
        <div className="bg-[#0f1f18] text-[#e6d9b8] px-7 py-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/60 font-medium">
            Глухомань · Оплата бронювання
          </p>
          <p className="font-display italic text-2xl mt-1.5">{hotel}</p>
        </div>

        <div className="px-7 py-6">
          <p className="text-sm text-[#1a3d2e]/70">
            Вітаємо, <span className="text-[#1a3d2e] font-medium">{guestName}</span>!
            Деталі вашого бронювання:
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            {roomName && (
              <div className="flex items-center gap-3 text-[#1a3d2e]">
                <BedDouble className="h-4 w-4 text-[#1a3d2e]/45" />
                <span>{roomName}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-[#1a3d2e]">
              <CalendarRange className="h-4 w-4 text-[#1a3d2e]/45" />
              <span>
                {dateFrom}
                {dateTo ? ` – ${dateTo}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#1a3d2e]">
              <Users className="h-4 w-4 text-[#1a3d2e]/45" />
              <span>{guests} гостей</span>
            </div>
          </dl>

          <div className="mt-6 pt-5 border-t border-[#1a3d2e]/10 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 font-medium">
              До сплати
            </span>
            <span className="font-display text-3xl text-[#1a3d2e] tabular-nums">
              {amount.toLocaleString('uk-UA')} грн
            </span>
          </div>

          {paid ? (
            <div className="mt-6 flex items-center justify-center gap-2 py-3.5 bg-[#1a3d2e]/8 border border-[#1a3d2e]/20 text-[#1a3d2e] text-sm font-medium">
              <Check className="h-4 w-4" /> Бронювання вже оплачено
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={pay}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a3d2e] text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Сплатити {amount.toLocaleString('uk-UA')} грн
              </button>
              {error && <p className="mt-3 text-xs text-red-700 text-center">{error}</p>}
              <p className="mt-4 text-[11px] text-[#1a3d2e]/45 text-center leading-relaxed">
                Безпечна оплата карткою через LiqPay. Після оплати ви отримаєте
                підтвердження.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
