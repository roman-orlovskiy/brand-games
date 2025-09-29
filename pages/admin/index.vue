<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Дашборд</h1>
      </v-col>
    </v-row>

    <!-- Статистические карточки -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="primary" size="40" class="mr-4">mdi-account-group</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalUsers }}</div>
                <div class="text-caption text-medium-emphasis">Всего пользователей</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" size="40" class="mr-4">mdi-gamepad-variant</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalGames }}</div>
                <div class="text-caption text-medium-emphasis">Игр сыграно</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="warning" size="40" class="mr-4">mdi-tag</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalBrands }}</div>
                <div class="text-caption text-medium-emphasis">Активных брендов</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="info" size="40" class="mr-4">mdi-ticket-percent</v-icon>
              <div>
                <div class="text-h6">{{ stats.totalPromoCodes }}</div>
                <div class="text-caption text-medium-emphasis">Промокодов выдано</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Графики и таблицы -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Активность по дням</v-card-title>
          <v-card-text>
            <v-chart
              :options="chartOptions"
              style="height: 300px;"
            />
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Топ бренды</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="brand in topBrands"
                :key="brand.id"
                :title="brand.name"
                :subtitle="`${brand.games} игр`"
              >
                <template v-slot:prepend>
                  <v-avatar :color="brand.color" size="small">
                    <span class="text-white">{{ brand.name.charAt(0) }}</span>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Последние действия -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Последние действия</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="activityHeaders"
              :items="recentActivity"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.timestamp="{ item }">
                {{ formatDate(item.timestamp) }}
              </template>
              <template v-slot:item.type="{ item }">
                <v-chip
                  :color="getActivityColor(item.type)"
                  size="small"
                >
                  {{ getActivityLabel(item.type) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// Мок данные
const stats = ref({
  totalUsers: 1250,
  totalGames: 5430,
  totalBrands: 8,
  totalPromoCodes: 2340
})

const topBrands = ref([
  { id: 1, name: 'Coca-Cola', games: 1250, color: 'red' },
  { id: 2, name: 'Pepsi', games: 980, color: 'blue' },
  { id: 3, name: 'Nike', games: 750, color: 'black' },
  { id: 4, name: 'Adidas', games: 620, color: 'green' }
])

const recentActivity = ref([
  { id: 1, type: 'game', description: 'Новая игра завершена', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 2, type: 'brand', description: 'Создан новый бренд "McDonald\'s"', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 3, type: 'promo', description: 'Сгенерирован промокод', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 4, type: 'user', description: 'Новый пользователь зарегистрирован', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 5, type: 'game', description: 'Игра завершена с рекордом', timestamp: new Date(Date.now() - 1000 * 60 * 60) }
])

const activityHeaders = [
  { title: 'Время', key: 'timestamp' },
  { title: 'Тип', key: 'type' },
  { title: 'Описание', key: 'description' }
]

const chartOptions = ref({
  title: {
    text: 'Активность игроков'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: 'Игры',
    type: 'line',
    data: [120, 200, 150, 80, 70, 110, 130],
    smooth: true
  }]
})

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getActivityColor = (type) => {
  const colors = {
    game: 'success',
    brand: 'primary',
    promo: 'warning',
    user: 'info'
  }
  return colors[type] || 'default'
}

const getActivityLabel = (type) => {
  const labels = {
    game: 'Игра',
    brand: 'Бренд',
    promo: 'Промо',
    user: 'Пользователь'
  }
  return labels[type] || type
}
</script>
