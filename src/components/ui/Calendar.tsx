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

export function Calendar({
  mode,
  selected,
  onSelect,
  onRangeSelect,
  minDate,
  maxDate,
}: CalendarProps) {
  const t = useTranslations("ui.calendar");

  const MONTHS = [
    t("months.1"),
    t("months.2"),
    t("months.3"),
    t("months.4"),
    t("months.5"),
    t("months.6"),
    t("months.7"),
    t("months.8"),
    t("months.9"),
    t("months.10"),
    t("months.11"),
    t("months.12"),
  ];

  const WEEKDAYS = [
    t("weekdays.mon"),
    t("weekdays.tue"),
    t("weekdays.wed"),
    t("weekdays.thu"),
    t("weekdays.fri"),
    t("weekdays.sat"),
    t("weekdays.sun"),
  ];

  const today = useMemo(() => startOfDay(new Date()), []);
  const effectiveMin = useMemo(
    () => startOfDay(minDate ?? today),
    [minDate, today]
  );
  const effectiveMax = useMemo(() => {
    if (maxDate) return startOfDay(maxDate);
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [maxDate, today]);

  const [viewDate, setViewDate] = useState<Date>(() => {
    if (mode === "range" && selected && typeof selected === "object" && "from" in selected && selected.from) {
      return new Date(selected.from);
    }
    if (mode === "single" && selected instanceof Date) {
      return new Date(selected);
    }
    return new Date();
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const grid = useMemo<Date[]>(() => {
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
  }, [year, month]);

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    if (d.getFullYear() < effectiveMin.getFullYear() ||
      (d.getFullYear() === effectiveMin.getFullYear() && d.getMonth() < effectiveMin.getMonth())) {
      return;
    }
    setViewDate(d);
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    if (d.getFullYear() > effectiveMax.getFullYear() ||
      (d.getFullYear() === effectiveMax.getFullYear() && d.getMonth() > effectiveMax.getMonth())) {
      return;
    }
    setViewDate(d);
  };

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
  let previewFrom = selFrom;
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

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label={t("previous_month_aria")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a3d2e] hover:bg-[#f4ecd8] transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-display text-xl text-[#0b1410]">
          {MONTHS[month]} <em className="italic text-[#1a3d2e]">{year}</em>
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          aria-label={t("next_month_aria")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a3d2e] hover:bg-[#f4ecd8] transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/60 text-center py-1"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d, i) => {
          const inMonth = d.getMonth() === month;
          const isPast =
            d.getTime() < effectiveMin.getTime() ||
            d.getTime() > effectiveMax.getTime();
          const isToday = sameDay(d, today);
          const isSingleSel = sameDay(d, selSingle);
          const isRangeStart = sameDay(d, previewFrom);
          const isRangeEnd = sameDay(d, previewTo);
          const inRange = isBetween(d, previewFrom, previewTo);
          const endpoint = isRangeStart || isRangeEnd || isSingleSel;

          const base =
            "relative flex aspect-square w-full items-center justify-center text-[14px] transition";
          let stateCls = "";
          if (isPast) {
            stateCls = "text-[#1a3d2e]/20 cursor-not-allowed";
          } else if (endpoint) {
            stateCls =
              "rounded-lg bg-[#1a3d2e] font-semibold text-[#faf6ec] shadow-sm cursor-pointer";
          } else if (inRange) {
            stateCls =
              "rounded-md bg-[#e6d9b8]/70 font-medium text-[#1a3d2e] cursor-pointer";
          } else if (isToday) {
            stateCls =
              "rounded-lg font-semibold text-[#1a3d2e] ring-1 ring-inset ring-[#c9a95c] hover:bg-[#1a3d2e]/[0.06] cursor-pointer";
          } else {
            stateCls =
              "rounded-lg font-medium text-[#0f1f18] hover:bg-[#1a3d2e]/[0.06] cursor-pointer";
          }
          if (!inMonth && !endpoint && !inRange && !isPast) {
            stateCls += " text-[#1a3d2e]/35";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => handleClick(d)}
              onMouseEnter={() => setHoverDate(d)}
              onMouseLeave={() => setHoverDate(null)}
              className={`${base} ${stateCls}`}
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
