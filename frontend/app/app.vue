<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Brand Games</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/admin" color="white" variant="outlined">
        <v-icon class="mr-2">mdi-cog</v-icon>
        Админка
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>
