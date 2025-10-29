<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Статистика</h1>
      <p class="text-gray-600 mt-1">Статистика игры "Лучник"</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Общая статистика</h3>
        </template>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Всего игр:</span>
            <span class="font-semibold">0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Успешных выстрелов:</span>
            <span class="font-semibold">0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Получено промокодов:</span>
            <span class="font-semibold">0</span>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Популярные призы</h3>
        </template>

        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-gift" class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm">Данные отсутствуют</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Конверсия</h3>
        </template>

        <div class="text-center py-8 text-gray-500">
          <UIcon name="i-lucide-trending-up" class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm">Данные отсутствуют</p>
        </div>
      </UCard>
    </div>

    <UCard class="mt-6">
      <template #header>
        <h2 class="text-lg font-semibold">Детальная статистика</h2>
      </template>

      <UAlert color="blue" variant="soft">
        <template #title>Информация</template>
        <p>Детальная статистика будет доступна после начала использования игры.</p>
      </UAlert>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>
