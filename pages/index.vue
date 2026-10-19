<template>
  <div class="materials-page">
    <div class="container">
      <div class="materials-page__header">
        <h1 class="materials-page__title">Материалы</h1>
      </div>

      <!-- Loading State -->
      <div v-if="materialsStore.isLoading && materialsStore.materials.length === 0" class="materials-page__loading">
        <div class="skeleton-grid">
          <div v-for="i in 8" :key="i" class="skeleton-card">
            <div class="skeleton-line skeleton-line--date"></div>
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--desc"></div>
            <div class="skeleton-line skeleton-line--desc-short"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="materialsStore.error && materialsStore.materials.length === 0" class="materials-page__error">
        <div class="error-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ materialsStore.error }}</p>
          <button class="btn-retry" @click="materialsStore.fetchMaterials(true)">
            Повторить попытку
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="materialsStore.sortedMaterials.length === 0" class="materials-page__empty">
        <div class="empty-card">
          <div class="empty-card__icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#0088CC" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2 class="empty-card__title">Материалов пока нет</h2>
          <p class="empty-card__text">Будьте первым, кто опубликует интересный материал!</p>
          <NuxtLink to="/materials/create" class="btn-create-first">
            Создать материал
          </NuxtLink>
        </div>
      </div>

      <!-- Grid of Materials -->
      <div v-else class="materials-page__grid">
        <MaterialCard
          v-for="material in materialsStore.sortedMaterials"
          :key="material.id"
          :material="material"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '~/stores/materials'

useHead({
  title: 'Материалы — Моя Планета'
})

const materialsStore = useMaterialsStore()

// Получаем материалы на SSR и клиенте
await useAsyncData('materials', () => materialsStore.fetchMaterials())
</script>

<style scoped lang="less">
.materials-page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);

  &__header {
    margin-bottom: var(--spacing-xl);
  }

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--color-text);
    line-height: var(--line-height-tight);

    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__empty,
  &__error {
    display: flex;
    justify-content: center;
    padding: var(--spacing-3xl) 0;
  }
}

.empty-card {
  text-align: center;
  max-width: 440px;
  background-color: var(--color-surface);
  padding: var(--spacing-2xl) var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
    color: var(--color-text);
  }

  &__text {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
}

.btn-create-first {
  display: inline-block;
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: background-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }
}

.error-card {
  text-align: center;
  color: var(--color-error);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  p {
    font-size: var(--font-size-base);
    color: var(--color-text);
  }
}

.btn-retry {
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-weight: 600;

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

// Skeletons
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f3f6 25%, #e6ebf0 50%, #f0f3f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  &--date {
    width: 35%;
    height: 14px;
  }

  &--title {
    width: 85%;
    height: 24px;
    margin-bottom: 8px;
  }

  &--desc {
    width: 100%;
    height: 14px;
  }

  &--desc-short {
    width: 60%;
    height: 14px;
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
