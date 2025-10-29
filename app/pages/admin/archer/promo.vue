<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Промокоды</h1>
      <p class="text-gray-600 mt-1">Управление промокодами для игры "Лучник"</p>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Список промокодов</h2>
      </template>

      <div class="space-y-4">
        <UAlert color="blue" variant="soft">
          <template #title>Информация</template>
          <p>Здесь будет отображаться список всех сгенерированных промокодов и статистика их использования.</p>
        </UAlert>

        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-ticket" class="w-12 h-12 mx-auto mb-4" />
          <p>Функционал промокодов будет добавлен в следующих версиях</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>
