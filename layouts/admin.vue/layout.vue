<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="adminUser.name"
        :subtitle="adminUser.email"
        nav
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          :to="item.to"
          :active="currentRoute === item.to"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Админ панель Brand Games</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-4"></v-breadcrumbs>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const rail = ref(false)
const route = useRoute()

const adminUser = ref({
  name: 'Администратор',
  email: 'admin@brandgames.com'
})

const menuItems = [
  { title: 'Дашборд', icon: 'mdi-view-dashboard', to: '/admin', value: 'dashboard' },
  { title: 'Бренды', icon: 'mdi-tag', to: '/admin/brands', value: 'brands' },
  { title: 'Настройки брендинга', icon: 'mdi-palette', to: '/admin/brand-settings', value: 'brand-settings' },
  { title: 'Настройки игры', icon: 'mdi-gamepad-variant', to: '/admin/game-settings', value: 'game-settings' },
  { title: 'Призы', icon: 'mdi-gift', to: '/admin/prizes', value: 'prizes' },
  { title: 'Аналитика', icon: 'mdi-chart-line', to: '/admin/analytics', value: 'analytics' },
  { title: 'Отчеты', icon: 'mdi-file-chart', to: '/admin/reports', value: 'reports' },
  { title: 'Промокоды', icon: 'mdi-ticket-percent', to: '/admin/promo-codes', value: 'promo-codes' }
]

const currentRoute = computed(() => route.path)

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ title: 'Админ панель', disabled: false, href: '/admin' }]
  
  pathSegments.forEach((segment, index) => {
    if (segment !== 'admin') {
      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
      items.push({
        title,
        disabled: index === pathSegments.length - 1,
        href: index === pathSegments.length - 1 ? undefined : `/${pathSegments.slice(0, index + 2).join('/')}`
      })
    }
  })
  
  return items
})

const logout = () => {
  // Логика выхода
  navigateTo('/admin/login')
}
</script>

