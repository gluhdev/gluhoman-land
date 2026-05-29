"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Calendar, toISO, fromISO, type DateRange } from "../ui/Calendar";

interface Props {
  hotels: { slug: string; label: string }[];
  current: {
    hotel: string;
    from?: string;
    to?: string;
    adults: number;
    children: number;
  };
}

const ADULTS_MIN = 1;
const ADULTS_MAX = 10;
const CHILDREN_MIN = 0;
const CHILDREN_MAX = 6;

function formatRange(from?: string, to?: string): string | null {
  if (!from || !to) return null;
  const f = fromISO(from);
  const t = fromISO(to);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
  return `${fmt(f)} – ${fmt(t)}`;
}

export default function AvailabilityBar({ hotels, current }: Props) {
  const t = useTranslations("booking_page");
  const tc = useTranslations("ui.booking_dialog_counter");

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, start] = useTransition();

  const [datesOpen, setDatesOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const setParams = (
    kv: Record<string, string | undefined>,
    opts?: { clearRoom?: boolean }
  ) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(kv)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    if (opts?.clearRoom) p.delete("room");
    start(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }));
  };

  // Close the dates popover on outside click / Escape.
  useEffect(() => {
    if (!datesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setDatesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDatesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [datesOpen]);

  const selectedRange: DateRange = {
    from: current.from ? fromISO(current.from) : undefined,
    to: current.to ? fromISO(current.to) : undefined,
  };

  const rangeLabel = formatRange(current.from, current.to);

  const handleRangeSelect = (range: DateRange) => {
    if (range.from && range.to) {
      setParams({ from: toISO(range.from), to: toISO(range.to) });
      setDatesOpen(false);
    }
  };

  const adultsDecAria = tc("decrease_aria", { label: t("adults") });
  const adultsIncAria = tc("increase_aria", { label: t("adults") });
  const childrenDecAria = tc("decrease_aria", { label: t("children") });
  const childrenIncAria = tc("increase_aria", { label: t("children") });

  return (
    <div className="sticky top-0 z-30 bg-[#faf6ec]/95 backdrop-blur border-b border-[#e6d9b8]">
      <div
        className={`mx-auto flex max-w-6xl flex-wrap items-end gap-3 px-4 py-3 sm:gap-4 sm:px-6 ${
          isPending ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        {/* Hotel tabs */}
        <div className="flex flex-wrap gap-2">
          {hotels.map((h) => {
            const active = h.slug === current.hotel;
            return (
              <button
                key={h.slug}
                type="button"
                onClick={() => setParams({ hotel: h.slug }, { clearRoom: true })}
                className={`rounded-[2px] px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[#1a3d2e] text-[#e6d9b8]"
                    : "ring-1 ring-[#1a3d2e]/15 text-[#1a3d2e] hover:bg-[#1a3d2e]/5"
                }`}
                aria-pressed={active}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        {/* Dates */}
        <div className="relative">
          <span className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70">
            {t("pick_dates")}
          </span>
          <button
            type="button"
            onClick={() => setDatesOpen((v) => !v)}
            className="rounded-[2px] ring-1 ring-[#1a3d2e]/15 px-3 py-2 text-sm text-[#1a3d2e] hover:bg-[#1a3d2e]/5 transition"
            aria-expanded={datesOpen}
          >
            {rangeLabel ?? t("pick_dates")}
          </button>

          {datesOpen && (
            <div
              ref={popoverRef}
              className="absolute left-0 top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-[20rem] rounded-[2px] border border-[#e6d9b8] bg-[#faf6ec] p-3 shadow-lg sm:w-auto"
            >
              <Calendar
                mode="range"
                minDate={new Date()}
                selected={selectedRange}
                onRangeSelect={handleRangeSelect}
              />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="flex items-end gap-3">
          <Stepper
            label={t("adults")}
            value={current.adults}
            decreaseAria={adultsDecAria}
            increaseAria={adultsIncAria}
            onChange={(n) => setParams({ adults: String(n) })}
            min={ADULTS_MIN}
            max={ADULTS_MAX}
          />
          <Stepper
            label={t("children")}
            value={current.children}
            decreaseAria={childrenDecAria}
            increaseAria={childrenIncAria}
            onChange={(n) => setParams({ children: String(n) })}
            min={CHILDREN_MIN}
            max={CHILDREN_MAX}
          />
        </div>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  decreaseAria,
  increaseAria,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  decreaseAria: string;
  increaseAria: string;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <span className="mb-1 block text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70">
        {label}
      </span>
      <div className="flex items-center rounded-[2px] border border-[#e6d9b8]">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-10 w-10 text-lg text-[#1a3d2e] transition hover:bg-[#f4ecd8] disabled:opacity-40"
          aria-label={decreaseAria}
        >
          −
        </button>
        <div className="min-w-8 flex-1 text-center font-display text-base text-[#0b1410]">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-10 w-10 text-lg text-[#1a3d2e] transition hover:bg-[#f4ecd8] disabled:opacity-40"
          aria-label={increaseAria}
        >
          +
        </button>
      </div>
    </div>
  );
}
