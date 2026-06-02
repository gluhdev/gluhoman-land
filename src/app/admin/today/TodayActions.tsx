'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, CheckCircle2, ChefHat, Truck, RotateCcw } from 'lucide-react';
import type { PaymentType } from '@/lib/payment-router';
import type { StatusAction } from '@/lib/status-service';

type Btn = {
  action: StatusAction;
  label: string;
  icon: typeof Check;
  classes: string;
};

// Brand-styled button variants (green #1a3d2e / cream theme).
const CONFIRM: Btn = {
  action: 'confirm',
  label: 'Підтвердити',
  icon: Check,
  classes:
    'bg-white border-[#1a3d2e]/20 text-[#1a3d2e] hover:bg-[#1a3d2e]/10 hover:border-[#1a3d2e]/45',
};
const PREPARING: Btn = {
  action: 'preparing',
  label: 'Готується',
  icon: ChefHat,
  classes:
    'bg-white border-[#c9a95c]/40 text-[#7a5d20] hover:bg-[#e6d9b8]/25 hover:border-[#c9a95c]',
};
const DELIVERING: Btn = {
  action: 'delivering',
  label: 'В дорозі',
  icon: Truck,
  classes:
    'bg-white border-[#c9a95c]/40 text-[#7a5d20] hover:bg-[#e6d9b8]/25 hover:border-[#c9a95c]',
};
const COMPLETE: Btn = {
  action: 'complete',
  label: 'Виконано',
  icon: CheckCircle2,
  classes:
    'bg-white border-[#1a3d2e]/20 text-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-[#e6d9b8] hover:border-[#1a3d2e]',
};
const CANCEL: Btn = {
  action: 'cancel',
  label: 'Скасувати',
  icon: X,
  classes:
    'bg-white border-[#0f1f18]/15 text-[#0f1f18]/55 hover:bg-[#0f1f18]/5 hover:text-[#0f1f18]/75',
};
const REFUND: Btn = {
  action: 'refund',
  label: 'Повернення',
  icon: RotateCcw,
  classes:
    'bg-white border-[#0f1f18]/15 text-[#0f1f18]/55 hover:bg-[#0f1f18]/5 hover:text-[#0f1f18]/75',
};

// Statuses past which no further action is offered (lowercased for comparison).
const TERMINAL = new Set([
  'cancelled',
  'completed',
  'refunded',
  'used',
]);

/** The buttons to show for an entity, given its current status. */
function buttonsFor(type: PaymentType, status: string): Btn[] {
  const s = status.toLowerCase();
  if (TERMINAL.has(s)) return [];

  switch (type) {
    case 'order': {
      const confirmed = s === 'confirmed';
      const preparing = s === 'preparing';
      const delivering = s === 'delivering';
      const btns: Btn[] = [];
      // Confirm only before it's confirmed/in-progress.
      if (!confirmed && !preparing && !delivering) btns.push(CONFIRM);
      // Progression: preparing → delivering → complete.
      if (!preparing && !delivering) btns.push(PREPARING);
      if (!delivering) btns.push(DELIVERING);
      btns.push(COMPLETE);
      btns.push(CANCEL);
      return btns;
    }
    case 'hotel':
    case 'sauna': {
      const btns: Btn[] = [];
      if (s !== 'confirmed' && s !== 'paid') btns.push(CONFIRM);
      btns.push(COMPLETE);
      btns.push(CANCEL);
      return btns;
    }
    case 'aquapark':
      return [CANCEL, REFUND];
    default:
      return [];
  }
}

export function TodayActions({
  type,
  id,
  currentStatus,
}: {
  type: PaymentType;
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<StatusAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const btns = buttonsFor(type, currentStatus);
  if (btns.length === 0) return null;

  const run = (action: StatusAction) => {
    startTransition(async () => {
      setBusy(action);
      setError(null);
      try {
        const res = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, id, action }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? 'Помилка');
          return;
        }
        router.refresh();
      } catch {
        setError('Помилка мережі');
      } finally {
        setBusy(null);
      }
    });
  };

  return (
    <div className="px-5 pb-3 pt-1">
      <div className="flex flex-wrap gap-1.5">
        {btns.map(({ action, label, icon: Icon, classes }) => (
          <button
            key={action}
            type="button"
            disabled={pending}
            onClick={() => run(action)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] font-medium border rounded-md transition-colors ${classes} ${
              pending ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Icon className="w-3 h-3" strokeWidth={2} />
            {busy === action ? '…' : label}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-[11px] font-display italic text-[#7a1d1d]">
          {error}
        </p>
      )}
    </div>
  );
}
