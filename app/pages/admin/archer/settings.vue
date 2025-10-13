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

        <!-- Параметры игры -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Параметры игры</h2>
          </template>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Количество подарков</label>
              <UInput
                v-model.number="gameSettings.prizesCount"
                type="number"
                min="1"
                max="10"
                class="w-32"
                @update:model-value="(value: number) => settingsStore.updatePrizesCount(value)"
              />
              <p class="text-xs text-gray-500">От 1 до 10 подарков</p>
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
        <ArcherGame />
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
const { brandSettings, gameSettings } = storeToRefs(settingsStore)

// Преобразование цветов бренд-бука в формат для USelect
const colorOptions = computed(() => {
  return brandSettings.value?.colors?.map((color) => ({
    label: color.name,
    value: color.color,
    brandColorId: color.id
  })) || []
})
</script>
