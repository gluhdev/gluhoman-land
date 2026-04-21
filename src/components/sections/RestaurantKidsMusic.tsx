/**
 * RestaurantKidsMusic — self-contained section combining:
 *  • Live music with DANIL REVEKA (Fri/Sat/Sun)
 *  • Kids room with animators (quest, soap show, cryo show, laser tag)
 *  • Banquet/wedding/birthday intro from docx
 *
 * Content verbatim from ОПИСАНИЕ РЕСТОРАН.docx.
 */

import Image from 'next/image';
import { Music, Baby, PartyPopper, Phone } from 'lucide-react';

const PHONE_1 = '+380508503555';
const PHONE_1_DISPLAY = '050 850 3 555';
const PHONE_2 = '+380532648548';
const PHONE_2_DISPLAY = '0532 648 548';

export function RestaurantKidsMusic() {
  return (
    <>
      {/* ─── LIVE MUSIC — DANIL REVEKA ─────────────────────────── */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            {/* Photo */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/restaurant/vocalist_danil_reveka_stage.jpg"
                alt="DANIL REVEKA на сцені ресторану Глухомань"
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
                className="absolute left-5 top-5 font-display italic text-base text-[#e6d9b8]"
              >
                № VIII
              </span>
            </div>

            {/* Copy */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8] mb-6 flex items-center gap-3">
                <Music className="w-4 h-4" strokeWidth={1.4} />
                Жива музика · пт · сб · нд
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-[#f4ecd8] leading-[0.95] mb-6">
                Музичні вечори
                <span className="block italic text-[#e6d9b8]">з DANIL REVEKA</span>
              </h2>
              <div className="space-y-5 text-[#f4ecd8]/80 md:text-lg font-light leading-relaxed">
                <p>
                  У п&apos;ятницю, суботу та неділю запрошуємо Вас на музичні
                  вечори. Жива музика у виконанні нашого вокаліста, музиканта,
                  фронтмена{' '}
                  <span className="italic text-[#e6d9b8]">
                    «Кавер-шоу Дискотека 90-х»
                  </span>
                  , учасника гурту{' '}
                  <span className="italic text-[#e6d9b8]">«Живі барабани»</span>{' '}
                  <span className="font-medium text-[#f4ecd8]">DANIL REVEKA</span>{' '}
                  заворожить Вас своїм вокалом.
                </p>
                <p>
                  Відзначте Ваш день народження, весілля або корпоратив у
                  ресторані «Глухомань» та зробіть його незабутнім! Наш
                  арт-директор{' '}
                  <span className="italic text-[#e6d9b8]">DANIL REVEKA</span>{' '}
                  організує для Вас музичний супровід: жива музика, ді-джей,
                  ведуча. Також можна замовити індивідуальну фотозону для
                  Вашого свята.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#e6d9b8]/20 pt-8 text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 font-medium">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                <span>Деталі:</span>
                <a href={`tel:${PHONE_1}`} className="text-[#e6d9b8] hover:text-[#f4ecd8] underline underline-offset-4">
                  {PHONE_1_DISPLAY}
                </a>
                <span className="text-[#e6d9b8]/40">·</span>
                <a href={`tel:${PHONE_2}`} className="text-[#e6d9b8] hover:text-[#f4ecd8] underline underline-offset-4">
                  {PHONE_2_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KIDS ROOM & ANIMATORS ─────────────────────────── */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6 flex items-center justify-center gap-3">
              <Baby className="w-4 h-4" strokeWidth={1.6} />
              Для малечі · IX
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Дитяча кімната
              <span className="block italic text-[#1a3d2e]">і розваги з аніматорами</span>
            </h2>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Для малечі в ресторані «Глухомань» теж є дещо особливе — безкоштовна
              ігрова дитяча кімната на ІІ поверсі з іграшками, лабіринтом та
              розмальовками. А також дитяче меню і десерти, що потішать
              улюбленими смаками.
            </p>
          </div>

          {/* Photo + animator list */}
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
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-2 h-[1px] w-6 shrink-0 bg-[#1a3d2e]/40"
                    />
                    <span className="italic">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-8 border-t border-[#1a3d2e]/15 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                <span>Деталі:</span>
                <a href={`tel:${PHONE_1}`} className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4">
                  {PHONE_1_DISPLAY}
                </a>
                <span className="text-[#1a3d2e]/40">·</span>
                <a href={`tel:${PHONE_2}`} className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4">
                  {PHONE_2_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
