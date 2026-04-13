import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Tag,
  CheckCircle,
  Bug,
  Heart,
  Target,
  Trophy,
  PartyPopper,
  Flame,
  Beer,
  Cat,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { ADDITIONAL_SERVICES, CONTACT_INFO } from '@/constants';

type Params = { slug: string };

type ServiceContent = {
  longDescription: string;
  highlights: { title: string; description: string }[];
  pricing: string;
  preparation?: string[];
  groupSize?: string;
};

const SERVICE_CONTENT: Record<string, ServiceContent> = {
  paintball: {
    longDescription:
      'Адреналін, тактика і командна гра у власному пейнтбольному клубі «Глухомань». Майданчик розташований у сосновому лісі — натуральні укриття, штучні барикади і безпечне обладнання забезпечують яскравий досвід для команд будь-якого розміру.\n\nМи проводимо корпоративні турніри, дитячі та підліткові ігри (від 12 років), а також святкові формати — день народження у форматі бойової місії, парубоцькі вечірки, тимбілдинги. Інструктор проводить інструктаж і супроводжує гру.',
    highlights: [
      { title: 'Лісовий полігон', description: 'Природні укриття серед сосен' },
      { title: 'Професійне обладнання', description: 'Маркери, маски, захисний одяг' },
      { title: 'Інструктор', description: 'Безпека і інструктаж перед грою' },
      { title: 'Декілька сценаріїв', description: 'Захоплення прапора, штурм, командний бій' },
    ],
    pricing: 'Базовий пакет — від 200 куль на гравця. Додаткові кулі за запитом.',
    groupSize: 'Від 6 до 20 осіб',
    preparation: [
      'Зручний одяг (можна забруднити)',
      'Закрите взуття',
      'Бажаність прибуття за 15 хвилин до брифінгу',
    ],
  },
  'brewery-tour': {
    longDescription:
      'Власна пивоварня «Глухомань» — гордість комплексу. Ми варимо крафтове пиво за традиційними чеськими і німецькими рецептами на місцевій воді з артезіанської свердловини. Тур включає екскурсію по виробництву, дегустацію 4 сортів пива і легкий пивний снек.\n\nГід-пивовар розповість про процес від солоду до бочки, покаже сучасне обладнання і традиційні мідні чани. Підходить для дорослих компаній (від 18 років), цінителів крафту і просто допитливих гостей.',
    highlights: [
      { title: 'Власне виробництво', description: 'Артезіанська вода і відбірний солод' },
      { title: '4 сорти на дегустацію', description: 'Лагер, IPA, портер, сезонний' },
      { title: 'Пивний снек', description: 'Сало, сир, пшеничні палички' },
      { title: 'Гід-пивовар', description: 'Розкаже усе про процес' },
    ],
    pricing: 'Стандартний тур ~90 хвилин, з дегустацією. Деталі за запитом.',
    groupSize: 'Від 4 до 16 осіб',
    preparation: ['Лише для дорослих 18+', 'За попереднім записом'],
  },
  'kids-parties': {
    longDescription:
      'Незабутні дитячі свята у Глухомані — на природі, з аніматорами, конкурсами, тортом і смачною їжею. Ми організовуємо дні народження для дітей від 3 до 14 років у різних форматах: лісові квести, спортивні естафети, контактний зоопарк, акваквест в аквапарку.\n\nКоманда заздалегідь обговорює сценарій з батьками, готує святковий стіл, прикрашає зону і забезпечує програму від 2 до 4 годин. Усі дитячі активності супроводжує досвідчений аніматор-педагог.',
    highlights: [
      { title: 'Аніматори', description: 'Костюмовані персонажі, ведучий, ігри' },
      { title: 'Святковий стіл', description: 'Дитяче меню і торт за смаком' },
      { title: 'Програма 2–4 години', description: 'Конкурси, подарунки, фотозона' },
      { title: 'Лісова локація', description: 'Безпечно, на свіжому повітрі' },
    ],
    pricing: 'Пакети залежать від кількості гостей і програми. За запитом.',
    groupSize: 'Від 6 до 30 дітей',
    preparation: ['Бронювання за 2 тижні', 'Узгодження сценарію та меню заздалегідь'],
  },
};

