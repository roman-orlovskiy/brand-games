<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление промокодами</h1>
          <v-btn color="primary" @click="openGenerateDialog">
            <v-icon left>mdi-plus</v-icon>
            Сгенерировать промокоды
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Фильтры и поиск -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="search"
          label="Поиск промокодов"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="statusFilter"
          label="Статус"
          :items="statusOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="typeFilter"
          label="Тип"
          :items="typeOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="brandFilter"
          label="Бренд"
          :items="brandOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn color="primary" @click="exportPromoCodes" class="mt-2">
          <v-icon left>mdi-export</v-icon>
          Экспорт
        </v-btn>
      </v-col>
    </v-row>

    <!-- Статистика промокодов -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="primary" size="40" class="mr-4">mdi-ticket-percent</v-icon>
              <div>
                <div class="text-h6">{{ stats.total }}</div>
                <div class="text-caption text-medium-emphasis">Всего промокодов</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" size="40" class="mr-4">mdi-check-circle</v-icon>
              <div>
                <div class="text-h6">{{ stats.used }}</div>
                <div class="text-caption text-medium-emphasis">Использовано</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="warning" size="40" class="mr-4">mdi-clock-outline</v-icon>
              <div>
                <div class="text-h6">{{ stats.active }}</div>
                <div class="text-caption text-medium-emphasis">Активных</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="error" size="40" class="mr-4">mdi-close-circle</v-icon>
              <div>
                <div class="text-h6">{{ stats.expired }}</div>
                <div class="text-caption text-medium-emphasis">Истекших</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Таблица промокодов -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredPromoCodes"
        :search="search"
        :items-per-page="15"
        class="elevation-1"
      >
        <template v-slot:item.code="{ item }">
          <v-chip
            :color="getCodeColor(item.status)"
            size="small"
            @click="copyToClipboard(item.code)"
            style="cursor: pointer;"
          >
            {{ item.code }}
          </v-chip>
        </template>

        <template v-slot:item.discount="{ item }">
          <span class="font-weight-bold text-success">{{ item.discount }}%</span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template v-slot:item.type="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            size="small"
          >
            {{ getTypeLabel(item.type) }}
          </v-chip>
        </template>

        <template v-slot:item.usage_count="{ item }">
          <v-progress-linear
            :model-value="(item.usage_count / item.usage_limit) * 100"
            :color="getUsageColor(item.usage_count, item.usage_limit)"
            height="20"
            rounded
          >
            <template v-slot:default="{ value }">
              <strong>{{ item.usage_count }}/{{ item.usage_limit }}</strong>
            </template>
          </v-progress-linear>
        </template>

        <template v-slot:item.expires_at="{ item }">
          <span :class="getExpirationClass(item.expires_at)">
            {{ formatDate(item.expires_at) }}
          </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            @click="editPromoCode(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            @click="deletePromoCode(item)"
          ></v-btn>
          <v-btn
            icon="mdi-copy"
            size="small"
            @click="copyToClipboard(item.code)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Диалог генерации промокодов -->
    <v-dialog v-model="generateDialog" max-width="600px">
      <v-card>
        <v-card-title>Генерация промокодов</v-card-title>
        <v-card-text>
          <v-form ref="generateForm" v-model="generateValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="generateForm.count"
                  label="Количество промокодов"
                  type="number"
                  :rules="countRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="generateForm.prefix"
                  label="Префикс"
                  hint="Например: BRAND"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="generateForm.discount"
                  label="Размер скидки (%)"
                  type="number"
                  :rules="discountRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="generateForm.usage_limit"
                  label="Лимит использований"
                  type="number"
                  :rules="limitRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="generateForm.brand"
                  label="Бренд"
                  :items="brandOptions"
                  :rules="brandRules"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="generateForm.type"
                  label="Тип промокода"
                  :items="typeOptions"
                  :rules="typeRules"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="generateForm.description"
                  label="Описание"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="expiryMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="generateForm.expires_at"
                      label="Дата истечения"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="generateForm.expires_at"
                    @update:model-value="expiryMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="generateForm.unique"
                  label="Уникальные промокоды"
                  color="primary"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="generateDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="generatePromoCodes" :disabled="!generateValid" :loading="generating">
            Сгенерировать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог редактирования -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Редактировать промокод</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editValid">
            <v-text-field
              v-model="editForm.code"
              label="Промокод"
              :rules="codeRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="editForm.discount"
              label="Размер скидки (%)"
              type="number"
              :rules="discountRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="editForm.usage_limit"
              label="Лимит использований"
              type="number"
              :rules="limitRules"
              required
            ></v-text-field>
            <v-select
              v-model="editForm.status"
              label="Статус"
              :items="statusOptions"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="editDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="savePromoCode" :disabled="!editValid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить промокод "{{ promoToDelete?.code }}"? Это действие нельзя отменить.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const search = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const brandFilter = ref('')
const generateDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)
const expiryMenu = ref(false)
const generateValid = ref(false)
const editValid = ref(false)
const generating = ref(false)
const promoToDelete = ref(null)

const statusOptions = [
  { title: 'Активен', value: 'active' },
  { title: 'Использован', value: 'used' },
  { title: 'Истек', value: 'expired' },
  { title: 'Отключен', value: 'disabled' }
]

const typeOptions = [
  { title: 'Процентная скидка', value: 'percentage' },
  { title: 'Фиксированная скидка', value: 'fixed' },
  { title: 'Бесплатная доставка', value: 'shipping' },
  { title: 'Подарок', value: 'gift' }
]

const brandOptions = [
  { title: 'Coca-Cola', value: 'coca-cola' },
  { title: 'Pepsi', value: 'pepsi' },
  { title: 'Nike', value: 'nike' },
  { title: 'Adidas', value: 'adidas' }
]

const headers = [
  { title: 'Промокод', key: 'code' },
  { title: 'Скидка', key: 'discount' },
  { title: 'Статус', key: 'status' },
  { title: 'Тип', key: 'type' },
  { title: 'Бренд', key: 'brand' },
  { title: 'Использований', key: 'usage_count' },
  { title: 'Истекает', key: 'expires_at' },
  { title: 'Действия', key: 'actions', sortable: false }
]

const generateForm = ref({
  count: 1,
  prefix: 'BRAND',
  discount: 10,
  usage_limit: 1,
  brand: '',
  type: '',
  description: '',
  expires_at: '',
  unique: true
})

const editForm = ref({
  code: '',
  discount: 0,
  usage_limit: 1,
  status: 'active'
})

const stats = ref({
  total: 1250,
  used: 890,
  active: 320,
  expired: 40
})

// Мок данные промокодов
const promoCodes = ref([
  {
    id: 1,
    code: 'BRAND10',
    discount: 10,
    status: 'active',
    type: 'percentage',
    brand: 'Coca-Cola',
    usage_count: 5,
    usage_limit: 100,
    expires_at: '2024-12-31',
    description: 'Скидка 10% на все товары',
    created_at: '2024-01-15'
  },
  {
    id: 2,
    code: 'PEPSI25',
    discount: 25,
    status: 'used',
    type: 'percentage',
    brand: 'Pepsi',
    usage_count: 1,
    usage_limit: 1,
    expires_at: '2024-12-31',
    description: 'Скидка 25% на напитки',
    created_at: '2024-01-16'
  },
  {
    id: 3,
    code: 'NIKE50',
    discount: 50,
    status: 'active',
    type: 'percentage',
    brand: 'Nike',
    usage_count: 0,
    usage_limit: 50,
    expires_at: '2024-06-30',
    description: 'Скидка 50% на обувь',
    created_at: '2024-01-17'
  },
  {
    id: 4,
    code: 'ADIDAS100',
    discount: 100,
    status: 'expired',
    type: 'fixed',
    brand: 'Adidas',
    usage_count: 10,
    usage_limit: 20,
    expires_at: '2024-01-31',
    description: 'Скидка 100 рублей',
    created_at: '2024-01-10'
  }
])

