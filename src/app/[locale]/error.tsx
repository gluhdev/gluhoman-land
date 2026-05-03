"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SurfaceCard
        variant="glass"
        padding="lg"
        className="max-w-xl w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-amber-100/80 p-5">
            <AlertTriangle
              className="h-12 w-12 text-amber-700"
              aria-hidden="true"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Щось пішло не так
        </h1>
        <p className="text-base md:text-lg text-neutral-600 mb-6">
          Технічна помилка. Спробуйте оновити сторінку або повернутися на
          головну.
        </p>
        {error.digest && (
          <p className="text-xs text-neutral-400 mb-6 font-mono">
            Код помилки: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-white font-medium shadow-md hover:bg-emerald-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Спробувати ще раз
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-6 py-3 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
          >
            На головну
          </Link>
        </div>
      </SurfaceCard>
    </main>
  );
}
