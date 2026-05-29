'use client';

import { useState, useTransition } from 'react';
import { Link2, Copy, Check, Loader2, CreditCard, X } from 'lucide-react';
import { createPaymentLink } from '../actions';

interface Props {
  bookingId: string;
  /** Already-agreed amount (грн), if a link was generated before. */
  currentAmount: number | null;
  /** Computed suggestion from room price × nights (грн). */
  suggestedAmount: number;
  paymentStatus: string; // unpaid | paid | failed
}

export function PaymentLinkPanel({
  bookingId,
  currentAmount,
  suggestedAmount,
  paymentStatus,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [amount, setAmount] = useState(
    String(currentAmount ?? (suggestedAmount > 0 ? suggestedAmount : ''))
  );
  const [path, setPath] = useState<string | null>(
    currentAmount && currentAmount > 0 ? `/uk/pay/${bookingId}` : null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fullLink =
    path && typeof window !== 'undefined' ? `${window.location.origin}${path}` : path ?? '';
  const paid = paymentStatus === 'paid';

  function generate() {
    setError(null);
    startTransition(async () => {
      const res = await createPaymentLink(bookingId, parseInt(amount, 10) || 0);
      if (!res.ok) {
        setError(res.error ?? 'Помилка');
        return;
      }
      setPath(res.path ?? null);
    });
  }

  function copy() {
    if (!fullLink) return;
    navigator.clipboard?.writeText(fullLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="mb-10 bg-white border border-[#1a3d2e]/10 p-6">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="h-4 w-4 text-[#1a3d2e]/60" />
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          Оплата онлайн
        </p>
        {paid && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 bg-[#1a3d2e] text-[#e6d9b8] border border-[#1a3d2e]">
            <Check className="h-3 w-3" /> Сплачено
          </span>
        )}
      </div>

      {paid ? (
        <p className="text-sm text-[#1a3d2e]/70 mt-3 leading-relaxed">
          Гість сплатив {currentAmount?.toLocaleString('uk-UA')} грн. Бронювання
          підтверджено.
        </p>
      ) : (
        <>
          <p className="text-sm text-[#1a3d2e]/65 mt-2 mb-5 leading-relaxed max-w-xl">
            Вкажіть суму, згенеруйте посилання й надішліть гостю. Після оплати
            бронювання автоматично стане «Підтверджено».
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <label className="block space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
                Сума, грн
              </span>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-40 px-3.5 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] tabular-nums focus:outline-none focus:border-[#1a3d2e]/45"
              />
            </label>
            {suggestedAmount > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(suggestedAmount))}
                className="text-[11px] uppercase tracking-[0.18em] text-[#1a3d2e]/55 font-medium hover:text-[#1a3d2e] pb-3"
              >
                Підказка: {suggestedAmount.toLocaleString('uk-UA')} грн
              </button>
            )}
            <button
              type="button"
              onClick={generate}
              disabled={pending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3d2e] text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {path ? 'Оновити посилання' : 'Створити посилання'}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 mt-4 max-w-xl">
              <X className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}

          {path && (
            <div className="mt-5 flex items-center gap-2 max-w-2xl">
              <input
                readOnly
                value={fullLink}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 px-3.5 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#1a3d2e] font-mono"
              />
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#1a3d2e]/25 text-[#1a3d2e] text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-[#1a3d2e]/5"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Скопійовано' : 'Копіювати'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
