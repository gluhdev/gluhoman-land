"use client";

import {
  useEffect,
  useState,
  useTransition,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  X,
  Hotel,
  Waves,
  UtensilsCrossed,
  Flame,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Cake,
  Briefcase,
  Heart,
  Users,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  submitBooking,
  type BookingService,
  type BookingPayload,
} from "@/app/actions/booking";
import { CONTACT_INFO } from "@/constants";
import { Calendar, toISO, fromISO, type DateRange } from "./Calendar";

const SERVICE_ICONS: Record<BookingService, typeof Hotel> = {
  hotel: Hotel,
  aquapark: Waves,
  restaurant: UtensilsCrossed,
  sauna: Flame,
};

const BOOKING_OPEN_EVENT = "gluhoman:booking:open";

export interface BookingPrefill {
  comment?: string;
  hotelSlug?: "aquapark" | "central" | "cottages" | "brewery";
  roomCategorySlug?: string;
}

export function openBookingDialog(
  service?: BookingService,
  prefill?: BookingPrefill
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(BOOKING_OPEN_EVENT, { detail: { service, prefill } })
  );
}

// ── Date helpers ───────────────────────────────────────────────────────────
const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const tomorrowDate = () => {
  const d = todayDate();
  d.setDate(d.getDate() + 1);
  return d;
};

type Errors = Partial<
  Record<
    | "name"
    | "phone"
    | "email"
    | "dateFrom"
    | "dateTo"
    | "time"
    | "guests"
    | "roomType"
    | "tariff"
    | "programme",
    string
  >
>;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("38")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 9) return raw.trim();
  return `+38 0${d.slice(0, 2)} ${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7, 9)}`;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// 30-min slots 12:00 → 21:30
