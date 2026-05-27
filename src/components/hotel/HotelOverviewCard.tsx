import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";

export interface HotelOverviewCardProps {
  index: number;
  kicker: string;
  name: string;
  tagline: string;
  highlights: string[];
  cta?: string;
  href?: string;
  imageSrc: string;
  imageAlt: string;
  disabled?: boolean;
  disabledLabel?: string;
}

const ROMAN = ["I", "II", "III", "IV"] as const;

export function HotelOverviewCard({
  index,
  kicker,
  name,
  tagline,
  highlights,
  cta,
  href,
  imageSrc,
  imageAlt,
  disabled,
  disabledLabel,
}: HotelOverviewCardProps) {
  const content = (
    <>
      <div className="relative aspect-[5/4] overflow-hidden ring-1 ring-[#1a3d2e]/10 shadow-[0_30px_60px_-25px_rgba(26,61,46,0.35)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={
            disabled
              ? "object-cover grayscale-[0.6]"
              : "object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          }
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0f1f18]/55 via-transparent to-transparent"
        />
        <div className="absolute top-4 left-4 flex items-center gap-3 text-[#f4ecd8]">
          <span className="font-display italic text-3xl leading-none">
            {ROMAN[index] ?? ""}
          </span>
          <span className="text-[10px] uppercase tracking-[0.28em] font-medium">
            {kicker}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col flex-1">
        <h3 className="font-display text-2xl md:text-[26px] leading-[1.15] text-[#1a3d2e]">
          {name}
        </h3>
        <p className="mt-1 font-display italic text-[16px] md:text-[17px] text-[#1a3d2e]/65 leading-snug">
          {tagline}
        </p>

        {highlights.filter(Boolean).length > 0 && (
          <ul className="mt-5 space-y-2">
            {highlights.filter(Boolean).map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[13px] text-[#0f1f18]/85 leading-snug"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1 w-1 rounded-full bg-[#c9a95c] flex-shrink-0"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {!disabled && cta && href && (
          <div className="mt-6 pt-5 border-t border-[#1a3d2e]/10 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-medium text-[#1a3d2e] group-hover:text-[#0f1f18] transition-colors">
            <span>{cta}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        )}
        {disabled && disabledLabel && (
          <div className="mt-6 pt-5 border-t border-[#1a3d2e]/10 text-[11px] uppercase tracking-[0.24em] font-medium text-[#1a3d2e]/40">
            {disabledLabel}
          </div>
        )}
      </div>
    </>
  );

  if (disabled || !href) {
    return (
      <article className="group flex flex-col h-full opacity-90 cursor-default">
        {content}
      </article>
    );
  }
  return (
    <Link
      href={href}
      className="group flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3d2e] rounded-sm"
    >
      {content}
    </Link>
  );
}
