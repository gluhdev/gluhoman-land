import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Глухомань",
  description:
    "Політика конфіденційності рекреаційного комплексу «Глухомань». Як ми збираємо, використовуємо та захищаємо ваші персональні дані.",
  openGraph: {
    title: "Політика конфіденційності | Глухомань",
    description:
      "Політика конфіденційності рекреаційного комплексу «Глухомань». Як ми збираємо, використовуємо та захищаємо ваші персональні дані.",
    type: "article",
    locale: "uk_UA",
  },
  twitter: {
    card: "summary",
    title: "Політика конфіденційності | Глухомань",
    description:
      "Політика конфіденційності рекреаційного комплексу «Глухомань».",
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf6ec]">
      {/* Editorial hero */}
      <section className="py-24 bg-[#faf6ec]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
            Юридичні документи
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[#1a3d2e] leading-[1.05] mb-5">
            Політика конфіденційності
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-[#1a3d2e]/70 mb-8">
            Як ми дбаємо про ваші персональні дані
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
              Ця Політика конфіденційності описує, яким чином рекреаційний
              комплекс «Глухомань» (далі — «Комплекс») збирає, використовує,
              зберігає та захищає персональні дані відвідувачів сайту та
              гостей. Політика розроблена відповідно до Закону України «Про
              захист персональних даних» та інших нормативно-правових актів,
              що регулюють обробку персональних даних.
            </p>
            <p className="mt-4">
              Використовуючи наш сайт або послуги, ви погоджуєтеся з умовами
              цієї Політики. Якщо ви не згодні з будь-якою з умов — будь
              ласка, утримайтеся від використання сайту та надсилання
              персональних даних.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[1]} title="Які дані ми збираємо" />
            <p>
              Ми збираємо лише ті дані, які є необхідними для надання наших
              послуг та якісної комунікації з гостями:
            </p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">Контактні дані:</strong>{" "}
                  ім&apos;я, номер телефону та електронна пошта, які ви надаєте
                  через форму бронювання або при зверненні до нас.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">Технічні дані:</strong>{" "}
                  cookies, необхідні для коректної роботи сайту та збереження
                  ваших налаштувань.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">Аналітичні дані:</strong>{" "}
                  знеособлена статистика відвідувань, якщо на сайті активовані
                  сервіси веб-аналітики.
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading
              numeral={ROMAN[2]}
              title="Як ми використовуємо дані"
            />
            <p>Отримані персональні дані використовуються виключно для:</p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>обробки запитів на бронювання номерів та послуг;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  зв&apos;язку з гостями для уточнення деталей їхнього
                  перебування;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  надсилання підтверджень бронювання та службових повідомлень;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>покращення якості обслуговування та роботи сайту.</span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[3]} title="Зберігання та захист" />
            <p>
              Ваші персональні дані зберігаються протягом строку, необхідного
              для досягнення цілей їхньої обробки, або протягом строку,
              встановленого чинним законодавством України. Ми застосовуємо
              організаційні та технічні заходи для захисту персональних
              даних від несанкціонованого доступу, зміни, розкриття чи
              знищення.
            </p>
            <p className="mt-4">
              Комплекс не передає персональні дані третім особам без згоди
              суб&apos;єкта даних, за винятком випадків, прямо передбачених
              чинним законодавством України.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[4]} title="Права користувача" />
            <p>
              Відповідно до Закону України «Про захист персональних даних»
              ви маєте право:
            </p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>отримувати інформацію про обробку ваших даних;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>вимагати доступу до своїх персональних даних;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>вимагати виправлення неточних або неповних даних;</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  вимагати видалення ваших персональних даних із нашої бази;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  звертатися зі скаргою до Уповноваженого Верховної Ради
                  України з прав людини.
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[5]} title="Обробка звернень" />
            <h3 className="font-display text-xl text-[#1a3d2e]/80 mt-4 mb-3">
              Як ми відповідаємо на ваші запити
            </h3>
            <p>
              З питань обробки персональних даних ви можете звернутися до нас
              зручним способом — ми прагнемо відповідати у розумні строки та
              надавати вичерпну інформацію щодо ваших даних. Контактні канали
              наведені у блоці нижче.
            </p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[6]} title="Зміни до політики" />
            <p>
              Комплекс залишає за собою право періодично оновлювати цю
              Політику конфіденційності. Нова редакція набуває чинності з
              моменту її публікації на сайті. Рекомендуємо періодично
              переглядати цю сторінку, щоб бути обізнаними з актуальними
              умовами.
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
