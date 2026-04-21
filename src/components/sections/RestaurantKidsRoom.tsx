/**
 * RestaurantKidsRoom — kids-only section (music block removed to avoid
 * duplicating the DANIL REVEKA feature from restaurant/page.tsx).
 *
 * Contains: free kids play room on 2nd floor + animator programmes.
 * Content verbatim from ОПИСАНИЕ РЕСТОРАН.docx.
 */

import Image from 'next/image';
import { Baby, PartyPopper, Phone } from 'lucide-react';

const PHONE_1 = '+380508503555';
const PHONE_1_DISPLAY = '050 850 3 555';
const PHONE_2 = '+380532648548';
const PHONE_2_DISPLAY = '0532 648 548';

export function RestaurantKidsRoom() {
  return (
    <section className="bg-[#faf6ec] py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6 flex items-center justify-center gap-3">
            <Baby className="w-4 h-4" strokeWidth={1.6} />
            Для малечі · IV
          </p>
          <h2 className="font-display font-light text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] tracking-tight mb-6">
            Дитяча кімната
            <span className="block italic text-[#1a3d2e]">
              і розваги з аніматорами
            </span>
          </h2>
          <div
            aria-hidden
            className="mx-auto my-8 h-px w-12 bg-[#c9a95c]/60"
          />
          <p className="text-[#1a3d2e]/80 md:text-lg font-light leading-relaxed">
            Для малечі в ресторані «Глухомань» теж є дещо особливе — безкоштовна
            ігрова дитяча кімната на ІІ поверсі ресторану з іграшками,
            лабіринтом та розмальовками. Дітки весело проведуть час з нашими
            аніматорами. А також є дитяче меню і десерти, які потішать
            улюбленими смаками.
          </p>
        </div>

        <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/images/restaurant/kids_room_labyrinth_maze.jpg"
              alt="Дитяча ігрова кімната з лабіринтом"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 border border-[#c9a95c]/50"
            />
            <span
              aria-hidden
              className="absolute left-5 top-5 font-display italic text-[#e6d9b8]"
            >
              № IV
            </span>
          </div>
          <div className="flex flex-col justify-center bg-white/50 p-8 md:p-12 border border-[#1a3d2e]/10">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70 mb-5 flex items-center gap-3">
              <PartyPopper className="w-4 h-4" strokeWidth={1.4} />
              Аніматори проводять
            </p>
            <ul className="space-y-4 text-[#1a3d2e]/80 md:text-lg font-light leading-relaxed">
              {[
                'Різноманітні квести',
                'Анімаційні програми',
                'Мильні шоу',
                'Кріо-шоу',
                'Лазертаг',
              ].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="h-px flex-1 border-b border-dotted border-[#1a3d2e]/30"
                  />
                  <span className="italic whitespace-nowrap">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-8 border-t border-[#1a3d2e]/15 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span>Деталі:</span>
              <a
                href={`tel:${PHONE_1}`}
                className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4"
              >
                {PHONE_1_DISPLAY}
              </a>
              <span className="text-[#1a3d2e]/40">·</span>
              <a
                href={`tel:${PHONE_2}`}
                className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4"
              >
                {PHONE_2_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
