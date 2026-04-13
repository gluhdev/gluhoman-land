'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface Props {
  name: string;
  initial?: string[];
  max?: number;
}

export function ImageUploader({ name, initial = [], max = 12 }: Props) {
  const [images, setImages] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: File[]) => {
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
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'upload failed');
      } finally {
        setUploading(false);
      }
    },
    [max]
  );

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
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-[#1a3d2e] bg-[#1a3d2e]/5'
            : 'border-[#1a3d2e]/25 hover:border-[#1a3d2e]/60 bg-[#f4ecd8]/30'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-[#1a3d2e]/80 font-medium">
          {isDragActive
            ? 'Відпустіть файли для завантаження'
            : 'Перетягніть фото сюди або натисніть щоб обрати'}
        </p>
        <p className="text-xs text-[#1a3d2e]/50 mt-1">
          JPG, PNG або WebP, до 5 МБ. Перше фото — головне.
        </p>
      </div>

      {uploading && (
        <p className="text-sm text-[#1a3d2e]/70">Завантаження…</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group border border-[#1a3d2e]/10 rounded-xl overflow-hidden bg-white"
            >
              <div className="aspect-[4/3] relative bg-[#f4ecd8]/40">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black/65 text-white text-xs flex justify-between items-center px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    className="px-1.5 hover:text-[#d4a056]"
                    aria-label="Перемістити вліво"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    className="px-1.5 hover:text-[#d4a056]"
                    aria-label="Перемістити вправо"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="px-1.5 text-red-300 hover:text-red-200"
                  aria-label="Видалити"
                >
                  ✕
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#1a3d2e] text-[#fdfaf0] text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  Головне
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
