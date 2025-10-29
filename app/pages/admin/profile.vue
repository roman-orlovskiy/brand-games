<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Профиль</h1>
      <p class="text-gray-600 mt-1">Информация о вашем аккаунте</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Личная информация</h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <UInput :model-value="userName" disabled />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput :model-value="userEmail" disabled />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Дата регистрации</label>
            <UInput :model-value="registrationDate" disabled />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Действия</h2>
        </template>

        <div class="space-y-4">
          <UButton 
            color="red" 
            variant="outline" 
            icon="i-lucide-log-out"
            @click="handleLogout"
            block
          >
            Выйти из аккаунта
          </UButton>
          
          <UAlert color="orange" variant="soft">
            <template #title>Внимание</template>
            <p>Изменение пароля и другие настройки аккаунта будут доступны в следующих версиях.</p>
          </UAlert>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Store аутентификации
const authStore = useAuthStore()
const { userName, userEmail, user } = storeToRefs(authStore)

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

// Обработчик выхода
const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/')
}

definePageMeta({
  layout: 'admin'
})
</script>
