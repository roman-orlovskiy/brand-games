<template>
  <div class="modal-overlay">
    <div class="modal-overlay__backdrop" />
    <div class="modal-overlay__content">
      <div class="modal-header">
        <h2 class="modal-title">Итоги игры</h2>
        <p class="modal-subtitle">Чтобы получить промокод заполните контактные данные</p>
      </div>
      
      <UForm 
        :state="formState" 
        class="contact-form"
        @submit="handleSubmit"
      >
        <div class="form-row">
          <UFormGroup 
            label="Имя" 
            name="firstName"
            :error="errors.firstName"
            class="form-group"
          >
            <UInput 
              v-model="formState.firstName" 
              placeholder="Введите ваше имя"
              size="lg"
            />
          </UFormGroup>
          
          <UFormGroup 
            label="Фамилия" 
            name="lastName"
            :error="errors.lastName"
            class="form-group"
          >
            <UInput 
              v-model="formState.lastName" 
              placeholder="Введите вашу фамилию"
              size="lg"
            />
          </UFormGroup>
        </div>
        
        <div class="form-row">
          <UFormGroup 
            label="Телефон" 
            name="phone"
            :error="errors.phone"
            class="form-group"
          >
             <UInput 
               v-model="formState.phone" 
               v-maska="'+7 (###) ###-##-##'"
               placeholder="+7 (___) ___-__-__"
               size="lg"
             />
          </UFormGroup>
          
          <UFormGroup 
            label="Email" 
            name="email"
            :error="errors.email"
            class="form-group"
          >
            <UInput 
              v-model="formState.email" 
              type="email"
              placeholder="Введите ваш email"
              size="lg"
            />
          </UFormGroup>
        </div>
        
        <div class="form-actions">
          <UButton 
            type="submit" 
            size="lg"
            color="primary"
            :loading="isSubmitting"
            class="submit-button cursor-pointer"
          >
            Получить промокод
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { vMaska } from 'maska/vue'

// Состояние формы
const formState = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

// Ошибки валидации
const errors = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

// Состояние отправки
const isSubmitting = ref(false)


// Валидация формы
const validateForm = () => {
  // Очищаем предыдущие ошибки
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!formState.firstName.trim()) {
    errors.firstName = 'Имя обязательно для заполнения'
    isValid = false
  }
  
  if (!formState.lastName.trim()) {
    errors.lastName = 'Фамилия обязательна для заполнения'
    isValid = false
  }
  
  if (!formState.phone.trim()) {
    errors.phone = 'Телефон обязателен для заполнения'
    isValid = false
  } else if (formState.phone.length < 18) {
    errors.phone = 'Введите корректный номер телефона'
    isValid = false
  }
  
  if (!formState.email.trim()) {
    errors.email = 'Email обязателен для заполнения'
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
    
    // После успешной отправки можно закрыть модалку или показать сообщение об успехе
    alert('Промокод отправлен на ваш email!')
    
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
  font-size: 1rem; // Базовый размер для em

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 32em; // Используем em вместо rem
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.75em; // 12px в em
    padding: 1.5em;
    text-align: center;
    box-shadow: 0 0.5em 2em rgba(0, 0, 0, 0.15);
    
    // Адаптивность для маленьких экранов
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
    font-size: 1.5em; // 24px в em
    font-weight: 700;
    margin: 0 0 0.5em 0;
    line-height: 1.2;
  }
  
  .modal-subtitle {
    color: #666;
    font-size: 0.9em; // 14.4px в em
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
      min-height: 2.5em; // 40px в em
      font-size: 1em;
      font-weight: 600;
      cursor: pointer !important;
    }
  }
}

// Адаптивность для очень маленьких экранов
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

// Адаптивность для больших экранов
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


