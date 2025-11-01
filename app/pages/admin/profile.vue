<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Профиль</h1>
      <p class="text-gray-600 mt-1">Информация о вашем аккаунте</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Личная информация -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Личная информация</h2>
        </template>

        <UForm 
          :state="profileForm" 
          class="space-y-4"
          @submit="handleUpdateProfile"
        >
          <UFormField 
            label="Имя" 
            name="name"
          >
            <UInput 
              v-model="profileForm.name" 
              placeholder="Введите ваше имя"
              class="w-full"
            />
          </UFormField>
          
          <UFormField 
            label="Email" 
            name="email"
          >
            <UInput 
              :model-value="userEmail" 
              disabled 
              class="w-full" 
            />
          </UFormField>

          <UFormField 
            label="Название компании" 
            name="companyName"
          >
            <UInput 
              v-model="profileForm.companyName" 
              placeholder="Введите название компании"
              class="w-full"
            />
          </UFormField>
          
          <UFormField 
            label="Дата регистрации" 
            name="createdAt"
          >
            <UInput 
              :model-value="registrationDate" 
              disabled 
              class="w-full" 
            />
          </UFormField>

          <UAlert 
            v-if="profileError" 
            color="red" 
            variant="soft"
            class="mt-4"
          >
            {{ profileError }}
          </UAlert>

          <UAlert 
            v-if="profileSuccess" 
            color="green" 
            variant="soft"
            class="mt-4"
          >
            Профиль успешно обновлен
          </UAlert>

          <UButton 
            type="submit" 
            :loading="isProfileLoading"
            class="cursor-pointer"
          >
            Сохранить изменения
          </UButton>
        </UForm>
      </UCard>

      <!-- Смена пароля -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Смена пароля</h2>
        </template>

        <UForm 
          :state="passwordForm" 
          class="space-y-4"
          @submit="handleChangePassword"
        >
          <UFormField 
            label="Текущий пароль" 
            name="oldPassword"
          >
            <UInput 
              v-model="passwordForm.oldPassword" 
              type="password"
              placeholder="Введите текущий пароль"
              class="w-full"
            />
          </UFormField>

          <UFormField 
            label="Новый пароль" 
            name="newPassword"
          >
            <UInput 
              v-model="passwordForm.newPassword" 
              type="password"
              placeholder="Введите новый пароль"
              class="w-full"
            />
          </UFormField>

          <UFormField 
            label="Подтверждение нового пароля" 
            name="confirmPassword"
          >
            <UInput 
              v-model="passwordForm.confirmPassword" 
              type="password"
              placeholder="Подтвердите новый пароль"
              class="w-full"
            />
          </UFormField>

          <UAlert 
            v-if="passwordError" 
            color="red" 
            variant="soft"
            class="mt-4"
          >
            {{ passwordError }}
          </UAlert>

          <UAlert 
            v-if="passwordSuccess" 
            color="green" 
            variant="soft"
            class="mt-4"
          >
            Пароль успешно изменен
          </UAlert>

          <UButton 
            type="submit" 
            :loading="isPasswordLoading"
            class="cursor-pointer"
          >
            Изменить пароль
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// Store аутентификации
const authStore = useAuthStore()
const { userName, userEmail, user } = storeToRefs(authStore)

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// Загрузка данных профиля при монтировании
onMounted(async () => {
  await loadProfile()
})

// Загрузка профиля из API
const loadProfile = async () => {
  try {
    const response = await $fetch<{ user: any }>('/api/admin/profile')
    authStore.user = response.user
    if (response.user) {
      profileForm.name = response.user.name
      profileForm.companyName = response.user.companyName || ''
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  }
}

// Форма профиля
const profileForm = reactive({
  name: '',
  companyName: ''
})

const isProfileLoading = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref(false)

// Обработчик обновления профиля
const handleUpdateProfile = async (event: FormSubmitEvent<any>) => {
  isProfileLoading.value = true
  profileError.value = null
  profileSuccess.value = false

  try {
    const response = await $fetch<{ user: any }>('/api/admin/profile', {
      method: 'PUT',
      body: {
        name: profileForm.name,
        companyName: profileForm.companyName || null
      }
    })
    
    authStore.user = response.user
    profileSuccess.value = true
    
    // Скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
  } catch (err: any) {
    profileError.value = err.data?.message || err.message || 'Ошибка при обновлении профиля'
  } finally {
    isProfileLoading.value = false
  }
}

// Форма смены пароля
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isPasswordLoading = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

// Обработчик смены пароля
const handleChangePassword = async (event: FormSubmitEvent<any>) => {
  isPasswordLoading.value = true
  passwordError.value = null
  passwordSuccess.value = false

  // Валидация на клиенте
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Пароли не совпадают'
    isPasswordLoading.value = false
    return
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'Пароль должен содержать минимум 6 символов'
    isPasswordLoading.value = false
    return
  }

  try {
    await $fetch('/api/admin/profile/change-password', {
      method: 'POST',
      body: {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }
    })
    
    passwordSuccess.value = true
    
    // Очищаем форму
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      passwordSuccess.value = false
    }, 3000)
  } catch (err: any) {
    passwordError.value = err.data?.message || err.message || 'Ошибка при изменении пароля'
  } finally {
    isPasswordLoading.value = false
  }
}

// Форматированная дата регистрации
const registrationDate = computed(() => {
  if (user.value?.createdAt) {
    return new Date(user.value.createdAt).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return 'Неизвестно'
})
</script>
