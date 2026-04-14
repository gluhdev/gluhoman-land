'use client';

import { useCallback, useState, useTransition } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import type { PageDef, FieldDef } from '@/lib/content-schema';

interface Props {
  page: PageDef;
  current: Record<string, unknown>;
}

export function ContentEditor({ page, current }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const s of page.sections) {
      for (const f of s.fields) {
        const cur = current[f.key];
        v[f.key] = typeof cur === 'string' ? cur : '';
      }
    }
    return v;
  });
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const markDirty = (key: string) => {
    setDirty((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const update = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    markDirty(key);
  };

  const saveField = async (field: FieldDef) => {
    setSavingKey(field.key);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: field.key,
          type: field.type,
          value: values[field.key] || null,
          revalidate: page.revalidate,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setDirty((prev) => {
        const next = new Set(prev);
        next.delete(field.key);
        return next;
      });
      setNotice('Збережено');
      setTimeout(() => setNotice(null), 2000);
    } catch {
      setNotice('Помилка збереження');
    } finally {
      setSavingKey(null);
    }
  };

  const resetField = async (field: FieldDef) => {
    if (!confirm(`Повернути «${field.label}» до оригінального значення?`)) return;
    setSavingKey(field.key);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: field.key,
          type: field.type,
          value: null,
          revalidate: page.revalidate,
        }),
      });
      if (!res.ok) throw new Error('Reset failed');
      setValues((prev) => ({ ...prev, [field.key]: '' }));
      setDirty((prev) => {
        const next = new Set(prev);
        next.delete(field.key);
        return next;
      });
      setNotice('Скинуто');
      setTimeout(() => setNotice(null), 2000);
      startTransition(() => {
        window.location.reload();
      });
    } catch {
      setNotice('Помилка');
    } finally {
      setSavingKey(null);
    }
  };

  const saveAll = async () => {
    const dirtyFields: FieldDef[] = [];
    for (const s of page.sections) {
      for (const f of s.fields) {
        if (dirty.has(f.key)) dirtyFields.push(f);
      }
    }
    if (dirtyFields.length === 0) return;
    for (const f of dirtyFields) {
      await saveField(f);
    }
    setNotice(`Збережено ${dirtyFields.length}`);
  };

  return (
    <div className="space-y-8">
      {page.sections.map((section) => (
        <div
          key={section.id}
          className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]"
        >
          <h2 className="font-display text-xl font-semibold text-[#1a3d2e] mb-5">
            {section.label}
          </h2>
          <div className="space-y-5">
            {section.fields.map((field) => (
              <FieldRow
                key={field.key}
                field={field}
                value={values[field.key]}
                isDirty={dirty.has(field.key)}
                isSaving={savingKey === field.key}
                isOverridden={Object.prototype.hasOwnProperty.call(current, field.key)}
                onChange={(v) => update(field.key, v)}
                onSave={() => saveField(field)}
                onReset={() => resetField(field)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-4 flex items-center justify-between gap-4 bg-[#1a3d2e] text-[#fdfaf0] rounded-full px-6 py-3 shadow-lg shadow-[#1a3d2e]/30">
        <span className="text-sm font-semibold">
          {dirty.size === 0
            ? notice ?? 'Немає незбережених змін'
            : `Незбережено: ${dirty.size}`}
        </span>
        <button
          type="button"
          onClick={saveAll}
          disabled={dirty.size === 0 || isPending}
          className="px-5 py-2 rounded-full bg-[#fdfaf0] text-[#1a3d2e] font-semibold text-sm hover:bg-white disabled:opacity-50"
        >
          Зберегти все
        </button>
      </div>
    </div>
  );
}

interface FieldRowProps {
  field: FieldDef;
  value: string;
  isDirty: boolean;
  isSaving: boolean;
  isOverridden: boolean;
  onChange: (v: string) => void;
  onSave: () => void;
  onReset: () => void;
}

function FieldRow({
  field,
  value,
  isDirty,
  isSaving,
  isOverridden,
  onChange,
  onSave,
  onReset,
}: FieldRowProps) {
  return (
    <div className="border-t border-[#1a3d2e]/8 pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
        <label className="block">
          <div className="text-xs font-semibold text-[#1a3d2e]/75 uppercase tracking-wider">
            {field.label}
            {isDirty && <span className="ml-1 text-amber-600">●</span>}
            {isOverridden && !isDirty && (
              <span className="ml-1 text-[10px] text-[#1a3d2e]/50">(змінено)</span>
            )}
          </div>
          <code className="text-[10px] text-[#1a3d2e]/40">{field.key}</code>
        </label>
        <div className="flex gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-3 py-1 rounded-full bg-[#1a3d2e] text-[#fdfaf0] text-[11px] font-semibold hover:bg-[#0f2a1e] disabled:opacity-50"
            >
              {isSaving ? 'Збереження…' : 'Зберегти'}
            </button>
          )}
          {isOverridden && !isDirty && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1 rounded-full border border-[#1a3d2e]/20 text-[#1a3d2e]/70 text-[11px] font-semibold hover:bg-[#1a3d2e]/5"
            >
              Скинути
            </button>
          )}
        </div>
      </div>

      {field.type === 'image' ? (
        <ImageFieldInput value={value} fallback={field.fallback} onChange={onChange} />
      ) : field.type === 'richtext' || (field.rows && field.rows > 1) ? (
        <textarea
          rows={field.rows ?? 4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.fallback}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.fallback}
          className={inputClass}
        />
      )}

      {field.hint && (
        <p className="text-[11px] text-[#1a3d2e]/50 mt-1.5">{field.hint}</p>
      )}
      {!value && (
        <p className="text-[11px] text-[#1a3d2e]/45 mt-1.5">
          Зараз показується оригінал: «{field.fallback.slice(0, 80)}{field.fallback.length > 80 ? '…' : ''}»
        </p>
      )}
    </div>
  );
}

function ImageFieldInput({
  value,
  fallback,
  onChange,
}: {
  value: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upload = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setErr(null);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Upload failed');
        const { url } = await res.json();
        onChange(url);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : 'upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: upload,
  });

  const displaySrc = value || fallback;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-[#1a3d2e]/10 bg-[#f4ecd8]/40 flex-shrink-0">
          {displaySrc && (
            <Image
              src={displaySrc}
              alt=""
              fill
              className="object-cover"
              sizes="128px"
              unoptimized
            />
          )}
        </div>
        <div className="flex-1">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition text-xs ${
              isDragActive
                ? 'border-[#1a3d2e] bg-[#1a3d2e]/5'
                : 'border-[#1a3d2e]/25 hover:border-[#1a3d2e]/60 bg-white'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-[#1a3d2e]/80 font-medium">
              {uploading
                ? 'Завантаження…'
                : isDragActive
                  ? 'Відпустіть файл'
                  : 'Перетягніть фото або натисніть'}
            </p>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={fallback}
            className={`${inputClass} mt-2 font-mono text-[11px]`}
          />
        </div>
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-sm focus:outline-none focus:border-[#1a3d2e]/50 focus:bg-white transition-all';
