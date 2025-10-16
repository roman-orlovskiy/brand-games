<template>
  <div class="space-y-4">
    <!-- Загруженный логотип -->
    <div v-if="logoUrl" class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-700">Текущий логотип</h3>
        <UButton
          color="red"
          variant="soft"
          size="sm"
          icon="i-heroicons-trash"
          @click="removeLogo"
        >
          Удалить
        </UButton>
      </div>
      
      <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div class="flex items-center justify-center">
          <img
            :src="logoUrl"
            alt="Логотип"
            class="max-h-20 max-w-full object-contain"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <!-- Загрузка нового логотипа -->
    <div class="space-y-3">
      <h3 class="text-sm font-medium text-gray-700">
        {{ logoUrl ? 'Заменить логотип' : 'Загрузить логотип' }}
      </h3>
      
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        :class="{ 'border-primary-500 bg-primary-50': isDragOver }"
        @click="triggerFileInput"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <div class="space-y-2">
          <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400 mx-auto" />
          <div class="text-sm text-gray-600">
            <span class="font-medium">Нажмите для выбора файла</span>
            <br>
            или перетащите изображение сюда
          </div>
          <div class="text-xs text-gray-500">
            Поддерживаются: PNG, JPG, SVG (макс. 2MB)
          </div>
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Ошибки -->
    <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { gameSettings } = storeToRefs(settingsStore)

const fileInputRef = ref<HTMLInputElement>()
const isDragOver = ref(false)
const error = ref('')

const logoUrl = computed(() => gameSettings.value.logoUrl)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  error.value = ''
  
  // Проверка типа файла
  const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Неподдерживаемый формат файла. Используйте PNG, JPG или SVG.'
    return
  }
  
  // Проверка размера файла (2MB)
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Файл слишком большой. Максимальный размер: 2MB.'
    return
  }
  
  // Создание URL для предпросмотра
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
      settingsStore.updateLogoUrl(result)
    }
  }
  reader.onerror = () => {
    error.value = 'Ошибка при чтении файла.'
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  settingsStore.removeLogo()
  error.value = ''
}

const handleImageError = () => {
  error.value = 'Ошибка при загрузке изображения.'
}
</script>