const filteredPromoCodes = computed(() => {
  let filtered = promoCodes.value

  if (statusFilter.value) {
    filtered = filtered.filter(code => code.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(code => code.type === typeFilter.value)
  }

  if (brandFilter.value) {
    filtered = filtered.filter(code => code.brand === brandFilter.value)
  }

  return filtered
})

const countRules = [
  v => !!v || 'Количество обязательно',
  v => v > 0 || 'Количество должно быть больше 0',
  v => v <= 1000 || 'Максимум 1000 промокодов за раз'
]

const discountRules = [
  v => !!v || 'Размер скидки обязателен',
  v => v >= 0 || 'Скидка не может быть отрицательной',
  v => v <= 100 || 'Максимальная скидка 100%'
]

const limitRules = [
  v => !!v || 'Лимит использований обязателен',
  v => v > 0 || 'Лимит должен быть больше 0'
]

const brandRules = [
  v => !!v || 'Бренд обязателен'
]

const typeRules = [
  v => !!v || 'Тип промокода обязателен'
]

const codeRules = [
  v => !!v || 'Промокод обязателен',
  v => v.length >= 3 || 'Промокод должен содержать минимум 3 символа'
]

const getCodeColor = (status) => {
  const colors = {
    active: 'success',
    used: 'info',
    expired: 'error',
    disabled: 'grey'
  }
  return colors[status] || 'default'
}

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    used: 'info',
    expired: 'error',
    disabled: 'grey'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Активен',
    used: 'Использован',
    expired: 'Истек',
    disabled: 'Отключен'
  }
  return labels[status] || status
}

const getTypeColor = (type) => {
  const colors = {
    percentage: 'primary',
    fixed: 'warning',
    shipping: 'info',
    gift: 'success'
  }
  return colors[type] || 'default'
}

const getTypeLabel = (type) => {
  const labels = {
    percentage: 'Процентная',
    fixed: 'Фиксированная',
    shipping: 'Доставка',
    gift: 'Подарок'
  }
  return labels[type] || type
}

const getUsageColor = (used, limit) => {
  const percentage = (used / limit) * 100
  if (percentage >= 90) return 'error'
  if (percentage >= 70) return 'warning'
  return 'success'
}

const getExpirationClass = (expiresAt) => {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiry < 0) return 'text-error'
  if (daysUntilExpiry <= 7) return 'text-warning'
  return 'text-success'
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
}

const openGenerateDialog = () => {
  generateForm.value = {
    count: 1,
    prefix: 'BRAND',
    discount: 10,
    usage_limit: 1,
    brand: '',
    type: '',
    description: '',
    expires_at: '',
    unique: true
  }
  generateDialog.value = true
}

const generatePromoCodes = async () => {
  if (generateValid.value) {
    generating.value = true
    
    // Мок генерация промокодов
    setTimeout(() => {
      const newCodes = []
      for (let i = 0; i < generateForm.value.count; i++) {
        const code = generateForm.value.unique 
          ? `${generateForm.value.prefix}${Date.now()}${i}`
          : `${generateForm.value.prefix}${i + 1}`
        
        newCodes.push({
          id: Date.now() + i,
          code,
          discount: generateForm.value.discount,
          status: 'active',
          type: generateForm.value.type,
          brand: generateForm.value.brand,
          usage_count: 0,
          usage_limit: generateForm.value.usage_limit,
          expires_at: generateForm.value.expires_at || '2024-12-31',
          description: generateForm.value.description,
          created_at: new Date().toISOString().split('T')[0]
        })
      }
      
      promoCodes.value.unshift(...newCodes)
      generateDialog.value = false
      generating.value = false
    }, 1500)
  }
}

const editPromoCode = (promoCode) => {
  editForm.value = {
    code: promoCode.code,
    discount: promoCode.discount,
    usage_limit: promoCode.usage_limit,
    status: promoCode.status
  }
  editDialog.value = true
}

const savePromoCode = () => {
  if (editValid.value) {
    const index = promoCodes.value.findIndex(p => p.code === editForm.value.code)
    if (index !== -1) {
      promoCodes.value[index] = {
        ...promoCodes.value[index],
        ...editForm.value
      }
    }
    editDialog.value = false
  }
}

const deletePromoCode = (promoCode) => {
  promoToDelete.value = promoCode
  deleteDialog.value = true
}

const confirmDelete = () => {
  if (promoToDelete.value) {
    const index = promoCodes.value.findIndex(p => p.id === promoToDelete.value.id)
    if (index !== -1) {
      promoCodes.value.splice(index, 1)
    }
    deleteDialog.value = false
    promoToDelete.value = null
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Можно добавить уведомление об успешном копировании
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const exportPromoCodes = () => {
  console.log('Exporting promocodes:', filteredPromoCodes.value)
  // Логика экспорта промокодов
}
</script>

