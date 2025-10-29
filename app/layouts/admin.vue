<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-2">
          <UNavigationMenu
            :collapsed="collapsed"
            :items="items[1]"
            orientation="vertical"
          />
          
          <!-- Кнопка выхода -->
          <UButton
            :label="collapsed ? '' : 'Выход'"
            icon="i-lucide-log-out"
            color="error"
            variant="ghost"
            size="sm"
            block
            class="mt-2"
            @click="handleLogout"
          />
        </div>
      </template>

    </UDashboardSidebar>

    <div class="flex-1 overflow-y-auto p-8">
      <slot />
    </div>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Store аутентификации
const authStore = useAuthStore()
const { userName } = storeToRefs(authStore)

// Обработчик выхода
const handleLogout = async () => {
  // Показываем подтверждение выхода
  const confirmed = confirm('Вы уверены, что хотите выйти из системы?')
  
  if (confirmed) {
    // Очищаем все данные аутентификации
    authStore.logout()
    
    // Редиректим на главную страницу
    await navigateTo('/')
  }
}

const items: NavigationMenuItem[][] = [[
{
  label: 'Настройки бренда',
  icon: 'i-lucide-settings',
  to: '/admin',
},
{
  label: 'Игры',
  icon: 'i-lucide-gamepad',
  defaultOpen: true,
  children: [
    {
      label: 'Лучник',
      icon: 'i-lucide-target',
      defaultOpen: true,
      collapsed: true,
      children: [
        {
          label: 'Настройки',
          to: '/admin/archer/settings',
        }, {
          label: 'Промокоды',
          to: '/admin/archer/promo'
        },
        {
          label: 'Статистика',
          to: '/admin/archer/statistics'
        }]
    }]
}],
[{
  label: userName.value || 'Профиль',
  icon: 'i-lucide-user',
  to: '/admin/profile'
}]]
</script>