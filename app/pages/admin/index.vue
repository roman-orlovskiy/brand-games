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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="colorItem in brandSettings.colors" :key="colorItem.id" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ colorItem.name }}</label>
                  <USelect
                    v-model="colorItem.color"
                    :options="colorItem.options.map(color => ({ label: color, value: color }))"
                    placeholder="Выберите цвет"
                  />
                  <div class="mt-1 flex items-center space-x-2">
                    <div 
                      class="w-6 h-6 rounded border border-gray-300"
                      :style="{ backgroundColor: colorItem.color }"
                    />
                    <span class="text-xs text-gray-500">{{ colorItem.color }}</span>
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
    { id: 1, name: 'Дерево', color: '#8B4513', options: ['#8B4513', '#A0522D', '#654321', '#2F1B14'] },
    { id: 2, name: 'Крона', color: '#228B22', options: ['#228B22', '#32CD32', '#006400', '#2E8B57'] },
    { id: 3, name: 'Траектория', color: '#FFD700', options: ['#FFD700', '#FFA500', '#FF6347', '#FF1493'] },
    { id: 4, name: 'Майка лучника', color: '#FF6B6B', options: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'] },
    { id: 5, name: 'Лук', color: '#8B4513', options: ['#8B4513', '#A0522D', '#654321', '#2F1B14'] },
    { id: 6, name: 'Стрела', color: '#696969', options: ['#696969', '#2F4F4F', '#A9A9A9', '#000000'] },
    { id: 7, name: 'Фон', color: '#87CEEB', options: ['#87CEEB', '#98FB98', '#F0E68C', '#FFB6C1'] },
    { id: 8, name: 'Призы', color: '#FF69B4', options: ['#FF69B4', '#FFD700', '#32CD32', '#FF6347'] },
    { id: 9, name: 'Интерфейс', color: '#4682B4', options: ['#4682B4', '#5F9EA0', '#6495ED', '#20B2AA'] },
    { id: 10, name: 'Кнопки', color: '#DC143C', options: ['#DC143C', '#FF4500', '#32CD32', '#4169E1'] },
  ]
})
</script>
