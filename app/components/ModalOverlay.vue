<template>
  <div class="modal-overlay">
    <div class="modal-overlay__backdrop" />
    <div class="modal-overlay__content">
      <div class="modal-header">
        <h2 class="modal-title">{{ gameSettings.formSettings?.titleText || 'Итоги игры' }}</h2>
        <p
          v-if="!isSuccess"
          class="modal-subtitle"
          v-html="gameSettings.formSettings?.descriptionText"
        />
        <p
          v-else
          class="modal-subtitle"
          v-html="gameSettings.formSettings?.discountDescription"
        />
      </div>
      
      <!-- Форма ввода данных -->
      <UForm 
        v-if="!isSuccess"
        :state="formState" 
        class="contact-form"
        @submit="handleSubmit"
      >
        <div class="form-row">
          <UFormField 
            label="Имя" 
            :error="errors.firstName"
            class="form-group"
          >
            <UInput
              v-model="formState.firstName" 
              name="firstName"
              placeholder="Введите ваше имя"
              size="lg"
              @input="clearFieldError('firstName')"
            />
          </UFormField>
          
          <UFormField 
            label="Фамилия" 
            :error="errors.lastName"
            class="form-group"
          >
            <UInput 
              v-model="formState.lastName" 
              name="lastName"
              placeholder="Введите вашу фамилию"
              size="lg"
              @input="clearFieldError('lastName')"
            />
          </UFormField>
        </div>
        
        <div class="form-row">
          <UFormField 
            label="Телефон" 
            :error="errors.phone"
            class="form-group"
          >
             <UInput 
               v-model="formState.phone" 
               v-maska="'+7 (###) ###-##-##'"
               name="phone"
               placeholder="+7 (___) ___-__-__"
               size="lg"
               @input="clearFieldError('phone')"
             />
          </UFormField>
          
          <UFormField 
            label="Email" 
            :error="errors.email"
            class="form-group"
          >
            <UInput 
              v-model="formState.email" 
              type="email"
              name="email"
              placeholder="Введите ваш email"
              size="lg"
              @input="clearFieldError('email')"
            />
          </UFormField>
        </div>
        
        <div class="form-actions">
          <UButton 
            type="submit" 
            size="lg"
            :loading="isSubmitting"
            class="submit-button cursor-pointer"
            :style="{ 
              backgroundColor: gameSettings.formSettings?.submitButtonColor || '#00BCD4',
              borderColor: gameSettings.formSettings?.submitButtonColor || '#00BCD4',
              color: 'white'
            }"
          >
            {{ gameSettings.formSettings?.buttonText || 'Получить промокод' }}
          </UButton>
        </div>
      </UForm>

      <!-- Промокод -->
      <div v-else class="promo-section">
        <div class="promo-code-container">
          <UInput
            v-model="promoCode"
            readonly
            size="lg"
            class="promo-input"
            :ui="{ trailing: 'pr-0.5' }"
            @click="handleInputClick"
          >
            <template #trailing>
              <UTooltip text="Скопировать промокод" :content="{ side: 'right' }">
                <UButton
                  :color="copied ? 'success' : 'neutral'"
                  variant="link"
                  size="sm"
                  :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                  aria-label="Скопировать промокод"
                  @click="copy(promoCode || defaultPromoCode)"
                />
              </UTooltip>
            </template>
          </UInput>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { vMaska } from 'maska/vue'
import { useClipboard } from '@vueuse/core'
import { useSettingsStore } from '~/stores/settings'
import { storeToRefs } from 'pinia'

// Пропсы
interface Props {
  collectedGifts?: Array<{ discount: number; imageUrl?: string; name?: string }>
}

const props = withDefaults(defineProps<Props>(), {
  collectedGifts: () => []
})

// Получаем настройки из store
const settingsStore = useSettingsStore()
const { gameSettings } = storeToRefs(settingsStore)

// Состояние формы
const formState = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

// Ошибки валидации
const errors = reactive({
  firstName: undefined as string | undefined,
  lastName: undefined as string | undefined,
  phone: undefined as string | undefined,
  email: undefined as string | undefined
})

// Состояние отправки
const isSubmitting = ref(false)

// Состояние успешной отправки
const isSuccess = ref(false)

// Функция генерации промокода из подарка
const generatePromoCodeFromGift = (gift: { discount: number; imageUrl?: string; name?: string }) => {
  // Генерируем промокод на основе названия подарка
  if (gift.name) {
    // Убираем пробелы и приводим к верхнему регистру
    const cleanName = gift.name.toUpperCase()
    return cleanName
  }
}

// Получаем дефолтный промокод из настроек
const defaultPromoCode = computed(() => {
  return gameSettings.value.formSettings?.defaultPromoCode || 'BRAND2025'
})

