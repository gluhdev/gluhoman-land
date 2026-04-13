import { Metadata } from 'next';
import { Download, ShoppingBag, Hotel, Waves, Flame, FileSpreadsheet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Експорт CSV — CRM Глухомань',
  robots: { index: false, follow: false },
};

const EXPORTS = [
  {
    id: 'orders',
    label: 'Замовлення доставки',
    description: 'Усі замовлення з меню — клієнт, телефон, адреса, перелік страв, сума',
    icon: ShoppingBag,
    href: '/api/admin/export/orders',
    columns: ['№', 'Дата', 'Статус', 'Клієнт', 'Телефон', 'Тип', 'Адреса', 'Сума', 'Перелік'],
  },
  {
    id: 'hotel',
    label: 'Бронювання готелю',
    description: 'Бронювання номерів — гість, дати, кількість гостей, ціна',
    icon: Hotel,
    href: '/api/admin/export/hotel-bookings',
    columns: ['№', 'Гість', 'Кімната', 'Тип', 'Заїзд', 'Виїзд', 'Ночей', 'Сума'],
  },
  {
    id: 'aquapark',
    label: 'Квитки аквапарку',
    description: 'Продані квитки — тип, кількість, QR-код',
    icon: Waves,
    href: '/api/admin/export/aquapark-tickets',
    columns: ['№', 'Клієнт', 'Дата візиту', 'Тарифи', 'Кількість', 'Сума', 'QR'],
  },
  {
    id: 'sauna',
    label: 'Бронювання лазні',
    description: 'Зарезервовані слоти — мала/велика лазня, час, клієнт',
    icon: Flame,
    href: '/api/admin/export/sauna-slots',
    columns: ['№', 'Лазня', 'Дата', 'Час', 'Клієнт', 'Телефон', 'Сума'],
  },
];

export default function ExportsPage() {
  // Default range: last 30 days
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 86_400_000);
  const fromIso = monthAgo.toISOString().slice(0, 10);
  const toIso = today.toISOString().slice(0, 10);

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Звіти
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1 flex items-center gap-3">
          <FileSpreadsheet className="h-7 w-7 text-[#1a3d2e]/40" />
          Експорт CSV
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        <p className="text-sm text-[#1a3d2e]/60 mt-3 max-w-xl">
          Завантажуйте дані за період у форматі CSV (UTF-8 з BOM, separator «;»). Відкривається в Excel і Google Sheets з підтримкою кирилиці.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {EXPORTS.map((exp) => {
          const Icon = exp.icon;
          return (
            <div
              key={exp.id}
              className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg font-semibold text-[#1a3d2e]">
                  {exp.label}
                </h2>
              </div>
              <p className="text-xs text-[#1a3d2e]/65 leading-relaxed mb-4">
                {exp.description}
              </p>
              <div className="text-[10px] text-[#1a3d2e]/55 uppercase tracking-wider mb-4 font-semibold">
                Колонки: {exp.columns.join(' · ')}
              </div>

              <form action={exp.href} method="GET" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1a3d2e]/55">
                      Від
                    </span>
                    <input
                      type="date"
                      name="from"
                      defaultValue={fromIso}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-xs"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1a3d2e]/55">
                      До
                    </span>
                    <input
                      type="date"
                      name="to"
                      defaultValue={toIso}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-xs"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Завантажити CSV
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <a
                  href={`${exp.href}`}
                  className="text-[10px] font-semibold text-[#1a3d2e]/70 hover:text-[#1a3d2e] underline underline-offset-2"
                >
                  Усі дані
                </a>
                <span className="text-[10px] text-[#1a3d2e]/30">·</span>
                <a
                  href={`${exp.href}?from=${toIso}`}
                  className="text-[10px] font-semibold text-[#1a3d2e]/70 hover:text-[#1a3d2e] underline underline-offset-2"
                >
                  Сьогодні
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
