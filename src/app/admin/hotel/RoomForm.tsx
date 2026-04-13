import { Save } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface Room {
  id?: string;
  number: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  description?: string | null;
  images?: string | null; // JSON-encoded
  active: boolean;
}

const TYPE_OPTIONS = [
  { value: 'standard', label: 'Стандарт' },
  { value: 'lux', label: 'Люкс' },
  { value: 'family', label: 'Сімейний' },
  { value: 'suite', label: 'Cвіт' },
];

export function RoomForm({
  initial,
  action,
  submitLabel = 'Зберегти',
}: {
  initial?: Partial<Room>;
  action: (formData: FormData) => Promise<unknown> | void;
  submitLabel?: string;
}) {
  let initialImages: string[] = [];
  if (initial?.images) {
    try {
      const arr = JSON.parse(initial.images);
      if (Array.isArray(arr)) initialImages = arr.filter((x) => typeof x === 'string');
    } catch {
      initialImages = [];
    }
  }

  return (
    <form
      action={action as (formData: FormData) => void}
      className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Номер кімнати" required>
          <input
            type="text"
            name="number"
            required
            defaultValue={initial?.number ?? ''}
            placeholder="101"
            className={inputClass}
          />
        </Field>
        <Field label="Тип" required>
          <select
            name="type"
            required
            defaultValue={initial?.type ?? 'standard'}
            className={inputClass}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Місткість (осіб)" required>
          <input
            type="number"
            name="capacity"
            required
            min={1}
            max={10}
            defaultValue={initial?.capacity ?? 2}
            className={inputClass}
          />
        </Field>
        <Field label="Ціна за ніч (грн)" required>
          <input
            type="number"
            name="pricePerNight"
            required
            min={0}
            step={1}
            defaultValue={initial?.pricePerNight ?? ''}
            placeholder="1500"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Опис">
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ''}
          placeholder="Затишний номер з виглядом на сад…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Фото номера">
        <ImageUploader name="images" initial={initialImages} />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="w-5 h-5 rounded border-[#1a3d2e]/20 text-[#1a3d2e] focus:ring-[#1a3d2e]/30"
        />
        <span className="text-sm font-semibold text-[#1a3d2e]">
          Активний (доступний для бронювання)
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
