<template>
  <div class="prize-image-upload">
    <div v-if="!imageUrl" class="upload-area">
      <UButton
        color="info"
        variant="outline"
        icon="i-heroicons-photo"
        size="sm"
        @click="handleFileSelect"
      >
        Загрузить изображение
      </UButton>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
    </div>
    
    <div v-else class="image-preview">
      <img
        :src="imageUrl"
        :alt="prizeName"
        class="preview-image"
      />
      <div class="image-actions">
        <UButton
          color="error"
          variant="outline"
          icon="i-heroicons-trash"
          size="xs"
          @click="removeImage"
        />
        <UButton
          variant="outline"
          icon="i-heroicons-pencil"
          size="xs"
          @click="handleFileSelect"
        />
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  prizeId: string
  prizeName: string
  imageUrl?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'image-uploaded', prizeId: string, imageUrl: string): void
  (e: 'image-removed', prizeId: string): void
}>()

const fileInput = ref<HTMLInputElement>()

const handleFileSelect = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB')
      return
    }
    
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }
    
    // Создаем URL для предпросмотра
    const imageUrl = URL.createObjectURL(file)
    emit('image-uploaded', props.prizeId, imageUrl)
    
    // Очищаем input
    target.value = ''
  }
}

const removeImage = () => {
  emit('image-removed', props.prizeId)
}
</script>

<style scoped lang="scss">
.prize-image-upload {
  .upload-area {
    display: flex;
    align-items: center;
    cursor: pointer;

    button {
      cursor: pointer;
    }
  }
  
  .image-preview {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    
    .preview-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }
    
    .image-actions {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      justify-content: center;

      button {
        cursor: pointer;
      }
    }
  }
}
</style>
