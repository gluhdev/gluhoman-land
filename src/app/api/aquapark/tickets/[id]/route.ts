/**
 * GET /api/aquapark/tickets/[id] — read a ticket by id.
 * Used by /aquapark/buy/success page polling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { aquaparkStorage } from '@/lib/aquapark-storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = await aquaparkStorage.get(id);
  if (!ticket) {
    return NextResponse.json({ error: 'Квиток не знайдено' }, { status: 404 });
  }
  return NextResponse.json(ticket);
}
