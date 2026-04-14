import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { CONTENT_SCHEMA } from '@/lib/content-schema';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminContentIndex() {
  const counts = await prisma.siteContent.groupBy({
    by: ['key'],
    _count: true,
  });
  const editedKeys = new Set(counts.map((c) => c.key));

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Контент сайту
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Редактор текстів та фото
        </h1>
        <p className="text-sm text-[#1a3d2e]/60 mt-2 max-w-2xl">
          Тут ви можете змінити будь-який текст або фото на сайті. Оберіть сторінку, відредагуйте
          потрібні поля та натисніть «Зберегти». Зміни одразу з&apos;являться на публічній частині
          сайту. Щоб повернути оригінальне значення — очистьте поле і збережіть.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONTENT_SCHEMA.map((page) => {
          const pageFields = page.sections.flatMap((s) => s.fields);
          const editedCount = pageFields.filter((f) => editedKeys.has(f.key)).length;
          return (
            <Link
              key={page.id}
              href={`/admin/content/${page.id}`}
              className="group bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 hover:border-[#1a3d2e]/30 hover:shadow-lg hover:shadow-[#1a3d2e]/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <ChevronRight className="h-5 w-5 text-[#1a3d2e]/30 group-hover:text-[#1a3d2e] group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="font-display text-lg font-semibold text-[#1a3d2e] mb-1">
                {page.label}
              </h2>
              <p className="text-xs text-[#1a3d2e]/55">
                {page.sections.length}{' '}
                {page.sections.length === 1 ? 'секція' : page.sections.length < 5 ? 'секції' : 'секцій'}
                {' · '}
                {pageFields.length}{' '}
                {pageFields.length === 1 ? 'поле' : pageFields.length < 5 ? 'поля' : 'полів'}
                {editedCount > 0 && (
                  <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-[#1a3d2e] text-[#fdfaf0] text-[10px] font-semibold">
                    {editedCount} змінено
                  </span>
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
