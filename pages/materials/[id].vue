<template>
  <div class="material-detail-page">
    <div class="container material-detail-page__container">
      <!-- Back Link -->
      <NuxtLink to="/" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Назад</span>
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="material-detail-page__loading">
        <div class="detail-card detail-card--skeleton">
          <div class="skeleton-line skeleton-line--date"></div>
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--title-2"></div>
          <div class="skeleton-line skeleton-line--text"></div>
          <div class="skeleton-line skeleton-line--text"></div>
          <div class="skeleton-line skeleton-line--text-short"></div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!material" class="material-detail-page__not-found">
        <div class="not-found-card">
          <h2 class="not-found-card__title">Материал не найден</h2>
          <p class="not-found-card__text">Возможно, он был удалён или указан некорректный идентификатор.</p>
          <NuxtLink to="/" class="btn-back-home">
            Вернуться к списку материалов
          </NuxtLink>
        </div>
      </div>

      <!-- Material Detail Content -->
      <article v-else class="detail-card">
        <div class="detail-card__date">
          <svg class="detail-card__date-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{{ formattedDate }}</span>
        </div>

        <h1 class="detail-card__title">{{ material.title }}</h1>

        <div v-if="material.short_description" class="detail-card__lead">
          {{ material.short_description }}
        </div>

        <!-- Rendered WYSIWYG Content -->
        <div
          v-if="material.description_html"
          class="detail-card__body article-content"
          v-html="material.description_html"
        ></div>
        <div
          v-else-if="material.short_description"
          class="detail-card__body article-content"
        >
          <p>{{ material.short_description }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '~/stores/materials'
import type { Material } from '~/types/material'
import { formatDate } from '~/utils/formatDate'

const route = useRoute()
const materialId = computed(() => String(route.params.id))
const materialsStore = useMaterialsStore()

const material = ref<Material | null>(null)
const isLoading = ref(true)

const formattedDate = computed(() => {
  return formatDate(material.value?.datetime)
})

// Загрузка данных для детальной страницы
const { data } = await useAsyncData(`material-${materialId.value}`, async () => {
  return await materialsStore.fetchMaterialById(materialId.value)
})

if (data.value) {
  material.value = data.value
  isLoading.value = false
} else {
  // На клиенте повторная проверка при необходимости
  onMounted(async () => {
    isLoading.value = true
    try {
      material.value = await materialsStore.fetchMaterialById(materialId.value)
    } finally {
      isLoading.value = false
    }
  })
}

// Установка динамического заголовка страницы
useHead(() => ({
  title: material.value?.title ? `${material.value.title} — Моя Планета` : 'Материал — Моя Планета'
}))
</script>

<style scoped lang="less">
.material-detail-page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);

  &__container {
    max-width: 920px;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  padding: 6px 0;
  transition: color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    transform: translateX(-3px);
  }
}

.detail-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl) var(--spacing-2xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
    border-radius: var(--radius-lg);
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-weight: 500;
    margin-bottom: var(--spacing-md);
  }

  &__date-icon {
    flex-shrink: 0;
    opacity: 0.8;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-3xl);
    font-weight: 700;
    line-height: var(--line-height-tight);
    color: var(--color-text);
    margin-bottom: var(--spacing-lg);

    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }

  &__lead {
    font-family: var(--font-body);
    font-size: 19px;
    line-height: var(--line-height-relaxed);
    color: var(--color-text);
    font-weight: 600;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-light);

    @media (max-width: 768px) {
      font-size: 17px;
    }
  }

  &__body {
    margin-top: var(--spacing-md);
  }
}

// Skeletons
.detail-card--skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f3f6 25%, #e6ebf0 50%, #f0f3f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  &--date {
    width: 140px;
    height: 16px;
  }

  &--title {
    width: 90%;
    height: 36px;
  }

  &--title-2 {
    width: 60%;
    height: 36px;
    margin-bottom: 16px;
  }

  &--text {
    width: 100%;
    height: 16px;
  }

  &--text-short {
    width: 70%;
    height: 16px;
  }
}

.not-found-card {
  text-align: center;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl) var(--spacing-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-xs);
  }

  &__text {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }
}

.btn-back-home {
  display: inline-block;
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
