"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const inputClass =
  "w-full rounded-[2px] border border-[#1a3d2e]/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a3d2e]/30";

function nightsBetween(from: string, to: string): number {
  return Math.max(1, Math.round((+new Date(to) - +new Date(from)) / 86400000));
}

/** dd.MM.yyyy */
function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
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
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [breakfast, setBreakfast] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const hasDates = Boolean(from && to);
  const nights = hasDates ? nightsBetween(from!, to!) : 1;
  const guests = adults + children;

  /** Slavic plural rule for nights (uk). */
  const nightsLabel = (n: number): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return t("nights_one", { count: n });
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return t("nights_few", { count: n });
    }
    return t("nights_many", { count: n });
  };

  const perNight =
    hasDates && room.tiers ? priceForGuests(room.tiers, guests) : null;
  const stayTotal = typeof perNight === "number" ? perNight * nights : null;

  // ── Validation ──
  function validateName(v: string): string | undefined {
    return v.trim().length >= 2 ? undefined : t("err_name");
  }
  function validatePhone(v: string): string | undefined {
    return v.replace(/\D/g, "").length >= 10 ? undefined : t("err_phone");
  }
  function validateEmail(v: string): string | undefined {
    if (!v) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : t("err_email");
  }

  const formInvalid =
    Boolean(validateName(name)) || Boolean(validatePhone(phone));
  const emailInvalid = Boolean(validateEmail(email));

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
      email: email || undefined,
      dateFrom: from,
      dateTo: to,
      adults,
      children,
      breakfast,
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

    // pay-to-confirm
    const r = await fetch("/api/payment/liqpay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "reservation",
        entityId: res.bookingId,
      }),
    });
    const pay = (await r.json()) as LiqPayCreateResponse;

    if (pay.mode === "stub" || pay.mode === "already-paid") {
      router.push(pay.entity?.successPath ?? `/uk/pay/success?id=${res.bookingId}`);
      return;
    }
    if (pay.mode === "liqpay" && pay.endpoint && pay.data && pay.signature) {
      submitLiqPayForm(pay.endpoint, pay.data, pay.signature);
      return; // leaves the SPA
    }

    setFormError(t("pay_error"));
    setSubmitting(false);
  }

  const submitDisabled = submitting || !hasDates || formInvalid || emailInvalid;

  return (
    <div className="bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 p-6 md:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl text-[#1a3d2e] leading-tight">
          {room.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-mt-1 -mr-1 flex-shrink-0 rounded-[2px] p-1.5 text-[#1a3d2e]/60 transition hover:bg-[#faf6ec] hover:text-[#1a3d2e] focus:outline-none focus:ring-2 focus:ring-[#1a3d2e]/30"
        >
          <X className="h-5 w-5" strokeWidth={1.7} />
        </button>
      </div>

      {/* Summary */}
      <dl className="mt-5 space-y-2 border-t border-[#1a3d2e]/10 pt-5 text-[14px]">
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
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#0f1f18]/70">{t("guests")}</dt>
          <dd className="text-right text-[#1a3d2e]">{guests}</dd>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4 border-t border-[#1a3d2e]/10 pt-4">
          {stayTotal != null ? (
            <>
              <dt className="text-[#0f1f18]/70">
                {t("total_for_stay", { nights: nightsLabel(nights) })}
              </dt>
              <dd className="font-display text-2xl leading-none text-[#1a3d2e]">
                {stayTotal} грн
              </dd>
            </>
          ) : (
            <dd className="ml-auto font-display text-2xl leading-none text-[#1a3d2e]">
              {room.priceLabel}
            </dd>
          )}
        </div>
      </dl>

      {/* Guest form */}
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        {/* Name */}
        <div>
          <label htmlFor="rp-name" className="mb-1 block text-[14px] text-[#0f1f18]/80">
            {t("field_name")}
          </label>
          <input
            id="rp-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            onBlur={(e) =>
              setErrors((p) => ({ ...p, name: validateName(e.target.value) }))
            }
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "rp-name-err" : undefined}
            className={inputClass}
          />
          {errors.name && (
            <p id="rp-name-err" className="mt-1 text-[13px] text-[#c8102e]">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="rp-phone" className="mb-1 block text-[14px] text-[#0f1f18]/80">
            {t("field_phone")}
          </label>
          <input
            id="rp-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            onBlur={(e) =>
              setErrors((p) => ({ ...p, phone: validatePhone(e.target.value) }))
            }
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "rp-phone-err" : undefined}
            className={inputClass}
          />
          {errors.phone && (
            <p id="rp-phone-err" className="mt-1 text-[13px] text-[#c8102e]">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="rp-email" className="mb-1 block text-[14px] text-[#0f1f18]/80">
            {t("field_email")}
          </label>
          <input
            id="rp-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            onBlur={(e) =>
              setErrors((p) => ({ ...p, email: validateEmail(e.target.value) }))
            }
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "rp-email-err" : undefined}
            className={inputClass}
          />
          {errors.email && (
            <p id="rp-email-err" className="mt-1 text-[13px] text-[#c8102e]">
              {errors.email}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="rp-comment" className="mb-1 block text-[14px] text-[#0f1f18]/80">
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

        {/* Breakfast */}
        <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#0f1f18]/80">
          <input
            type="checkbox"
            checked={breakfast}
            onChange={(e) => setBreakfast(e.target.checked)}
            className="h-4 w-4 rounded-[2px] border-[#1a3d2e]/30 text-[#1a3d2e] focus:ring-2 focus:ring-[#1a3d2e]/30"
          />
          <span>{t("breakfast")}</span>
        </label>

        {/* Submit */}
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
