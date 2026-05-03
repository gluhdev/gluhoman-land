import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export const metadata: Metadata = {
  title: "Публічна оферта | Глухомань",
  description:
    "Публічна оферта рекреаційного комплексу «Глухомань». Умови бронювання, оплати, перебування та надання послуг.",
  openGraph: {
    title: "Публічна оферта | Глухомань",
    description:
      "Публічна оферта рекреаційного комплексу «Глухомань». Умови бронювання, оплати та перебування.",
    type: "article",
    locale: "uk_UA",
  },
  twitter: {
    card: "summary",
    title: "Публічна оферта | Глухомань",
    description: "Умови бронювання та надання послуг комплексу «Глухомань».",
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "11 квітня 2026";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function SectionHeading({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <header className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/60 mb-3">
        {numeral}
      </div>
      <h2 className="font-display text-3xl md:text-4xl text-[#1a3d2e] leading-tight">
        {title}
      </h2>
    </header>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-[100svh] bg-[#faf6ec]">
      {/* Editorial hero */}
      <section className="py-24 bg-[#faf6ec]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
            Юридичні документи
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[#1a3d2e] leading-[1.05] mb-5">
            Публічна оферта
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-[#1a3d2e]/70 mb-8">
            Умови бронювання та перебування у комплексі
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1a3d2e]/40">
            Останнє оновлення: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Main editorial column */}
      <section className="py-20 md:py-28 bg-[#faf6ec]">
        <article className="max-w-3xl mx-auto px-6 text-[#0f1f18]/80 leading-relaxed">
          <section>
            <SectionHeading numeral={ROMAN[0]} title="Загальні положення" />
            <p>
              Цей документ є офіційною публічною офертою рекреаційного
              комплексу «Глухомань» (далі — «Комплекс»), адресованою будь-якій
              фізичній або юридичній особі (далі — «Гість»), щодо укладення
              договору про надання послуг на викладених нижче умовах.
            </p>
            <p className="mt-4">
              Фактом акцепту (прийняття) цієї оферти є оформлення бронювання
              через сайт, телефон або інші доступні канали зв&apos;язку, а
              також здійснення оплати послуг. З моменту акцепту договір
              вважається укладеним на умовах цієї оферти.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[1]} title="Предмет договору" />
            <p>
              Комплекс надає Гостю наступні послуги відповідно до обраного
              варіанту бронювання:
            </p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>проживання у номерах готелю;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>харчування в ресторані Комплексу;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>відвідування аквапарку;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>користування сауною та лазневим комплексом;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  додаткові послуги (апітерапія, весільні заходи, пейнтбол та
                  інші) згідно з актуальним переліком.
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[2]} title="Бронювання та оплата" />
            <h3 className="font-display text-xl text-[#1a3d2e]/80 mt-4 mb-3">
              Як оформити заявку
            </h3>
            <p>
              Бронювання послуг здійснюється через форму на сайті, за
              телефонами, вказаними у розділі «Контакти», або безпосередньо
              на рецепції Комплексу. Після отримання заявки адміністратор
              зв&apos;язується з Гостем для підтвердження деталей
              бронювання.
            </p>
            <h3 className="font-display text-xl text-[#1a3d2e]/80 mt-6 mb-3">
              Передоплата та розрахунки
            </h3>
            <p>
              Для гарантованого бронювання може вимагатися передоплата у
              розмірі, погодженому з Гостем на момент оформлення заявки.
              Повний розрахунок здійснюється у строки та у спосіб, узгоджені
              при підтвердженні бронювання.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading
              numeral={ROMAN[3]}
              title="Скасування та повернення"
            />
            <p>
              У разі скасування бронювання Гість зобов&apos;язаний
              якнайшвидше повідомити про це адміністрацію Комплексу.
              Повернення коштів здійснюється згідно з умовами, погодженими
              сторонами безпосередньо при бронюванні, з урахуванням строку
              повідомлення та характеру заброньованих послуг.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[4]} title="Правила перебування" />
            <p>
              Для забезпечення комфортного відпочинку всіх гостей Комплексу
              діють наступні правила:
            </p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">Тихі години:</strong> з
                  22:00 до 08:00 просимо утримуватися від гучних розмов та
                  музики.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">Паління:</strong>{" "}
                  дозволене виключно у спеціально відведених для цього місцях.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">
                    Розміщення з тваринами:
                  </strong>{" "}
                  можливе за попереднім узгодженням із адміністрацією.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  Гості зобов&apos;язуються дбайливо ставитися до майна
                  Комплексу та дотримуватися правил пожежної безпеки.
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading
              numeral={ROMAN[5]}
              title="Відповідальність сторін"
            />
            <p>
              Сторони несуть відповідальність за невиконання або неналежне
              виконання умов цієї оферти відповідно до чинного законодавства
              України. Комплекс не несе відповідальності за шкоду, завдану
              Гостем внаслідок порушення ним правил перебування, а також за
              збереження особистих речей, залишених без нагляду.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[6]} title="Форс-мажор" />
            <p>
              Сторони звільняються від відповідальності за часткове або
              повне невиконання зобов&apos;язань, якщо воно є наслідком дії
              обставин непереборної сили (форс-мажорні обставини): стихійні
              лиха, військові дії, рішення органів державної влади, аварії
              на інженерних мережах та інші події, які сторони не могли
              передбачити або відвернути.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[7]} title="Прикінцеві положення" />
            <p>
              З усіх питань, пов&apos;язаних із цією офертою, звертайтеся за
              контактами, наведеними у блоці нижче. Комплекс залишає за собою
              право вносити зміни до умов цієї оферти; актуальна редакція
              публікується на сайті та набуває чинності з моменту публікації.
            </p>
          </section>
        </article>
      </section>

      {/* Deep forest contacts */}
      <section className="py-16 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#f4ecd8]/60 mb-4">
            Контакти
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[#f4ecd8] mb-10">
            Зв&apos;язок з нами
          </h2>

          <ul className="space-y-4">
            {CONTACT_INFO.phone.map((p) => (
              <li key={p} className="flex items-center gap-4">
                <Phone
                  className="w-4 h-4 text-[#e6d9b8]/70"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${p.replace(/\s+/g, "")}`}
                  className="font-display text-2xl md:text-3xl tracking-wide text-[#f4ecd8] hover:text-[#e6d9b8] transition-colors"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 pt-2">
              <Mail
                className="w-4 h-4 text-[#e6d9b8]/70"
                aria-hidden="true"
              />
              <a
                href="mailto:hello@gluhoman.com.ua"
                className="font-display text-xl md:text-2xl tracking-wide text-[#f4ecd8] hover:text-[#e6d9b8] transition-colors"
              >
                hello@gluhoman.com.ua
              </a>
            </li>
            <li className="flex items-center gap-4 pt-2">
              <MapPin
                className="w-4 h-4 text-[#e6d9b8]/70"
                aria-hidden="true"
              />
              <span className="text-[#f4ecd8]/80 text-base">
                {CONTACT_INFO.address}
              </span>
            </li>
            <li className="pl-8 text-[11px] uppercase tracking-[0.22em] text-[#f4ecd8]/50">
              {CONTACT_INFO.workingHours}
            </li>
          </ul>
        </div>
      </section>

      {/* Back link */}
      <section className="py-12 bg-[#faf6ec]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/"
            className="inline-block text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] border-b border-[#1a3d2e]/30 hover:border-[#1a3d2e] pb-1 transition-colors"
          >
            Повернутись на головну
          </Link>
        </div>
      </section>
    </main>
  );
}
