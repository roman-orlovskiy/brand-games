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
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div v-for="colorItem in gameSettings.colors" :key="colorItem.id" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{ colorItem.name }}</label>
                  <USelect
                    :model-value="colorItem.brandColorId"
                    :items="colorOptions"
                    placeholder="Выберите цвет"
                    value-key="brandColorId"
                    class="w-35"
                    @update:model-value="(value: string) => settingsStore.updateGameColor(colorItem.id, value)"
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

        <!-- Логотип -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Логотип</h2>
          </template>

          <LogoUpload />
        </UCard>

        <!-- Параметры игры -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Параметры игры</h2>
          </template>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Количество подарков</label>
              <UInput
                v-model.number="prizesCount"
                type="number"
                min="1"
                max="10"
                class="w-32"
              />
              <p class="text-xs text-gray-500">От 1 до 10 подарков</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Количество мусора</label>
              <UInput
                v-model.number="badPrizesCount"
                type="number"
                min="0"
                max="5"
                class="w-32"
              />
              <p class="text-xs text-gray-500">От 0 до 5 плохих призов (мусор)</p>
            </div>
          </div>
        </UCard>

        <!-- Список подарков -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Список подарков</h2>
          </template>

          <div class="space-y-4">
            <div 
              v-for="(prize, index) in gameSettings.prizes" 
              :key="prize.id"
              class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex-shrink-0">
                <span class="text-sm font-medium text-gray-500">#{{ index + 1 }}</span>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Название подарка</label>
                <UInput
                  :model-value="prize.name"
                  placeholder="Введите название подарка"
                  @update:model-value="(value: string) => settingsStore.updatePrizeName(prize.id, value)"
                />
              </div>
              
              <div class="w-24">
                <label class="block text-sm font-medium text-gray-700 mb-1">Скидка (%)</label>
                <UInput
                  :model-value="prize.discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="3"
                  @update:model-value="(value: number) => settingsStore.updatePrizeDiscount(prize.id, value)"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Предпросмотр игры -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Предпросмотр игры</h2>
              <UButton
                color="primary"
                variant="soft"
                icon="i-heroicons-arrow-path"
                class="cursor-pointer"
                @click="reloadGame"
              >
                Обновить игру
              </UButton>
            </div>
          </template>

          <div class="game-preview">
            <ArcherGame ref="gameRef" :key="gameKey" />
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
  layout: 'admin'
})

const settingsStore = useSettingsStore()
const { brandSettings, gameSettings } = storeToRefs(settingsStore)

// Локальные значения для количества подарков (без автоматического обновления store)
const prizesCount = ref(gameSettings.value.prizesCount)
const badPrizesCount = ref(gameSettings.value.badPrizesCount)

// Функция применения изменений (вызывается из reloadGame)
const applyChanges = () => {
  settingsStore.updatePrizesCount(prizesCount.value)
  settingsStore.updateBadPrizesCount(badPrizesCount.value)
}

// Ссылка на игровой компонент
const gameRef = ref()

// Ключ для перезагрузки игры
const gameKey = ref(0)

// Функция перезагрузки игры
const reloadGame = () => {
  // Применяем изменения из локальных переменных
  applyChanges()
  
  // Сбрасываем игру перед перезагрузкой
  if (gameRef.value && gameRef.value.resetGame) {
    gameRef.value.resetGame()
  }
  
  // Перезагружаем компонент
  gameKey.value++
}

// Преобразование цветов бренд-бука в формат для USelect
const colorOptions = computed(() => {
  return brandSettings.value?.colors?.map((color) => ({
    label: color.name,
    value: color.color,
    brandColorId: color.id
  })) || []
})
</script>

<style scoped lang="scss" >
.game-preview {
  width: 100%;
  max-width: 50rem;
}
</style>
