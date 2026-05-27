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
          { key: 'hotel.hero.eyebrow', label: 'Надзаголовок', type: 'text', fallback: 'Проживання · I', hint: 'Маленький текст над заголовком' },
          { key: 'hotel.hero.title', label: 'Головний заголовок', type: 'text', fallback: 'Готель' },
          { key: 'hotel.hero.subtitle', label: 'Підзаголовок (абзац)', type: 'richtext', fallback: 'Затишні номери серед соснового лісу Полтавщини, авторська кухня й тиша природи — місце, де час нарешті уповільнюється.', rows: 4 },
          { key: 'hotel.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/9.jpg' },
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
          { key: 'restaurant.hero.eyebrow', label: 'Надзаголовок', type: 'text', fallback: 'Кухня та музика • III' },
          { key: 'restaurant.hero.title', label: 'Головний заголовок', type: 'text', fallback: 'Ресторан' },
          { key: 'restaurant.hero.subtitle', label: 'Підзаголовок (абзац)', type: 'richtext', fallback: 'Європейсько-українська кухня, українська піч на дровах, крафтове пиво власної пивоварні, павлінарій у залі «Жар-Птиці» та жива музика на вихідних.', rows: 4 },
          { key: 'restaurant.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/restaurant/exterior_summer_terrace_water.jpg' },
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
          { key: 'aquapark.hero.eyebrow', label: 'Надзаголовок', type: 'text', fallback: 'Вода та сонце • II' },
          { key: 'aquapark.hero.title', label: 'Головний заголовок', type: 'text', fallback: 'Аквапарк' },
          { key: 'aquapark.hero.subtitle', label: 'Підзаголовок (абзац)', type: 'richtext', fallback: 'Водні гірки, басейни з підігрівом та окрема дитяча зона. Цілий день відпочинку для всієї родини — від ранку до заходу сонця.', rows: 4 },
          { key: 'aquapark.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/akvapark.webp' },
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
          { key: 'sauna.hero.eyebrow', label: 'Надзаголовок', type: 'text', fallback: 'Тіло та дух • IV' },
          { key: 'sauna.hero.title', label: 'Головний заголовок', type: 'text', fallback: 'Лазня' },
          { key: 'sauna.hero.subtitle', label: 'Підзаголовок (абзац)', type: 'richtext', fallback: 'Чани на дровах з карпатськими травами, дубові та бамбукові віники, масажі і кімнати відпочинку з самоварами.', rows: 4 },
          { key: 'sauna.hero.image', label: 'Фонове фото', type: 'image', fallback: '/images/sauna/exterior_small_sauna_building.jpg' },
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
  {
    id: 'hotel-prices',
    label: 'Ціни на номери',
    revalidate: ['/hotel', '/hotel/aquapark', '/hotel/central', '/cottages'],
    sections: [
      {
        id: 'aquapark',
        label: 'Готель-Аквапарк',
        fields: [
          { key: 'hotel.aquapark.lux-balcony.price', label: 'Двокімнатний Люкс із балконом', type: 'text', fallback: 'Ціна за запитом', hint: 'Наприклад: «від 4 800 грн / ніч»' },
          { key: 'hotel.aquapark.standard-aqua.price', label: 'Стандарт з виходом до Аквапарку', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.aquapark.standard-balcony.price', label: 'Стандарт із балконом (2-й поверх)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.aquapark.standard-twin.price', label: 'Стандарт з окремими ліжками (мансарда)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.aquapark.lux-attic.price', label: 'Двокімнатний Люкс (мансарда)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.aquapark.standard-basic.price', label: 'Стандарт без балкона', type: 'text', fallback: 'Ціна за запитом' },
        ],
      },
      {
        id: 'central',
        label: 'Центральний Готель',
        fields: [
          { key: 'hotel.central.lux-balcony.price', label: 'Двокімнатний Люкс з балконом', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.central.standard-balcony-1f.price', label: 'Стандарт з балконом (І поверх)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.central.standard-balcony-2f.price', label: 'Стандарт з балконом (ІІ поверх)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.central.standard-no-balcony-twin.price', label: 'Стандарт без балкону (2 ліжка)', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.central.standard-no-balcony-double.price', label: 'Стандарт без балкону (двоспальне)', type: 'text', fallback: 'Ціна за запитом' },
        ],
      },
      {
        id: 'brewery',
        label: 'Корпус Броварні',
        fields: [
          { key: 'hotel.brewery.brewery-balcony.price', label: 'Стандарт із балконом', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'hotel.brewery.brewery-bunk.price', label: 'Стандарт з двоярусним ліжком', type: 'text', fallback: 'Ціна за запитом' },
        ],
      },
      {
        id: 'cottages',
        label: 'Будиночки',
        fields: [
          { key: 'cottages.yaga.price', label: 'Будиночок «Баби Яги»', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'cottages.lisovyk.price', label: 'Хатинка Мудрого Лісовика', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'cottages.teremok.price', label: 'Теремок', type: 'text', fallback: 'Ціна за запитом' },
          { key: 'cottages.terem-lux.price', label: 'Теремок-Люкс', type: 'text', fallback: 'Ціна за запитом' },
        ],
      },
      {
        id: 'common',
        label: 'Спільні умови',
        fields: [
          { key: 'hotel.common.extra_bed', label: 'Додаткове спальне місце', type: 'text', fallback: '250 грн / доба', hint: 'З docx: «Вартість додаткового місця в номері — 250 грн / доба»' },
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
