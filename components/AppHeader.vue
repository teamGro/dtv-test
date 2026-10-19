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
          aria-label="Создать материал"
          title="Создать материал"
        >
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
  justify-content: center;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  padding: 10px 20px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color var(--transition-fast), color var(--transition-fast);

  &__icon {
    display: none;
  }

  &__text {
    display: inline;
    white-space: nowrap;
  }

  &:hover {
    background-color: var(--color-primary-light-hover);
    color: var(--color-primary);
  }

  &:active {
    background-color: var(--color-primary-light-active);
    color: var(--color-primary);
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 10px;

    &__icon {
      display: block;
      width: 20px;
      height: 20px;
    }

    &__text {
      display: none;
    }
  }
}
</style>
