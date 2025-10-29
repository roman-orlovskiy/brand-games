<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <div class="auth-page__card">
        <div class="auth-page__header">
          <h1 class="auth-page__title">Регистрация</h1>
          <p class="auth-page__subtitle">Создайте новый аккаунт для доступа к админ-панели</p>
        </div>

        <UForm 
          :state="form" 
          :schema="schema" 
          @submit="handleRegister"
          class="auth-page__form"
        >
          <UFormField 
            label="Имя" 
            name="name"
            class="auth-page__field"
          >
            <UInput 
              v-model="form.name" 
              type="text" 
              placeholder="Введите ваше имя"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField 
            label="Email" 
            name="email"
            class="auth-page__field"
          >
            <UInput 
              v-model="form.email" 
              type="email" 
              placeholder="Введите ваш email"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField 
            label="Пароль" 
            name="password"
            class="auth-page__field"
          >
            <UInput 
              v-model="form.password" 
              type="password" 
              placeholder="Введите пароль"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField 
            label="Подтверждение пароля" 
            name="confirmPassword"
            class="auth-page__field"
          >
            <UInput 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="Подтвердите пароль"
              :disabled="isLoading"
              class="w-full"
            />
          </UFormField>

          <UAlert 
            v-if="error" 
            color="red" 
            variant="soft"
            class="auth-page__alert"
          >
            {{ error }}
          </UAlert>

          <UButton 
            type="submit" 
            :loading="isLoading"
            :disabled="isLoading"
            class="auth-page__submit"
            size="lg"
            block
          >
            Зарегистрироваться
          </UButton>
        </UForm>

        <div class="auth-page__footer">
          <p class="auth-page__text">
            Уже есть аккаунт? 
            <NuxtLink to="/login" class="auth-page__link">
              Войти
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// Мета-данные страницы
definePageMeta({
  layout: false,
  title: 'Регистрация'
})

// Схема валидации
const schema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

type Schema = z.output<typeof schema>

// Состояние формы
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Store аутентификации
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

// Обработчик отправки формы
const handleRegister = async (event: FormSubmitEvent<Schema>) => {
  const success = await authStore.register({
    name: event.data.name,
    email: event.data.email,
    password: event.data.password,
    confirmPassword: event.data.confirmPassword
  })

  if (success) {
    await navigateTo('/admin')
  }
}

// Очистка ошибки при изменении полей
watch(form, () => {
  if (error.value) {
    authStore.clearError()
  }
})
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;

  &__container {
    width: 100%;
    max-width: 400px;
  }

  &__card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    color: #6b7280;
    margin: 0;
  }

  &__form {
    margin-bottom: 1.5rem;
  }

  &__field {
    margin-bottom: 1rem;
  }

  &__alert {
    margin-bottom: 1rem;
  }

  &__submit {
    margin-top: 1rem;
  }

  &__footer {
    text-align: center;
    margin-bottom: 1rem;
  }

  &__text {
    color: #6b7280;
    margin: 0;
  }

  &__link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
