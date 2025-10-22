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
              <label class="block text-sm font-medium text-gray-700">Количество выстрелов</label>
              <UInput
                v-model.number="shotsCount"
                type="number"
                min="1"
                max="10"
                class="w-32"
              />
              <p class="text-xs text-gray-500">Сколько выстрелов доступно игроку</p>
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
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Режим скидок</label>
              <USelect
                :model-value="gameSettings.discountMode"
                :items="discountModeOptions"
                placeholder="Выберите режим"
                class="w-64"
                @update:model-value="(value: string) => settingsStore.updateDiscountMode(value as 'sum' | 'max')"
              />
              <p class="text-xs text-gray-500">
                <span v-if="gameSettings.discountMode === 'sum'">Суммировать все скидки сбитых подарков</span>
                <span v-else>Выбирать самую большую скидку из сбитых подарков</span>
              </p>
            </div>
            
            <div class="pt-2">
              <UButton
                color="primary"
                variant="solid"
                icon="i-heroicons-check"
                class="cursor-pointer"
                @click="applyGameSettings"
              >
                Применить изменения
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Настройки формы обратной связи -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Настройки формы обратной связи</h2>
          </template>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Цвет кнопки "Получить промокод"</label>
              <div class="flex items-center space-x-4">
                <USelect
                  :model-value="formSubmitButtonColorId"
                  :items="colorOptions"
                  placeholder="Выберите цвет"
                  value-key="brandColorId"
                  class="w-64"
                  @update:model-value="(value: string) => updateFormButtonColor(value)"
                >
                  <template #leading>
                    <div 
                      class="w-4 h-4 rounded-full border border-gray-300"
                      :style="{ backgroundColor: formSubmitButtonColor }"
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
              <p class="text-xs text-gray-500">Выберите цвет из палитры бренда для кнопки отправки формы</p>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Цвет фона оверлея</label>
              <div class="flex items-center space-x-4">
                <USelect
                  :model-value="formOverlayBackgroundColorId"
                  :items="colorOptions"
                  placeholder="Выберите цвет"
                  value-key="brandColorId"
                  class="w-64"
                  @update:model-value="(value: string) => updateFormOverlayBackgroundColor(value)"
                >
                  <template #leading>
                    <div 
                      class="w-4 h-4 rounded-full border border-gray-300"
                      :style="{ backgroundColor: formOverlayBackgroundColor }"
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
              <p class="text-xs text-gray-500">Выберите цвет из палитры бренда для фона оверлея (прозрачность сохраняется)</p>
            </div>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Заголовок формы</label>
                <UInput
                  v-model="formTitleText"
                  placeholder="Итоги игры"
                />
                <p class="text-xs text-gray-500">Текст заголовка модального окна</p>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Описание формы</label>
                <UTextarea
                  v-model="formDescriptionText"
                  placeholder="Чтобы получить промокод заполните контактные данные"
                  :rows="5"
                />
                <p class="text-xs text-gray-500">Описание под заголовком</p>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Текст кнопки</label>
                <UInput
                  v-model="formButtonText"
                  placeholder="Получить промокод"
                />
                <p class="text-xs text-gray-500">Текст на кнопке отправки формы</p>
              </div>
              
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
              
              <div class="w-32">
                <label class="block text-sm font-medium text-gray-700 mb-1">Изображение</label>
                <PrizeImageUpload
                  :prize-id="prize.id"
                  :prize-name="prize.name"
                  :image-url="prize.imageUrl"
                  @image-uploaded="handleImageUploaded"
                  @image-removed="handleImageRemoved"
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
import { onMounted, watch } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'admin'
})

const settingsStore = useSettingsStore()
  const { brandSettings, gameSettings } = storeToRefs(settingsStore)

// Локальные значения для настроек (без автоприменения, до нажатия кнопки)
const prizesCount = ref(gameSettings.value.prizesCount)
const shotsCount = ref(gameSettings.value.shotsCount)
const badPrizesCount = ref(gameSettings.value.badPrizesCount)
const formSubmitButtonColor = ref(gameSettings.value.formSettings?.submitButtonColor || '#00BCD4')

// ID выбранного цвета для кнопки формы
const formSubmitButtonColorId = ref('main') // По умолчанию основной цвет

