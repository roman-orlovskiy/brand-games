<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройки игры</h1>
      <p class="text-gray-600 mt-1">Здесь можно настроить дизайн игры</p>
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
                    :items="colorOptions"
                    placeholder="Выберите цвет"
                    value-key="value"
                  >
                    <template #leading="{ modelValue }">
                      <div 
                        v-if="modelValue"
                        class="w-4 h-4 rounded-full border border-gray-300"
                        :style="{ backgroundColor: modelValue }"
                      />
                    </template>
                    <template #item-label="{ item }">
                      <div class="flex items-center space-x-2">
                        <div 
                          class="w-4 h-4 rounded-full border border-gray-300"
                          :style="{ backgroundColor: item.color }"
                        />
                        <span>{{ item.label }}</span>
                      </div>
                    </template>
                  </USelect>
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

// Исходный массив цветов
const rawColors = [
  '#8B4513', '#A0522D', '#654321', '#2F1B14',
  '#228B22', '#32CD32', '#006400', '#2E8B57'
]

// Преобразование в формат для USelect
const colorOptions = rawColors.map(color => ({
  label: color,
  value: color,
  color: color
}))

const brandSettings = ref({
  colors: [
    { id: 1, name: 'Дерево', color: '#8B4513' },
    { id: 2, name: 'Крона', color: '#228B22' },
    { id: 3, name: 'Траектория', color: '#FFD700' },
    { id: 4, name: 'Майка лучника', color: '#FF6B6B' },
    { id: 5, name: 'Лук', color: '#8B4513' },
    { id: 6, name: 'Стрела', color: '#696969' },
    { id: 7, name: 'Фон', color: '#87CEEB' },
    { id: 8, name: 'Призы', color: '#FF69B4' },
    { id: 9, name: 'Интерфейс', color: '#4682B4' },
    { id: 10, name: 'Кнопки', color: '#DC143C' },
  ]
})
</script>
