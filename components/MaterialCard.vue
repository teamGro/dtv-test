<template>
  <NuxtLink :to="`/materials/${material.id}`" class="material-card">
    <div class="material-card__date">
      <svg class="material-card__date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <span>{{ formattedDate }}</span>
    </div>

    <h2 class="material-card__title">{{ material.title }}</h2>

    <p v-if="material.short_description" class="material-card__description">
      {{ material.short_description }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Material } from '~/types/material'
import { formatDate } from '~/utils/formatDate'

const props = defineProps<{
  material: Material
}>()

const formattedDate = computed(() => {
  return formatDate(props.material.datetime)
})
</script>

<style scoped lang="less">
.material-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
  border: 1px solid var(--color-border-light);
  height: 100%;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
    border-color: rgba(0, 136, 204, 0.2);

    .material-card__title {
      color: var(--color-primary);
    }
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
  }

  &__date-icon {
    flex-shrink: 0;
    opacity: 0.8;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-xl);
    font-weight: 700;
    line-height: var(--line-height-tight);
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color var(--transition-fast);
  }

  &__description {
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: auto;
  }
}
</style>
