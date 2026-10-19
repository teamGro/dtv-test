# Пошаговый план реализации проекта (Git Commits Guide)

Данный документ описывает пошаговую историю разработки проекта для создания осмысленной, логичной цепочки коммитов в Git в соответствии с требованиями тестового задания.

---

## 📌 Шаг 1: Инициализация проекта Nuxt 3 и базовая структура

**Цель:** Создать фундамент приложения на Nuxt 3, настроить менеджер пакетов и `.gitignore`.

* **Файлы:**
  * `package.json`
  * `package-lock.json`
  * `nuxt.config.ts`
  * `tsconfig.json`
  * `.gitignore`
  * `app.vue`
* **Действия:**
  1. Инициализация проекта Nuxt 3 с Vue 3.
  2. Установка базовых зависимостей (`nuxt`, `vue`).
  3. Конфигурация `.gitignore` (исключение `.nuxt`, `.output`, `node_modules`).
* **Рекомендуемый коммит:**
  ```bash
  git add .gitignore package.json package-lock.json nuxt.config.ts tsconfig.json app.vue
  git commit -m "feat: initialize Nuxt 3 project structure"
  ```

---

## 📌 Шаг 2: Настройка шрифтов, Less и системы дизайн-токенов

**Цель:** Подключить препроцессор Less, шрифты `Futura PT` и `Source Sans 3` и создать единый файл CSS-переменных.

* **Файлы:**
  * `public/fonts/` (шрифты FuturaPT и SourceSans3)
  * `public/favicon.svg`
  * `assets/styles/fonts.less`
  * `assets/styles/variables.less`
  * `assets/styles/main.less`
  * `nuxt.config.ts` (подключение `main.less`)
* **Действия:**
  1. Размещение шрифтов в `public/fonts/`.
  2. Описание правил `@font-face` в `assets/styles/fonts.less`.
  3. Определение всех дизайн-токенов в `variables.less` (цвета, шрифты, отступы, тени, радиусы скругления).
  4. Настройка глобального файла стилей `main.less` с базовым сбросом и стилями типографики для статей.
* **Рекомендуемый коммит:**
  ```bash
  git add public/ assets/ nuxt.config.ts
  git commit -m "feat(styles): setup Less, design tokens and typography with Futura PT and Source Sans 3"
  ```

---

## 📌 Шаг 3: Модели данных TypeScript и серверный API-прокси (решение CORS)

**Цель:** Реализовать строгую типизацию сущностей и настроить серверные обработчики Nuxt Nitro для обхода CORS.

* **Файлы:**
  * `types/material.ts`
  * `server/api/materials/index.get.ts`
  * `server/api/materials/save.post.ts`
  * `server/api/materials.get.ts`
* **Действия:**
  1. Описание интерфейсов `Material` и `CreateMaterialPayload`.
  2. Создание обработчика `server/api/materials/index.get.ts` для получения материалов через Node.js без CORS-ограничений браузера.
  3. Создание обработчика `server/api/materials/save.post.ts` с серверной валидацией длины полей (`title` <= 80, `short_description` <= 255) и пересылкой POST-запроса на `naukatv.ru`.
* **Рекомендуемый коммит:**
  ```bash
  git add types/ server/
  git commit -m "feat(api): define material types and server-side nitro proxy to handle CORS"
  ```

---

## 📌 Шаг 4: Хранилище состояния Pinia

**Цель:** Настроить централизованное управление состоянием материалов, кэширование и сортировку.

* **Файлы:**
  * `stores/materials.ts`
  * `package.json` (`pinia`, `@pinia/nuxt`)
  * `nuxt.config.ts` (подключение модуля `@pinia/nuxt`)
* **Действия:**
  1. Создание Pinia-стора `materials`.
  2. Реализация геттера `sortedMaterials` с сортировкой по дате (свежие материалы выше).
  3. Реализация экшенов `fetchMaterials`, `fetchMaterialById` (с поиском в кэше и фоллбэком на загрузку списка) и `createMaterial`.
* **Рекомендуемый коммит:**
  ```bash
  git add stores/ nuxt.config.ts package.json
  git commit -m "feat(store): implement Pinia store for materials with caching and date sorting"
  ```

---

## 📌 Шаг 5: Компоненты интерфейса (AppHeader и MaterialCard)

**Цель:** Сверстать общую шапку сайта и карточку материала по макетам Figma.

* **Файлы:**
  * `components/AppHeader.vue`
  * `components/MaterialCard.vue`
  * `utils/formatDate.ts`
  * `app.vue`
* **Действия:**
  1. Создание утилиты `utils/formatDate.ts` для форматирования даты на русском языке (например, «21 сентября 2024»).
  2. Верстка компонента `AppHeader.vue` с логотипом «МОЯ ПЛАНЕТА» и кнопкой «Создать материал».
  3. Верстка компонента `MaterialCard.vue` с иконкой календаря, заголовком, описанием и ховер-эффектами.
  4. Обновление `app.vue` для подключения шапки и `<NuxtPage />`.
