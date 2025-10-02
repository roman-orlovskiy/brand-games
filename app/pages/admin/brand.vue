<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройка бренда</h1>
      <p class="text-gray-600 mt-1">Настройте внешний вид игры под ваш бренд</p>
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
              <h3 class="text-sm font-medium text-gray-700 mb-3">Основные цвета</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Основной цвет</label>
                  <UInput
                    v-model="brandSettings.primaryColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Вторичный цвет</label>
                  <UInput
                    v-model="brandSettings.secondaryColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Акцентный цвет</label>
                  <UInput
                    v-model="brandSettings.accentColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Фоновый цвет</label>
                  <UInput
                    v-model="brandSettings.backgroundColor"
                    type="color"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <!-- Цвета мишени -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">Цвета мишени</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Центральная зона</label>
                  <UInput
                    v-model="brandSettings.targetCenterColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Средняя зона</label>
                  <UInput
                    v-model="brandSettings.targetMiddleColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Внешняя зона</label>
                  <UInput
                    v-model="brandSettings.targetOuterColor"
                    type="color"
                    size="sm"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs text-gray-600">Цвет стрелы</label>
                  <UInput
                    v-model="brandSettings.arrowColor"
                    type="color"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Логотип и изображения -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Логотип и изображения</h2>
          </template>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Логотип</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UIcon name="i-lucide-upload" class="mx-auto h-12 w-12 text-gray-400" />
                <div class="mt-2">
                  <UButton variant="outline" size="sm">Загрузить логотип</UButton>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG до 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Фоновое изображение</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UIcon name="i-lucide-image" class="mx-auto h-12 w-12 text-gray-400" />
                <div class="mt-2">
                  <UButton variant="outline" size="sm">Загрузить фон</UButton>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG до 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Дополнительные настройки -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Дополнительные настройки</h2>
          </template>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">Анимации</label>
                <p class="text-xs text-gray-500">Включить анимации в игре</p>
              </div>
              <UToggle v-model="brandSettings.enableAnimations" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">Звуковые эффекты</label>
                <p class="text-xs text-gray-500">Включить звуки в игре</p>
              </div>
              <UToggle v-model="brandSettings.enableSounds" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Шрифт</label>
              <USelect
                v-model="brandSettings.fontFamily"
                :options="fontOptions"
                placeholder="Выберите шрифт"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Стиль границ</label>
              <USelect
                v-model="brandSettings.borderStyle"
                :options="borderOptions"
                placeholder="Выберите стиль"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Предпросмотр -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Предпросмотр</h2>
          </template>

          <div class="space-y-4">
            <!-- Мини-игра для предпросмотра -->
            <div class="relative bg-gray-100 rounded-lg p-4 min-h-[200px]">
              <div class="text-center text-xs text-gray-500 mb-4">
                Предпросмотр игры
              </div>
              
              <!-- Простая мишень для предпросмотра -->
              <div class="flex justify-center">
                <div class="relative">
                  <!-- Внешняя зона -->
                  <div 
                    class="w-16 h-16 rounded-full border-4"
                    :style="{ 
                      backgroundColor: brandSettings.targetOuterColor,
                      borderColor: brandSettings.primaryColor 
                    }"
                  ></div>
                  <!-- Средняя зона -->
                  <div 
                    class="absolute top-2 left-2 w-12 h-12 rounded-full border-4"
                    :style="{ 
                      backgroundColor: brandSettings.targetMiddleColor,
                      borderColor: brandSettings.secondaryColor 
                    }"
                  ></div>
                  <!-- Центральная зона -->
                  <div 
                    class="absolute top-4 left-4 w-8 h-8 rounded-full"
                    :style="{ backgroundColor: brandSettings.targetCenterColor }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="space-y-2">
              <UButton 
                block 
                color="primary"
                @click="saveSettings"
                :loading="isSaving"
              >
                Сохранить настройки
              </UButton>
              <UButton 
                block 
                variant="outline"
                @click="resetSettings"
              >
                Сбросить
              </UButton>
              <UButton 
                block 
                variant="ghost"
                @click="previewGame"
              >
                Предпросмотр игры
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Готовые палитры -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Готовые палитры</h2>
          </template>

          <div class="space-y-3">
            <div 
              v-for="palette in presetPalettes" 
              :key="palette.name"
              class="flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-gray-50"
              @click="applyPalette(palette)"
            >
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: palette.colors.primary }"
                  ></div>
                  <div 
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: palette.colors.secondary }"
                  ></div>
                  <div 
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: palette.colors.accent }"
                  ></div>
                </div>
                <span class="text-sm font-medium">{{ palette.name }}</span>
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400" />
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

// Состояние настроек бренда
const brandSettings = ref({
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
  backgroundColor: '#f8fafc',
  targetCenterColor: '#ef4444',
  targetMiddleColor: '#f97316',
  targetOuterColor: '#eab308',
  arrowColor: '#374151',
  enableAnimations: true,
  enableSounds: true,
  fontFamily: 'Inter',
  borderStyle: 'rounded'
})

const isSaving = ref(false)

// Опции для селектов
const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Montserrat', value: 'Montserrat' }
]

const borderOptions = [
  { label: 'Скругленные', value: 'rounded' },
  { label: 'Прямые', value: 'square' },
  { label: 'Острые', value: 'sharp' }
]

// Готовые цветовые палитры
const presetPalettes = [
  {
    name: 'Синий океан',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#f0f9ff'
    }
  },
  {
    name: 'Лесная зелень',
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: '#f0fdf4'
    }
  },
  {
    name: 'Закат',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#f59e0b',
      background: '#fff7ed'
    }
  },
  {
    name: 'Фиолетовый',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a855f7',
      background: '#faf5ff'
    }
  }
]

// Методы
const saveSettings = async () => {
  isSaving.value = true
  try {
    // Здесь будет API вызов для сохранения настроек
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Настройки сохранены:', brandSettings.value)
    // Показать уведомление об успехе
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    // Показать уведомление об ошибке
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  brandSettings.value = {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    targetCenterColor: '#ef4444',
    targetMiddleColor: '#f97316',
    targetOuterColor: '#eab308',
    arrowColor: '#374151',
    enableAnimations: true,
    enableSounds: true,
    fontFamily: 'Inter',
    borderStyle: 'rounded'
  }
}

const applyPalette = (palette: typeof presetPalettes[0]) => {
  brandSettings.value.primaryColor = palette.colors.primary
  brandSettings.value.secondaryColor = palette.colors.secondary
  brandSettings.value.accentColor = palette.colors.accent
  brandSettings.value.backgroundColor = palette.colors.background
}

const previewGame = () => {
  // Открыть предпросмотр игры в новом окне
  window.open('/game-preview', '_blank')
}
</script>
