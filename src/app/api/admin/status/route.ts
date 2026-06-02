/**
 * POST /api/admin/status — unified admin status transition for any managed
 * entity. Body: { type, id, action }. Authenticated (admin session) and routed
 * through the shared changeStatus service (idempotent + notifies operators and,
 * for confirm/cancel, the guest). Used by the actionable /admin/today cockpit.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  changeStatus,
  actionToStatus,
  type StatusAction,
} from '@/lib/status-service';
import type { PaymentType } from '@/lib/payment-router';

const TYPES = ['order', 'reservation', 'hotel', 'sauna', 'aquapark'] as const;
const ACTIONS: StatusAction[] = [
  'confirm',
  'cancel',
  'preparing',
  'delivering',
  'complete',
  'refund',
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    type?: string;
    id?: string;
    action?: string;
  } | null;
  const type = body?.type as PaymentType | undefined;
  const id = body?.id;
  const action = body?.action as StatusAction | undefined;

  if (
    !type ||
    !TYPES.includes(type as (typeof TYPES)[number]) ||
    !id ||
    !action ||
    !ACTIONS.includes(action)
  ) {
    return NextResponse.json({ error: 'Невірні параметри' }, { status: 400 });
  }

  const target = actionToStatus(type, action);
  if (!target) {
    return NextResponse.json(
      { error: 'Дія недоступна для цього типу' },
      { status: 400 },
    );
  }

  const result = await changeStatus(
    type,
    id,
    target,
    { hotelSlug: session.user.hotelSlug ?? null, notifyGuest: true },
    action,
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
