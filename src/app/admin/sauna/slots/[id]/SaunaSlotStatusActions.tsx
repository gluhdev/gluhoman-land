'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronRight } from 'lucide-react';

const FLOW: Array<{ id: string; label: string }> = [
  { id: 'paid', label: 'Сплачено' },
  { id: 'completed', label: 'Виконано' },
];

const TERMINAL = ['completed', 'cancelled'];

export function SaunaSlotStatusActions({
  slotId,
  currentStatus,
}: {
  slotId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = async (status: string) => {
    setLoading(status);
    setError(null);
    try {
      const res = await fetch(`/api/admin/sauna/slots/${slotId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Помилка');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
    } finally {
      setLoading(null);
    }
  };

  if (TERMINAL.includes(currentStatus)) {
    return (
      <p className="text-xs text-[#1a3d2e]/55 italic">
        Бронювання {currentStatus === 'completed' ? 'виконано' : 'скасовано'}.
      </p>
    );
  }

  const currentIdx = FLOW.findIndex((s) => s.id === currentStatus);

  return (
    <div className="space-y-2">
      {FLOW.map((s, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isNext = idx === currentIdx + 1;
        const disabled = loading !== null || isPast || isCurrent;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => update(s.id)}
            disabled={disabled}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isPast
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-60 cursor-default'
                : isCurrent
                ? 'bg-[#1a3d2e] text-[#fdfaf0] cursor-default'
                : isNext
                ? 'bg-[#1a3d2e]/10 text-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-[#fdfaf0] border border-[#1a3d2e]/20'
                : 'bg-white text-[#1a3d2e]/50 hover:bg-[#1a3d2e]/5 border border-[#1a3d2e]/15'
            }`}
          >
            <span>{s.label}</span>
            {loading === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => update('cancelled')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors mt-4"
      >
        {loading === 'cancelled' && <Loader2 className="h-3 w-3 animate-spin" />}
        Скасувати бронювання
      </button>

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}
