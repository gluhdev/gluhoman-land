/**
 * POST /api/admin/sauna/slots/[id]/status — change a sauna slot status (admin).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { saunaStorage } from '@/lib/sauna-storage';
import { SaunaSlotStatus } from '@/types/sauna';

const Schema = z.object({
  status: z.enum(['free', 'reserved', 'paid', 'completed', 'cancelled']),
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
  const updated = await saunaStorage.updateStatus(id, parsed.data.status as SaunaSlotStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Не знайдено' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, slot: updated });
}