// Переменные для цвета фона оверлея
const formOverlayBackgroundColor = ref(gameSettings.value.formSettings?.overlayBackgroundColor || '#C27BA0')
const formOverlayBackgroundColorId = ref('neutral') // По умолчанию нейтральный цвет

// Переменные для текстов формы
const formTitleText = ref(gameSettings.value.formSettings?.titleText || 'Итоги игры')
const formDescriptionText = ref(gameSettings.value.formSettings?.descriptionText || 'Чтобы получить промокод заполните контактные данные')
const formButtonText = ref(gameSettings.value.formSettings?.buttonText || 'Получить промокод')

// Watchers для автоматического обновления store
watch(formTitleText, (newValue) => {
  settingsStore.updateFormTitleText(newValue)
})

watch(formDescriptionText, (newValue) => {
  settingsStore.updateFormDescriptionText(newValue)
})

watch(formButtonText, (newValue) => {
  settingsStore.updateFormButtonText(newValue)
})


// Инициализируем правильный ID при загрузке
onMounted(() => {
  // Инициализация цвета кнопки
  const currentColor = gameSettings.value.formSettings?.submitButtonColor || '#00BCD4'
  const brandColor = brandSettings.value?.colors?.find(color => color.color === currentColor)
  if (brandColor) {
    formSubmitButtonColorId.value = brandColor.id
  }
  
  // Инициализация цвета фона оверлея
  const currentOverlayColor = gameSettings.value.formSettings?.overlayBackgroundColor || '#C27BA0'
  const overlayBrandColor = brandSettings.value?.colors?.find(color => color.color === currentOverlayColor)
  if (overlayBrandColor) {
    formOverlayBackgroundColorId.value = overlayBrandColor.id
  }
})

// Функция обновления цвета кнопки формы
const updateFormButtonColor = (brandColorId: string) => {
  formSubmitButtonColorId.value = brandColorId
  const brandColor = brandSettings.value?.colors?.find(color => color.id === brandColorId)
  if (brandColor) {
    formSubmitButtonColor.value = brandColor.color
    settingsStore.updateFormSubmitButtonColor(brandColor.color)
  }
}

// Функция обновления цвета фона оверлея
const updateFormOverlayBackgroundColor = (brandColorId: string) => {
  formOverlayBackgroundColorId.value = brandColorId
  const brandColor = brandSettings.value?.colors?.find(color => color.id === brandColorId)
  if (brandColor) {
    formOverlayBackgroundColor.value = brandColor.color
    settingsStore.updateFormOverlayBackgroundColor(brandColor.color)
  }
}

// Функция применения изменений (вызывается из reloadGame)
const applyChanges = () => {
  settingsStore.updatePrizesCount(prizesCount.value)
  settingsStore.updateShotsCount(shotsCount.value)
  settingsStore.updateBadPrizesCount(badPrizesCount.value)
  settingsStore.updateFormSubmitButtonColor(formSubmitButtonColor.value)
  settingsStore.updateFormOverlayBackgroundColor(formOverlayBackgroundColor.value)
  settingsStore.updateFormTitleText(formTitleText.value)
  settingsStore.updateFormDescriptionText(formDescriptionText.value)
  settingsStore.updateFormButtonText(formButtonText.value)
}

// Функция применения изменений параметров игры
const applyGameSettings = () => {
  // Применяем изменения через стор
  settingsStore.applyGameSettings(prizesCount.value, badPrizesCount.value, shotsCount.value)
  
  // Перезагружаем игру для применения изменений
  reloadGame()
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

// Опции для выбора режима скидок
const discountModeOptions = [
  { label: 'Суммировать скидки', value: 'sum' },
  { label: 'Максимальная скидка', value: 'max' }
]

// Обработчики для загрузки изображений призов
const handleImageUploaded = (prizeId: string, imageUrl: string) => {
  settingsStore.updatePrizeImage(prizeId, imageUrl)
}

const handleImageRemoved = (prizeId: string) => {
  settingsStore.removePrizeImage(prizeId)
}
</script>

<style scoped lang="scss" >
.game-preview {
  width: 100%;
  max-width: 50rem;
}
</style>
