# План: Власна сторінка меню ресторану

## Контекст

Зараз кнопка "Переглянути меню" веде на сторонній сайт **expz.menu**
(URL: `https://expz.menu/68cb558b-4efe-4276-b686-bd2ad11d2836`).

**Мета:** відмовитись від зовнішньої платформи і побудувати власну сторінку меню
прямо на сайті `/menu` — з категоріями, картками страв, фото, цінами і описами.
Все виглядає гармонійно в стилі сайту і відкривається без переходу на сторонні ресурси.

---

## Фаза 1. Витягти дані з expz.menu

**Проблема:** expz.menu — це SPA (Vite). HTML порожній, дані підтягуються по API.
Простий `fetch` / `WebFetch` НЕ працює.

**Варіант А — Playwright (рекомендований)**

`@playwright/test` вже є в `devDependencies`, але без `playwright.config` і тестів. Використати для разового парсингу:

1. Встановити браузер: `npx playwright install chromium`
2. Створити одноразовий скрипт `scripts/scrape-menu.ts`:
   - Відкриває сторінку
   - Чекає на завантаження категорій (`await page.waitForSelector('...')`)
   - Перехоплює `fetch`/`XHR` запити через `page.on('response', ...)` — там має бути JSON з меню
   - Або витягує DOM після повного рендеру: `page.$$eval('.menu-item', ...)`
   - Зберігає результат в `src/data/menu.json`
3. Запустити: `npx tsx scripts/scrape-menu.ts`
4. Видалити скрипт після використання (він не потрібен в продакшені)

**Варіант Б — Reverse-engineering API**

1. Відкрити експз.меню в Chrome DevTools → Network → XHR
2. Знайти запит на кшталт `GET https://api.expz.menu/v1/menus/68cb558b-...`
3. Зробити його прямо через `curl`/`WebFetch` → отримати JSON
4. Зберегти у `src/data/menu.json`

**Варіант В — Ручний парсинг (fallback)**

Якщо нічого не працює — відкрити сторінку, скопіювати контент по категоріях
і структурувати вручну. Повільно, але надійно.

**Результат Фази 1:** файл `src/data/menu.json` з повною структурою меню.

---

## Фаза 2. Структура даних

### Типи (`src/types/menu.ts`)

```ts
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;          // в гривнях
  weight?: string;        // "250 г" / "300 мл"
  image?: string;         // /images/menu/xxx.jpg або URL
  tags?: string[];        // ["vegan", "spicy", "new"]
}

export interface MenuCategory {
  id: string;              // slug: "salads" / "main-dishes"
  name: string;            // "Салати"
  icon?: string;           // emoji або lucide icon name
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}
```

### Дані (`src/data/menu.json`)

Повне меню у форматі JSON:
```json
{
  "categories": [
    {
      "id": "salads",
      "name": "Салати",
      "items": [
        { "id": "caesar", "name": "Цезар з куркою", "price": 285, "weight": "220 г", "description": "..." }
      ]
    }
  ]
}
```

### Зображення

- Якщо на expz.menu є фото — завантажити і покласти в `public/images/menu/`
- Якщо фото немає — використати placeholder або фірмовий заглушку
- Імена файлів: `{category-slug}-{item-slug}.jpg` (без пробілів/кирилиці)

---

## Фаза 3. UI — сторінка `/menu`

### Файлова структура

```
src/app/menu/
  └── page.tsx           # Серверний компонент з метаданими + MenuPageClient
src/components/menu/
  ├── MenuHero.tsx       # Шапка з фото ресторану + заголовок
  ├── CategoryNav.tsx    # Sticky горизонтальна навігація категорій
  ├── CategorySection.tsx # Секція з назвою категорії + grid страв
  ├── DishCard.tsx       # Картка страви (фото, назва, опис, ціна)
  └── MenuFooter.tsx     # Контакти + CTA "Забронювати столик"
```

### Секції сторінки

**1. Hero** (h-[50vh], не повноекранний):
- Фон: `/images/restaurant/bar_rustic_tree_trunk.jpg` або `exterior_summer_terrace_water.jpg`
- Градієнт overlay
- Badge "Меню ресторану"
- H1: "Меню «Глухомань»"
- Підзаголовок: "Українська та європейська кухня, крафтове пиво власного виробництва"

**2. Sticky Category Nav** (`top-[header-height]`, z-index над контентом):
- Горизонтальна прокрутка на mobile, центроване на desktop
- Кожна категорія — pill-кнопка з емодзі/іконкою і назвою
- При кліку — `scrollIntoView` до відповідної секції
- Активна категорія підсвічується через `IntersectionObserver`
- Стиль: glassmorphism (`bg-white/80 backdrop-blur-md border-b`)

```tsx
<nav className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-white/30">
  <div className="container max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
    <div className="flex gap-2 min-w-max">
      {categories.map(cat => (
        <button onClick={() => scrollTo(cat.id)} className={isActive(cat.id) 
          ? "bg-gradient-to-r from-primary to-accent text-white" 
          : "bg-white/60 text-foreground hover:bg-white"}>
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  </div>
</nav>
```

**3. Category Sections** (один `<section id={cat.id}>` на категорію):
- `py-16 scroll-mt-32` (враховує sticky nav)
- H2: назва категорії з градієнтним текстом
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- `DishCard` для кожної страви

