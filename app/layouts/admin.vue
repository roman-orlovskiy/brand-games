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
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[1]"
          orientation="vertical"
        />
      </template>

    </UDashboardSidebar>

    <div class="flex-1 overflow-y-auto p-8">
      <slot />
    </div>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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
  label: 'Профиль',
  icon: 'i-lucide-user',
  to: '/admin/profile'
},
{
  label: 'Выход',
  icon: 'i-lucide-log-out',
  to: '/admin/logout'
}]]
</script>