* **Рекомендуемый коммит:**
  ```bash
  git add components/ utils/ app.vue
  git commit -m "feat(ui): add AppHeader, MaterialCard components and date formatting helper"
  ```

---

## 📌 Шаг 6: Страница списка материалов (`/`)

**Цель:** Собрать главную страницу со списком материалов, состояниями загрузки и пустого списка.

* **Файлы:**
  * `pages/index.vue`
* **Действия:**
  1. Интеграция со стором через `useAsyncData`.
  2. Отображение сетки карточек (4 колонки на десктопе).
  3. Реализация красивых скелетонов (shimmer-анимация) на время загрузки.
  4. Реализация блока «Пустое состояние» (Empty State) с кнопкой создания первого материала.
  5. Обработка сетевых ошибок с кнопкой повтора.
* **Рекомендуемый коммит:**
  ```bash
  git add pages/index.vue
  git commit -m "feat(views): implement materials list page with skeletons and empty state"
  ```

---

## 📌 Шаг 7: WYSIWYG-редактор TipTap

**Цель:** Интегрировать TipTap редактор с необходимым стандартным набором инструментов.

* **Файлы:**
  * `components/WysiwygEditor.vue`
  * `package.json` (`@tiptap/vue-3`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`)
* **Действия:**
  1. Подключение и настройка TipTap с расширениями `StarterKit` и `Placeholder`.
  2. Реализация панели инструментов (Текст / Параграф, H1, H2, H3, Цитата) с подсветкой активного состояния.
  3. Настройка эмита данных в двух форматах: `update:html` и `update:json`.
* **Рекомендуемый коммит:**
  ```bash
  git add components/WysiwygEditor.vue package.json
  git commit -m "feat(editor): integrate TipTap WYSIWYG editor with HTML and JSON export"
  ```

---

## 📌 Шаг 8: Страница создания материала (`/materials/create`)

**Цель:** Реализовать форму создания материала с комплексной валидацией.

* **Файлы:**
  * `pages/materials/create.vue`
* **Действия:**
  1. Поля: `title`, `short_description`, `datetime`, `WysiwygEditor`.
  2. Настройка проверки длины:
     * `title` до 80 символов с интерактивным счетчиком;
     * `short_description` до 255 символов с интерактивным счетчиком.
  3. Поле даты с дефолтным текущим значением и возможностью выбора.
  4. Обработка сабмита: отправка POST-запроса через стор, индикатор загрузки и редирект на детальную страницу созданного материала.
* **Рекомендуемый коммит:**
  ```bash
  git add pages/materials/create.vue
  git commit -m "feat(views): implement material creation page with form validation and counters"
  ```

---

## 📌 Шаг 9: Детальная страница материала (`/materials/[id]`)

**Цель:** Реализовать просмотр материала с поддержкой форматированного текста.

* **Файлы:**
  * `pages/materials/[id].vue`
* **Действия:**
  1. Получение данных из Pinia-стора с автоматической фоллбэк-загрузкой при прямом переходе.
  2. Отображение кнопки «Назад», даты публикации, заголовка и лид-абзаца.
  3. Рендеринг HTML-контента редактора с типографикой `.article-content`.
  4. Обработка сценария «Материал не найден».
* **Рекомендуемый коммит:**
  ```bash
  git add pages/materials/[id].vue
  git commit -m "feat(views): implement material detail page with HTML rendering and fallback fetch"
  ```

---

## 📌 Шаг 10: Адаптивность и финальная полировка

**Цель:** Обеспечить идеальное отображение на мобильных устройствах и планшетах по макетам Figma.

* **Файлы:**
  * `assets/styles/main.less`
  * `components/AppHeader.vue`
  * `pages/index.vue`
  * `pages/materials/create.vue`
  * `pages/materials/[id].vue`
* **Действия:**
  1. Медиа-запросы для мобильных устройств (390px, 768px, 1200px).
  2. Одноколоночная сетка на экранах смартфонов.
  3. Touch-friendly отступы и размеры кнопок.
* **Рекомендуемый коммит:**
  ```bash
  git add assets/ components/ pages/
  git commit -m "style: optimize responsive layouts for mobile and tablet devices"
  ```

---

## 📌 Шаг 11: Документация проекта (README.md)

**Цель:** Описать установку, запуск и подробно ответить на все 4 обязательных вопроса из задания.

* **Файлы:**
  * `README.md`
  * `IMPLEMENTATION_PLAN.md`
* **Действия:**
  1. Описание установки и запуска (`npm install --legacy-peer-deps`, `npm run dev`).
  2. Обоснование выбора Pinia store для детальной страницы.
  3. Описание двухуровневой валидации длины полей (`title` и `short_description`).
  4. Подробное объяснение решения проблемы CORS через серверный прокси Nitro.
* **Рекомендуемый коммит:**
  ```bash
  git add README.md IMPLEMENTATION_PLAN.md
  git commit -m "docs: add comprehensive README with setup instructions and architecture decisions"
  ```
