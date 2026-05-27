'use client';

import { useState, useTransition } from 'react';
import { Check, X, CheckCircle2, Clock } from 'lucide-react';
import {
  updateBookingStatus,
  type BookingStatusValue,
} from '../actions';

const ACTIONS: Array<{
  status: BookingStatusValue;
  label: string;
  icon: typeof Check;
  // brand classes for inactive state
  classes: string;
  // brand classes when this status is the current one (locked / "this is active")
  activeClasses: string;
}> = [
  {
    status: 'PENDING',
    label: 'Очікує',
    icon: Clock,
    classes:
      'bg-white border-[#c9a95c]/40 text-[#7a5d20] hover:bg-[#e6d9b8]/25 hover:border-[#c9a95c]',
    activeClasses: 'bg-[#e6d9b8]/45 border-[#c9a95c] text-[#7a5d20]',
  },
  {
    status: 'CONFIRMED',
    label: 'Підтвердити',
    icon: Check,
    classes:
      'bg-white border-[#1a3d2e]/20 text-[#1a3d2e] hover:bg-[#1a3d2e]/10 hover:border-[#1a3d2e]/45',
    activeClasses: 'bg-[#1a3d2e]/10 border-[#1a3d2e]/45 text-[#1a3d2e]',
  },
  {
    status: 'COMPLETED',
    label: 'Виконано',
    icon: CheckCircle2,
    classes:
      'bg-white border-[#1a3d2e]/20 text-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-[#e6d9b8] hover:border-[#1a3d2e]',
    activeClasses: 'bg-[#1a3d2e] border-[#1a3d2e] text-[#e6d9b8]',
  },
  {
    status: 'CANCELLED',
    label: 'Скасувати',
    icon: X,
    classes:
      'bg-white border-[#0f1f18]/15 text-[#0f1f18]/55 hover:bg-[#0f1f18]/5 hover:text-[#0f1f18]/75',
    activeClasses: 'bg-[#0f1f18]/5 border-[#0f1f18]/20 text-[#0f1f18]/55',
  },
];

export function StatusActions({
  id,
  current,
}: {
  id: string;
  current: BookingStatusValue;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ status, label, icon: Icon, classes, activeClasses }) => {
          const active = status === current;
          return (
            <button
              key={status}
              type="button"
              disabled={pending || active}
              onClick={() =>
                startTransition(async () => {
                  setError(null);
                  const res = await updateBookingStatus(id, status);
                  if (!res.ok) setError(res.error ?? 'Помилка');
                })
              }
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] font-medium border transition-colors ${
                active ? activeClasses : classes
              } ${active ? 'cursor-default' : ''} ${
                pending ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-3 text-xs font-display italic text-[#7a1d1d]">
          {error}
        </p>
      )}
    </div>
  );
}
