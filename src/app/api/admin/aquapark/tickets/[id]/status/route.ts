/**
 * POST /api/admin/aquapark/tickets/[id]/status
 * Admin-only — change an aquapark ticket status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { aquaparkStorage } from '@/lib/aquapark-storage';
import { AquaparkTicketStatus } from '@/types/aquapark';

const Schema = z.object({
  status: z.enum(['pending', 'paid', 'used', 'cancelled', 'refunded']),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невірний статус' }, { status: 400 });
  }

  const { id } = await params;
  const updated = await aquaparkStorage.updateStatus(id, parsed.data.status as AquaparkTicketStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Квиток не знайдено' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ticket: updated });
}
