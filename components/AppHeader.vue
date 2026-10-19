<template>
  <header class="app-header">
    <div class="container app-header__container">
      <NuxtLink to="/" class="app-header__logo" title="На главную">
        <img
          src="~/assets/img/logo.svg"
          alt="Телеканал Моя Планета"
          class="app-header__logo-img"
          width="115"
          height="44"
        />
      </NuxtLink>

      <div class="app-header__actions">
        <NuxtLink
          v-if="showCreateButton"
          to="/materials/create"
          class="btn-create"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span class="btn-create__text">Создать материал</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

// Скрываем кнопку "Создать материал" если мы уже находимся на странице создания
const showCreateButton = computed(() => {
  return route.path !== '/materials/create'
})
</script>

<style scoped lang="less">
.app-header {
  height: var(--header-height);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    user-select: none;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.88;
    }
  }

  &__logo-img {
    display: block;
    height: 44px;
    width: auto;

    @media (max-width: 480px) {
      height: 36px;
    }
  }
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 2px 6px rgba(0, 136, 204, 0.25);

  &:hover {
    background-color: var(--color-primary-hover);
    box-shadow: 0 4px 12px rgba(0, 136, 204, 0.35);
  }

  &:active {
    background-color: var(--color-primary-active);
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>
