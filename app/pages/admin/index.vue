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
            <h2 class="text-lg font-semibold">Цветовая палитра бренда</h2>
            <p class="text-sm text-gray-600 mt-1">Выберите основные цвета для вашего бренда</p>
          </template>

          <div class="space-y-6">
            <!-- Основные цвета -->
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="colorItem in brandSettings.colors" :key="colorItem.id" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ colorItem.name }}</label>
                    <p class="text-xs text-gray-500 mb-3">{{ colorItem.description }}</p>
                  </div>
                  
                  <!-- Цветовой пикер -->
                  <UColorPicker
                    v-model="colorItem.color"
                    size="lg"
                    :throttle="100"
                    format="hex"
                  />
                  
                  <!-- Превью цвета -->
                  <div class="flex items-center space-x-3">
                    <div 
                      class="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                      :style="{ backgroundColor: colorItem.color }"
                    />
                    <div class="flex-1">
                      <div class="text-sm font-mono text-gray-600">{{ colorItem.color }}</div>
                      <div class="text-xs text-gray-400">HEX код</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Предпросмотр бренда -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Предпросмотр бренда</h2>
          </template>
          
          <div class="space-y-4">
            <!-- Логотип/название -->
            <div class="p-6 rounded-lg" :style="{ backgroundColor: getColor(3) }">
              <h3 class="text-2xl font-bold" :style="{ color: getColor(0) }">
                Ваш Бренд
              </h3>
            </div>
            
            <!-- Кнопки -->
            <div class="flex space-x-3">
              <button 
                class="px-4 py-2 rounded-lg text-white font-medium"
                :style="{ backgroundColor: getColor(0) }"
              >
                Основная кнопка
              </button>
              <button 
                class="px-4 py-2 rounded-lg border-2 font-medium"
                :style="{ 
                  borderColor: getColor(0),
                  color: getColor(0)
                }"
              >
                Вторичная кнопка
              </button>
            </div>
            
            <!-- Цветовая палитра -->
            <div class="grid grid-cols-5 gap-2">
              <div 
                v-for="colorItem in brandSettings.colors" 
                :key="colorItem.id"
                class="h-16 rounded-lg border border-gray-200"
                :style="{ backgroundColor: colorItem.color }"
                :title="colorItem.name"
              />
            </div>
            
            <!-- Быстрый выбор цвета -->
            <div class="pt-4 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Быстрый выбор цвета</h3>
              <div class="flex space-x-2">
                <UPopover v-for="colorItem in brandSettings.colors" :key="colorItem.id">
                  <UButton 
                    :label="colorItem.name" 
                    color="neutral" 
                    variant="outline"
                    size="sm"
                  >
                    <template #leading>
                      <span 
                        class="size-3 rounded-full" 
                        :style="{ backgroundColor: colorItem.color }"
                      />
                    </template>
                  </UButton>
                  
                  <template #content>
                    <div class="p-4">
                      <UColorPicker 
                        v-model="colorItem.color" 
                        size="md"
                        format="hex"
                      />
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>
          </div>
        </UCard>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const settingsStore = useSettingsStore()
const { brandSettings } = storeToRefs(settingsStore)

// Загрузка настроек бренда при монтировании
onMounted(async () => {
  await settingsStore.loadBrandSettings()
})

// Автосохранение при изменении цветов
let saveTimeout: NodeJS.Timeout | null = null
watch(() => brandSettings.value.colors, async () => {
  // Небольшая задержка для debounce
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = setTimeout(async () => {
    await settingsStore.saveBrandSettings()
  }, 1000)
}, { deep: true })

const getColor = (index: number) => {
  return brandSettings.value?.colors?.[index]?.color || '#000000'
}
</script>
