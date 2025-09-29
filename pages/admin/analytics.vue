<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Аналитика игр</h1>
      </v-col>
    </v-row>

    <!-- Фильтры -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select
          v-model="filters.brand"
          label="Бренд"
          :items="brandOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filters.period"
          label="Период"
          :items="periodOptions"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="filters.dateRange"
              label="Диапазон дат"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.dateRange"
            range
            @update:model-value="dateMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="applyFilters" class="mt-2">
          <v-icon left>mdi-filter</v-icon>
          Применить фильтры
        </v-btn>
      </v-col>
    </v-row>

    <!-- Основные метрики -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="primary" size="40" class="mr-4">mdi-gamepad-variant</v-icon>
              <div>
                <div class="text-h6">{{ metrics.totalGames }}</div>
                <div class="text-caption text-medium-emphasis">Всего игр</div>
                <div class="text-caption text-success">+12% за период</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" size="40" class="mr-4">mdi-account-group</v-icon>
              <div>
                <div class="text-h6">{{ metrics.uniquePlayers }}</div>
                <div class="text-caption text-medium-emphasis">Уникальных игроков</div>
                <div class="text-caption text-success">+8% за период</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="warning" size="40" class="mr-4">mdi-target</v-icon>
              <div>
                <div class="text-h6">{{ metrics.hitRate }}%</div>
                <div class="text-caption text-medium-emphasis">Процент попаданий</div>
                <div class="text-caption text-success">+3% за период</div>
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
                <div class="text-h6">{{ metrics.promoCodesUsed }}</div>
                <div class="text-caption text-medium-emphasis">Промокодов использовано</div>
                <div class="text-caption text-success">+15% за период</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Графики -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Активность игроков по дням</v-card-title>
          <v-card-text>
            <v-chart
              :options="activityChartOptions"
              style="height: 400px;"
            />
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Распределение по брендам</v-card-title>
          <v-card-text>
            <v-chart
              :options="brandDistributionOptions"
              style="height: 400px;"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Детальная аналитика -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Топ зоны попаданий</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="zone in topHitZones"
                :key="zone.name"
                :title="zone.name"
                :subtitle="`${zone.hits} попаданий (${zone.percentage}%)`"
              >
                <template v-slot:prepend>
                  <v-avatar :color="zone.color" size="small">
                    <span class="text-white">{{ zone.name.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-progress-linear
                    :model-value="zone.percentage"
                    :color="zone.color"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Популярные призы</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="prize in popularPrizes"
                :key="prize.name"
                :title="prize.name"
                :subtitle="`${prize.wins} выигрышей`"
              >
                <template v-slot:prepend>
                  <v-avatar :color="prize.color" size="small">
                    <span class="text-white">{{ prize.name.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-chip size="small" :color="prize.rarity">
                    {{ prize.rarity }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Временная аналитика -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Временная аналитика</v-card-title>
          <v-card-text>
            <v-tabs v-model="timeTab" class="mb-4">
              <v-tab value="hourly">По часам</v-tab>
              <v-tab value="daily">По дням</v-tab>
              <v-tab value="weekly">По неделям</v-tab>
            </v-tabs>
            
            <v-window v-model="timeTab">
              <v-window-item value="hourly">
                <v-chart
                  :options="hourlyChartOptions"
                  style="height: 300px;"
                />
              </v-window-item>
              <v-window-item value="daily">
                <v-chart
                  :options="dailyChartOptions"
                  style="height: 300px;"
                />
              </v-window-item>
              <v-window-item value="weekly">
                <v-chart
                  :options="weeklyChartOptions"
                  style="height: 300px;"
                />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Конверсия и удержание -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Конверсия игроков</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h3 text-primary">{{ conversionRate }}%</div>
              <div class="text-caption text-medium-emphasis">Игроков завершили игру</div>
            </div>
            <v-progress-circular
              :model-value="conversionRate"
              :size="100"
              :width="10"
              color="primary"
              class="mt-4"
            >
              {{ conversionRate }}%
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Среднее время игры</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h3 text-success">{{ averageGameTime }}с</div>
              <div class="text-caption text-medium-emphasis">Среднее время одной игры</div>
            </div>
            <v-list>
              <v-list-item>
                <v-list-item-title>Быстрее всего</v-list-item-title>
                <v-list-item-subtitle>{{ fastestGame }}с</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Дольше всего</v-list-item-title>
                <v-list-item-subtitle>{{ slowestGame }}с</v-list-item-subtitle>
              </v-list-item>
            </v-list>
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

const dateMenu = ref(false)
const timeTab = ref('daily')

const filters = ref({
  brand: '',
  period: 'week',
  dateRange: []
})

const brandOptions = [
  { title: 'Coca-Cola', value: 'coca-cola' },
  { title: 'Pepsi', value: 'pepsi' },
  { title: 'Nike', value: 'nike' },
  { title: 'Adidas', value: 'adidas' }
]

const periodOptions = [
  { title: 'За день', value: 'day' },
  { title: 'За неделю', value: 'week' },
  { title: 'За месяц', value: 'month' },
  { title: 'За год', value: 'year' }
]

const metrics = ref({
  totalGames: 15420,
  uniquePlayers: 3250,
  hitRate: 68.5,
  promoCodesUsed: 8920
})

const topHitZones = ref([
  { name: 'Центр', hits: 1250, percentage: 35, color: 'red' },
  { name: 'Средняя зона', hits: 980, percentage: 28, color: 'orange' },
  { name: 'Внешняя зона', hits: 750, percentage: 21, color: 'green' },
  { name: 'Край мишени', hits: 540, percentage: 16, color: 'blue' }
])

const popularPrizes = ref([
  { name: 'Скидка 10%', wins: 1250, color: 'green', rarity: 'common' },
  { name: 'Скидка 25%', wins: 750, color: 'orange', rarity: 'rare' },
  { name: 'Бесплатная доставка', wins: 620, color: 'blue', rarity: 'common' },
  { name: 'Скидка 50%', wins: 380, color: 'red', rarity: 'epic' },
  { name: 'Подарочный сертификат', wins: 120, color: 'purple', rarity: 'legendary' }
])

const conversionRate = ref(78.5)
const averageGameTime = ref(45.2)
const fastestGame = ref(12.5)
const slowestGame = ref(120.8)

const activityChartOptions = ref({
  title: {
    text: 'Активность игроков'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Игры', 'Уникальные игроки', 'Промокоды']
  },
  xAxis: {
    type: 'category',
    data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Игры',
      type: 'line',
      data: [120, 200, 150, 80, 70, 110, 130],
      smooth: true
    },
    {
      name: 'Уникальные игроки',
      type: 'line',
      data: [80, 120, 100, 60, 50, 80, 90],
      smooth: true
    },
    {
      name: 'Промокоды',
      type: 'line',
      data: [60, 100, 80, 50, 40, 70, 85],
      smooth: true
    }
  ]
})

const brandDistributionOptions = ref({
  title: {
    text: 'Распределение по брендам',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: [{
    name: 'Игры',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 35, name: 'Coca-Cola' },
      { value: 28, name: 'Pepsi' },
      { value: 20, name: 'Nike' },
      { value: 17, name: 'Adidas' }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

const hourlyChartOptions = ref({
  title: {
    text: 'Активность по часам'
  },
  xAxis: {
    type: 'category',
    data: Array.from({length: 24}, (_, i) => `${i}:00`)
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: 'Игры',
    type: 'bar',
    data: Array.from({length: 24}, () => Math.floor(Math.random() * 100) + 20)
  }]
})

const dailyChartOptions = ref({
  title: {
    text: 'Активность по дням'
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

const weeklyChartOptions = ref({
  title: {
    text: 'Активность по неделям'
  },
  xAxis: {
    type: 'category',
    data: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: 'Игры',
    type: 'bar',
    data: [850, 920, 780, 1050]
  }]
})

const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  // Логика применения фильтров
}
</script>

