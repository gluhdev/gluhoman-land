"use client";

import { useEffect, useState, useTransition } from "react";
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

function fmtDay(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}.${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}.${d.getFullYear()}`;
}

function nightsBetween(from: Date, to: Date): number {
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
}

export default function AvailabilityBar({ hotels, current }: Props) {
  const t = useTranslations("booking_page");
  const tc = useTranslations("ui.booking_dialog_counter");

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, start] = useTransition();

  const setParams = (
    kv: Record<string, string | undefined>,
    opts?: { clearRoom?: boolean },
  ) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(kv)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    if (opts?.clearRoom) p.delete("room");
    start(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }));
  };

  // Local range state lets the in-progress (first-click) selection persist —
  // the URL is only written once BOTH ends are chosen.
  const fromURL = (): DateRange => ({
    from: current.from ? fromISO(current.from) : undefined,
    to: current.to ? fromISO(current.to) : undefined,
  });
  const [range, setRange] = useState<DateRange>(fromURL);
  useEffect(() => {
    setRange(fromURL());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.from, current.to]);

  const handleRangeSelect = (r: DateRange) => {
    setRange(r);
    if (r.from && r.to) {
      setParams({ from: toISO(r.from), to: toISO(r.to) });
    } else if (current.from || current.to) {
      // first click of a new range — clear the previously committed URL range
      setParams({ from: undefined, to: undefined });
    }
  };

  const clearDates = () => {
    setRange({ from: undefined, to: undefined });
    setParams({ from: undefined, to: undefined });
  };

  const adultsDecAria = tc("decrease_aria", { label: t("adults") });
  const adultsIncAria = tc("increase_aria", { label: t("adults") });
  const childrenDecAria = tc("decrease_aria", { label: t("children") });
  const childrenIncAria = tc("increase_aria", { label: t("children") });

  const complete = Boolean(range.from && range.to);
  const nights = complete ? nightsBetween(range.from!, range.to!) : 0;

  return (
    <div
      className={`rounded-[2px] bg-white p-4 ring-1 ring-[#1a3d2e]/10 sm:p-6 ${
        isPending ? "opacity-70" : ""
      }`}
    >
      {/* Step 1 — hotel */}
      <div>
        <StepLabel n={1} text={t("step_hotel")} />
        <div className="mt-2 flex flex-wrap gap-2">
          {hotels.map((h) => {
            const active = h.slug === current.hotel;
            return (
              <button
                key={h.slug}
                type="button"
                onClick={() => setParams({ hotel: h.slug }, { clearRoom: true })}
                className={`rounded-[2px] px-3.5 py-2 text-sm transition ${
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
      </div>

      {/* Step 2 (dates) + Step 3 (guests) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Inline calendar */}
        <div>
          <StepLabel n={2} text={t("step_dates")} />
          <div className="mt-2 w-full max-w-[20rem] rounded-[2px] border border-[#e6d9b8] bg-[#faf6ec]/50 p-3">
            <Calendar
              mode="range"
              minDate={new Date()}
              selected={range}
              onRangeSelect={handleRangeSelect}
            />
          </div>
        </div>

        {/* Guests + summary */}
        <div className="flex flex-col gap-5">
          <div>
            <StepLabel n={3} text={t("step_guests")} />
            <div className="mt-2 flex flex-wrap gap-3">
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

          {/* Selected-range summary / hint */}
          <div className="rounded-[2px] bg-[#1a3d2e]/[0.03] p-4 ring-1 ring-[#1a3d2e]/10">
            {complete ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 text-[14px] text-[#0f1f18]">
                  <p>
                    <span className="text-[#1a3d2e]/60">{t("checkin")}: </span>
                    <span className="font-medium">{fmtDay(range.from!)}</span>
                  </p>
                  <p>
                    <span className="text-[#1a3d2e]/60">{t("checkout")}: </span>
                    <span className="font-medium">{fmtDay(range.to!)}</span>
                  </p>
                  <p className="text-[13px] text-[#1a3d2e]/70">
                    {t("nights_count", { count: nights })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearDates}
                  className="text-[13px] text-[#1a3d2e]/70 underline underline-offset-2 hover:text-[#1a3d2e]"
                >
                  {t("clear_dates")}
                </button>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-[#1a3d2e]/70">
                {range.from ? t("pick_checkout") : t("select_dates_hint")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a3d2e]/70">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a3d2e] text-[10px] text-[#e6d9b8]">
        {n}
      </span>
      {text}
    </span>
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
