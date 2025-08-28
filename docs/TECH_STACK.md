# Технический стек - Глухомань

## Основные технологии

### Frontend Framework
- **Next.js 15** - React-фреймворк с поддержкой SSR/SSG
- **TypeScript** - типизация для надежности и удобства разработки
- **React 18** - современная версия React с новейшими возможностями

### Стилизация
- **Tailwind CSS v4** - utility-first CSS фреймворк
- **shadcn/ui** - готовые компоненты с отличной доступностью
- **PostCSS** - обработка CSS

### Архитектура
- **App Router** - новая система роутинга Next.js
- **Feature-based структура** - организация кода по фичам
- **Component-driven development** - модульная разработка

## Структура проекта

```
src/
├── app/                     # App Router страницы
│   ├── aquapark/           # Страница аквапарка
│   ├── restaurant/         # Страница ресторана
│   ├── hotel/              # Страница готеля
│   ├── other-services/     # Дополнительные услуги
│   ├── layout.tsx          # Корневой layout
│   └── page.tsx            # Главная страница
├── components/             # Переиспользуемые компоненты
│   ├── layout/             # Layout компоненты
│   ├── sections/           # Секции страниц
│   └── ui/                 # shadcn/ui компоненты
├── lib/                    # Утилиты и хелперы
├── types/                  # TypeScript типы
└── constants/              # Константы и конфигурация
```

## Принципы разработки

### Mobile-First
Все компоненты разрабатываются сначала для мобильных устройств

### Accessibility (a11y)
- Семантическая HTML разметка
- ARIA атрибуты где необходимо
- Контрастность цветов
- Поддержка клавиатурной навигации

### Performance
- Оптимизация изображений с next/image
- Lazy loading для несущественного контента
- Code splitting на уровне страниц
- Минификация и сжатие

### SEO
- Meta теги для каждой страницы
- Structured data (JSON-LD)
- Sitemap и robots.txt
- Open Graph теги

## Языковая поддержка

### Текущая реализация
- **Украинский язык** - основной язык сайта
- Все тексты, названия и контент на украинском

### Планируемое расширение
- Русский язык
- Английский язык
- i18n интеграция для будущих языков

## Команды разработки

### Установка зависимостей
```bash
npm install
```

### Разработка
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

### Линтинг
```bash
npm run lint
```

## Полезные ресурсы

- [Next.js документация](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui компоненты](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)