'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Heart,
  ArrowUpRight,
} from 'lucide-react';
import {
  CONTACT_INFO,
  MAIN_SERVICES,
  ADDITIONAL_SERVICES,
} from '@/constants';
import { openBookingDialog } from '@/components/ui/BookingDialog';

const EYEBROW =
  'text-[11px] uppercase tracking-[0.22em] font-medium text-white/60';
const LINK =
  'text-sm text-white/75 hover:text-white transition-colors duration-200';

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { name: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { name: 'Telegram', href: 'https://t.me', Icon: Send },
  { name: 'WhatsApp', href: 'https://wa.me', Icon: MessageCircle },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a3d2e] text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-20">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Column 1: Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Глухомань — головна">
              <Image
                src="/images/logo.png"
                alt="Глухомань"
                width={200}
                height={104}
                className="h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
              Затишний куточок природи Полтавщини — родинна гостинність,
              вишукана кухня та комфорт у серці лісу.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors duration-200 hover:border-white/40 hover:text-white"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-3">
            <h3 className={EYEBROW}>Послуги</h3>
            <nav className="mt-6 space-y-3">
              {MAIN_SERVICES.map((service) => (
                <Link key={service.id} href={service.href} className={`block ${LINK}`}>
                  {service.title}
                </Link>
              ))}
            </nav>

            <h4 className={`${EYEBROW} mt-10 block`}>Інші послуги</h4>
            <nav className="mt-6 space-y-3">
              {ADDITIONAL_SERVICES.slice(0, 5).map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className={`block ${LINK}`}
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contacts */}
          <div className="lg:col-span-3">
            <h3 className={EYEBROW}>Контакти</h3>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                {CONTACT_INFO.phone.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-sm text-white/75 transition-colors duration-200 hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
                    <span className="tabular-nums tracking-wide">{phone}</span>
                  </a>
                ))}
              </div>

              <a
                href="mailto:hello@gluhoman.com.ua"
                className="flex items-center gap-3 text-sm text-white/75 transition-colors duration-200 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
                <span>hello@gluhoman.com.ua</span>
              </a>

              <div className="flex items-start gap-3 pt-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/40" strokeWidth={1.5} />
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-white/70">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/40" strokeWidth={1.5} />
                <span className="leading-relaxed">{CONTACT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Booking */}
          <div className="lg:col-span-2">
            <h3 className={EYEBROW}>Забронювати</h3>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              Залиште заявку онлайн або зателефонуйте — ми допоможемо
              спланувати ваш відпочинок.
            </p>

            <button
              type="button"
              onClick={() => openBookingDialog()}
              className="group mt-6 inline-flex w-full items-center justify-between border border-white/25 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#1a3d2e]"
            >
              <span>Залишити заявку</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </button>

            <p className={`${EYEBROW} mt-8`}>Або напишіть нам</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors duration-200 hover:text-white"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Telegram</span>
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors duration-200 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 border-t border-white/10 pt-8 lg:mt-20">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs text-white/50">
              © {year} Глухомань. Всі права захищено.
            </p>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Політика конфіденційності
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Публічна оферта
              </Link>
            </nav>

            <p className="inline-flex items-center gap-1.5 text-xs text-white/50">
              <span>Створено з</span>
              <Heart className="h-3 w-3 fill-white/60 text-white/60" strokeWidth={1.5} />
              <span>у Полтаві</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
