import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const EntrySchema = z.object({
  key: z.string().min(1).max(200),
  type: z.enum(['text', 'richtext', 'image', 'number', 'url']),
  value: z.union([z.string(), z.number(), z.null()]),
  revalidate: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = EntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { key, type, value, revalidate } = parsed.data;

  if (value === null || value === '') {
    await prisma.siteContent.deleteMany({ where: { key } });
  } else {
    await prisma.siteContent.upsert({
      where: { key },
      create: {
        key,
        type,
        value: JSON.stringify(value),
        updatedBy: session.user.email ?? null,
      },
      update: {
        type,
        value: JSON.stringify(value),
        updatedBy: session.user.email ?? null,
      },
    });
  }

  if (revalidate && revalidate.length > 0) {
    for (const path of revalidate) {
      try {
        revalidatePath(path);
      } catch {
        // best-effort
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const rows = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json({
    entries: rows.map((r) => ({
      key: r.key,
      type: r.type,
      value: safeParse(r.value),
      updatedAt: r.updatedAt.toISOString(),
      updatedBy: r.updatedBy,
    })),
  });
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
