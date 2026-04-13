'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  Check,
  X,
  Loader2,
  RefreshCw,
  Link2,
  AlertCircle,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface BotInfo {
  configured: boolean;
  error?: string;
  bot?: {
    id: number;
    first_name: string;
    username: string;
  };
  webhook?: {
    url: string;
    pending_update_count: number;
    last_error_date?: number;
    last_error_message?: string;
  };
}

export function TelegramSetupClient() {
  const [info, setInfo] = useState<BotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/telegram/info', { cache: 'no-store' });
      const data = await res.json();
      setInfo(data);
    } catch {
      setInfo({ configured: false, error: 'Помилка запиту' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setWebhook = async () => {
    setWorking('set');
    setMessage(null);
    try {
      const res = await fetch('/api/admin/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set' }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({ kind: 'ok', text: `Webhook встановлено: ${data.url}` });
        await load();
      } else {
        setMessage({ kind: 'err', text: data.error ?? 'Помилка' });
      }
    } catch (err) {
      setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Помилка' });
    } finally {
      setWorking(null);
    }
  };

  const removeWebhook = async () => {
    setWorking('delete');
    setMessage(null);
    try {
      const res = await fetch('/api/admin/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({ kind: 'ok', text: 'Webhook видалено' });
        await load();
      } else {
        setMessage({ kind: 'err', text: data.error ?? 'Помилка' });
      }
    } catch (err) {
      setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Помилка' });
    } finally {
      setWorking(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-10 text-center shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3d2e]/40 mx-auto mb-3" />
        <p className="text-sm text-[#1a3d2e]/60">Завантажуємо інформацію про бота…</p>
      </div>
    );
  }

  // Not configured — show setup instructions
  if (!info?.configured) {
    return (
      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 lg:p-8 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1a3d2e] mb-1">
              Бот не налаштовано
            </h2>
            <p className="text-sm text-[#1a3d2e]/70">
              {info?.error ?? 'TELEGRAM_BOT_TOKEN не задано в .env.local'}
            </p>
          </div>
        </div>

        <div className="border-t border-[#1a3d2e]/10 pt-5 space-y-4 text-sm text-[#1a3d2e]/75">
          <h3 className="font-display text-base font-semibold text-[#1a3d2e]">
            Як налаштувати
          </h3>

          <Step n={1}>
            Відкрийте{' '}
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a3d2e] underline underline-offset-2"
            >
              @BotFather
            </a>{' '}
            у Telegram і напишіть <code className="bg-[#f4ecd8]/60 px-1.5 py-0.5 rounded text-xs">/newbot</code>
          </Step>

          <Step n={2}>
            Введіть назву бота (наприклад <em>Глухомань</em>) і унікальний юзернейм
            (наприклад <em>gluhoman_bot</em>)
          </Step>

          <Step n={3}>
            Скопіюйте токен і додайте в <code className="bg-[#f4ecd8]/60 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
            <pre className="bg-[#0f1f18] text-[#e6d9b8] text-xs p-3 rounded-xl mt-2 overflow-x-auto">
{`TELEGRAM_BOT_TOKEN=123456789:ABCdef...
TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 16)`}
            </pre>
          </Step>

          <Step n={4}>
            Перезапустіть сервер (<code className="bg-[#f4ecd8]/60 px-1.5 py-0.5 rounded text-xs">npm run dev</code>)
            і поверніться на цю сторінку
          </Step>

          <Step n={5}>
            Натисніть <strong>Встановити webhook</strong> — бот почне приймати повідомлення.
            На production це має бути HTTPS URL вашого домену.
          </Step>
        </div>
      </div>
    );
  }

  const { bot, webhook } = info;
  const webhookActive = webhook?.url && webhook.url.length > 0;

  return (
    <div className="space-y-5">
      {/* Bot info */}
      {bot && (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a3d2e] text-[#fdfaf0] flex items-center justify-center flex-shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-[#1a3d2e]">
                {bot.first_name}
              </h2>
              <a
                href={`https://t.me/${bot.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1a3d2e]/70 hover:text-[#1a3d2e] underline underline-offset-2 inline-flex items-center gap-1"
              >
                @{bot.username}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-[10px] text-[#1a3d2e]/45 uppercase tracking-wider font-semibold mt-2">
                Bot ID: {bot.id}
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
              aria-label="Оновити"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Webhook status */}
      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              webhookActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {webhookActive ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg font-semibold text-[#1a3d2e]">
              {webhookActive ? 'Webhook активний' : 'Webhook не налаштовано'}
            </h2>
            {webhookActive && webhook && (
              <>
                <p className="text-xs text-[#1a3d2e]/60 mt-1 break-all font-mono">{webhook.url}</p>
                <p className="text-[10px] text-[#1a3d2e]/45 uppercase tracking-wider font-semibold mt-2">
                  Pending: {webhook.pending_update_count}
                </p>
                {webhook.last_error_message && (
                  <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs text-red-800">
                      <strong>Остання помилка:</strong> {webhook.last_error_message}
                    </p>
                  </div>
                )}
              </>
            )}
            {!webhookActive && (
              <p className="text-xs text-[#1a3d2e]/60 mt-1">
                Натисніть «Встановити webhook» щоб бот почав отримувати повідомлення.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#1a3d2e]/10 pt-4">
          <button
            type="button"
            onClick={setWebhook}
            disabled={working !== null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors disabled:opacity-50"
          >
            {working === 'set' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            Встановити webhook
          </button>
          {webhookActive && (
            <button
              type="button"
              onClick={removeWebhook}
              disabled={working !== null}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {working === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Видалити webhook
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
              message.kind === 'ok'
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.kind === 'ok' ? (
              <Check className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-xs ${
                message.kind === 'ok' ? 'text-emerald-900' : 'text-red-900'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}
      </div>

      {/* Commands reference */}
      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
        <h2 className="font-display text-lg font-semibold text-[#1a3d2e] mb-4">
          Команди бота
        </h2>
        <ul className="space-y-2 text-sm">
          <Cmd cmd="/start" label="Головне меню з кнопками" />
          <Cmd cmd="/menu" label="Посилання на меню ресторану" />
          <Cmd cmd="/hotel" label="Список номерів готелю і бронювання" />
          <Cmd cmd="/aquapark" label="Тарифи і купівля квитків" />
          <Cmd cmd="/sauna" label="Резервація лазні" />
          <Cmd cmd="/orders" label="Переглянути свої замовлення (за телефоном)" />
          <Cmd cmd="/help" label="Допомога" />
        </ul>
        <div className="mt-4 pt-4 border-t border-[#1a3d2e]/10">
          <p className="text-xs text-[#1a3d2e]/60 leading-relaxed">
            <strong>Порада:</strong> у @BotFather можна встановити меню команд для бота через
            <code className="bg-[#f4ecd8]/60 px-1.5 py-0.5 rounded text-[10px] mx-1">/setcommands</code>
            — тоді команди з&apos;являться у списку Telegram-інтерфейсу.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a3d2e] text-[#fdfaf0] flex items-center justify-center text-xs font-bold tabular-nums">
        {n}
      </span>
      <div className="flex-1 pt-0.5">{children}</div>
    </div>
  );
}

function Cmd({ cmd, label }: { cmd: string; label: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <code className="bg-[#f4ecd8]/60 text-[#1a3d2e] font-mono text-xs px-2 py-0.5 rounded whitespace-nowrap">
        {cmd}
      </code>
      <span className="text-[#1a3d2e]/70 text-xs">{label}</span>
    </li>
  );
}