function iconForService(id: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    apitherapy: Bug,
    wedding: Heart,
    paintball: Target,
    horses: Trophy,
    'kids-parties': PartyPopper,
    'bbq-zone': Flame,
    'brewery-tour': Beer,
    'petting-zoo': Cat,
  };
  return map[id] ?? Sparkles;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function generateStaticParams(): Params[] {
  return ADDITIONAL_SERVICES.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = ADDITIONAL_SERVICES.find((s) => s.id === slug);

  if (!service) {
    return { title: 'Послуга не знайдена — Глухомань' };
  }

  return {
    title: `${service.title} — Рекреаційний комплекс Глухомань`,
    description: service.description,
    openGraph: {
      title: `${service.title} — Глухомань`,
      description: service.description,
      type: 'website',
      locale: 'uk_UA',
      siteName: 'Глухомань',
    },
  };
}

export default async function OtherServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = ADDITIONAL_SERVICES.find((s) => s.id === slug);

  if (!service) {
    notFound();
  }

  const Icon = iconForService(service.id);
  const content = SERVICE_CONTENT[service.id];
  const otherServices = ADDITIONAL_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);
  const primaryPhone = CONTACT_INFO.phone[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.title,
    areaServed: 'Полтавська область, Україна',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Рекреаційний комплекс Глухомань',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'UA',
        addressRegion: 'Полтавська область',
        addressLocality: 'Нижні Млини',
        streetAddress: CONTACT_INFO.address,
      },
      telephone: CONTACT_INFO.phone[0],
      openingHours: CONTACT_INFO.workingHours,
    },
  };

  return (
    <>
      <Script
        id={`jsonld-service-${service.id}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — deep forest */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #e6d9b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 70%, #e6d9b8 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Додаткова послуга • Глухомань
          </p>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#e6d9b8]/10 border border-[#e6d9b8]/30 mb-8">
            <Icon className="w-11 h-11 text-[#e6d9b8]" strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] mb-6">
            {service.title}
            <span className="block italic text-[#e6d9b8]/80 text-3xl md:text-4xl mt-4">
              у лісовому серці Полтавщини
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            {service.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={telHref(primaryPhone)}
              className="inline-flex items-center justify-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
            >
              <Phone className="w-4 h-4" /> Зателефонувати
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center justify-center gap-3 border border-[#e6d9b8]/40 text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:border-[#e6d9b8] transition"
            >
              Дізнатись більше
            </a>
          </div>
        </div>
      </section>

      {/* Про послугу — cream */}
      {content && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                Що це
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                Про послугу
                <span className="block italic text-[#1a3d2e]/70">докладно</span>
              </h2>
            </div>
            <div className="md:col-span-8 space-y-6">
              {content.longDescription.split('\n\n').map((p, i) => (
                <p
                  key={i}
                  className="text-[#0f1f18]/80 leading-relaxed text-lg font-light"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Особливості — deep forest */}
      {content && (
        <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-4">
                Особливості
              </p>
              <h2 className="font-display text-4xl md:text-5xl">
                Що робить цю послугу
                <span className="block italic text-[#e6d9b8]/80">особливою</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e6d9b8]/20">
              {content.highlights.map((h, i) => (
                <div key={i} className="bg-[#0f1f18] p-10 md:p-12">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 mb-4">
                    {ROMAN[i] ?? i + 1}
                  </p>
                  <p className="font-display text-3xl mb-3">{h.title}</p>
                  <p className="text-[#f4ecd8]/70 leading-relaxed font-light">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick facts — cream */}
      {content && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                Деталі
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e]">
                Коротко про головне
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-[#e6d9b8]">
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <Users className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  Розмір групи
                </p>
                <p className="font-display text-2xl text-[#1a3d2e]">
                  {content.groupSize ?? 'За запитом'}
                </p>
              </div>
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <Tag className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  Вартість
                </p>
                <p className="font-display text-xl text-[#1a3d2e] leading-snug">
                  {content.pricing}
                </p>
              </div>
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <CheckCircle className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  Підготовка
                </p>
                <p className="font-display text-2xl text-[#1a3d2e]">
                  {content.preparation && content.preparation.length > 0
                    ? `${content.preparation.length} простих кроків`
                    : 'Мінімальна'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Як підготуватися — cream */}
      {content && content.preparation && content.preparation.length > 0 && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                Перед візитом
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                Як підготуватися
                <span className="block italic text-[#1a3d2e]/70">заздалегідь</span>
              </h2>
            </div>
            <ol className="md:col-span-8 space-y-px bg-[#e6d9b8]">
              {content.preparation.map((item, i) => (
                <li
                  key={i}
                  className="bg-[#faf6ec] flex items-start gap-8 p-8 md:p-10"
                >
                  <span className="font-display text-3xl text-[#1a3d2e]/50 min-w-[3rem]">
                    {ROMAN[i] ?? i + 1}
                  </span>
                  <span className="text-[#0f1f18]/80 text-lg font-light leading-relaxed pt-2">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Contacts — deep forest */}
      <section id="contacts" className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-4">
              Зв&apos;язок
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6">
              Готові
              <span className="block italic text-[#e6d9b8]/80">забронювати?</span>
            </h2>
            <p className="text-[#f4ecd8]/70 font-light leading-relaxed mb-8">
              Зателефонуйте нам, і менеджер узгодить дату, деталі програми та
              відповість на всі запитання.
            </p>
            <div className="flex items-center gap-3 text-sm text-[#f4ecd8]/70 mb-3">
              <Clock className="w-4 h-4 text-[#e6d9b8]" />
              <span>{CONTACT_INFO.workingHours}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#f4ecd8]/70">
              <MapPin className="w-4 h-4 text-[#e6d9b8]" />
              <span>{CONTACT_INFO.address}</span>
            </div>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-[#e6d9b8]/20 border-y border-[#e6d9b8]/20">
              {CONTACT_INFO.phone.map((phone) => (
                <li key={phone}>
                  <a
                    href={telHref(phone)}
                    className="group flex items-center justify-between py-6 transition"
                  >
                    <span className="flex items-center gap-4">
                      <Phone className="w-4 h-4 text-[#e6d9b8]" />
                      <span className="font-display text-2xl md:text-3xl text-[#f4ecd8] group-hover:text-[#e6d9b8] transition">
                        {phone}
                      </span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#e6d9b8]/60 group-hover:text-[#e6d9b8] group-hover:translate-x-1 transition" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related services — cream */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                Ще цікаве
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                Інші додаткові
                <span className="block italic text-[#1a3d2e]/70">послуги</span>
              </h2>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] hover:text-[#0f1f18]"
            >
              Всі послуги
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e6d9b8]">
            {otherServices.map((other, i) => {
              const OIcon = iconForService(other.id);
              const num = String(i + 1).padStart(2, '0');
              return (
                <Link
                  key={other.id}
                  href={other.href}
                  className="group bg-[#faf6ec] p-10 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-display text-3xl text-[#e6d9b8]">
                      {num}
                    </span>
                    <OIcon
                      className="w-5 h-5 text-[#1a3d2e]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-display text-2xl text-[#1a3d2e] mb-3 leading-tight">
                    {other.title}
                  </h3>
                  <p className="text-sm text-[#0f1f18]/70 font-light leading-relaxed line-clamp-2 mb-6">
                    {other.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                    Детальніше
                    <span className="relative inline-block w-8 h-px bg-[#1a3d2e] transition-all duration-300 group-hover:w-12" />
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA — deep forest */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-6">
            Наступний крок
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            Обрали послугу?
            <span className="block italic text-[#e6d9b8]/80 text-3xl md:text-4xl mt-4">
              звʼяжіться з нами просто зараз
            </span>
          </h2>
          <p className="text-[#f4ecd8]/70 font-light text-lg mb-10 max-w-xl mx-auto">
            Один дзвінок — і ми підготуємо все необхідне для вашого візиту до
            Глухомані.
          </p>
          <a
            href={telHref(primaryPhone)}
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
          >
            <Phone className="w-4 h-4" />
            {primaryPhone}
          </a>
        </div>
      </section>
    </>
  );
}
