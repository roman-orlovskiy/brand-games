<template>
  <div class="archer-page">
    <div class="archer-page__container">
      <ArcherGame class="archer-page__game" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Игра Лучник'
})
</script>

<style scoped lang="scss">
.archer-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;

  &__container {
    flex: 1;
    width: 100%;
    display: flex;
  }

  &__game {
    width: 100%;
    height: 100%;
  }
}
</style>


