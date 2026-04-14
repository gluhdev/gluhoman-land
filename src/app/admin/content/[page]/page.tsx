import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPage } from '@/lib/content-schema';
import { prisma } from '@/lib/prisma';
import { ContentEditor } from './ContentEditor';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageId } = await params;
  const page = getPage(pageId);
  if (!page) notFound();

  const allKeys = page.sections.flatMap((s) => s.fields.map((f) => f.key));
  const rows = await prisma.siteContent.findMany({ where: { key: { in: allKeys } } });
  const current: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      current[row.key] = JSON.parse(row.value);
    } catch {
      current[row.key] = row.value;
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Усі сторінки
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Редагування
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          {page.label}
        </h1>
      </div>

      <ContentEditor page={page} current={current} />
    </div>
  );
}
