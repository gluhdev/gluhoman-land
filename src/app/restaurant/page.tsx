import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";
import { EmbeddedMenu } from "@/components/menu/EmbeddedMenu";

export const metadata: Metadata = {
  title: "Ресторан «Глухомань» — Українська та європейська кухня",
  description:
    "Двоповерховий ресторан у старовинному казковому стилі з критою терасою і літніми майданчиками на воді. Європейсько-українська кухня, крафтове пиво, жива музика.",
};

export default function RestaurantPage() {
  return (
    <main>
      {/* ===== Блок 1: HERO ===== */}
      <section className="relative min-h-screen flex items-end bg-[#0f1f18] text-white overflow-hidden">
        <Image
          src="/images/restaurant/exterior_summer_terrace_water.jpg"
          alt="Літня тераса ресторану Глухомань на воді"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f18] via-[#0f1f18]/60 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 md:px-12 pb-24 md:pb-32 w-full">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
            Глухомань — це світ здійснення мрій і казкових бажань!
          </h1>
          <p className="mt-8 text-lg md:text-xl leading-relaxed max-w-3xl opacity-90">
            На території ресторанно – готельного комплексу «Глухомань» на Вас очікує двоповерховий ресторан в старовинному казковому стилі з критою терасою і трьома літніми майданчиками на воді в оточенні фонтанів та лебедів.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <BookingButton
              service="restaurant"
              className="inline-flex items-center gap-3 bg-white text-[#0f1f18] px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Забронювати столик за тел: 050 850 3 555 або 0532-648-548
            </BookingButton>
          </div>
        </div>
      </section>

      {/* ===== Блок 2: Кухня та пиво ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/craft_beer_glasses_snacks.jpg"
              alt="Крафтове пиво та закуски"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Кухня та пиво
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#0f1f18]/80">
              Ресторан «Глухомань» зустріне Вас з відмінною європейсько – українською кухнею та привітним персоналом. Це найкраще місце для любителів крафтового пива. У нас можна посмакувати пивом власного виробництва.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Блок 3: Жива музика ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Жива музика
            </h2>
            <p className="mt-6 text-lg leading-relaxed opacity-90">
              У п&apos;ятницю, суботу та неділю запрошуємо Вас на музичні вечори. Жива музика у виконанні нашого вокаліста, музиканта, фронтмена «Кавер шоу Дискотека 90-х», учасник гурту «Живі барабани» DANIL REVEKA заворожить Вас своїм вокалом.
            </p>
            <div className="mt-8">
              <BookingButton
                service="restaurant"
                className="inline-flex items-center gap-3 bg-white text-[#0f1f18] px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Забронювати столик за тел: 050 850 3 555 або 0532-648-548
              </BookingButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/vocalist_danil_reveka_stage.jpg"
              alt="DANIL REVEKA на сцені"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Блок 4: Зал І поверх з піччю (25 місць) ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_oven.jpg"
              alt="Зал з українською піччю"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Зал І поверх з піччю (25 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#0f1f18]/80">
              Гордістю нашого закладу є справжня українська піч, викладена вручну з глини та обпаленої цегли. Вона розташована в центрі залу, і в холодну пору року ми розпалюємо в ній дрова. Живий вогонь, аромат духмяного дерева та м&apos;яке тепло, що розходиться від печі, створюють неповторну домашню атмосферу спокою та тепла. Також в меню з листопада по березень присутні страви які готуються в печі.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Блок 5: Відокремлений Зал (8 місць) ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Відокремлений Зал (8 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed opacity-90">
              Затишна атмосфера, що ідеально підходить як для вечірніх побачень, так і для сімейних обідів.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_private.jpg"
              alt="Відокремлений зал"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Блок 6: Зал «Жар-Птиці» (20 місць) ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_zhar_ptytsi.jpg"
              alt="Зал Жар-Птиці з павлінарієм"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Зал «Жар-Птиці» (20 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#0f1f18]/80">
              Серцем залу є наш просторий, елегантно оформлений павлінарій. За скляною перегородкою. Спостереження за цими граційними птахами під час трапези додає атмосфері відчуття екзотики та спокою.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Блок 7: Зал ІІ поверх з балконом і каміном (25 місць) ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Зал ІІ поверх з балконом і каміном (25 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed opacity-90">
              Запрошуємо вас до нашого затишного залу, який ідеально поєднує сучасний комфорт із класичною атмосферою відпочинку. Центральним елементом інтер&apos;єру є стильний електричний камін. Він миттєво додає простору відчуття тепла та затишку без зайвого диму чи запаху. Реалістична імітація живого вогню слугує чудовим фоном для неспішних розмов. Поєднання затишної камінної зони та можливості вийти на балкон робить його улюбленим місцем наших гостей у будь-яку пору року.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_fireplace_balcony.jpg"
              alt="Зал з каміном та балконом"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Блок 8: VIP-зал з більярдом ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_vip_billiards.jpg"
              alt="VIP-зал з більярдом"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              VIP-зал з більярдом
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#0f1f18]/80">
              Більярд допомагає відпочити, мотивує на дружню або ділову бесіду, заспокоює та допомагає розвинути мислення та логіку. В нашій VIP – кімнаті Ви можете насолодитися грою в будь який час доби, а також посмакувати нефільтрованим пивом власного виробництва.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Блок 9: Зал «Тераса» (50 місць) ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Зал «Тераса» (50 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed opacity-90">
              Ідеальна локація для ювілеїв, корпоративних вечірок або великих сімейних святкувань. Ми пропонуємо вам насолодитися вишуканою кухнею та першокласним сервісом в атмосфері легкості та свята. Просторе планування дозволяє легко трансформувати простір під будь-який формат заходу: від класичного банкетного розсадження до вільного лаунж - фуршету.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_terrace.jpg"
              alt="Зал Тераса"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Блок 10: Банкетна зала ІІ поверх (90 місць) ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/restaurant/hall_banquet.jpg"
              alt="Банкетна зала"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
              Банкетна зала ІІ поверх (90 місць)
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#0f1f18]/80">
              Запрошуємо вас до нашого просторого та розкішного банкетного залу, який ідеально підходить для проведення масштабних святкувань. Зал комфортно вміщує до 90 гостей у форматі банкету, забезпечуючи достатньо місця для танців, розваг та вільного пересування.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#0f1f18]/80">
              Зал має продумане планування, яке дозволяє розмістити гостьові столи різними способами (П-подібно, окремими круглими столами або «ялинкою»), залишивши при цьому місце для танцполу, сцени для музикантів або ведучого, а також окремої зони для фотосесій чи фуршету. Ми можемо адаптувати простір під будь-який формат вашого заходу.
            </p>
            <div className="mt-8">
              <BookingButton
                service="restaurant"
                className="inline-flex items-center gap-3 bg-[#0f1f18] text-white px-6 py-3 text-sm font-medium hover:bg-[#0f1f18]/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Детальна інформація за тел: 050 850 3 555 або 0532-648-548
              </BookingButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Блок 11: Свята та події ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
            Свята та події
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg leading-relaxed opacity-90">
                Відзначте Ваш день народження, весілля або корпоратив у ресторані «Глухомань» та зробіть його незабутнім! Прийдіть разом з друзями та родиною, щоб насолодитися смачними стравами, вишуканою атмосферою та найкращим обслуговуванням. Також можна замовити індивідуальну фотозону для Вашого свята.
              </p>
              <p className="mt-4 text-lg leading-relaxed opacity-90">
                А наш арт – директор DANIL REVEKA організує для Вас музичний супровід (жива музика, ді-джей, ведуча)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/restaurant/event_01.jpg"
                  alt="Святкування в ресторані"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/restaurant/event_02.jpg"
                  alt="Святкування в ресторані"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Блок 12: Дитяча кімната ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
            Дитяча кімната
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-lg leading-relaxed text-[#0f1f18]/80">
                Для малечі в ресторані «Глухомань» теж є дещо особливе – безкоштовна ігрова дитяча кімната (на ІІ поверсі ресторану) з іграшками, лабіринтом та розмальовками. Дітки весело проведуть час з нашими аніматорами. А також є дитяче меню і десерти, які потішать улюбленими смаками.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/restaurant/kids_room_01.jpg"
                  alt="Дитяча кімната"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/restaurant/kids_room_02.jpg"
                  alt="Дитяча кімната"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/restaurant/kids_room_03.jpg"
                alt="Аніматори для дітей"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-lg leading-relaxed text-[#0f1f18]/80">
              Наші аніматори проводять різноманітні квести, анімації, мильні шоу, кріо – шоу, лазертаг.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Блок 13: Меню ===== */}
      <section className="bg-[#0f1f18] text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight mb-12">
            Меню
          </h2>
          <EmbeddedMenu />
        </div>
      </section>

      {/* ===== Блок 14: Фінальний CTA ===== */}
      <section className="bg-[#faf6ec] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight">
            Забронювати столик
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:+380508503555"
              className="inline-flex items-center gap-2 text-lg text-[#0f1f18] hover:opacity-70 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              050 850 3 555
            </a>
            <a
              href="tel:+380532648548"
              className="inline-flex items-center gap-2 text-lg text-[#0f1f18] hover:opacity-70 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              0532-648-548
            </a>
          </div>
          <div className="mt-8">
            <Link
              href="/menu"
              className="inline-block border border-[#0f1f18] px-8 py-3 text-sm font-medium hover:bg-[#0f1f18] hover:text-white transition-colors"
            >
              Переглянути меню
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
