<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Отчеты</h1>
          <v-btn color="primary" @click="generateReport" :loading="generating">
            <v-icon left>mdi-file-export</v-icon>
            Сгенерировать отчет
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Фильтры для отчетов -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-select
          v-model="reportFilters.type"
          label="Тип отчета"
          :items="reportTypes"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="reportFilters.brand"
          label="Бренд"
          :items="brandOptions"
          variant="outlined"
          clearable
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
              v-model="reportFilters.dateRange"
              label="Период"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="reportFilters.dateRange"
            range
            @update:model-value="dateMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="reportFilters.format"
          label="Формат экспорта"
          :items="exportFormats"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Предпросмотр отчета -->
    <v-row v-if="reportPreview">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Предпросмотр отчета: {{ getReportTypeLabel(reportFilters.type) }}
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="previewHeaders"
              :items="reportPreview"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>
              <template v-slot:item.brand="{ item }">
                <v-chip size="small" :color="getBrandColor(item.brand)">
                  {{ item.brand }}
                </v-chip>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'completed' ? 'success' : 'warning'"
                  size="small"
                >
                  {{ item.status === 'completed' ? 'Завершена' : 'В процессе' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- История отчетов -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>История отчетов</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="historyHeaders"
              :items="reportHistory"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.created_at="{ item }">
                {{ formatDateTime(item.created_at) }}
              </template>
              <template v-slot:item.type="{ item }">
                <v-chip size="small" :color="getReportTypeColor(item.type)">
                  {{ getReportTypeLabel(item.type) }}
                </v-chip>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'ready' ? 'success' : item.status === 'processing' ? 'warning' : 'error'"
                  size="small"
                >
                  {{ getStatusLabel(item.status) }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  v-if="item.status === 'ready'"
                  icon="mdi-download"
                  size="small"
                  @click="downloadReport(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  @click="deleteReport(item)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Статистика отчетов -->
    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Всего отчетов</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h3 text-primary">{{ reportStats.total }}</div>
              <div class="text-caption text-medium-emphasis">Создано за все время</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>За этот месяц</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h3 text-success">{{ reportStats.thisMonth }}</div>
              <div class="text-caption text-medium-emphasis">Отчетов сгенерировано</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Средний размер</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h3 text-info">{{ reportStats.averageSize }}KB</div>
              <div class="text-caption text-medium-emphasis">Средний размер файла</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Настройки автоматических отчетов -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Автоматические отчеты</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="autoReportSettings.enabled"
                  label="Включить автоматические отчеты"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="autoReportSettings.frequency"
                  label="Частота"
                  :items="frequencyOptions"
                  :disabled="!autoReportSettings.enabled"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="autoReportSettings.email"
                  label="Email для отправки"
                  type="email"
                  :disabled="!autoReportSettings.enabled"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="autoReportSettings.type"
                  label="Тип отчета"
                  :items="reportTypes"
                  :disabled="!autoReportSettings.enabled"
                ></v-select>
              </v-col>
            </v-row>
            <v-btn
              color="primary"
              @click="saveAutoReportSettings"
              :disabled="!autoReportSettings.enabled"
            >
              Сохранить настройки
            </v-btn>
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
const generating = ref(false)

const reportFilters = ref({
  type: 'games',
  brand: '',
  dateRange: [],
  format: 'xlsx'
})

const reportTypes = [
  { title: 'Отчет по играм', value: 'games' },
  { title: 'Отчет по пользователям', value: 'users' },
  { title: 'Отчет по брендам', value: 'brands' },
  { title: 'Отчет по промокодам', value: 'promo' },
  { title: 'Финансовый отчет', value: 'financial' }
]

const brandOptions = [
  { title: 'Coca-Cola', value: 'coca-cola' },
  { title: 'Pepsi', value: 'pepsi' },
  { title: 'Nike', value: 'nike' },
  { title: 'Adidas', value: 'adidas' }
]

const exportFormats = [
  { title: 'Excel (.xlsx)', value: 'xlsx' },
  { title: 'CSV (.csv)', value: 'csv' },
  { title: 'PDF (.pdf)', value: 'pdf' }
]

const frequencyOptions = [
  { title: 'Ежедневно', value: 'daily' },
  { title: 'Еженедельно', value: 'weekly' },
  { title: 'Ежемесячно', value: 'monthly' }
]

const previewHeaders = [
  { title: 'Дата', key: 'date' },
  { title: 'Бренд', key: 'brand' },
  { title: 'Игроков', key: 'players' },
  { title: 'Игр', key: 'games' },
  { title: 'Промокодов', key: 'promo_codes' },
  { title: 'Статус', key: 'status' }
]

const historyHeaders = [
  { title: 'Создан', key: 'created_at' },
  { title: 'Тип', key: 'type' },
  { title: 'Период', key: 'period' },
  { title: 'Размер', key: 'size' },
  { title: 'Статус', key: 'status' },
  { title: 'Действия', key: 'actions', sortable: false }
]

const reportPreview = ref([
  {
    date: '2024-01-15',
    brand: 'Coca-Cola',
    players: 150,
    games: 320,
    promo_codes: 180,
    status: 'completed'
  },
  {
    date: '2024-01-16',
    brand: 'Pepsi',
    players: 120,
    games: 280,
    promo_codes: 150,
    status: 'completed'
  },
  {
    date: '2024-01-17',
    brand: 'Nike',
    players: 90,
    games: 200,
    promo_codes: 120,
    status: 'processing'
  }
])

const reportHistory = ref([
  {
    id: 1,
    type: 'games',
    period: '2024-01-01 - 2024-01-31',
    size: '2.5MB',
    status: 'ready',
    created_at: '2024-01-31 10:30:00'
  },
  {
    id: 2,
    type: 'users',
    period: '2024-01-01 - 2024-01-31',
    size: '1.8MB',
    status: 'ready',
    created_at: '2024-01-30 15:45:00'
  },
  {
    id: 3,
    type: 'brands',
    period: '2024-01-01 - 2024-01-31',
    size: '0.9MB',
    status: 'processing',
    created_at: '2024-01-31 16:20:00'
  },
  {
    id: 4,
    type: 'promo',
    period: '2024-01-01 - 2024-01-31',
    size: '1.2MB',
    status: 'error',
    created_at: '2024-01-29 09:15:00'
  }
])

const reportStats = ref({
  total: 156,
  thisMonth: 23,
  averageSize: 1.8
})

const autoReportSettings = ref({
  enabled: false,
  frequency: 'weekly',
  email: 'admin@brandgames.com',
  type: 'games'
})

const getReportTypeLabel = (type) => {
  const labels = {
    games: 'Отчет по играм',
    users: 'Отчет по пользователям',
    brands: 'Отчет по брендам',
    promo: 'Отчет по промокодам',
    financial: 'Финансовый отчет'
  }
  return labels[type] || type
}

const getReportTypeColor = (type) => {
  const colors = {
    games: 'primary',
    users: 'success',
    brands: 'warning',
    promo: 'info',
    financial: 'error'
  }
  return colors[type] || 'default'
}

const getBrandColor = (brand) => {
  const colors = {
    'Coca-Cola': 'red',
    'Pepsi': 'blue',
    'Nike': 'black',
    'Adidas': 'green'
  }
  return colors[brand] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    ready: 'Готов',
    processing: 'Обработка',
    error: 'Ошибка'
  }
  return labels[status] || status
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
}

const formatDateTime = (dateTime) => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateTime))
}

const generateReport = async () => {
  generating.value = true
  
  // Мок генерация отчета
  setTimeout(() => {
    generating.value = false
    console.log('Generating report:', reportFilters.value)
    
    // Добавляем в историю
    const newReport = {
      id: Date.now(),
      type: reportFilters.value.type,
      period: reportFilters.value.dateRange.join(' - '),
      size: '1.5MB',
      status: 'processing',
      created_at: new Date().toISOString()
    }
    reportHistory.value.unshift(newReport)
  }, 2000)
}

const downloadReport = (report) => {
  console.log('Downloading report:', report)
  // Логика скачивания отчета
}

const deleteReport = (report) => {
  const index = reportHistory.value.findIndex(r => r.id === report.id)
  if (index !== -1) {
    reportHistory.value.splice(index, 1)
  }
}

const saveAutoReportSettings = () => {
  console.log('Saving auto report settings:', autoReportSettings.value)
  // Логика сохранения настроек
}
</script>

