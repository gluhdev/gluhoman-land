import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';

const PHONE = '+380508503555';
const PHONE_DISPLAY = '+38 050 850 3 555';

export function SaunaFromClientFull() {
  return (
    <main>
      {/* Блок 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Image
          src="/images/sauna/exterior_small_sauna_building.jpg"
          alt="Лазня Глухомань — зовнішній вигляд"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0f1f18]/60" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="font-display text-5xl md:text-7xl text-[#f4ecd8] mb-8">
            Лазня + Чан
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-[#f4ecd8]/90">
            Лазня - це унікальне місце, де кожен зможе знайти джерело здоров&apos;я та відпочинку на свій смак.
            На території ресторанно - готельного комплексу «Глухомань» біля лісу знаходяться дві лазні на дровах
            з карпатськими чанами під відкритим небом: Мала лазня та Велика лазня, де Ви маєте змогу насолодитися
            всіма перевагами та традиціями оздоровчих процедур: різноманітні масажі, скраби, обгортання,
            закарпатський та цитрусовий чан.
          </p>
        </div>
      </section>

      {/* Блок 2: Мала лазня */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/small_sauna_outdoor_pool_barrel.jpg"
              alt="Мала лазня — басейн на вулиці"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0f1f18] mb-6">
              Мала лазня
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80">
              Басейн в Малій лазні знаходиться на вулиці
            </p>
          </div>
        </div>
      </section>

      {/* Блок 3: Велика лазня */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#f4ecd8] mb-6">
              Велика лазня
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80">
              У Великій лазні басейн знаходиться в приміщенні
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/pool_big_sauna_indoor_full.jpg"
              alt="Велика лазня — басейн в приміщенні"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Блок 4: Ціна та устрій */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xl md:text-2xl font-bold text-[#0f1f18] mb-8">
            Оренда лазні 900 грн/год (мінімальне замовлення 2 години до 7-ми осіб)
          </p>
          <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80">
            Як влаштована лазня на дровах? По-перше, справжні лазні повністю дерев&apos;яні, за винятком
            печі-кам&apos;янки. Лазня в «Глухомані» облицьована липою і обладнана декількома полками
            виготовленими з липи. Температура повітря в парній досягає 90 - 100 °С.
          </p>
        </div>
      </section>

      {/* Блок 5: Масаж дубовими віниками */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/steam_room_oak_broom_massage.jpg"
              alt="Масаж дубовими віниками в парній"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#f4ecd8] mb-6">
              Масаж дубовими віниками в парній
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              Пропарка віниками покращує кровообіг, очищає шкіру та виводить токсини, а також розслабляє
              м&apos;язи та зміцнює імунітет. Під час процедури розпарений віник виділяє ефірні олії та
              фітонциди, які живлять шкіру та мають антибактеріальну дію.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              Через високий вміст пари в повітрі прогрів організму набагато сильніший, ніж в сауні: піт
              не випаровується, і за рахунок посиленої циркуляції крові починають прогріватися внутрішні тканини.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80">
              Ароматерапія: м&apos;ята, евкаліпт, прополіс
            </p>
          </div>
        </div>
      </section>

      {/* Блок 6: Карпатський чан */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0f1f18] mb-6">
              Карпатський чан
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              Доповнення до лазні «Карпатський чан» - це унікальна спа - процедура. Завдяки якій можна забути
              про стреси і стимулювати роботу серцево - судинної системи і нирок. Процедури можуть зняти болі
              при ревматизмі, нормалізувати обмін речовин, знизити ризик простудних захворювань. Цілюще тепло
              гарячої води проникає в кожну клітинку організму, максимально розслаблює м&apos;язи, дає їм справжній
              відпочинок, приносячи ні з чим незрівнянну користь. Температура води в чані від 38 – 40 С.
              Настоюється на лікарських травах (ромашка, полинь, звіробій та ін.)
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#0f1f18] mb-2">
              Бронювання чану при замовленні лазні: 600 грн/год (мін. 2 години)
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#0f1f18] mb-4">
              Бронювання чану без замовлення лазні: 1000 грн/год (мін. 2 години)
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80">
              Щоб Ваш відпочинок був максимально приємним після кожних гостей ми повністю міняємо воду в чані
              та проводимо дезінфекцію.
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/chan_carpathian_herbs_steam.jpg"
              alt="Карпатський чан з лікарськими травами"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Блок 7: Хвойно-цитрусовий чан */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/chan_citrus_couple_night.jpg"
              alt="Хвойно-цитрусовий чан"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#f4ecd8] mb-6">
              Хвойно - цитрусовий чан
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              «Хвойно – цитрусовий карпатський чан»: аромати хвої, апельсина, лимона та грейпфрута дають
              тонізуючий ефект Вашому організму та дарують незрівнянний прилив енергії та гарного настрою.
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#f4ecd8] mb-2">
              Бронювання чану при замовленні лазні: 950 грн/год (мін. 2 години)
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#f4ecd8] mb-4">
              Бронювання чану без замовлення лазні: 1350 грн/год (мін. 2 години)
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80">
              Після кожних гостей вода та цитрусові повністю оновлюються. А сам чан – дезінфікується.
            </p>
          </div>
        </div>
      </section>

      {/* Блок 8: Чай та мед */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              Під час відвідування лазні тіло та організм втрачає велику кількість води тому щоб відновити
              водний баланс Ви можете замовити трав&apos;яний чай з баранками та медом або крафтовий квас
              власного виробництва.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80">
              Мед має багато корисних властивостей: підтримка імунітету, природний антиоксидант, легке джерело
              енергії, покращує сон.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/sauna/samovar_tea_baranki.jpg"
                alt="Самовар з чаєм та баранками"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/sauna/honey_jar_gluhoman.jpg"
                alt="Мед Глухомань"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Блок 9: Крафтове пиво */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              А для тих, хто любить комбінувати банний відпочинок зі смачною вечерею, є можливість замовити
              їжу, коктейлі та крафтове пиво власного виробництва з нашого ресторану. Лазня «Глухомань» -
              ідеальне місце для тих, хто шукає якісний та незабутній відпочинок.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80">
              Замовлення за телефоном{' '}
              <a href={`tel:${PHONE}`} className="underline text-[#f4ecd8]">
                +380508503555
              </a>{' '}
              ресторан «Глухомань»
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/craft_beer_roasted_chicken.jpg"
              alt="Крафтове пиво та страви з ресторану"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Блок 10: Стоун масаж */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/stone_massage_candles_promo.jpg"
              alt="Стоун масаж"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0f1f18] mb-6">
              Стоун масаж
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              Стоун масаж надає користь завдяки глибокому розслабленню м&apos;язів, покращенню кровообігу,
              зменшенню стресу та полегшенню болю. А також гармонізувати нервову систему. Дарує відчуття
              легкості, гармонії та припливу сил.
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#0f1f18]">
              Стоун масаж 50/80 хв 900/1200 грн
            </p>
          </div>
        </div>
      </section>

      {/* Блок 11: Класичний масаж */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#f4ecd8] mb-6">
              Класичний масаж тіла
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              Класичний масаж корисний для розслаблення м&apos;язів, зняття болю та стресу, поліпшення
              кровообігу та лімфотоку, а також загального покращення самопочуття. Він сприяє підвищенню
              еластичності шкіри, покращенню якості сну, зміцненню імунної системи та відновленню
              працездатності після фізичних навантажень або травм.
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#f4ecd8]">
              Масаж «Класичний» 20 хв/350 грн, 30 хв/450 грн, 50 хв/550 грн
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/massage_classic_back.jpg"
              alt="Класичний масаж тіла"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Блок 12: Тайський масаж */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/massage_thai_stretching.jpg"
              alt="Тайський масаж"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0f1f18] mb-6">
              Тайський масаж
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              Тайський масаж — це стародавній вид лікувального масажу, який поєднує в собі елементи
              розтягування, натискання та йоги, а також впливає на енергетичні канали тіла. Він сприяє
              глибокому розслабленню, покращує гнучкість, кровообіг і загальне самопочуття, а також допомагає
              зняти м&apos;язову напругу.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              «Пахоп» — це вид тайського масажу, який виконується теплими трав&apos;яними мішечками.
            </p>
            <div className="text-xl md:text-2xl font-bold text-[#0f1f18] space-y-1">
              <p>Традиційний тайський масаж + пахоп 45хв/700 грн</p>
              <p>Традиційний тайський масаж 40хв/550 грн</p>
              <p>Тайський релакс арома-ойл масаж 40хв/550 грн</p>
              <p>Тайський фут масаж (стоп) 35 хв/450 грн</p>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 13: Бамбуковий масаж */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#f4ecd8] mb-6">
              Бамбуковий масаж
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#f4ecd8]/80 mb-4">
              Масаж бамбуковими віниками має давнє східне коріння і походить переважно з Китаю та Японії.
              Бамбук здавна вважають символом сили, гнучкості та оздоровлення. Масаж бамбуковими віниками
              приносить користь, яка включає глибоке розслаблення м&apos;язів, зняття напруги та стресу,
              покращення кровообігу і лімфотоку, а також боротьбу з целюлітом.
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#f4ecd8]">
              Масаж бамбуковими віниками 20хв/400 грн
            </p>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/massage_bamboo_broom_therapist.jpg"
              alt="Бамбуковий масаж"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Блок 14: Скрабування */}
      <section className="bg-[#faf6ec] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/sauna/scrub_mud_clay_body.jpg"
              alt="Скрабування тіла"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#0f1f18] mb-6">
              Скрабування
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#1a3d2e]/80 mb-4">
              Скраб у лазні приносить користь завдяки поєднанню ефектів від гарячого пару та механічного
              очищення. Він глибоко очищає шкіру, стимулює кровообіг, виводить токсини. В результаті шкіра
              стає гладенькою, м&apos;якою, зволоженою та оновленою.
            </p>
            <div className="text-xl md:text-2xl font-bold text-[#0f1f18] space-y-1">
              <p>Сіль-глина 300грн</p>
              <p>Сода-лимон 300 грн</p>
              <p>Сіль-арома 300 грн</p>
              <p>«Кавово-медовий» 400 грн</p>
              <p>«Кавово-сольовий» 400 грн</p>
              <p>«Шоколад» 400 грн</p>
              <p>«Сіль, гірчиця, мед, пиво» 400 грн</p>
              <p>Фруктова аплікація 400 грн (яблуко, апельсин, банан, морква)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 15: CTA */}
      <section className="bg-[#0f1f18] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-[#f4ecd8] mb-8 hover:underline"
          >
            <Phone className="w-6 h-6" />
            Замовлення за телефоном {PHONE_DISPLAY}
          </a>
          <div>
            <Link
              href="/sauna/booking"
              className="inline-block bg-[#f4ecd8] text-[#0f1f18] px-10 py-4 text-lg font-bold tracking-wide hover:bg-[#e6d9b8] transition"
            >
              Забронювати онлайн
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
