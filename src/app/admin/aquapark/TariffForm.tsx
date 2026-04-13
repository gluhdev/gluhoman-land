import { Save } from 'lucide-react';

interface Tariff {
  id?: string;
  name: string;
  price: number;
  description?: string | null;
  active: boolean;
}

export function TariffForm({
  initial,
  action,
  submitLabel = 'Зберегти',
}: {
  initial?: Partial<Tariff>;
  action: (formData: FormData) => Promise<unknown> | void;
  submitLabel?: string;
}) {
  return (
    <form
      action={action as (formData: FormData) => void}
      className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] space-y-5"
    >
      <Field label="Назва тарифу" required>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          placeholder="Дорослий"
          className={inputClass}
        />
      </Field>

      <Field label="Ціна (грн)" required>
        <input
          type="number"
          name="price"
          required
          min={0}
          step={1}
          defaultValue={initial?.price ?? ''}
          placeholder="450"
          className={inputClass}
        />
      </Field>

      <Field label="Опис">
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          placeholder="Повний день в аквапарку для дорослих (від 16 років)"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="w-5 h-5 rounded border-[#1a3d2e]/20 text-[#1a3d2e] focus:ring-[#1a3d2e]/30"
        />
        <span className="text-sm font-semibold text-[#1a3d2e]">
          Активний (доступний для покупки)
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md"
      >
        <Save className="h-4 w-4" />
        {submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:bg-white transition-all';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-[#1a3d2e]/70 uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}
