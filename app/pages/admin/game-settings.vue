<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройки игры</h1>
      <p class="text-gray-600 mt-1">Здесь можно настроить дизайн игры</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-3">
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
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div v-for="colorItem in gameSettings.colors" :key="colorItem.id" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ colorItem.name }}</label>
                  <USelect
                    :model-value="colorItem.brandColorId"
                    @update:model-value="(value) => updateGameColor(colorItem.id, value)"
                    :items="colorOptions"
                    placeholder="Выберите цвет"
                    value-key="brandColorId"
                    class="w-35"
                  >
                    <template #leading>
                      <div 
                        class="w-4 h-4 rounded-full border border-gray-300"
                        :style="{ backgroundColor: colorItem.color }"
                      />
                    </template>
                    <template #item-label="{ item }">
                      <div class="flex items-center space-x-2">
                        <div 
                          class="w-4 h-4 rounded-full border border-gray-300"
                          :style="{ backgroundColor: item.value }"
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

    <UCard>
      <template #header>
        <h2 class="text-lg font-semibold">Предпросмотр игры</h2>
      </template>

      <div class="lg:col-span-1 w-3xl">
        <GameField />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'admin'
})

const settingsStore = useSettingsStore()
const { brandSettings } = storeToRefs(settingsStore)

// Цвета игры с привязкой к бренд-буку
const gameSettings = ref({
  colors: [
    { id: 1, name: 'Дерево', color: brandSettings.value?.colors?.[0]?.color || '#8B4513', brandColorId: 0 },
    { id: 2, name: 'Крона', color: brandSettings.value?.colors?.[1]?.color || '#228B22', brandColorId: 1 },
    { id: 3, name: 'Траектория', color: brandSettings.value?.colors?.[4]?.color || '#FFD700', brandColorId: 4 },
    { id: 4, name: 'Майка лучника', color: brandSettings.value?.colors?.[4]?.color || '#FF6B6B', brandColorId: 4 },
    { id: 5, name: 'Лук', color: brandSettings.value?.colors?.[2]?.color || '#8B4513', brandColorId: 2 },
    { id: 6, name: 'Стрела', color: brandSettings.value?.colors?.[2]?.color || '#696969', brandColorId: 2 },
    { id: 7, name: 'Фон', color: brandSettings.value?.colors?.[3]?.color || '#87CEEB', brandColorId: 3 },
    { id: 8, name: 'Призы', color: brandSettings.value?.colors?.[4]?.color || '#FF69B4', brandColorId: 4 },
    { id: 9, name: 'Интерфейс', color: brandSettings.value?.colors?.[0]?.color || '#4682B4', brandColorId: 0 },
    { id: 10, name: 'Кнопки', color: brandSettings.value?.colors?.[4]?.color || '#DC143C', brandColorId: 4 },
  ]
})

// Преобразование цветов бренд-бука в формат для USelect
const colorOptions = computed(() => {
  return brandSettings.value?.colors?.map((color, index) => ({
    label: color.name,
    value: color.color,
    brandColorId: index
  })) || []
})

const updateGameColor = (gameColorId: number, brandColorId: number) => {
  const gameColor = gameSettings.value.colors.find(c => c.id === gameColorId)
  const brandColor = brandSettings.value?.colors?.[brandColorId]
  if (gameColor && brandColor) {
    gameColor.color = brandColor.color
    gameColor.brandColorId = brandColorId
  }
}
</script>
