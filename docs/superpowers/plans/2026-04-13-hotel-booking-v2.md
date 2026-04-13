# Hotel Booking v2 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring hotel booking from partial working state to production-quality: admin can fully manage rooms (with photo upload) and bookings (calendar + manual + edit + status); guests can book and pay via LiqPay on mobile with real availability calendar; system is reliable.

**Architecture:** Build on top of existing Prisma/Next.js 15/NextAuth foundation. Add shared `/api/admin/upload` endpoint with local disk storage (Docker volume on VPS). Extend existing admin pages rather than rebuild. No new frameworks.

**Tech Stack:** Next.js 15 App Router, React 19, Prisma, NextAuth v5, Zod, react-day-picker (new dep), react-dropzone (new dep), sharp (new dep, for image probe).

**No test runner in project** — verification is: `npm run lint`, `npx tsc --noEmit`, and manual browser check on `http://localhost:3000` after each etap.

---

## Etap 0 — Admin Rooms CRUD + Photo Upload

### Task 0.1: Add upload dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install deps**

```bash
npm install react-dropzone sharp
npm install -D @types/react-dropzone || true
```

- [ ] **Step 2: Verify install**

```bash
npm ls react-dropzone sharp
```

Expected: both listed, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add react-dropzone and sharp for admin photo upload"
```

---

### Task 0.2: Create upload endpoint

**Files:**
- Create: `src/app/api/admin/upload/route.ts`
- Create: `public/uploads/.gitkeep`

- [ ] **Step 1: Create `public/uploads` directory with gitkeep**

```bash
mkdir -p public/uploads
touch public/uploads/.gitkeep
echo "*" > public/uploads/.gitignore
echo "!.gitignore" >> public/uploads/.gitignore
echo "!.gitkeep" >> public/uploads/.gitkeep
```

Wait — fix the gitignore: we want `public/uploads/*` ignored but the dir tracked.

```bash
cat > public/uploads/.gitignore <<'EOF'
*
!.gitignore
!.gitkeep
EOF
```

- [ ] **Step 2: Write the endpoint**

Create `src/app/api/admin/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

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

  // Probe dimensions + re-encode as webp for consistency/size
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
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/upload/route.ts public/uploads/
git commit -m "feat: add admin image upload endpoint with sharp pipeline"
```

---

### Task 0.3: Add Docker volume for uploads

**Files:**
- Modify: `docker-compose.yml`

- [ ] **Step 1: Add volume mount**

In the `gluhoman` service, add:

```yaml
    volumes:
      - ./uploads:/app/public/uploads
```

- [ ] **Step 2: Document in deploy note**

Add to bottom of `docker-compose.yml`:

```yaml
# Uploads persist in ./uploads on the host (bind mount).
# On first deploy: mkdir -p uploads && chmod 755 uploads
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "chore(docker): mount uploads volume for persistent room photos"
```

---

### Task 0.4: Replace image textarea with dropzone uploader in RoomForm

**Files:**
- Create: `src/components/admin/ImageUploader.tsx`
- Modify: `src/app/admin/hotel/RoomForm.tsx`

- [ ] **Step 1: Create ImageUploader component**

`src/components/admin/ImageUploader.tsx`:

```tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface Props {
  name: string;           // form field name — hidden input holds JSON array
  initial?: string[];
  max?: number;
}

export function ImageUploader({ name, initial = [], max = 12 }: Props) {
  const [images, setImages] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (files: File[]) => {
    setError(null);
    setUploading(true);
    try {
      const next: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'upload failed');
        }
        const { url } = await res.json();
        next.push(url);
      }
      setImages((prev) => [...prev, ...next].slice(0, max));
    } catch (e: any) {
      setError(e.message ?? 'upload failed');
    } finally {
      setUploading(false);
    }
  }, [max]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    onDrop: upload,
  });

  const remove = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-500'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Відпустіть файли для завантаження'
            : 'Перетягніть фото сюди або натисніть щоб обрати'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG або WebP, до 5 МБ</p>
      </div>

      {uploading && <p className="text-sm text-gray-500">Завантаження…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div key={url + idx} className="relative group border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] relative bg-gray-100">
                <Image src={url} alt="" fill className="object-cover" sizes="200px" unoptimized />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs flex justify-between p-1 opacity-0 group-hover:opacity-100 transition">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(idx, -1)} className="px-1">←</button>
                  <button type="button" onClick={() => move(idx, 1)} className="px-1">→</button>
                </div>
                <button type="button" onClick={() => remove(idx)} className="px-1 text-red-300">✕</button>
              </div>
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">Головне</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `RoomForm.tsx` to use ImageUploader**

Replace the existing `images` textarea with `<ImageUploader name="images" initial={initial?.images ?? []} />`. Keep all other fields as-is.

- [ ] **Step 3: Update `parseImages()` in `actions.ts`**

Now receives JSON array string from the hidden input. Simplify:

```ts
function parseImages(input?: string): string {
  if (!input) return JSON.stringify([]);
  try {
    const arr = JSON.parse(input);
    if (Array.isArray(arr)) return JSON.stringify(arr.filter((x) => typeof x === 'string'));
  } catch {}
  return JSON.stringify([]);
}
```

- [ ] **Step 4: Typecheck + lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 5: Manual browser test**

```bash
npm run dev
```

Open http://localhost:3000/admin/hotel/rooms/new, sign in, upload 2-3 images, fill form, save, verify room appears in list with images visible.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/ImageUploader.tsx src/app/admin/hotel/RoomForm.tsx src/app/admin/hotel/actions.ts
git commit -m "feat(admin): drag-and-drop photo uploader for hotel rooms"
```

---

### Task 0.5: Prevent deleting rooms with active bookings (friendly error)

Existing `deleteRoom` already checks `_count.bookings`. Verify it ignores cancelled/completed (currently it doesn't — it counts all). Update to only block on non-terminal bookings.

**Files:**
- Modify: `src/app/admin/hotel/actions.ts` `deleteRoom`

- [ ] **Step 1: Update delete check**

```ts
export async function deleteRoom(id: string) {
  await requireAdmin();
  const activeBookings = await prisma.hotelBooking.count({
    where: {
      roomId: id,
      status: { notIn: ['cancelled', 'completed'] },
    },
  });
  if (activeBookings > 0) {
    throw new Error(`Неможливо видалити номер: є ${activeBookings} активних бронювань`);
  }
  await prisma.hotelBooking.deleteMany({ where: { roomId: id } }); // orphan old completed/cancelled
  // Actually no — keep them for reporting. Just delete the room via set-null? Current schema has required FK.
  // Instead, soft-delete: mark room inactive.
  await prisma.hotelRoom.update({ where: { id }, data: { active: false, number: `ARCHIVED-${Date.now()}` } });
  revalidatePath('/admin/hotel/rooms');
  redirect('/admin/hotel/rooms');
}
```

Rationale: schema has required FK `roomId` → hard delete breaks historical bookings. Soft-delete by archiving instead.

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/hotel/actions.ts
git commit -m "fix(admin): soft-delete rooms to preserve booking history"
```

---

## Etap 1 — Admin Bookings A→Z

### Task 1.1: Add "Edit booking" action

**Files:**
- Create: `src/app/api/admin/hotel/bookings/[id]/route.ts` (PUT)
- Modify: `src/app/admin/hotel/bookings/[id]/page.tsx` (add edit link/modal)
- Create: `src/app/admin/hotel/bookings/[id]/edit/page.tsx`

- [ ] **Step 1: Write PUT handler**

`src/app/api/admin/hotel/bookings/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const EditSchema = z.object({
  roomId: z.string().optional(),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().min(6).optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.number().int().min(1).max(10).optional(),
  comment: z.string().max(500).optional(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = EditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.hotelBooking.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (existing.status === 'completed' || existing.status === 'cancelled') {
    return NextResponse.json({ error: 'cannot edit terminal booking' }, { status: 400 });
  }

  const data: any = { ...parsed.data };
  if (data.checkIn) data.checkIn = new Date(data.checkIn);
  if (data.checkOut) data.checkOut = new Date(data.checkOut);
  if (data.customerEmail === '') data.customerEmail = null;

  // Recalc total if dates or room changed
  if (data.checkIn || data.checkOut || data.roomId) {
    const roomId = data.roomId ?? existing.roomId;
    const ci = data.checkIn ?? existing.checkIn;
    const co = data.checkOut ?? existing.checkOut;
    const room = await prisma.hotelRoom.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: 'room not found' }, { status: 400 });
    const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
    data.total = nights * room.pricePerNight;
  }

  const updated = await prisma.hotelBooking.update({ where: { id }, data, include: { room: true } });
  return NextResponse.json({ ok: true, booking: updated });
}
```

- [ ] **Step 2: Add edit page with form**

`src/app/admin/hotel/bookings/[id]/edit/page.tsx` — server component that fetches booking + rooms, renders a client form posting JSON to the PUT endpoint.

Implementation: a simple form with inputs for name/phone/email/dates/guests/room/comment, fetch PUT on submit, router.push back to detail page on success.

- [ ] **Step 3: Add "Edit" link on detail page**

In `src/app/admin/hotel/bookings/[id]/page.tsx`, add near status actions:

```tsx
{booking.status !== 'completed' && booking.status !== 'cancelled' && (
  <Link href={`/admin/hotel/bookings/${booking.id}/edit`} className="btn-secondary">
    Редагувати
  </Link>
)}
```

- [ ] **Step 4: Typecheck + commit**

```bash
npx tsc --noEmit && npm run lint
git add src/app/api/admin/hotel/bookings/[id]/route.ts src/app/admin/hotel/bookings/[id]/edit/page.tsx src/app/admin/hotel/bookings/[id]/page.tsx
git commit -m "feat(admin): edit hotel booking (dates, room, customer)"
```

---

### Task 1.2: Manual booking creation (for phone calls)

**Files:**
- Create: `src/app/api/admin/hotel/bookings/manual/route.ts`
- Create: `src/app/admin/hotel/bookings/new/page.tsx`
- Modify: `src/app/admin/hotel/bookings/page.tsx` (add "Створити вручну" button)

- [ ] **Step 1: Write POST handler**

Accepts the same schema as public booking + `paymentMode: 'online'|'cash'|'paid-offline'`. If cash/paid-offline, sets booking status to `confirmed`, paymentStatus to `paid`. Otherwise creates pending and returns id for admin to collect later.

- [ ] **Step 2: Write admin form page**

Client form with room dropdown (fetches rooms via server component props), date inputs, customer fields, payment mode radio.

- [ ] **Step 3: Link from bookings list**

Add button `<Link href="/admin/hotel/bookings/new">Створити вручну</Link>` in the list header.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/hotel/bookings/manual/ src/app/admin/hotel/bookings/new/ src/app/admin/hotel/bookings/page.tsx
git commit -m "feat(admin): manual hotel booking creation for phone customers"
```

---

### Task 1.3: Calendar grid view

**Files:**
- Create: `src/app/admin/hotel/calendar/page.tsx`
- Create: `src/components/admin/HotelCalendarGrid.tsx`
- Modify: `src/app/admin/hotel/page.tsx` (add link to calendar)

- [ ] **Step 1: Server component fetches data**

Query: `?month=YYYY-MM` (default current month). Fetch all active rooms + all bookings overlapping the month (status ≠ cancelled). Build a 2D map `room.id → day(1..31) → bookingOrNull`.

- [ ] **Step 2: Render grid**

Table with rooms as rows, days as columns. Each cell:
- Empty → white, clickable → `/admin/hotel/bookings/new?roomId=X&checkIn=YYYY-MM-DD`
- Occupied → colored by status (pending=yellow, paid=blue, confirmed=green, completed=gray), clickable → booking detail
- Span multi-day bookings visually by coloring consecutive cells

- [ ] **Step 3: Month navigation**

Prev/Next month links. Query-string driven.

- [ ] **Step 4: Link from main admin**

- [ ] **Step 5: Commit**

---

### Task 1.4: Enhanced filters on bookings list

**Files:**
- Modify: `src/app/admin/hotel/bookings/page.tsx`

- [ ] **Step 1: Add query params**

Support `?status=&from=&to=&roomId=&q=` (q = search in customerName/Phone). Render filter bar.

- [ ] **Step 2: Update Prisma query**

Use `where` combining all filters.

- [ ] **Step 3: Commit**

---

## Etap 2 — Guest BookingFlow v2

### Task 2.1: Month-availability endpoint

**Files:**
- Create: `src/app/api/hotel/availability/month/route.ts`

- [ ] **Step 1: Write handler**

Input: `?year=2026&month=4` (1-indexed). Returns array of `{ date: 'YYYY-MM-DD', availableRooms: number }` for each day of the month. Counts active rooms minus overlapping non-cancelled bookings per day.

- [ ] **Step 2: Commit**

---

### Task 2.2: Install react-day-picker + rewrite Step 1

**Files:**
- Modify: `package.json`
- Modify: `src/app/hotel/booking/BookingFlow.tsx`

- [ ] **Step 1: Install**

```bash
npm install react-day-picker date-fns
```

- [ ] **Step 2: Rewrite Step 1 of BookingFlow**

Use `<DayPicker mode="range" disabled={fullyBookedDates} />`. Call month-availability endpoint on mount + when month changes. Mark days with `availableRooms === 0` as disabled.

- [ ] **Step 3: Ukrainian locale (uk)**

```tsx
import { uk } from 'date-fns/locale';
<DayPicker locale={uk} ... />
```

- [ ] **Step 4: Commit**

---

### Task 2.3: Polish Step 2 (room cards with carousel)

Use existing `embla-carousel-react` for per-card image carousel. Card: carousel, type badge, capacity, description, price/night × nights = total, "Обрати" CTA.

- [ ] **Step 1: Update render**
- [ ] **Step 2: Commit**

---

### Task 2.4: Polish Step 3 (sticky summary + validation)

Mobile sticky bottom bar with total + "Оплатити". Form validation inline.

- [ ] **Step 1: Update render**
- [ ] **Step 2: Commit**

---

## Etap 3 — LiqPay Production

### Task 3.1: Success + fail pages

**Files:**
- Create: `src/app/hotel/booking/success/page.tsx`
- Create: `src/app/hotel/booking/fail/page.tsx`

- [ ] **Step 1: Success page with polling**

Client component reads `?id=` from searchParams, polls `GET /api/hotel/bookings/[id]` every 2s up to 30s, shows booking number/dates/total and "Дякуємо" message.

- [ ] **Step 2: Fail page**

Shows error message and "Спробувати знову" → `/hotel/booking`.

- [ ] **Step 3: Commit**

---

### Task 3.2: Production runbook

**Files:**
- Create: `docs/BOOKING_RUNBOOK.md`

List required env vars, DNS requirements, LiqPay dashboard config (callback URL, merchant ID), how to toggle out of stub mode.

- [ ] **Step 1: Write runbook**
- [ ] **Step 2: Commit**

---

## Etap 4 — Reliability

### Task 4.1: Auto-cancel stale pending bookings

**Files:**
- Modify: `src/lib/booking-storage.ts`
- Modify: `src/app/api/hotel/availability/route.ts`

- [ ] **Step 1: Add `cancelStalePending()` helper**

```ts
async function cancelStalePending() {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000);
  await prisma.hotelBooking.updateMany({
    where: { paymentStatus: 'pending', status: 'pending', createdAt: { lt: cutoff } },
    data: { status: 'cancelled', updatedAt: new Date() },
  });
}
```

- [ ] **Step 2: Call at top of availability GET handler (fire-and-forget)**
- [ ] **Step 3: Commit**

---

### Task 4.2: Double-pay guard verification

- [ ] **Step 1: Read `create/route.ts`, verify early return when entity.paymentStatus === 'paid'. If missing, add.**
- [ ] **Step 2: Commit if changed**

---

## Final Verification

- [ ] **Step 1: Full typecheck + lint**

```bash
npx tsc --noEmit && npm run lint
```

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Manual smoke test**

In `npm run dev`:
1. Admin: create room with photos
2. Admin: create manual booking
3. Admin: view calendar with that booking
4. Admin: edit the booking
5. Admin: cancel the booking
6. Guest: /hotel/booking — pick dates, see availability, pick room, submit, reach success page (stub mode)
7. Admin: see new guest booking in list

- [ ] **Step 4: Final commit / push**

User will review on their own after everything is done.
