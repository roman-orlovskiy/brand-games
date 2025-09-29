<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление призами</h1>
          <v-btn color="primary" @click="openCreateDialog">
            <v-icon left>mdi-plus</v-icon>
            Добавить приз
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Фильтры и поиск -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Поиск призов"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="categoryFilter"
          label="Категория"
          :items="categoryOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="rarityFilter"
          label="Редкость"
          :items="rarityOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <!-- Таблица призов -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredPrizes"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.image="{ item }">
          <v-avatar size="40" :color="item.color">
            <img v-if="item.image" :src="item.image" :alt="item.name">
            <span v-else class="text-white">{{ item.name.charAt(0) }}</span>
          </v-avatar>
        </template>

        <template v-slot:item.category="{ item }">
          <v-chip
            :color="getCategoryColor(item.category)"
            size="small"
          >
            {{ getCategoryLabel(item.category) }}
          </v-chip>
        </template>

        <template v-slot:item.rarity="{ item }">
          <v-chip
            :color="getRarityColor(item.rarity)"
            size="small"
          >
            {{ getRarityLabel(item.rarity) }}
          </v-chip>
        </template>

        <template v-slot:item.probability="{ item }">
          <v-progress-linear
            :model-value="item.probability"
            :color="getProbabilityColor(item.probability)"
            height="20"
            rounded
          >
            <template v-slot:default="{ value }">
              <strong>{{ value }}%</strong>
            </template>
          </v-progress-linear>
        </template>

        <template v-slot:item.value="{ item }">
          <span class="font-weight-bold">{{ formatCurrency(item.value) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            @click="editPrize(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            @click="deletePrize(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Диалог создания/редактирования -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEdit ? 'Редактировать приз' : 'Создать приз' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="prizeForm.name"
                  label="Название приза"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="prizeForm.description"
                  label="Описание"
                  multiline
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="prizeForm.category"
                  label="Категория"
                  :items="categoryOptions"
                  :rules="categoryRules"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="prizeForm.rarity"
                  label="Редкость"
                  :items="rarityOptions"
                  :rules="rarityRules"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="prizeForm.probability"
                  label="Вероятность (%)"
                  type="number"
                  :rules="probabilityRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="prizeForm.value"
                  label="Стоимость приза"
                  type="number"
                  :rules="valueRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="prizeForm.color"
                  label="Цвет приза"
                ></v-color-picker>
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="prizeForm.imageFile"
                  label="Изображение приза"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="prizeForm.active"
                  label="Активен"
                  true-value="true"
                  false-value="false"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="savePrize" :disabled="!valid">
            {{ isEdit ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить приз "{{ prizeToDelete?.name }}"? Это действие нельзя отменить.
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
const categoryFilter = ref('')
const rarityFilter = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const valid = ref(false)
const isEdit = ref(false)
const prizeToDelete = ref(null)

const categoryOptions = [
  { title: 'Скидки', value: 'discount' },
  { title: 'Подарки', value: 'gift' },
  { title: 'Сертификаты', value: 'certificate' },
  { title: 'Товары', value: 'product' }
]

const rarityOptions = [
  { title: 'Обычный', value: 'common' },
  { title: 'Редкий', value: 'rare' },
  { title: 'Эпический', value: 'epic' },
  { title: 'Легендарный', value: 'legendary' }
]

const headers = [
  { title: 'Изображение', key: 'image', sortable: false },
  { title: 'Название', key: 'name' },
  { title: 'Категория', key: 'category' },
  { title: 'Редкость', key: 'rarity' },
  { title: 'Вероятность', key: 'probability' },
  { title: 'Стоимость', key: 'value' },
  { title: 'Статус', key: 'active' },
  { title: 'Действия', key: 'actions', sortable: false }
]

const prizeForm = ref({
  name: '',
  description: '',
  category: '',
  rarity: '',
  probability: 0,
  value: 0,
  color: '#4CAF50',
  imageFile: null,
  active: true
})

const nameRules = [
  v => !!v || 'Название обязательно',
  v => v.length >= 2 || 'Название должно содержать минимум 2 символа'
]

const categoryRules = [
  v => !!v || 'Категория обязательна'
]

const rarityRules = [
  v => !!v || 'Редкость обязательна'
]

const probabilityRules = [
  v => !!v || 'Вероятность обязательна',
  v => v >= 0 && v <= 100 || 'Вероятность должна быть от 0 до 100'
]

const valueRules = [
  v => !!v || 'Стоимость обязательна',
  v => v >= 0 || 'Стоимость не может быть отрицательной'
]

// Мок данные призов
const prizes = ref([
  {
    id: 1,
    name: 'Скидка 10%',
    description: 'Небольшая скидка на покупку',
    category: 'discount',
    rarity: 'common',
    probability: 40,
    value: 100,
    color: '#4CAF50',
    image: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=10%',
    active: true,
    created_at: '2024-01-15'
  },
  {
    id: 2,
    name: 'Скидка 25%',
    description: 'Хорошая скидка на покупку',
    category: 'discount',
    rarity: 'rare',
    probability: 25,
    value: 250,
    color: '#FF9800',
    image: 'https://via.placeholder.com/40x40/FF9800/FFFFFF?text=25%',
    active: true,
    created_at: '2024-01-16'
  },
  {
    id: 3,
    name: 'Скидка 50%',
    description: 'Отличная скидка на покупку',
    category: 'discount',
    rarity: 'epic',
    probability: 15,
    value: 500,
    color: '#F44336',
    image: 'https://via.placeholder.com/40x40/F44336/FFFFFF?text=50%',
    active: true,
    created_at: '2024-01-17'
  },
  {
    id: 4,
    name: 'Бесплатная доставка',
    description: 'Доставка в подарок',
    category: 'gift',
    rarity: 'common',
    probability: 20,
    value: 200,
    color: '#2196F3',
    image: 'https://via.placeholder.com/40x40/2196F3/FFFFFF?text=Д',
    active: true,
    created_at: '2024-01-18'
  },
  {
    id: 5,
    name: 'Подарочный сертификат',
    description: 'Сертификат на 1000 рублей',
    category: 'certificate',
    rarity: 'legendary',
    probability: 5,
    value: 1000,
    color: '#9C27B0',
    image: 'https://via.placeholder.com/40x40/9C27B0/FFFFFF?text=С',
    active: true,
    created_at: '2024-01-19'
  }
])

const filteredPrizes = computed(() => {
  let filtered = prizes.value

  if (categoryFilter.value) {
    filtered = filtered.filter(prize => prize.category === categoryFilter.value)
  }

  if (rarityFilter.value) {
    filtered = filtered.filter(prize => prize.rarity === rarityFilter.value)
  }

  return filtered
})

const getCategoryColor = (category) => {
  const colors = {
    discount: 'success',
    gift: 'primary',
    certificate: 'warning',
    product: 'info'
  }
  return colors[category] || 'default'
}

const getCategoryLabel = (category) => {
  const labels = {
    discount: 'Скидки',
    gift: 'Подарки',
    certificate: 'Сертификаты',
    product: 'Товары'
  }
  return labels[category] || category
}

const getRarityColor = (rarity) => {
  const colors = {
    common: 'grey',
    rare: 'blue',
    epic: 'purple',
    legendary: 'orange'
  }
  return colors[rarity] || 'default'
}

const getRarityLabel = (rarity) => {
  const labels = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный'
  }
  return labels[rarity] || rarity
}

const getProbabilityColor = (probability) => {
  if (probability >= 30) return 'success'
  if (probability >= 15) return 'warning'
  return 'error'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(value)
}

const openCreateDialog = () => {
  isEdit.value = false
  prizeForm.value = {
    name: '',
    description: '',
    category: '',
    rarity: '',
    probability: 0,
    value: 0,
    color: '#4CAF50',
    imageFile: null,
    active: true
  }
  dialog.value = true
}

const editPrize = (prize) => {
  isEdit.value = true
  prizeForm.value = { ...prize }
  dialog.value = true
}

const savePrize = () => {
  if (valid.value) {
    if (isEdit.value) {
      const index = prizes.value.findIndex(p => p.id === prizeForm.value.id)
      if (index !== -1) {
        prizes.value[index] = { ...prizeForm.value }
      }
    } else {
      const newPrize = {
        ...prizeForm.value,
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0]
      }
      prizes.value.push(newPrize)
    }
    dialog.value = false
  }
}

const deletePrize = (prize) => {
  prizeToDelete.value = prize
  deleteDialog.value = true
}

const confirmDelete = () => {
  if (prizeToDelete.value) {
    const index = prizes.value.findIndex(p => p.id === prizeToDelete.value.id)
    if (index !== -1) {
      prizes.value.splice(index, 1)
    }
    deleteDialog.value = false
    prizeToDelete.value = null
  }
}
</script>

