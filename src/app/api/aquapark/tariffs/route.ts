/**
 * GET /api/aquapark/tariffs — list of active aquapark ticket tariffs.
 */

import { NextResponse } from 'next/server';
import { aquaparkStorage } from '@/lib/aquapark-storage';

export async function GET() {
  const tariffs = await aquaparkStorage.listTariffs(true);
  return NextResponse.json({ tariffs });
}
