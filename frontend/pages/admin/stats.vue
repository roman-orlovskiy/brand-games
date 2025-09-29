<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Статистика</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Игры по дням
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-2">mdi-chart-line</v-icon>
              <p class="text-grey mt-4">График игр будет здесь</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            Распределение призов
          </v-card-title>
          <v-card-text>
            <div class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-2">mdi-chart-pie</v-icon>
              <p class="text-grey mt-4">Круговая диаграмма будет здесь</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-table</v-icon>
            Детальная статистика
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="statsHeaders"
              :items="statsData"
              class="elevation-1"
            >
              <template v-slot:item.games="{ item }">
                <span class="font-weight-bold">{{ item.games }}</span>
              </template>
              <template v-slot:item.prizes="{ item }">
                <span class="font-weight-bold text-success">{{ item.prizes }}</span>
              </template>
              <template v-slot:item.users="{ item }">
                <span class="font-weight-bold text-info">{{ item.users }}</span>
              </template>
            </v-data-table>
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

const statsHeaders = [
  { title: 'Дата', key: 'date', sortable: true },
  { title: 'Игры', key: 'games', sortable: true },
  { title: 'Призы выдано', key: 'prizes', sortable: true },
  { title: 'Новые пользователи', key: 'users', sortable: true },
  { title: 'Конверсия', key: 'conversion', sortable: true }
]

const statsData = ref([
  { date: '2024-01-15', games: 45, prizes: 12, users: 8, conversion: '26.7%' },
  { date: '2024-01-14', games: 38, prizes: 9, users: 5, conversion: '23.7%' },
  { date: '2024-01-13', games: 52, prizes: 15, users: 12, conversion: '28.8%' },
  { date: '2024-01-12', games: 41, prizes: 11, users: 7, conversion: '26.8%' },
  { date: '2024-01-11', games: 47, prizes: 13, users: 9, conversion: '27.7%' }
])
</script>
