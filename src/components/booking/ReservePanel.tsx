"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createRoomReservation } from "@/app/actions/booking";
import {
  submitLiqPayForm,
  type LiqPayCreateResponse,
} from "@/lib/liqpay-redirect";
import { priceForGuests } from "@/lib/room-prices";
import type { RoomVM, BookingHotelSlug } from "@/lib/hotel-rooms";

interface Props {
  room: RoomVM;
  hotel: BookingHotelSlug;
  from?: string; // ISO; may be missing
  to?: string; // ISO; may be missing
  adults: number;
  children: number;
  onClose: () => void;
}

const ADULTS_MIN = 1;
const ADULTS_MAX = 10;
const CHILDREN_MIN = 0;
const CHILDREN_MAX = 6;

const inputClass =
  "w-full rounded-[2px] border border-[#1a3d2e]/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3d2e]/30";

function nightsBetween(from: string, to: string): number {
  return Math.max(1, Math.round((+new Date(to) - +new Date(from)) / 86400000));
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export default function ReservePanel({
  room,
  hotel,
  from,
  to,
  adults,
  children,
  onClose,
}: Props) {
  const t = useTranslations("booking_page");
  const tc = useTranslations("ui.booking_dialog_counter");
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Guests are URL-controlled so the price/summary stay in sync with the search bar.
  const setGuests = (kv: Record<string, number>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(kv)) p.set(k, String(v));
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const hasDates = Boolean(from && to);
  const nights = hasDates ? nightsBetween(from!, to!) : 1;
  const guests = adults + children;

  const nightsLabel = (n: number): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return t("nights_one", { count: n });
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
      return t("nights_few", { count: n });
    return t("nights_many", { count: n });
  };

  const perNight =
    hasDates && room.tiers ? priceForGuests(room.tiers, guests) : null;
  const stayTotal = typeof perNight === "number" ? perNight * nights : null;

  // ── Validation (email is REQUIRED) ──
  function validateName(v: string): string | undefined {
    return v.trim().length >= 2 ? undefined : t("err_name");
  }
  function validatePhone(v: string): string | undefined {
    return v.replace(/\D/g, "").length >= 10 ? undefined : t("err_phone");
  }
  function validateEmail(v: string): string | undefined {
    if (!v.trim()) return t("err_email_required");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : t("err_email");
  }

  const formInvalid =
    Boolean(validateName(name)) ||
    Boolean(validatePhone(phone)) ||
    Boolean(validateEmail(email));

  async function handleSubmit() {
    if (!from || !to) return;
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    if (nameErr || phoneErr || emailErr) {
      setErrors({ name: nameErr, phone: phoneErr, email: emailErr });
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const res = await createRoomReservation({
      hotelSlug: hotel,
      roomCategorySlug: room.slug,
      name,
      phone,
      email,
      dateFrom: from,
      dateTo: to,
      adults,
      children,
      breakfast: true, // breakfast is always included
      comment: comment || undefined,
    });

    if (!res.ok || !res.bookingId) {
      setFormError(res.error ?? t("pay_error"));
      setSubmitting(false);
      return;
    }

    if (res.mode === "request") {
      router.push(`/hotel/booking/success?id=${res.bookingId}`);
      return;
    }

    const r = await fetch("/api/payment/liqpay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType: "reservation", entityId: res.bookingId }),
    });
    const pay = (await r.json()) as LiqPayCreateResponse;

    if (pay.mode === "stub" || pay.mode === "already-paid") {
      router.push(pay.entity?.successPath ?? `/pay/success?id=${res.bookingId}`);
      return;
    }
    if (pay.mode === "liqpay" && pay.endpoint && pay.data && pay.signature) {
      submitLiqPayForm(pay.endpoint, pay.data, pay.signature);
      return;
    }

    setFormError(t("pay_error"));
    setSubmitting(false);
  }

  const submitDisabled = submitting || !hasDates || formInvalid;

  return (
    <div className="rounded-[2px] bg-white p-5 ring-1 ring-[#1a3d2e]/10 sm:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl leading-tight text-[#1a3d2e] sm:text-2xl">
          {room.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-mr-1 -mt-1 flex-shrink-0 rounded-[2px] p-1.5 text-[#1a3d2e]/60 transition hover:bg-[#faf6ec] hover:text-[#1a3d2e] focus:outline-none focus:ring-2 focus:ring-[#1a3d2e]/30"
        >
          <X className="h-5 w-5" strokeWidth={1.7} />
        </button>
      </div>

      {/* Summary */}
      <dl className="mt-4 space-y-2 border-t border-[#1a3d2e]/10 pt-4 text-[14px]">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#0f1f18]/70">{t("summary_dates")}</dt>
          <dd className="text-right text-[#1a3d2e]">
            {hasDates ? (
              `${fmtDate(from!)} – ${fmtDate(to!)}`
            ) : (
              <span className="text-[#1a3d2e]/55">{t("change_dates_first")}</span>
            )}
          </dd>
        </div>
        {hasDates && (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#0f1f18]/70">{t("summary_nights")}</dt>
            <dd className="text-right text-[#1a3d2e]">{nightsLabel(nights)}</dd>
          </div>
        )}
      </dl>

      {/* Guests — editable here too */}
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <MiniStepper
          label={t("adults")}
          value={adults}
          min={ADULTS_MIN}
          max={ADULTS_MAX}
          decAria={tc("decrease_aria", { label: t("adults") })}
          incAria={tc("increase_aria", { label: t("adults") })}
          onChange={(n) => setGuests({ adults: n })}
        />
        <MiniStepper
          label={t("children")}
          value={children}
          min={CHILDREN_MIN}
          max={CHILDREN_MAX}
          decAria={tc("decrease_aria", { label: t("children") })}
          incAria={tc("increase_aria", { label: t("children") })}
          onChange={(n) => setGuests({ children: n })}
        />
      </div>

      {/* Breakfast is always included */}
      <p className="mt-3 flex items-center gap-2 rounded-[2px] bg-[#1a3d2e]/[0.04] px-3 py-2 text-[13px] text-[#1a3d2e]">
        <span aria-hidden>🥐</span>
        {t("breakfast_included")}
      </p>

      {/* Total */}
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#1a3d2e]/10 pt-4">
        {stayTotal != null ? (
          <>
            <span className="text-[14px] text-[#0f1f18]/70">
              {t("total_for_stay", { nights: nightsLabel(nights) })}
            </span>
            <span className="font-display text-2xl leading-none text-[#1a3d2e]">
              {stayTotal.toLocaleString("uk-UA")} грн
            </span>
          </>
        ) : (
          <span className="ml-auto font-display text-2xl leading-none text-[#1a3d2e]">
            {room.priceLabel}
          </span>
        )}
      </div>

      {/* Guest form */}
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        <Field
          id="rp-name"
          label={t("field_name")}
          value={name}
          type="text"
          error={errors.name}
          onChange={(v) => {
            setName(v);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          onBlur={(v) => setErrors((p) => ({ ...p, name: validateName(v) }))}
        />
        <Field
          id="rp-phone"
          label={t("field_phone")}
          value={phone}
          type="tel"
          error={errors.phone}
          onChange={(v) => {
            setPhone(v);
            if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
          }}
          onBlur={(v) => setErrors((p) => ({ ...p, phone: validatePhone(v) }))}
        />
        <Field
          id="rp-email"
          label={t("field_email_required")}
          value={email}
          type="email"
          error={errors.email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          onBlur={(v) => setErrors((p) => ({ ...p, email: validateEmail(v) }))}
        />
        <p className="-mt-2 text-[12px] text-[#1a3d2e]/55">
          {t("email_confirmation_note")}
        </p>

        <div>
          <label
            htmlFor="rp-comment"
            className="mb-1 block text-[14px] text-[#0f1f18]/80"
          >
            {t("field_comment")}
          </label>
          <textarea
            id="rp-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full rounded-[2px] bg-[#c9a95c] px-6 py-3 text-[15px] font-medium text-[#1a3d2e] transition hover:bg-[#b8923f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t("submitting") : t("reserve_and_pay")}
          </button>
          {!hasDates && (
            <p className="mt-2 text-center text-[13px] text-[#1a3d2e]/55">
              {t("change_dates_first")}
            </p>
          )}
          {formError && (
            <p className="mt-2 text-center text-[13px] text-[#c8102e]">
              {formError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  type,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  type: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[14px] text-[#0f1f18]/80">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={inputClass}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[13px] text-[#c8102e]">
          {error}
        </p>
      )}
    </div>
  );
}

function MiniStepper({
  label,
  value,
  min,
  max,
  decAria,
  incAria,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  decAria: string;
  incAria: string;
  onChange: (n: number) => void;
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
          aria-label={decAria}
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
          aria-label={incAria}
        >
          +
        </button>
      </div>
    </div>
  );
}
