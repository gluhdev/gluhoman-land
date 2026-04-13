import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'unsupported type' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  let width: number;
  let height: number;
  try {
    const pipeline = sharp(bytes).rotate();
    const meta = await pipeline.metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
    webp = await pipeline
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: 'invalid image' }, { status: 400 });
  }

  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dirRel = path.posix.join('uploads', yyyy, mm);
  const dirAbs = path.join(process.cwd(), 'public', dirRel);
  await mkdir(dirAbs, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  const absPath = path.join(dirAbs, filename);
  await writeFile(absPath, webp);

  const url = `/${path.posix.join(dirRel, filename)}`;

  return NextResponse.json({
    url,
    width,
    height,
    size: webp.length,
  });
}

export const runtime = 'nodejs';