// Генерация промокода на основе сбитых подарков
const promoCode = computed(() => {
  if (!props.collectedGifts || props.collectedGifts.length === 0) {
    return defaultPromoCode.value // Дефолтный промокод, если подарков нет
  }

  // Если режим максимальной скидки, берем промокод из подарка с максимальной скидкой
  if (gameSettings.value.discountMode === 'max') {
    const maxDiscountGift = props.collectedGifts.reduce((max, gift) => 
      gift.discount > max.discount ? gift : max
    )

    return generatePromoCodeFromGift(maxDiscountGift)
  }

  return defaultPromoCode.value
})

// Функционал копирования
const { copy, copied } = useClipboard()

// Функция для конвертации hex в rgb
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result && result[1] && result[2] && result[3]) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }
  return '0, 0, 0'
}

// Очистка ошибок при изменении полей
const clearFieldError = (fieldName: keyof typeof errors) => {
  if (errors[fieldName]) {
    errors[fieldName] = undefined
  }
}

// Обработка клика по инпуту с промокодом
const handleInputClick = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    // Выделяем весь текст
    target.select()
    target.setSelectionRange(0, target.value.length)
    
    // Копируем в буфер обмена
    await copy(promoCode.value || defaultPromoCode.value)
  }
}

// Валидация формы
const validateForm = () => {
  // Очищаем предыдущие ошибки
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = undefined
  })
  
  let isValid = true
  
  if (!formState.firstName.trim()) {
    errors.firstName = 'Введите имя'
    isValid = false
  }
  
  if (!formState.lastName.trim()) {
    errors.lastName = 'Введите фамилию'
    isValid = false
  }
  
  if (!formState.phone.trim()) {
    errors.phone = 'Введите телефон'
    isValid = false
  } else if (formState.phone.length < 18) {
    errors.phone = 'Введите корректный номер телефона'
    isValid = false
  }
  
  if (!formState.email.trim()) {
    errors.email = 'Введите email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }
  
  return isValid
}

// Обработчик отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Здесь будет логика отправки данных на сервер
    console.log('Отправка данных:', formState)
    
    // Имитация запроса
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Показываем промокод вместо alert
    isSuccess.value = true
    
  } catch (error) {
    console.error('Ошибка при отправке формы:', error)
    alert('Произошла ошибка. Попробуйте еще раз.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 5000;
  font-size: 1rem;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: v-bind('`rgba(${hexToRgb(gameSettings.formSettings?.overlayBackgroundColor || "#C27BA0")}, 0.6)`');
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 32em;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.75em;
    padding: 1.5em;
    text-align: center;
    box-shadow: 0 0.5em 2em rgba(0, 0, 0, 0.15);
    
    /* Адаптивность для маленьких экранов */
    @media (max-width: 480px) {
      width: 95%;
      padding: 1em;
      font-size: 0.9rem;
    }
    
    @media (max-width: 360px) {
      font-size: 0.8rem;
    }
  }
}

.modal-header {
  margin-bottom: 1.5em;
  
  .modal-title {
    color: #111;
    font-size: 1.5em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    line-height: 1.2;
  }
  
  .modal-subtitle {
    color: #666;
    font-size: 0.9em;
    font-weight: 400;
    margin: 0;
    line-height: 1.4;
  }
}

.contact-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1em;

  .form-row {
    display: flex;
    justify-content: center;
    gap: 1em;
  }
  
  
  .form-actions {
    margin-top: 0.5em;
    text-align: center;
    
    .submit-button {
      width: 100%;
      min-height: 2.5em;
      font-size: 1em;
      font-weight: 600;
      cursor: pointer !important;
      
      /* Переопределяем стили UButton для кастомного цвета */
      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

.promo-section {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  text-align: center;
  
  .promo-code-container {
    .promo-input {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      font-size: 1.1em;
      text-align: center;
      letter-spacing: 0.1em;
      cursor: pointer;
      user-select: all;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      &:focus {
        outline: none;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

/* Адаптивность для очень маленьких экранов */
@media (max-width: 320px) {
  .modal-overlay {
    font-size: 0.75rem;
    
    &__content {
      width: 98%;
      padding: 0.75em;
    }
  }
  
  .contact-form {
    .form-row {
      gap: 0.5em;
    }
    
    .form-group {
      margin-bottom: 0.75em;
    }
  }
}

/* Адаптивность для больших экранов */
@media (min-width: 1200px) {
  .modal-overlay {
    font-size: 1.1rem;
    
    &__content {
      max-width: 36em;
    }
  }
}

@media (min-width: 1600px) {
  .modal-overlay {
    font-size: 1.2rem;
    
    &__content {
      max-width: 40em;
    }
  }
}
</style>


