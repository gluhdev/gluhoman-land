/**
 * GET /api/sauna/availability?date=YYYY-MM-DD
 * Returns the virtual slot grid for a date — both saunas, all time windows.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saunaStorage } from '@/lib/sauna-storage';

const Schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = Schema.safeParse({ date: url.searchParams.get('date') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалідні параметри' }, { status: 400 });
  }
  const slots = await saunaStorage.getAvailability(parsed.data.date);
  return NextResponse.json({ date: parsed.data.date, slots });
}
