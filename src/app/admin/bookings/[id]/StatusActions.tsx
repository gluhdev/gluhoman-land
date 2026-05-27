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
  classes: string;
}> = [
  {
    status: 'PENDING',
    label: 'Очікує',
    icon: Clock,
    classes: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300',
  },
  {
    status: 'CONFIRMED',
    label: 'Підтвердити',
    icon: Check,
    classes:
      'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border-emerald-300',
  },
  {
    status: 'COMPLETED',
    label: 'Виконано',
    icon: CheckCircle2,
    classes:
      'bg-blue-100 text-blue-900 hover:bg-blue-200 border-blue-300',
  },
  {
    status: 'CANCELLED',
    label: 'Скасувати',
    icon: X,
    classes:
      'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-300',
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
        {ACTIONS.map(({ status, label, icon: Icon, classes }) => {
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
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-colors ${classes} ${
                active ? 'opacity-60 cursor-default' : ''
              } ${pending ? 'opacity-50 cursor-wait' : ''}`}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
