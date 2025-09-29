<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Панель администратора</h1>
        <p class="text-h6 text-grey-darken-1 mb-8">
          Добро пожаловать в админ панель Brand Games
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4" color="primary" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" color="white" class="mb-2">mdi-gamepad-variant</v-icon>
            <div class="text-h4 text-white font-weight-bold">12</div>
            <div class="text-white">Активных игр</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" color="success" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" color="white" class="mb-2">mdi-gift</v-icon>
            <div class="text-h4 text-white font-weight-bold">156</div>
            <div class="text-white">Призов выдано</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" color="info" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" color="white" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 text-white font-weight-bold">2,847</div>
            <div class="text-white">Пользователей</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4" color="warning" variant="flat">
          <v-card-text class="text-center">
            <v-icon size="48" color="white" class="mb-2">mdi-chart-line</v-icon>
            <div class="text-h4 text-white font-weight-bold">98.5%</div>
            <div class="text-white">Успешность</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Статистика за последние 7 дней
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-2">mdi-chart-line</v-icon>
              <p class="text-grey mt-4">График статистики будет здесь</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-clock-outline</v-icon>
            Последние действия
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(action, index) in recentActions"
                :key="index"
                :prepend-icon="action.icon"
                :title="action.title"
                :subtitle="action.time"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-cog</v-icon>
            Быстрые действия
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-btn
                  color="primary"
                  variant="outlined"
                  block
                  prepend-icon="mdi-plus"
                  :to="'/admin/games'"
                >
                  Добавить игру
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  color="success"
                  variant="outlined"
                  block
                  prepend-icon="mdi-gift"
                  :to="'/admin/prizes'"
                >
                  Управление призами
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  color="info"
                  variant="outlined"
                  block
                  prepend-icon="mdi-account-group"
                  :to="'/admin/users'"
                >
                  Пользователи
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  color="warning"
                  variant="outlined"
                  block
                  prepend-icon="mdi-chart-line"
                  :to="'/admin/stats'"
                >
                  Подробная статистика
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const recentActions = ref([
  {
    icon: 'mdi-gamepad-variant',
    title: 'Создана новая игра "Лук и стрелы"',
    time: '2 часа назад'
  },
  {
    icon: 'mdi-gift',
    title: 'Выдан приз пользователю #1234',
    time: '4 часа назад'
  },
  {
    icon: 'mdi-account-plus',
    title: 'Новый пользователь зарегистрирован',
    time: '6 часов назад'
  },
  {
    icon: 'mdi-cog',
    title: 'Обновлены настройки системы',
    time: '1 день назад'
  }
])
</script>
