<template>
  <div>
    <v-row class="mt-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 mb-4">Brand Games</h1>
        <p class="text-h5 text-grey-darken-1 mb-8">
          Интерактивные игры с призами и брендингом
        </p>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card class="pa-6 text-center" elevation="4">
          <v-icon size="64" color="primary" class="mb-4">mdi-gamepad-variant</v-icon>
          <h3 class="text-h5 mb-3">Увлекательные игры</h3>
          <p class="text-grey">Играйте в различные мини-игры и выигрывайте призы</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 text-center" elevation="4">
          <v-icon size="64" color="success" class="mb-4">mdi-gift</v-icon>
          <h3 class="text-h5 mb-3">Крутые призы</h3>
          <p class="text-grey">Получайте реальные призы за ваши достижения</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 text-center" elevation="4">
          <v-icon size="64" color="info" class="mb-4">mdi-account-group</v-icon>
          <h3 class="text-h5 mb-3">Сообщество</h3>
          <p class="text-grey">Присоединяйтесь к нашему игровому сообществу</p>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-play"
          class="mr-4"
        >
          Начать игру
        </v-btn>
        <v-btn
          color="secondary"
          size="large"
          prepend-icon="mdi-information"
          variant="outlined"
        >
          Узнать больше
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
// Главная страница приложения
</script>
