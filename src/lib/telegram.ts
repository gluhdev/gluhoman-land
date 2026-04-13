/**
 * Low-level Telegram Bot API wrapper.
 *
 * No external dependencies — uses global fetch.
 * All methods are async and return the Telegram `result` field on success.
 * Errors are thrown with the `description` from Telegram.
 *
 * Reference: https://core.telegram.org/bots/api
 */

const API_BASE = 'https://api.telegram.org/bot';

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }
  return token;
}

export async function callTelegram<T = unknown>(
  method: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!data.ok) {
    throw new Error(data.description ?? `Telegram API ${method} failed`);
  }
  return data.result as T;
}

/* ─── Types (minimal subset we use) ─── */

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  contact?: {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
  };
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
  }>;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type ReplyKeyboardButton = {
  text: string;
  request_contact?: boolean;
};

export type ReplyKeyboardMarkup = {
  keyboard: ReplyKeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  is_persistent?: boolean;
  input_field_placeholder?: string;
};

export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | { remove_keyboard: true };

/* ─── High-level helpers ─── */

export async function sendMessage(params: {
  chat_id: number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: ReplyMarkup;
  disable_web_page_preview?: boolean;
}): Promise<TelegramMessage> {
  return callTelegram<TelegramMessage>('sendMessage', params);
}

export async function editMessageText(params: {
  chat_id: number;
  message_id: number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: InlineKeyboardMarkup;
  disable_web_page_preview?: boolean;
}): Promise<TelegramMessage | boolean> {
  return callTelegram('editMessageText', params);
}

export async function answerCallbackQuery(params: {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
}): Promise<boolean> {
  return callTelegram<boolean>('answerCallbackQuery', params);
}

export async function getMe(): Promise<TelegramUser> {
  return callTelegram<TelegramUser>('getMe');
}

export async function setWebhook(url: string, secretToken?: string): Promise<boolean> {
  return callTelegram<boolean>('setWebhook', {
    url,
    secret_token: secretToken,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  });
}

export async function deleteWebhook(): Promise<boolean> {
  return callTelegram<boolean>('deleteWebhook', { drop_pending_updates: true });
}

export async function getWebhookInfo(): Promise<{
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}> {
  return callTelegram('getWebhookInfo');
}

export function isBotConfigured(): boolean {
  return !!process.env.TELEGRAM_BOT_TOKEN;
}
