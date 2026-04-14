/**
 * Declarative schema for all editable site content.
 * Admin UI is generated from this structure — add a new key here and
 * it appears in /admin/content automatically. The same key is used by
 * <EditableText> / <EditableImage> on the public pages.
 */

export type FieldType = 'text' | 'richtext' | 'image' | 'number' | 'url';

export interface FieldDef {
  key: string;           // unique dotted key, e.g. "home.hero.title"
  label: string;         // Ukrainian label shown in admin
  type: FieldType;
  fallback: string;      // default displayed if DB has no override
  hint?: string;         // helper text under the field
  rows?: number;         // for textarea
}

export interface SectionDef {
  id: string;
  label: string;
  fields: FieldDef[];
}

export interface PageDef {
  id: string;            // url-safe id, used in admin route
  label: string;
  revalidate: string[];  // paths to revalidate on save
  sections: SectionDef[];
}

export const CONTENT_SCHEMA: PageDef[] = [
  {
    id: 'home',
    label: 'Головна',
    revalidate: ['/'],
    sections: [
      {
        id: 'hero',
        label: 'Hero (головний банер)',
        fields: [
          { key: 'home.hero.eyebrow', label: 'Надзаголовок', type: 'text', fallback: 'Садиба Глухомань' },
          { key: 'home.hero.title', label: 'Заголовок', type: 'text', fallback: 'Відпочинок у Глухомані' },
          { key: 'home.hero.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Тиша лісу, смак домашньої кухні та справжня українська гостинність у с. Нижні Млини', rows: 3 },
          { key: 'home.hero.ctaPrimary', label: 'Головна кнопка', type: 'text', fallback: 'Забронювати' },
          { key: 'home.hero.ctaSecondary', label: 'Друга кнопка', type: 'text', fallback: 'Наші послуги' },
        ],
      },
      {
        id: 'story',
        label: 'Історія / About',
        fields: [
          { key: 'home.story.title', label: 'Заголовок', type: 'text', fallback: 'Про нас' },
          { key: 'home.story.body', label: 'Основний текст', type: 'richtext', fallback: 'Глухомань — родинний комплекс відпочинку у мальовничому куточку Полтавщини. Ми поєднуємо сучасний комфорт із автентичністю традиційного українського села.', rows: 6 },
          { key: 'home.story.image', label: 'Фото', type: 'image', fallback: '/images/story.jpg' },
        ],
      },
      {
        id: 'features',
        label: 'Переваги',
        fields: [
          { key: 'home.features.title', label: 'Заголовок блоку', type: 'text', fallback: 'Чому обирають нас' },
          { key: 'home.features.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Все для вашого ідеального відпочинку', rows: 2 },
        ],
      },
      {
        id: 'location',
        label: 'Локація',
        fields: [
          { key: 'home.location.title', label: 'Заголовок', type: 'text', fallback: 'Як нас знайти' },
          { key: 'home.location.address', label: 'Адреса', type: 'text', fallback: 'с. Нижні Млини, Полтавська область' },
          { key: 'home.location.description', label: 'Опис проїзду', type: 'richtext', fallback: '15 хвилин від центру Полтави. Зручний під\'їзд асфальтованою дорогою, велика безкоштовна парковка.', rows: 4 },
        ],
      },
    ],
  },
  {
    id: 'hotel',
    label: 'Готель',
    revalidate: ['/hotel', '/hotel/booking'],
    sections: [
      {
        id: 'hero',
        label: 'Hero сторінки',
        fields: [
          { key: 'hotel.hero.title', label: 'Заголовок', type: 'text', fallback: 'Готель' },
          { key: 'hotel.hero.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Затишні номери з видом на ставок', rows: 2 },
          { key: 'hotel.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/hotel-hero.jpg' },
        ],
      },
      {
        id: 'intro',
        label: 'Вступний текст',
        fields: [
          { key: 'hotel.intro.body', label: 'Опис готелю', type: 'richtext', fallback: 'Номери різних категорій для пар, родин і компаній. Щодня — свіжа постіль, рушники і ранкова кава на веранді.', rows: 6 },
        ],
      },
    ],
  },
  {
    id: 'restaurant',
    label: 'Ресторан',
    revalidate: ['/restaurant'],
    sections: [
      {
        id: 'hero',
        label: 'Hero',
        fields: [
          { key: 'restaurant.hero.title', label: 'Заголовок', type: 'text', fallback: 'Ресторан' },
          { key: 'restaurant.hero.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Українська кухня з продуктів з власного господарства', rows: 2 },
          { key: 'restaurant.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/restaurant-hero.jpg' },
        ],
      },
      {
        id: 'intro',
        label: 'Опис',
        fields: [
          { key: 'restaurant.intro.body', label: 'Текст', type: 'richtext', fallback: 'Затишна зала на 80 осіб, літня тераса біля озера, мангал та жива музика на вихідних.', rows: 5 },
        ],
      },
    ],
  },
  {
    id: 'aquapark',
    label: 'Аквапарк',
    revalidate: ['/aquapark'],
    sections: [
      {
        id: 'hero',
        label: 'Hero',
        fields: [
          { key: 'aquapark.hero.title', label: 'Заголовок', type: 'text', fallback: 'Аквапарк' },
          { key: 'aquapark.hero.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Гірки, басейни та зона SPA', rows: 2 },
          { key: 'aquapark.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/aquapark-hero.jpg' },
        ],
      },
    ],
  },
  {
    id: 'sauna',
    label: 'Лазня',
    revalidate: ['/sauna'],
    sections: [
      {
        id: 'hero',
        label: 'Hero',
        fields: [
          { key: 'sauna.hero.title', label: 'Заголовок', type: 'text', fallback: 'Лазня на дровах' },
          { key: 'sauna.hero.subtitle', label: 'Підзаголовок', type: 'text', fallback: 'Справжня українська лазня з купіллю', rows: 2 },
          { key: 'sauna.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/sauna-hero.jpg' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Контакти (шапка + футер)',
    revalidate: ['/', '/hotel', '/aquapark', '/restaurant', '/sauna'],
    sections: [
      {
        id: 'main',
        label: 'Основні контакти',
        fields: [
          { key: 'contact.phone', label: 'Телефон', type: 'text', fallback: '+380 50 850 35 55' },
          { key: 'contact.phoneSecondary', label: 'Другий телефон', type: 'text', fallback: '' },
          { key: 'contact.email', label: 'Email', type: 'text', fallback: 'info@gluhoman.com' },
          { key: 'contact.address', label: 'Адреса', type: 'text', fallback: 'с. Нижні Млини, Полтавська обл.' },
          { key: 'contact.hours', label: 'Робочий час', type: 'text', fallback: 'Щодня 08:00 — 23:00' },
          { key: 'contact.instagram', label: 'Instagram URL', type: 'url', fallback: 'https://instagram.com/' },
          { key: 'contact.facebook', label: 'Facebook URL', type: 'url', fallback: 'https://facebook.com/' },
        ],
      },
    ],
  },
];

export function getPage(id: string): PageDef | undefined {
  return CONTENT_SCHEMA.find((p) => p.id === id);
}

export function findField(key: string): FieldDef | undefined {
  for (const p of CONTENT_SCHEMA) {
    for (const s of p.sections) {
      const f = s.fields.find((f) => f.key === key);
      if (f) return f;
    }
  }
  return undefined;
}
