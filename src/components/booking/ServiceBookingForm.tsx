"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Loader2,
  AlertCircle,
  Cake,
  Briefcase,
  Heart,
  Users,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { submitBooking, type BookingPayload } from "@/app/actions/booking";
import { CONTACT_INFO } from "@/constants";
import { Calendar, toISO } from "@/components/ui/Calendar";

interface Props {
  service: "restaurant" | "aquapark" | "sauna";
}

// ── Date helpers ───────────────────────────────────────────────────────────
const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

type Errors = Partial<
  Record<"name" | "phone" | "email" | "dateFrom" | "time" | "guests", string>
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
type SaunaSlotId = "morning" | "afternoon" | "evening";

// ── Main component ─────────────────────────────────────────────────────────
export default function ServiceBookingForm({ service }: Props) {
  const t = useTranslations("ui.booking_dialog");
  const tv = useTranslations("ui.booking_dialog_validation");

  // Shared
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [dateSingle, setDateSingle] = useState<Date>(todayDate());

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

  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // ── Validation ──────────────────────────────────────────────────────────
  const validateAll = (): Errors => {
    const errs: Errors = {};
    // Date (single) — required for all three services.
    if (!dateSingle) errs.dateFrom = tv("date_required");

    if (service === "restaurant") {
      if (!time) errs.time = tv("restaurant_time_required");
      if (partySize < 1 || partySize > 20)
        errs.guests = tv("restaurant_party_range");
    }
    if (service === "aquapark") {
      if (adultsCount + kidsCount + toddlersCount < 1)
        errs.guests = tv("aquapark_min_guest");
    }
    if (service === "sauna") {
      if (!saunaSlot) errs.time = tv("sauna_time_required");
      if (saunaGroup < 2 || saunaGroup > 12)
        errs.guests = tv("sauna_group_range");
    }

    // Contact fields.
    if (!name.trim() || name.trim().length < 2) errs.name = tv("name_min");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) errs.phone = tv("phone_invalid");
    if (email.trim() && !isValidEmail(email.trim()))
      errs.email = tv("email_invalid");
    return errs;
  };

  const contactReady = useMemo(() => {
    if (!name.trim() || name.trim().length < 2) return false;
    if (phone.replace(/\D/g, "").length < 10) return false;
    if (email.trim() && !isValidEmail(email.trim())) return false;
    return true;
  }, [name, phone, email]);

  const handlePhoneBlur = () => {
    if (!phone.trim()) return;
    setPhone(formatPhone(phone));
  };

  // Per-field blur validation — re-run all rules, keep only this field's error.
  const blurField = (field: keyof Errors) => {
    const errs = validateAll();
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = validateAll();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const base = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      comment: comment.trim() || undefined,
    };

    let payload: BookingPayload;
    if (service === "aquapark") {
      payload = {
        service: "aquapark",
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
        service: "restaurant",
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
        service: "sauna",
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

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <SuccessScreen bookingId={successId} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 p-6 md:p-8"
      >
        <fieldset disabled={pending} className="contents">
          <div className="space-y-6">
            {/* Date */}
            <div>
              <Label>{t("eyebrow")}</Label>
              <div className="mt-2 border border-[#1a3d2e]/15 rounded-[2px] p-5">
                <Calendar
                  mode="single"
                  selected={dateSingle}
                  onSelect={setDateSingle}
                />
              </div>
              {errors.dateFrom && (
                <p className="mt-2 text-xs text-red-700">{errors.dateFrom}</p>
              )}
            </div>

            {/* Service-specific extras */}
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

            {/* Contact fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t("field_name_label")} required error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => blurField("name")}
                  className={inputCls(errors.name)}
                  placeholder={t("field_name_placeholder")}
                  autoComplete="name"
                />
              </Field>
              <Field
                label={t("field_phone_label")}
                required
                error={errors.phone}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => {
                    handlePhoneBlur();
                    blurField("phone");
                  }}
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
                onBlur={() => blurField("email")}
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

            <button
              type="submit"
              disabled={pending || !contactReady}
              className="w-full inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#1a3d2e] text-[#f4ecd8] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-[0_10px_28px_-12px_rgba(15,31,24,0.5)] transition hover:bg-[#0f1f18] disabled:bg-[#1a3d2e]/20 disabled:text-[#1a3d2e]/45 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? t("submit_loading") : t("submit_label")}
            </button>

            <p className="text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/60 text-center">
              {t("privacy_note")}
            </p>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────────

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
  const tariffs: { id: "full_day" | "half_day"; label: string; hint: string }[] =
    [
      {
        id: "full_day",
        label: ta("tariff_full_day_label"),
        hint: ta("tariff_full_day_hint"),
      },
      {
        id: "half_day",
        label: ta("tariff_half_day_label"),
        hint: ta("tariff_half_day_hint"),
      },
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
                    : "border-[#1a3d2e]/15 text-[#1a3d2e] hover:bg-[#f4ecd8]"
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
        <Counter
          label={ta("adults_label")}
          decreaseAria={tc("decrease_aria", { label: ta("adults_label") })}
          increaseAria={tc("increase_aria", { label: ta("adults_label") })}
          value={adultsCount}
          setValue={setAdultsCount}
          min={0}
          max={20}
        />
        <Counter
          label={ta("kids_label")}
          decreaseAria={tc("decrease_aria", { label: ta("kids_label") })}
          increaseAria={tc("increase_aria", { label: ta("kids_label") })}
          value={kidsCount}
          setValue={setKidsCount}
          min={0}
          max={20}
        />
        <Counter
          label={ta("toddlers_label")}
          decreaseAria={tc("decrease_aria", { label: ta("toddlers_label") })}
          increaseAria={tc("increase_aria", { label: ta("toddlers_label") })}
          value={toddlersCount}
          setValue={setToddlersCount}
          min={0}
          max={10}
        />
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
  setOccasion: (
    v: "birthday" | "business" | "romantic" | "casual" | "other"
  ) => void;
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
        <Counter
          label={tr("guests_label")}
          decreaseAria={tc("decrease_aria", { label: tr("guests_label") })}
          increaseAria={tc("increase_aria", { label: tr("guests_label") })}
          value={partySize}
          setValue={setPartySize}
          min={1}
          max={20}
        />
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
                    : "border-[#1a3d2e]/15 text-[#1a3d2e] hover:bg-[#f4ecd8]"
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
    {
      id: "morning",
      label: ts("slot_morning_label"),
      time: ts("slot_morning_time"),
    },
    {
      id: "afternoon",
      label: ts("slot_afternoon_label"),
      time: ts("slot_afternoon_time"),
    },
    {
      id: "evening",
      label: ts("slot_evening_label"),
      time: ts("slot_evening_time"),
    },
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
                    : "border-[#1a3d2e]/15 text-[#1a3d2e] hover:bg-[#f4ecd8]"
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
      <Counter
        label={ts("group_size_label")}
        decreaseAria={tc("decrease_aria", { label: ts("group_size_label") })}
        increaseAria={tc("increase_aria", { label: ts("group_size_label") })}
        value={groupSize}
        setValue={setGroupSize}
        min={2}
        max={12}
      />
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
                    : "border-[#1a3d2e]/15 text-[#1a3d2e] hover:bg-[#f4ecd8]"
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
      <div className="mt-2 flex items-center border border-[#1a3d2e]/15">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="h-11 w-11 text-[#1a3d2e] hover:bg-[#f4ecd8] transition text-lg"
          aria-label={decreaseAria}
        >
          −
        </button>
        <div className="flex-1 text-center font-display text-lg text-[#0f1f18]">
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

function SuccessScreen({ bookingId }: { bookingId: string | null }) {
  const t = useTranslations("ui.booking_dialog_success");
  const phone = CONTACT_INFO.phone?.[0] ?? "";
  return (
    <div className="bg-white rounded-[2px] ring-1 ring-[#1a3d2e]/10 px-6 pt-12 pb-10 md:px-8 text-center">
      <h2 className="font-display text-4xl sm:text-5xl text-[#0f1f18]">
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
      <p className="mt-3 text-sm text-[#0f1f18]/80">
        {phone ? t("follow_up_phone", { phone }) : t("follow_up")}
      </p>
    </div>
  );
}

function inputCls(err?: string) {
  const base =
    "w-full rounded-[2px] border px-3 py-2 text-sm text-[#0f1f18] placeholder:text-[#1a3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#1a3d2e]/30 transition";
  return err
    ? `${base} border-red-400`
    : `${base} border-[#1a3d2e]/15`;
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
