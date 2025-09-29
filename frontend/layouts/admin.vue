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
        :title="rail ? '' : 'Админ панель'"
        :subtitle="rail ? '' : 'Brand Games'"
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
          prepend-icon="mdi-view-dashboard"
          title="Главная"
          value="dashboard"
          :to="'/admin'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-gamepad-variant"
          title="Игры"
          value="games"
          :to="'/admin/games'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-gift"
          title="Призы"
          value="prizes"
          :to="'/admin/prizes'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Пользователи"
          value="users"
          :to="'/admin/users'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Статистика"
          value="stats"
          :to="'/admin/stats'"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Настройки"
          value="settings"
          :to="'/admin/settings'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Админ панель - Brand Games</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell" variant="text"></v-btn>
      <v-btn icon="mdi-account" variant="text"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const rail = ref(true)
</script>