**4. DishCard** — картка страви:

```tsx
<div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl 
                overflow-hidden hover:shadow-2xl hover:-translate-y-1 
                transition-all duration-500 group">
  {item.image && (
    <div className="relative aspect-video">
      <Image src={item.image} alt={item.name} fill 
             className="object-cover group-hover:scale-105 transition-transform duration-700" />
    </div>
  )}
  <div className="p-6">
    <div className="flex items-start justify-between gap-4 mb-2">
      <h3 className="text-lg font-bold">{item.name}</h3>
      <span className="text-xl font-bold text-primary whitespace-nowrap">{item.price} ₴</span>
    </div>
    {item.weight && <p className="text-xs text-muted-foreground mb-2">{item.weight}</p>}
    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
  </div>
</div>
```

**5. CTA Footer** (повторний — градієнт):
- "Готові замовити?"
- Кнопка: "Забронювати столик" → `tel:+380508503555`

### Client/Server компоненти

- `src/app/menu/page.tsx` — серверний (імпортує `menu.json` напряму, без `fetch`)
- `CategoryNav` — **клієнтський** (`'use client'` — для state активної категорії і `useEffect` з IntersectionObserver)
- `CategorySection`, `DishCard` — серверні

Меню не вимагає API-роутів — все статично з JSON.

---

## Фаза 4. Інтеграція

### 1. Замінити зовнішні посилання на меню

**У `src/app/restaurant/page.tsx`:**
- Hero кнопка: `<a href="http://expz.menu/...">` → `<Link href="/menu">`
- CTA кнопка: те саме

**У `src/components/sections/` (Header, Footer) — якщо десь є посилання на меню** — замінити на `/menu`.

### 2. Додати в навігацію сайту

`src/components/layout/Header.tsx` — додати пункт "Меню" (між "Ресторан" і іншим):
```
Головна | Ресторан | Меню | Готель | ...
```

Або як окрема кнопка в хедері.

### 3. Metadata (SEO)

`src/app/menu/page.tsx`:
```ts
export const metadata: Metadata = {
  title: 'Меню ресторану Глухомань — українська та європейська кухня',
  description: 'Повне меню ресторану «Глухомань» у с. Нижні Млини. Українські страви, європейська кухня, крафтове пиво власного виробництва.',
  openGraph: { type: 'website', locale: 'uk_UA' },
};
```

---

## Фаза 5. Тести і верифікація

1. `npm run build` — має пройти без помилок
2. `npm run dev` — відкрити `/menu` і перевірити:
   - Всі категорії і страви відображаються
   - Sticky nav правильно прокручується при кліку
   - Активна категорія підсвічується при скролі
   - Grid адаптивний (mobile/tablet/desktop)
   - Всі фото завантажуються (немає 404)
3. Lighthouse score — performance > 90
4. Перевірити що кнопки на сторінці ресторану ведуть на `/menu`, а не на expz.menu

---

## Файли для створення/редагування

### Нові:
- `src/app/menu/page.tsx`
- `src/components/menu/MenuHero.tsx`
- `src/components/menu/CategoryNav.tsx` (client)
- `src/components/menu/CategorySection.tsx`
- `src/components/menu/DishCard.tsx`
- `src/components/menu/MenuFooter.tsx`
- `src/types/menu.ts`
- `src/data/menu.json`
- `public/images/menu/*.jpg` (фото страв, якщо є)
- `scripts/scrape-menu.ts` (тимчасово, для Фази 1)

### Редагувати:
- `src/app/restaurant/page.tsx` — замінити 2 посилання на меню
- `src/components/layout/Header.tsx` — додати пункт "Меню" (опціонально)

---

## Порядок виконання (для нової сесії)

1. **Спочатку:** запустити Playwright-скрипт і отримати `menu.json` (або ручний парсинг)
2. **Створити типи:** `src/types/menu.ts`
3. **Побудувати компоненти:** Hero → CategoryNav → CategorySection → DishCard
4. **Створити сторінку:** `src/app/menu/page.tsx`
5. **Замінити посилання** в `restaurant/page.tsx`
6. **Видалити** `src/components/ui/MenuModal.tsx` і `MenuButton.tsx` (не потрібні)
7. **Build + dev** — перевірити в браузері
8. **Commit** (тільки після підтвердження від користувача)

---

## Важливі нотатки

- **Мова UI:** тільки українська (усі тексти, заголовки, підзаголовки)
- **Дизайн-система:** використовувати існуючі токени (primary, accent, glassmorphism cards)
- **Images:** `next/image` з `fill` — ніяких background-image CSS для страв
- **Без API-роутів:** меню статичне, JSON імпортується напряму
- **Мобільна версія:** sticky nav має горизонтально прокручуватись, картки в 1 колонку
- **Доступність:** `aria-label` на кнопках навігації, focus states, semantic HTML

---

## Відкриті питання (уточнити на початку нової сесії)

1. **Чи доступний API expz.menu?** (перевірити DevTools Network)
2. **Чи є фото страв на expz.menu або треба використати заглушки?**
3. **Чи додавати пункт "Меню" в головну навігацію сайту чи тільки з ресторану?**
4. **Чи потрібен пошук / фільтрація** (наприклад, тільки вегетаріанські)? — поки НЕ додаємо, тримаємо просто.
