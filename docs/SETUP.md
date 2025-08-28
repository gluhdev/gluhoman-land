# Налаштування проекту Глухомань

## Швидкий старт

### Встановлення залежностей
```bash
npm install
```

### Запуск development сервера
```bash
npm run dev
```

Сайт буде доступний на http://localhost:3000

### Збірка для production
```bash
npm run build
npm start
```

## Структура проекта

```
gluhoman-land/
├── docs/                    # Документація
│   ├── TECH_STACK.md       # Опис технологій
│   ├── ARCHITECTURE.md     # Архітектура проекту
│   └── SETUP.md            # Цей файл
├── public/                 # Статичні файли
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Головний layout
│   │   ├── page.tsx       # Головна сторінка
│   │   ├── aquapark/      # Сторінка аквапарку
│   │   ├── restaurant/    # Сторінка ресторану
│   │   ├── hotel/         # Сторінка готелю
│   │   └── other-services/ # Додаткові послуги
│   ├── components/        # Компоненти React
│   │   ├── layout/        # Layout компоненти
│   │   ├── sections/      # Секції сторінок
│   │   └── ui/            # shadcn/ui компоненти
│   ├── lib/               # Утиліти
│   ├── types/             # TypeScript типи
│   └── constants/         # Константи та конфігурація
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Розробка

### Додавання нових компонентів shadcn/ui
```bash
npx shadcn@latest add [component-name]
```

### Перевірка коду
```bash
npm run lint
```

### Збірка проекту
```bash
npm run build
```

## Особливості проекту

### Мова сайту
- **Українська мова** - основна та єдина мова на поточний момент
- Всі тексти, навігація та контент українською
- Готовність до додавання інших мов у майбутньому

### Зображення
- Поточно використовуються placeholder зображення
- Реальні фото будуть додані пізніше
- Всі зображення оптимізовані через next/image

### Стилізація
- **Mobile-first підхід** - спочатку мобільна версія
- **Tailwind CSS** для швидкої розробки
- **shadcn/ui** для готових компонентів
- **Responsive design** для всіх пристроїв

## Корисні команди

### Розробка
```bash
npm run dev          # Запуск development сервера з Turbopack
npm run build        # Збірка для production
npm run start        # Запуск production сервера
npm run lint         # Перевірка коду ESLint
```

### shadcn/ui
```bash
npx shadcn@latest add button     # Додати компонент Button
npx shadcn@latest add card       # Додати компонент Card
npx shadcn@latest add dialog     # Додати компонент Dialog
```

## Налаштування редактора

### VS Code
Рекомендовані розширення:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Налаштування Prettier (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Наступні кроки

1. **Створення окремих сторінок** для кожної послуги
2. **Додавання реальних зображень** замість placeholder
3. **Налаштування форм зворотного зв'язку**
4. **SEO оптимізація** та structured data
5. **Тестування** з Playwright
6. **Performance оптимізація**

## Підтримка

При виникненні питань або проблем:
1. Перевірте документацію в папці `docs/`
2. Перегляньте структуру коду в `src/`
3. Зверніться до документації Next.js та Tailwind CSS