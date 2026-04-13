import { Metadata } from 'next';
import { Bot } from 'lucide-react';
import { TelegramSetupClient } from './SetupClient';

export const metadata: Metadata = {
  title: 'Telegram бот — CRM Глухомань',
  robots: { index: false, follow: false },
};

export default function TelegramAdminPage() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Інтеграція
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1 flex items-center gap-3">
          <Bot className="h-7 w-7 text-[#1a3d2e]/40" />
          Telegram бот
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        <p className="text-sm text-[#1a3d2e]/60 mt-3 max-w-2xl">
          Бот для продажу бронювань і квитків через Telegram. Клієнти можуть
          переглянути меню, готель, аквапарк і лазню, забронювати послуги і
          отримати статус замовлень прямо в чаті.
        </p>
      </div>

      <TelegramSetupClient />
    </div>
  );
}
