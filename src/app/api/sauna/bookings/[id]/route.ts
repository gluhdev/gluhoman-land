import { NextRequest, NextResponse } from 'next/server';
import { saunaStorage } from '@/lib/sauna-storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const slot = await saunaStorage.get(id);
  if (!slot) return NextResponse.json({ error: 'Не знайдено' }, { status: 404 });
  return NextResponse.json(slot);
}
