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

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[
{
  label: 'Дашборд',
  icon: 'i-lucide-layout-dashboard',
  to: '/admin',
  active: true
},
{
  label: 'Настройка бренда',
  icon: 'i-lucide-palette',
  to: '/admin/brand'
},
{
  label: 'Игра',
  icon: 'i-lucide-target',
  defaultOpen: true,
  children: [{
    label: 'Основные настройки',
    to: '/admin/game/settings'
  }, {
    label: 'Промокоды',
    to: '/admin/game/promo'
  }, {
    label: 'Статистика',
    to: '/admin/game/statistics'
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