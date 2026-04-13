# Остаточне виправлення iOS Safari viewport jank

## Проблема
На iPhone Safari під час прокрутки, коли збирається/розгортається нижня панель URL/вкладок, кожна hero-секція на сайті «смикалася» і візуально зумилася. Раніше ми вже застосували:

- `min-h-[90svh]` на всіх hero-секціях
- `h-[100svh]` на `HeroSlider`
- `overscroll-y-none` на `<html>` і `<body>`
- Вимкнення Lenis smooth scroll на touch
- Вимкнення framer-motion `useScroll` parallax на touch

Цього виявилося **недостатньо** — jank залишався.

## Чому `svh` на hero-секції було недостатньо
`svh` (small viewport height) — це стабільна одиниця: вона **не змінюється**, коли iOS Safari ховає або показує адресну панель. Однак ми застосовували `svh` лише до самих hero-секцій. **Батьківські контейнери** все ще використовували динамічні одиниці:

| Файл | Рядок | Що було | Чому це проблема |
|------|-------|---------|------------------|
| `src/app/globals.css` | 22 | `body { min-height: 100dvh }` | `dvh` — **dynamic** viewport height, змінюється разом із панеллю Safari |
| `src/app/globals.css` | 792 | `.bg-radial-gradient-green { min-height: 100vh; width: 100vw }` | `vh` — теж динамічна на iOS |
| `src/app/layout.tsx` | 66 | `<div className="min-h-screen ...">` | Tailwind `min-h-screen` = `min-height: 100vh` — **dynamic** |
| `src/components/sections/HeroSlider.tsx` | 124 | `style={{ width: '100vw' }}` | Інлайн `100vw` дублював клас і змушував reflow при зміні viewport |

### Механізм jank
1. Користувач скролить — iOS Safari прибирає адресну панель.
2. Browser оновлює `100vh` / `100dvh` → висота `body` зростає на ~60-80px.
3. Зростання `body` запускає reflow всього document.
4. Hero-секція має `min-h-[90svh]` (стабільна), але всередині неї `<Image fill object-cover>` живе в контейнері, який отримує subpixel-зсув від reflow батьків.
5. `object-cover` перераховує scale, щоб вписати картинку в нову geometry → **видимий зум на 1-2%**.

Тобто `svh` на hero не рятує, поки **батьки** теж не переведені на `svh`.

## Остаточне виправлення
Перевести **всі root-рівні висоти** на `svh`. Для root-контейнерів сайту нам взагалі не потрібна динамічна поведінка — нам потрібна **стабільна** висота, яка ніколи не «дихає».

### Зміни

**1. `src/app/globals.css`** (рядки 12-26)
```css
body {
  min-height: 100svh;   /* було 100dvh */
}
```

**2. `src/app/globals.css`** (рядок ~792, `.bg-radial-gradient-green`)
```css
.bg-radial-gradient-green {
  min-height: 100svh;   /* було 100vh */
  width: 100%;          /* було 100vw — звужує можливість reflow по ширині */
}
```

**3. `src/app/layout.tsx`** (рядок 66)
```tsx
<div className="min-h-[100svh] flex flex-col prevent-horizontal-scroll">
{/* було min-h-screen, тобто 100vh */}
```

**4. `src/components/sections/HeroSlider.tsx`** (рядок 123)
```tsx
<section className="relative h-[100svh] max-h-[100svh] w-full overflow-hidden bg-black">
{/* видалили інлайн style={{ width: '100vw', maxWidth: '100vw' }} */}
```

## Чому це працює
Після цього виправлення **жоден** root-контейнер сайту більше не залежить від динамічного viewport. Коли Safari ховає/показує адресну панель:

- `body` залишається на `100svh` — без змін.
- Wrapper `<div>` залишається на `100svh` — без змін.
- `bg-radial-gradient-green` залишається на `100svh` — без змін.
- Hero-секція залишається на `100svh` / `90svh` — без змін.
- **Reflow не відбувається** → `<Image fill object-cover>` не перераховує scale → нема видимого зуму.

## Trade-offs
- **Видимий контент трохи менший** на iOS Safari, коли адресна панель розгорнута: ми зайняли «small» viewport, а не «dynamic». Це навмисно — стабільність важливіша за +60px у пікового стану.
- **Desktop не зачеплено**: на desktop `svh == dvh == vh`, поведінка ідентична.
- **Lenis smooth scroll** працює без змін (на desktop він активний, на touch ми його вимикаємо).
- **HeroSlider autoplay** не зачеплено — ми лише прибрали інлайн стилі ширини.
- **Жодних нових залежностей**, жодних JS-хаків з `window.innerHeight` чи `visualViewport` API.

## Альтернативи, які ми відхилили

| Підхід | Чому не обрали |
|--------|----------------|
| `position: fixed` на body + scroll-container | Ламає sticky header, ламає Lenis, ламає scroll-snap |
| JS `--vh` через resize listener | Шумний, не вирішує саму причину reflow, додає JS на critical path |
| `visualViewport` API + CSS vars | Те саме, що JS `--vh`, лише точніше — все одно reflow |
| Фіксована aspect-ratio замість vh | Втрата flexibility між iPhone SE і Pro Max |

`svh` на всіх root-контейнерах — найпростіший, найдешевший і найнадійніший варіант.
