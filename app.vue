<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.app-main {
  flex: 1;
}
</style>
