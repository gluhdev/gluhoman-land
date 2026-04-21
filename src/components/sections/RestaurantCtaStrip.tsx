/**
 * RestaurantCtaStrip — reusable booking CTA band.
 * Drop between sections on /restaurant for frequent conversion prompts.
 *
 * Two variants:
 *   dark   — for placement after cream sections
 *   cream  — for placement after dark sections
 */

import { BookingButton } from '@/components/ui/BookingButton';
import { Phone } from 'lucide-react';

const PHONE_1 = '+380508503555';
const PHONE_1_DISPLAY = '050 850 3 555';
const PHONE_2 = '+380532648548';
const PHONE_2_DISPLAY = '0532 648 548';

export function RestaurantCtaStrip({
  variant = 'dark',
  title = 'Столик у ресторані',
  subtitle = 'чекає на Вас',
}: {
  variant?: 'dark' | 'cream';
  title?: string;
  subtitle?: string;
}) {
  const isDark = variant === 'dark';
  return (
    <section
      className={`${
        isDark ? 'bg-[#0f1f18] text-[#f4ecd8]' : 'bg-[#f4ecd8] text-[#0f1f18]'
      } py-16 md:py-20`}
    >
      <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`mt-2 h-px w-12 ${isDark ? 'bg-[#c9a95c]/60' : 'bg-[#1a3d2e]/40'}`}
          />
          <div>
            <p
              className={`text-[11px] uppercase tracking-[0.32em] mb-2 ${
                isDark ? 'text-[#e6d9b8]' : 'text-[#1a3d2e]/70'
              }`}
            >
              Забронювати
            </p>
            <p
              className={`font-display text-3xl md:text-4xl leading-[1] font-light ${
                isDark ? 'text-[#f4ecd8]' : 'text-[#0f1f18]'
              }`}
            >
              {title} <span className="italic">{subtitle}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BookingButton
            service="restaurant"
            className={`${
              isDark
                ? 'bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]'
                : 'bg-[#0f1f18] text-[#f4ecd8] hover:bg-[#1a3d2e]'
            } inline-flex items-center gap-3 px-8 py-3.5 font-medium tracking-wide transition`}
          >
            Забронювати столик
          </BookingButton>
          <a
            href={`tel:${PHONE_1}`}
            className={`${
              isDark
                ? 'border border-[#e6d9b8]/40 text-[#e6d9b8] hover:bg-[#e6d9b8]/10'
                : 'border border-[#1a3d2e]/40 text-[#1a3d2e] hover:bg-[#1a3d2e]/5'
            } inline-flex items-center gap-3 px-8 py-3.5 font-medium tracking-wide transition`}
          >
            <Phone className="w-4 h-4" />
            {PHONE_1_DISPLAY}
          </a>
          <a
            href={`tel:${PHONE_2}`}
            className={`text-[11px] uppercase tracking-[0.22em] hidden lg:inline-flex items-center gap-2 ${
              isDark ? 'text-[#e6d9b8]/60 hover:text-[#e6d9b8]' : 'text-[#1a3d2e]/55 hover:text-[#0f1f18]'
            } transition`}
          >
            <span className={isDark ? 'h-px w-6 bg-[#e6d9b8]/30' : 'h-px w-6 bg-[#1a3d2e]/30'} />
            {PHONE_2_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
