# Архитектура проекта - Глухомань

## Общий подход

Проект построен по принципу **feature-based архитектуры** с использованием **App Router** от Next.js. Каждая основная функция/страница имеет свою структуру и компоненты.

## Роутинг и навигация

### Основные страницы
```
/ (главная)
├── /aquapark (аквапарк)
├── /restaurant (ресторан)  
├── /hotel (готель)
└── /other-services/ (дополнительные услуги)
    ├── /apitherapy (апітерапія)
    ├── /wedding (весільні церемонії)
    ├── /sauna (лазня)
    ├── /paintball (пейнтбол)
    ├── /horses (прогулянки на конях)
    ├── /kids-parties (дитячі свята)
    └── /bbq-zone (мангальна зона)
```

### Структура layout'ов
- **Root Layout** (`src/app/layout.tsx`) - общий для всего сайта
- **Page-specific layouts** - при необходимости для отдельных разделов

## Компонентная архитектура

### Layout компоненты
```typescript
src/components/layout/
├── Header.tsx              # Главное меню и навигация
├── Footer.tsx              # Подвал с контактами
├── MobileMenu.tsx          # Мобильное меню
└── ContactBar.tsx          # Панель с контактами
```

### UI компоненты (shadcn/ui)
```typescript
src/components/ui/
├── button.tsx              # Кнопки
├── card.tsx                # Карточки
├── navigation-menu.tsx     # Навигационное меню
├── sheet.tsx               # Боковые панели
└── ...                     # Другие UI компоненты
```

### Секции страниц
```typescript
src/components/sections/
├── HeroSection.tsx         # Главная секция
├── ServicesGrid.tsx        # Сетка услуг
├── AboutSection.tsx        # О нас
├── ContactSection.tsx      # Контактная секция
└── GallerySection.tsx      # Галерея
```

## Управление данными

### Константы и конфигурация
- `src/constants/index.ts` - все статические данные
- Информация об услугах, контакты, навигация
- Централизованное управление контентом

### TypeScript типы
```typescript
// src/types/index.ts
interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  category: 'main' | 'additional';
}
```

## Стилизация

### Tailwind CSS подход
- **Utility-first** классы для быстрой разработки
- **Responsive design** с mobile-first подходом
- **Custom CSS variables** для темы и цветов

### Дизайн-система
- Единая цветовая палитра
- Consistent spacing и typography
- Переиспользуемые компоненты

## Оптимизация производительности

### Image optimization
```typescript
import Image from 'next/image';
// Автоматическая оптимизация всех изображений
```

### Code splitting
- Автоматический code splitting на уровне страниц
- Dynamic imports для тяжелых компонентов
- Lazy loading для изображений

### SEO оптимизация
```typescript
// В каждой странице
export const metadata: Metadata = {
  title: 'Заголовок страницы',
  description: 'Описание страницы',
  // Open Graph, Twitter cards и т.д.
}
```

## Будущие расширения

### Интернационализация (i18n)
```typescript
// Подготовка к добавлению next-intl
const messages = {
  uk: { /* украинские тексты */ },
  ru: { /* русские тексты */ },
  en: { /* английские тексты */ }
}
```

### CMS интеграция
- Возможность подключения headless CMS
- Динамическое управление контентом
- API для обновления информации

### PWA функционал
- Service Workers для кеширования
- Offline поддержка
- App-like experience

## Тестирование

### Unit тесты
- Jest для логики компонентов
- React Testing Library для UI тестов

### E2E тесты
- Playwright для автоматизированного тестирования
- Тестирование критических user flows

### Performance тесты
- Lighthouse CI для мониторинга производительности
- Core Web Vitals отслеживание