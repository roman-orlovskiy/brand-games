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
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/admin/dashboard',
  active: true
}, {
  label: 'Бренды',
  icon: 'i-lucide-palette',
  defaultOpen: true,
  children: [{
    label: 'Список брендов',
    to: '/admin/brands'
  }, {
    label: 'Настройки брендинга',
    to: '/admin/brands/settings'
  }, {
    label: 'Предпросмотр',
    to: '/admin/brands/preview'
  }]
}, {
  label: 'Игра',
  icon: 'i-lucide-target',
  defaultOpen: true,
  children: [{
    label: 'Настройки игры',
    to: '/admin/game/settings'
  }, {
    label: 'Управление призами',
    to: '/admin/game/prizes'
  }, {
    label: 'Аналитика',
    to: '/admin/game/analytics'
  }, {
    label: 'Отчеты',
    to: '/admin/game/reports'
  }]
}, {
  label: 'Промокоды',
  icon: 'i-lucide-ticket',
  defaultOpen: true,
  children: [{
    label: 'Управление',
    to: '/admin/promo/manage'
  }, {
    label: 'Генератор',
    to: '/admin/promo/generator'
  }]
}, {
  label: 'Пользователи',
  icon: 'i-lucide-users',
  to: '/admin/users'
}, {
  label: 'Результаты игр',
  icon: 'i-lucide-trophy',
  to: '/admin/results'
}], [{
  label: 'Настройки',
  icon: 'i-lucide-settings',
  to: '/admin/settings'
}, {
  label: 'Профиль',
  icon: 'i-lucide-user',
  to: '/admin/profile'
}, {
  label: 'Выход',
  icon: 'i-lucide-log-out',
  to: '/admin/logout'
}]]
</script>