<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройка бренда</h1>
      <p class="text-gray-600 mt-1">Заполните основные настройки для вашего бренда</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Основные настройки -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Цветовая палитра -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Цветовая палитра</h2>
          </template>

          <div class="space-y-6">
            <!-- Основные цвета -->
            <div>
              <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div class="space-y-2" v-for="colorItem in brandSettings.colors" :key="colorItem.id">
                  <label class="text-xs text-gray-600 pr-2">{{ colorItem.name }}</label>
                  <div class="relative">
                    <input
                      v-model="colorItem.color"
                      type="color"
                      class="w-full h-8 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const brandSettings = ref({
  colors: [
    { id: 1, name: 'Основной цвет', color: '#3b82f6' },
    { id: 2, name: 'Вторичный цвет', color: '#1e40af' },
    { id: 3, name: 'Акцентный цвет', color: '#f59e0b' },
    { id: 4, name: 'Фоновый цвет', color: '#f8fafc' },
  ]
})
</script>