const RESTAURANT_TIMES = (() => {
  const out: string[] = [];
  for (let h = 12; h <= 21; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

// Slot IDs are stable server-side keys (not translated)
const SAUNA_SLOT_IDS = [
  "morning",
  "afternoon",
  "evening",
] as const;
type SaunaSlotId = (typeof SAUNA_SLOT_IDS)[number];

// ── Main component ─────────────────────────────────────────────────────────
export default function BookingDialog() {
  const t = useTranslations("ui.booking_dialog");
  const tv = useTranslations("ui.booking_dialog_validation");
  const ts = useTranslations("ui.booking_dialog_services");

  const SERVICES: {
    id: BookingService;
    label: string;
    icon: typeof Hotel;
    description: string;
  }[] = [
    { id: "hotel", label: ts("hotel_label"), icon: SERVICE_ICONS.hotel, description: ts("hotel_description") },
    { id: "aquapark", label: ts("aquapark_label"), icon: SERVICE_ICONS.aquapark, description: ts("aquapark_description") },
    { id: "restaurant", label: ts("restaurant_label"), icon: SERVICE_ICONS.restaurant, description: ts("restaurant_description") },
    { id: "sauna", label: ts("sauna_label"), icon: SERVICE_ICONS.sauna, description: ts("sauna_description") },
  ];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState<BookingService>("hotel");

  // Shared
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [dateSingle, setDateSingle] = useState<Date>(todayDate());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: todayDate(),
    to: tomorrowDate(),
  });

  // Hotel
  const [roomType, setRoomType] = useState<"standard" | "family" | "lux">(
    "standard"
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [breakfast, setBreakfast] = useState(true);

  // Aquapark
  const [tariff, setTariff] = useState<"full_day" | "half_day">("full_day");
  const [adultsCount, setAdultsCount] = useState(2);
  const [kidsCount, setKidsCount] = useState(0);
  const [toddlersCount, setToddlersCount] = useState(0);

  // Restaurant
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [occasion, setOccasion] = useState<
    "birthday" | "business" | "romantic" | "casual" | "other"
  >("casual");
  const [dietary, setDietary] = useState("");

  // Sauna
  const [saunaSlot, setSaunaSlot] = useState<SaunaSlotId>("afternoon");
  const [saunaGroup, setSaunaGroup] = useState(4);
  const [programme, setProgramme] = useState<"classic" | "herbal" | "family">(
    "classic"
  );

  // Multi-hotel prefill (silent — populated from /hotel/* booking buttons)
  const [hotelSlug, setHotelSlugState] = useState<
    "aquapark" | "central" | "cottages" | "brewery" | undefined
  >(undefined);
  const [roomCategorySlug, setRoomCategorySlugState] = useState<
    string | undefined
  >(undefined);

  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const resetAll = useCallback(() => {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setComment("");
    setDateSingle(todayDate());
    setDateRange({ from: todayDate(), to: tomorrowDate() });
    setRoomType("standard");
    setAdults(2);
    setChildren(0);
    setBreakfast(true);
    setTariff("full_day");
    setAdultsCount(2);
    setKidsCount(0);
    setToddlersCount(0);
    setTime("19:00");
    setPartySize(2);
    setOccasion("casual");
    setDietary("");
    setSaunaSlot("afternoon");
    setSaunaGroup(4);
    setProgramme("classic");
    setErrors({});
    setSubmitError(null);
    setSuccess(false);
    setSuccessId(null);
    setHotelSlugState(undefined);
    setRoomCategorySlugState(undefined);
  }, []);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (
        e as CustomEvent<{
          service?: BookingService;
          prefill?: BookingPrefill;
        }>
      ).detail;
      resetAll();
      if (detail?.service) setService(detail.service);
      if (detail?.prefill?.comment) setComment(detail.prefill.comment);
      if (detail?.prefill?.hotelSlug) setHotelSlugState(detail.prefill.hotelSlug);
      if (detail?.prefill?.roomCategorySlug)
        setRoomCategorySlugState(detail.prefill.roomCategorySlug);
      setOpen(true);
    }
    window.addEventListener(BOOKING_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(BOOKING_OPEN_EVENT, onOpen);
  }, [resetAll]);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(resetAll, 150);
  }, [resetAll]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // ── Validation ──────────────────────────────────────────────────────────
  const validateStep1 = (): Errors => {
    const errs: Errors = {};
    if (service === "hotel") {
      if (!dateRange.from || !dateRange.to) {
        errs.dateFrom = tv("hotel_dates_required");
      } else if (dateRange.to.getTime() <= dateRange.from.getTime()) {
        errs.dateTo = tv("hotel_checkout_after_checkin");
      }
      if (adults < 1) errs.guests = tv("hotel_min_adults");
    } else {
      if (!dateSingle) errs.dateFrom = tv("date_required");
    }
    if (service === "restaurant") {
      if (!time) errs.time = tv("restaurant_time_required");
      if (partySize < 1 || partySize > 20) errs.guests = tv("restaurant_party_range");
    }
    if (service === "aquapark") {
      if (adultsCount + kidsCount + toddlersCount < 1)
        errs.guests = tv("aquapark_min_guest");
    }
    if (service === "sauna") {
      if (!saunaSlot) errs.time = tv("sauna_time_required");
      if (saunaGroup < 2 || saunaGroup > 12) errs.guests = tv("sauna_group_range");
    }
    return errs;
  };

  const validateStep2 = (): Errors => {
    const errs: Errors = {};
    if (!name.trim() || name.trim().length < 2) errs.name = tv("name_min");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) errs.phone = tv("phone_invalid");
    if (email.trim() && !isValidEmail(email.trim()))
      errs.email = tv("email_invalid");
    return errs;
  };

  const step2Ready = useMemo(() => {
    if (!name.trim() || name.trim().length < 2) return false;
    if (phone.replace(/\D/g, "").length < 10) return false;
    if (email.trim() && !isValidEmail(email.trim())) return false;
    return true;
  }, [name, phone, email]);

  const goNext = () => {
    const errs = validateStep1();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(2);
      setSubmitError(null);
    }
  };

  const goBack = () => {
    setStep(1);
    setSubmitError(null);
  };

  const handlePhoneBlur = () => {
    if (!phone.trim()) return;
    setPhone(formatPhone(phone));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = { ...validateStep1(), ...validateStep2() };
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const step1Keys = ["dateFrom", "dateTo", "time", "guests"] as const;
      if (step1Keys.some((k) => errs[k])) setStep(1);
      return;
    }

    const base = {
      service,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      comment: comment.trim() || undefined,
    };

    let payload: BookingPayload;
    if (service === "hotel") {
      payload = {
        ...base,
        guests: adults + children,
        dateFrom: toISO(dateRange.from!),
        dateTo: toISO(dateRange.to!),
        roomType,
        adults,
        children,
        breakfast,
        hotelSlug,
        roomCategorySlug,
      };
    } else if (service === "aquapark") {
      payload = {
        ...base,
        guests: adultsCount + kidsCount + toddlersCount,
        dateFrom: toISO(dateSingle),
        tariff,
        adultsCount,
        kidsCount,
        toddlersCount,
      };
    } else if (service === "restaurant") {
      payload = {
        ...base,
        guests: partySize,
        dateFrom: toISO(dateSingle),
        time,
        occasion,
        dietary: dietary.trim() || undefined,
      };
    } else {
      // sauna
      payload = {
        ...base,
        guests: saunaGroup,
        dateFrom: toISO(dateSingle),
        time: saunaSlot,
        programme,
      };
    }

    startTransition(async () => {
      const res = await submitBooking(payload);
      if (res.ok) {
        setSuccess(true);
        setSuccessId(res.bookingId ?? null);
      } else {
        setSubmitError(res.message);
      }
    });
  };

  if (!mounted || !open) return null;

  const activeService = SERVICES.find((s) => s.id === service)!;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-[#0b1410]/70 p-0 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative w-full sm:max-w-2xl md:max-w-3xl max-h-[95vh] overflow-y-auto bg-[#faf6ec] shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label={t("close_aria")}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8] transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <SuccessScreen onClose={close} bookingId={successId} />
        ) : (
          <div className="px-6 pt-10 pb-8 sm:px-10 sm:pt-12">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-3">
              {t("eyebrow")}
            </p>
            <h2
              id="booking-title"
              className="font-display text-3xl sm:text-4xl text-[#0b1410] mb-6"
            >
              {t("title")} <em className="italic text-[#1a3d2e]">{t("title_em")}</em>
            </h2>

            {/* Service tabs */}
            <div
              role="tablist"
              aria-label={t("service_tabs_aria")}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-y border-[#e6d9b8] py-3"
            >
              {SERVICES.map((s) => {
                const Icon = s.icon;
                const active = service === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setService(s.id);
                      setErrors({});
                      setStep(1);
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 text-[11px] uppercase tracking-[0.18em] transition ${
                      active
                        ? "bg-[#1a3d2e] text-[#f4ecd8]"
                        : "text-[#1a3d2e]/60 hover:text-[#1a3d2e] hover:bg-[#f4ecd8]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 font-display italic text-[#1a3d2e] text-center text-lg">
              {activeService.description}
            </p>

            {/* Body */}
            <div className="relative mt-6">
              {pending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#faf6ec]/80">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1a3d2e]" />
                </div>
              )}

              <fieldset disabled={pending} className="contents">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div className="border border-[#e6d9b8] p-5 bg-[#faf6ec]">
                      {service === "hotel" ? (
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onRangeSelect={setDateRange}
                        />
                      ) : (
                        <Calendar
                          mode="single"
                          selected={dateSingle}
                          onSelect={setDateSingle}
                        />
                      )}
                      {(errors.dateFrom || errors.dateTo) && (
                        <p className="mt-3 text-xs text-red-700">
                          {errors.dateFrom || errors.dateTo}
                        </p>
                      )}
                    </div>

                    {/* Service-specific extras */}
                    <div className="space-y-5">
                      {service === "hotel" && (
                        <HotelExtras
                          roomType={roomType}
                          setRoomType={setRoomType}
                          adults={adults}
                          setAdults={setAdults}
                          childrenCount={children}
                          setChildrenCount={setChildren}
                          breakfast={breakfast}
                          setBreakfast={setBreakfast}
                        />
                      )}
                      {service === "aquapark" && (
                        <AquaparkExtras
                          tariff={tariff}
                          setTariff={setTariff}
                          adultsCount={adultsCount}
                          setAdultsCount={setAdultsCount}
                          kidsCount={kidsCount}
                          setKidsCount={setKidsCount}
                          toddlersCount={toddlersCount}
                          setToddlersCount={setToddlersCount}
                        />
                      )}
                      {service === "restaurant" && (
                        <RestaurantExtras
                          time={time}
                          setTime={setTime}
                          partySize={partySize}
                          setPartySize={setPartySize}
                          occasion={occasion}
                          setOccasion={setOccasion}
                          dietary={dietary}
                          setDietary={setDietary}
                          error={errors.time}
                        />
                      )}
                      {service === "sauna" && (
                        <SaunaExtras
                          slot={saunaSlot}
                          setSlot={setSaunaSlot}
                          groupSize={saunaGroup}
                          setGroupSize={setSaunaGroup}
                          programme={programme}
                          setProgramme={setProgramme}
                        />
                      )}

                      {errors.guests && (
                        <p className="text-xs text-red-700">{errors.guests}</p>
                      )}

                      <button
                        type="button"
                        onClick={goNext}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3d2e] text-[#f4ecd8] px-6 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-[#0f1f18] transition"
                      >
                        {t("next_label")}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("field_name_label")} required error={errors.name}>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputCls(errors.name)}
                          placeholder={t("field_name_placeholder")}
                          autoComplete="name"
                        />
                      </Field>
                      <Field label={t("field_phone_label")} required error={errors.phone}>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={handlePhoneBlur}
                          className={inputCls(errors.phone)}
                          placeholder={t("field_phone_placeholder")}
                          autoComplete="tel"
                        />
                      </Field>
                    </div>

                    <Field label={t("field_email_label")} error={errors.email}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputCls(errors.email)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </Field>

                    <Field label={t("field_comment_label")}>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={`${inputCls()} min-h-[90px] resize-y`}
                        placeholder={t("field_comment_placeholder")}
                        rows={3}
                      />
                    </Field>

                    {submitError && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 border border-red-300 bg-red-50 p-3 text-sm text-red-900"
                      >
                        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center justify-center gap-2 border border-[#1a3d2e] text-[#1a3d2e] px-5 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-[#1a3d2e] hover:text-[#f4ecd8] transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {t("back_label")}
                      </button>
                      <button
                        type="submit"
                        disabled={pending || !step2Ready}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1a3d2e] text-[#f4ecd8] px-6 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-[#0f1f18] disabled:opacity-60 disabled:cursor-not-allowed transition"
                      >
                        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {pending ? t("submit_loading") : t("submit_label")}
                      </button>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/60 text-center">
                      {t("privacy_note")}
                    </p>
                  </form>
                )}
              </fieldset>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function HotelExtras({
  roomType,
  setRoomType,
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  breakfast,
  setBreakfast,
}: {
  roomType: "standard" | "family" | "lux";
  setRoomType: (v: "standard" | "family" | "lux") => void;
  adults: number;
  setAdults: (n: number) => void;
  childrenCount: number;
  setChildrenCount: (n: number) => void;
  breakfast: boolean;
  setBreakfast: (v: boolean) => void;
}) {
  const t = useTranslations("ui.booking_dialog_hotel");
  const tc = useTranslations("ui.booking_dialog_counter");
  const rooms: { id: "standard" | "family" | "lux"; label: string; hint: string }[] = [
    { id: "standard", label: t("room_standard_label"), hint: t("room_standard_hint") },
    { id: "family", label: t("room_family_label"), hint: t("room_family_hint") },
    { id: "lux", label: t("room_lux_label"), hint: t("room_lux_hint") },
  ];
  return (
    <div className="space-y-5">
      <div>
        <Label>{t("room_type_label")}</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {rooms.map((r) => {
            const active = roomType === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomType(r.id)}
                className={`flex flex-col items-center justify-center border p-3 text-center transition ${
                  active
                    ? "border-[#1a3d2e] bg-[#1a3d2e] text-[#f4ecd8]"
                    : "border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8]"
                }`}
              >
                <span className="font-display text-base">{r.label}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] opacity-70 mt-1">
                  {r.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Counter label={t("adults_label")} decreaseAria={tc("decrease_aria", { label: t("adults_label") })} increaseAria={tc("increase_aria", { label: t("adults_label") })} value={adults} setValue={setAdults} min={1} max={4} />
        <Counter label={t("children_label")} decreaseAria={tc("decrease_aria", { label: t("children_label") })} increaseAria={tc("increase_aria", { label: t("children_label") })} value={childrenCount} setValue={setChildrenCount} min={0} max={4} />
      </div>
      <button
        type="button"
        onClick={() => setBreakfast(!breakfast)}
        className={`w-full flex items-center justify-between border px-4 py-3 transition ${
          breakfast
            ? "border-[#1a3d2e] bg-[#f4ecd8]"
            : "border-[#e6d9b8] hover:bg-[#f4ecd8]"
        }`}
      >
        <span className="text-sm text-[#0b1410]">{t("breakfast_label")}</span>
        <span
          className={`h-5 w-9 relative rounded-full transition ${
            breakfast ? "bg-[#1a3d2e]" : "bg-[#e6d9b8]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#e6d9b8] transition ${
              breakfast ? "left-[18px] bg-[#faf6ec]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    </div>
  );
}

function AquaparkExtras({
  tariff,
  setTariff,
  adultsCount,
  setAdultsCount,
  kidsCount,
  setKidsCount,
  toddlersCount,
  setToddlersCount,
}: {
  tariff: "full_day" | "half_day";
  setTariff: (v: "full_day" | "half_day") => void;
  adultsCount: number;
  setAdultsCount: (n: number) => void;
  kidsCount: number;
  setKidsCount: (n: number) => void;
  toddlersCount: number;
  setToddlersCount: (n: number) => void;
}) {
  const ta = useTranslations("ui.booking_dialog_aquapark");
  const tc = useTranslations("ui.booking_dialog_counter");
  const tariffs: { id: "full_day" | "half_day"; label: string; hint: string }[] = [
    { id: "full_day", label: ta("tariff_full_day_label"), hint: ta("tariff_full_day_hint") },
    { id: "half_day", label: ta("tariff_half_day_label"), hint: ta("tariff_half_day_hint") },
  ];
  return (
    <div className="space-y-5">
      <div>
        <Label>{ta("tariff_label")}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {tariffs.map((tr) => {
            const active = tariff === tr.id;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => setTariff(tr.id)}
                className={`flex flex-col items-center border p-4 transition ${
                  active
                    ? "border-[#1a3d2e] bg-[#1a3d2e] text-[#f4ecd8]"
                    : "border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8]"
                }`}
              >
                <span className="font-display text-lg">{tr.label}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] opacity-70 mt-1">
                  {tr.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        <Counter label={ta("adults_label")} decreaseAria={tc("decrease_aria", { label: ta("adults_label") })} increaseAria={tc("increase_aria", { label: ta("adults_label") })} value={adultsCount} setValue={setAdultsCount} min={0} max={20} />
        <Counter label={ta("kids_label")} decreaseAria={tc("decrease_aria", { label: ta("kids_label") })} increaseAria={tc("increase_aria", { label: ta("kids_label") })} value={kidsCount} setValue={setKidsCount} min={0} max={20} />
        <Counter label={ta("toddlers_label")} decreaseAria={tc("decrease_aria", { label: ta("toddlers_label") })} increaseAria={tc("increase_aria", { label: ta("toddlers_label") })} value={toddlersCount} setValue={setToddlersCount} min={0} max={10} />
      </div>
    </div>
  );
}

function RestaurantExtras({
  time,
  setTime,
  partySize,
  setPartySize,
  occasion,
  setOccasion,
  dietary,
  setDietary,
  error,
}: {
  time: string;
  setTime: (v: string) => void;
  partySize: number;
  setPartySize: (n: number) => void;
  occasion: "birthday" | "business" | "romantic" | "casual" | "other";
  setOccasion: (v: "birthday" | "business" | "romantic" | "casual" | "other") => void;
  dietary: string;
  setDietary: (v: string) => void;
  error?: string;
}) {
  const tr = useTranslations("ui.booking_dialog_restaurant");
  const tc = useTranslations("ui.booking_dialog_counter");
  const occ: {
    id: "birthday" | "business" | "romantic" | "casual" | "other";
    label: string;
    Icon: typeof Cake;
  }[] = [
    { id: "birthday", label: tr("occ_birthday"), Icon: Cake },
    { id: "business", label: tr("occ_business"), Icon: Briefcase },
    { id: "romantic", label: tr("occ_romantic"), Icon: Heart },
    { id: "casual", label: tr("occ_casual"), Icon: Users },
    { id: "other", label: tr("occ_other"), Icon: Sparkles },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{tr("time_label")}</Label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${inputCls(error)} mt-2`}
          >
            {RESTAURANT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Counter label={tr("guests_label")} decreaseAria={tc("decrease_aria", { label: tr("guests_label") })} increaseAria={tc("increase_aria", { label: tr("guests_label") })} value={partySize} setValue={setPartySize} min={1} max={20} />
      </div>
      <div>
        <Label>{tr("occasion_label")}</Label>
        <div className="grid grid-cols-5 gap-1.5 mt-2">
          {occ.map((o) => {
            const active = occasion === o.id;
            const Icon = o.Icon;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOccasion(o.id)}
                className={`flex flex-col items-center gap-1 border p-2 transition ${
                  active
                    ? "border-[#1a3d2e] bg-[#1a3d2e] text-[#f4ecd8]"
                    : "border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[9px] uppercase tracking-[0.1em] text-center leading-tight">
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label>{tr("dietary_label")}</Label>
        <textarea
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          rows={2}
          className={`${inputCls()} mt-2 resize-y`}
          placeholder={tr("dietary_placeholder")}
        />
      </div>
    </div>
  );
}

function SaunaExtras({
  slot,
  setSlot,
  groupSize,
  setGroupSize,
  programme,
  setProgramme,
}: {
  slot: SaunaSlotId;
  setSlot: (v: SaunaSlotId) => void;
  groupSize: number;
  setGroupSize: (n: number) => void;
  programme: "classic" | "herbal" | "family";
  setProgramme: (v: "classic" | "herbal" | "family") => void;
}) {
  const ts = useTranslations("ui.booking_dialog_sauna");
  const tc = useTranslations("ui.booking_dialog_counter");
  const progs: { id: "classic" | "herbal" | "family"; label: string }[] = [
    { id: "classic", label: ts("prog_classic") },
    { id: "herbal", label: ts("prog_herbal") },
    { id: "family", label: ts("prog_family") },
  ];
  const slots: { id: SaunaSlotId; label: string; time: string }[] = [
    { id: "morning", label: ts("slot_morning_label"), time: ts("slot_morning_time") },
    { id: "afternoon", label: ts("slot_afternoon_label"), time: ts("slot_afternoon_time") },
    { id: "evening", label: ts("slot_evening_label"), time: ts("slot_evening_time") },
  ];
  return (
    <div className="space-y-5">
      <div>
        <Label>{ts("slot_label")}</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {slots.map((s) => {
            const active = slot === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlot(s.id)}
                className={`flex items-center justify-between border px-4 py-3 transition ${
                  active
                    ? "border-[#1a3d2e] bg-[#1a3d2e] text-[#f4ecd8]"
                    : "border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8]"
                }`}
              >
                <span className="font-display text-base">{s.label}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">
                  {s.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <Counter label={ts("group_size_label")} decreaseAria={tc("decrease_aria", { label: ts("group_size_label") })} increaseAria={tc("increase_aria", { label: ts("group_size_label") })} value={groupSize} setValue={setGroupSize} min={2} max={12} />
      <div>
        <Label>{ts("programme_label")}</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {progs.map((p) => {
            const active = programme === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProgramme(p.id)}
                className={`border px-3 py-3 text-center transition ${
                  active
                    ? "border-[#1a3d2e] bg-[#1a3d2e] text-[#f4ecd8]"
                    : "border-[#e6d9b8] text-[#1a3d2e] hover:bg-[#f4ecd8]"
                }`}
              >
                <span className="font-display text-base">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Counter({
  label,
  decreaseAria,
  increaseAria,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  decreaseAria: string;
  increaseAria: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center border border-[#e6d9b8]">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="h-11 w-11 text-[#1a3d2e] hover:bg-[#f4ecd8] transition text-lg"
          aria-label={decreaseAria}
        >
          −
        </button>
        <div className="flex-1 text-center font-display text-lg text-[#0b1410]">
          {value}
        </div>
        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + 1))}
          className="h-11 w-11 text-[#1a3d2e] hover:bg-[#f4ecd8] transition text-lg"
          aria-label={increaseAria}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 block">
      {children}
    </span>
  );
}

function SuccessScreen({
  onClose,
  bookingId,
}: {
  onClose: () => void;
  bookingId: string | null;
}) {
  const t = useTranslations("ui.booking_dialog_success");
  const phone = CONTACT_INFO.phone?.[0] ?? "";
  return (
    <div className="px-6 pt-16 pb-12 sm:px-10 text-center">
      <h2 className="font-display text-5xl sm:text-6xl text-[#0b1410]">
        {t("title")}
      </h2>
      <p className="mt-4 font-display italic text-xl text-[#1a3d2e]">
        {t("subtitle")}
      </p>
      {bookingId && (
        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70">
          {t("booking_ref", { id: bookingId.slice(0, 8) })}
        </p>
      )}
      <p className="mt-3 text-sm text-[#0b1410]/80">
        {phone
          ? t("follow_up_phone", { phone })
          : t("follow_up")}
      </p>
      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center bg-[#1a3d2e] text-[#f4ecd8] px-10 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-[#0f1f18] transition"
        >
          {t("close_label")}
        </button>
      </div>
    </div>
  );
}

function inputCls(err?: string) {
  const base =
    "w-full bg-[#faf6ec] border px-4 py-3 text-sm text-[#0b1410] placeholder:text-[#1a3d2e]/40 focus:outline-none transition";
  return err
    ? `${base} border-red-400 focus:border-red-500`
    : `${base} border-[#e6d9b8] focus:border-[#1a3d2e]`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-2 block">
        {label}
        {required && <span className="text-[#1a3d2e] ml-1">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-red-700">{error}</span>
      )}
    </label>
  );
}

// Re-export for any external consumers that previously imported from here
export { fromISO };
