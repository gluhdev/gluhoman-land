/**
 * POST /api/admin/sauna/slots/[id]/status — change a sauna slot status (admin).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { saunaStorage } from '@/lib/sauna-storage';
import { changeStatus } from '@/lib/status-service';

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
  const result = await changeStatus('sauna', id, parsed.data.status, {
    hotelSlug: session.user.hotelSlug ?? null,
    notifyGuest: true,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const updated = await saunaStorage.get(id);
  return NextResponse.json({ ok: true, slot: updated });
}
