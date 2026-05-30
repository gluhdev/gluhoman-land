"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface CalendarProps {
  mode: "single" | "range";
  selected?: Date | DateRange;
  onSelect?: (date: Date) => void;
  onRangeSelect?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  /** How many months to show side-by-side (desktop). Mobile always shows 1. */
  numberOfMonths?: number;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(d: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const t = d.getTime();
  return t > from.getTime() && t < to.getTime();
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(s: string): Date {
  return new Date(s + "T00:00:00");
}

function monthStart(d: Date, offset = 0): Date {
  return new Date(d.getFullYear(), d.getMonth() + offset, 1);
}

export function Calendar({
  mode,
  selected,
  onSelect,
  onRangeSelect,
  minDate,
  maxDate,
  numberOfMonths = 1,
}: CalendarProps) {
  const t = useTranslations("ui.calendar");

  const MONTHS = [
    t("months.1"), t("months.2"), t("months.3"), t("months.4"),
    t("months.5"), t("months.6"), t("months.7"), t("months.8"),
    t("months.9"), t("months.10"), t("months.11"), t("months.12"),
  ];
  const WEEKDAYS = [
    t("weekdays.mon"), t("weekdays.tue"), t("weekdays.wed"), t("weekdays.thu"),
    t("weekdays.fri"), t("weekdays.sat"), t("weekdays.sun"),
  ];

  const today = useMemo(() => startOfDay(new Date()), []);
  const effectiveMin = useMemo(
    () => startOfDay(minDate ?? today),
    [minDate, today],
  );
  const effectiveMax = useMemo(() => {
    if (maxDate) return startOfDay(maxDate);
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [maxDate, today]);

  const [viewDate, setViewDate] = useState<Date>(() => {
    if (mode === "range" && selected && typeof selected === "object" && "from" in selected && selected.from) {
      return monthStart(selected.from);
    }
    if (mode === "single" && selected instanceof Date) {
      return monthStart(selected);
    }
    return monthStart(today);
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Resolve selected values
  let selFrom: Date | undefined;
  let selTo: Date | undefined;
  let selSingle: Date | undefined;
  if (mode === "single" && selected instanceof Date) {
    selSingle = startOfDay(selected);
  } else if (mode === "range" && selected && typeof selected === "object" && "from" in selected) {
    selFrom = selected.from ? startOfDay(selected.from) : undefined;
    selTo = selected.to ? startOfDay(selected.to) : undefined;
  }

  // Preview range while hovering (after start selected, before end)
  const previewFrom = selFrom;
  let previewTo = selTo;
  if (mode === "range" && selFrom && !selTo && hoverDate && hoverDate.getTime() > selFrom.getTime()) {
    previewTo = hoverDate;
  }

  function handleClick(d: Date) {
    if (d.getTime() < effectiveMin.getTime() || d.getTime() > effectiveMax.getTime()) return;
    if (mode === "single") {
      onSelect?.(d);
      return;
    }
    if (!selFrom || (selFrom && selTo)) {
      onRangeSelect?.({ from: d, to: undefined });
    } else if (d.getTime() <= selFrom.getTime()) {
      onRangeSelect?.({ from: d, to: undefined });
    } else {
      onRangeSelect?.({ from: selFrom, to: d });
    }
  }

  function buildGrid(year: number, month: number): Date[] {
    const firstOfMonth = new Date(year, month, 1);
    const jsDow = firstOfMonth.getDay();
    const dowMondayBased = (jsDow + 6) % 7;
    const start = new Date(year, month, 1 - dowMondayBased);
    const dates: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(startOfDay(d));
    }
    return dates;
  }

  const count = Math.max(1, numberOfMonths);
  const months = Array.from({ length: count }, (_, i) => monthStart(viewDate, i));

  const canPrev =
    new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getTime() >= effectiveMin.getTime();
  const canNext =
    monthStart(months[months.length - 1], 1).getTime() <=
    monthStart(effectiveMax).getTime();

  const navBtn =
    "flex h-9 w-9 items-center justify-center rounded-full text-[#1a3d2e] transition hover:bg-[#1a3d2e]/[0.07] disabled:cursor-not-allowed disabled:opacity-25";

  function renderMonth(m: Date) {
    const year = m.getFullYear();
    const month = m.getMonth();
    const grid = buildGrid(year, month);
    return (
      <div>
        <h3 className="mb-2 text-center font-display text-base text-[#0b1410]">
          {MONTHS[month]} <em className="italic text-[#1a3d2e]">{year}</em>
        </h3>
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-0.5 text-center text-[10px] uppercase tracking-[0.12em] text-[#1a3d2e]/55"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {grid.map((d, i) => {
            const inMonth = d.getMonth() === month;
            // Hide adjacent-month days so it's always clear which month a date belongs to.
            if (!inMonth) {
              return <div key={i} aria-hidden className="aspect-square w-full" />;
            }
            const isPast =
              d.getTime() < effectiveMin.getTime() || d.getTime() > effectiveMax.getTime();
            const isToday = sameDay(d, today);
            const isSingleSel = sameDay(d, selSingle);
            const isStart = sameDay(d, previewFrom);
            const isEnd = sameDay(d, previewTo);
            const inRange = isBetween(d, previewFrom, previewTo);
            const endpoint = isStart || isEnd || isSingleSel;

            const base =
              "relative flex aspect-square w-full items-center justify-center text-[13px] transition";
            let cls: string;
            if (isPast) {
              cls = "text-[#1a3d2e]/20 cursor-not-allowed";
            } else if (endpoint) {
              cls =
                "rounded-lg bg-[#1a3d2e] font-semibold text-[#faf6ec] shadow-sm cursor-pointer";
            } else if (inRange) {
              cls = "rounded-md bg-[#e6d9b8]/70 font-medium text-[#1a3d2e] cursor-pointer";
            } else if (isToday) {
              cls =
                "rounded-lg font-semibold text-[#1a3d2e] ring-1 ring-inset ring-[#c9a95c] hover:bg-[#1a3d2e]/[0.06] cursor-pointer";
            } else {
              cls =
                "rounded-lg font-medium text-[#0f1f18] hover:bg-[#1a3d2e]/[0.06] cursor-pointer";
            }

            return (
              <button
                key={i}
                type="button"
                disabled={isPast}
                onClick={() => handleClick(d)}
                onMouseEnter={() => setHoverDate(d)}
                onMouseLeave={() => setHoverDate(null)}
                className={`${base} ${cls}`}
                aria-label={toISO(d)}
                aria-pressed={endpoint}
              >
                <span>{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full select-none">
      {/* Nav */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrev && setViewDate(monthStart(viewDate, -1))}
          disabled={!canPrev}
          aria-label={t("previous_month_aria")}
          className={navBtn}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => canNext && setViewDate(monthStart(viewDate, 1))}
          disabled={!canNext}
          aria-label={t("next_month_aria")}
          className={navBtn}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Month(s) */}
      <div className={`grid gap-5 lg:gap-8 ${count > 1 ? "lg:grid-cols-2" : ""}`}>
        {months.map((m, idx) => (
          <div
            key={idx}
            className={`mx-auto w-full max-w-[15.5rem] ${idx > 0 ? "hidden lg:block" : ""}`}
          >
            {renderMonth(m)}
          </div>
        ))}
      </div>
    </div>
  );
}
