'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'gluhoman-cookie-consent';

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible && acceptBtnRef.current) {
      acceptBtnRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'rejected');
    } catch {}
    setVisible(false);
  };

  const close = () => {
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Згода на використання cookie"
      className="fixed inset-x-0 bottom-0 z-[90] bg-white border-t border-neutral-200 shadow-2xl animate-in slide-in-from-bottom duration-500"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <button
          type="button"
          onClick={close}
          aria-label="Закрити"
          className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-[1fr_auto] gap-4 md:gap-8 items-center pr-8 md:pr-10">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Використання Cookie
              </span>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Ми використовуємо cookie для покращення роботи сайту, аналітики та зручності бронювання. Продовжуючи перегляд, ви погоджуєтеся з нашою{' '}
              <Link href="/privacy" className="text-primary underline hover:no-underline">
                Політикою конфіденційності
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:flex-row">
            <button
              ref={acceptBtnRef}
              type="button"
              onClick={accept}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity order-1"
            >
              Прийняти
            </button>
            <button
              type="button"
              onClick={reject}
              className="border border-neutral-300 text-neutral-700 px-6 py-2.5 rounded-full font-medium hover:bg-neutral-50 transition-colors order-2"
            >
              Відхилити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
