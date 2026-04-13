// Message formatting helpers for the Gluhoman bot.
// NOTE: `Booking` fields are based on the main app's Prisma schema.
// Adjust field names if the actual schema differs.

export interface BookingLike {
  id: string;
  service?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  guests?: number | null;
  message?: string | null;
  createdAt?: Date | string | null;
}

export function serviceEmoji(service?: string | null): string {
  switch ((service || '').toLowerCase()) {
    case 'aquapark':
      return '🏊';
    case 'hotel':
      return '🏨';
    case 'restaurant':
      return '🍽️';
    case 'sauna':
      return '🧖';
    case 'wedding':
      return '💍';
    case 'paintball':
      return '🎯';
    case 'apitherapy':
      return '🐝';
    default:
      return '📌';
  }
}

function formatDate(d?: Date | string | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toISOString().slice(0, 10);
}

export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function formatBookingShort(b: BookingLike): string {
  const emoji = serviceEmoji(b.service);
  const name = b.name || 'Без імені';
  const from = formatDate(b.dateFrom);
  return `${emoji} \`${shortId(b.id)}\` ${name} — ${from}`;
}

export function formatBookingFull(b: BookingLike): string {
  const lines = [
    `${serviceEmoji(b.service)} *Бронювання* \`${shortId(b.id)}\``,
    '',
    `Послуга: ${b.service || '—'}`,
    `Ім'я: ${b.name || '—'}`,
    `Телефон: ${b.phone || '—'}`,
    `Email: ${b.email || '—'}`,
    `Дата з: ${formatDate(b.dateFrom)}`,
    `Дата до: ${formatDate(b.dateTo)}`,
    `Гостей: ${b.guests ?? '—'}`,
    `Створено: ${formatDate(b.createdAt)}`,
  ];
  if (b.message) {
    lines.push('', `Повідомлення:`, b.message);
  }
  return lines.join('\n');
}
