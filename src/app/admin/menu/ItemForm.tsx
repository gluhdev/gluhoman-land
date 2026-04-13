import { Save } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  icon?: string | null;
}

interface Item {
  id?: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  weight?: string | null;
  image?: string | null;
  order: number;
  active: boolean;
}

export function ItemForm({
  initial,
  categories,
  defaultCategoryId,
  action,
  submitLabel = 'Зберегти',
}: {
  initial?: Partial<Item>;
  categories: CategoryOption[];
  defaultCategoryId?: string;
  action: (formData: FormData) => Promise<unknown> | void;
  submitLabel?: string;
}) {
  return (
    <form
      action={action as (formData: FormData) => void}
      className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] space-y-5"
    >
      <Field label="Категорія" required>
        <select
          name="categoryId"
          required
          defaultValue={initial?.categoryId ?? defaultCategoryId ?? ''}
          className={inputClass}
        >
          <option value="" disabled>
            — Оберіть категорію —
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon ? `${c.icon} ` : ''}
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Назва страви" required>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          placeholder="Наприклад: Цезар з куркою"
          className={inputClass}
        />
      </Field>

      <Field label="Опис">
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          placeholder="Опис інгредієнтів, способу приготування…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Ціна (грн)" required>
          <input
            type="number"
            name="price"
            required
            min={0}
            step={1}
            defaultValue={initial?.price ?? ''}
            placeholder="285"
            className={inputClass}
          />
        </Field>
        <Field label="Вага / Об'єм">
          <input
            type="text"
            name="weight"
            defaultValue={initial?.weight ?? ''}
            placeholder="220 г"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Зображення (URL)">
        <input
          type="text"
          name="image"
          defaultValue={initial?.image ?? ''}
          placeholder="https://… або /images/dish.jpg"
          className={inputClass}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Порядок">
          <input
            type="number"
            name="order"
            min={0}
            defaultValue={initial?.order ?? 0}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-3 cursor-pointer pt-7">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial?.active ?? true}
            className="w-5 h-5 rounded border-[#1a3d2e]/20 text-[#1a3d2e] focus:ring-[#1a3d2e]/30"
          />
          <span className="text-sm font-semibold text-[#1a3d2e]">
            Активна
          </span>
        </label>
      </div>

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
