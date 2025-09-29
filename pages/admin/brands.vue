<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление брендами</h1>
          <v-btn color="primary" @click="openCreateDialog">
            <v-icon left>mdi-plus</v-icon>
            Добавить бренд
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Фильтры и поиск -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Поиск брендов"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="statusFilter"
          label="Статус"
          :items="statusOptions"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="sortBy"
          label="Сортировка"
          :items="sortOptions"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Таблица брендов -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredBrands"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.logo="{ item }">
          <v-avatar size="40" :color="item.color">
            <img v-if="item.logo" :src="item.logo" :alt="item.name">
            <span v-else class="text-white">{{ item.name.charAt(0) }}</span>
          </v-avatar>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : 'error'"
            size="small"
          >
            {{ item.status === 'active' ? 'Активен' : 'Неактивен' }}
          </v-chip>
        </template>

        <template v-slot:item.games_count="{ item }">
          <v-chip color="info" size="small">
            {{ item.games_count }} игр
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            @click="editBrand(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            @click="deleteBrand(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Диалог создания/редактирования -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEdit ? 'Редактировать бренд' : 'Создать бренд' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="brandForm.name"
                  label="Название бренда"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="brandForm.description"
                  label="Описание"
                  multiline
                  rows="3"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="brandForm.website"
                  label="Веб-сайт"
                  type="url"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="brandForm.contact_email"
                  label="Email для связи"
                  type="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="brandForm.primary_color"
                  label="Основной цвет"
                ></v-color-picker>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="brandForm.secondary_color"
                  label="Дополнительный цвет"
                ></v-color-picker>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="brandForm.logo_file"
                  label="Логотип"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="brandForm.status"
                  label="Активен"
                  true-value="active"
                  false-value="inactive"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="saveBrand" :disabled="!valid">
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
          Вы уверены, что хотите удалить бренд "{{ brandToDelete?.name }}"? Это действие нельзя отменить.
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
const sortBy = ref('name')
const dialog = ref(false)
const deleteDialog = ref(false)
const valid = ref(false)
const isEdit = ref(false)
const brandToDelete = ref(null)

const statusOptions = [
  { title: 'Активен', value: 'active' },
  { title: 'Неактивен', value: 'inactive' }
]

const sortOptions = [
  { title: 'По названию', value: 'name' },
  { title: 'По дате создания', value: 'created_at' },
  { title: 'По количеству игр', value: 'games_count' }
]

const headers = [
  { title: 'Логотип', key: 'logo', sortable: false },
  { title: 'Название', key: 'name' },
  { title: 'Описание', key: 'description' },
  { title: 'Статус', key: 'status' },
  { title: 'Игр', key: 'games_count' },
  { title: 'Создан', key: 'created_at' },
  { title: 'Действия', key: 'actions', sortable: false }
]

const brandForm = ref({
  name: '',
  description: '',
  website: '',
  contact_email: '',
  primary_color: '#1976D2',
  secondary_color: '#FFC107',
  logo_file: null,
  status: 'active'
})

const nameRules = [
  v => !!v || 'Название обязательно',
  v => v.length >= 2 || 'Название должно содержать минимум 2 символа'
]

// Мок данные брендов
const brands = ref([
  {
    id: 1,
    name: 'Coca-Cola',
    description: 'Официальный напиток для освежения',
    website: 'https://coca-cola.com',
    contact_email: 'contact@coca-cola.com',
    primary_color: '#FF0000',
    secondary_color: '#FFFFFF',
    logo: 'https://via.placeholder.com/40x40/FF0000/FFFFFF?text=C',
    status: 'active',
    games_count: 1250,
    created_at: '2024-01-15'
  },
  {
    id: 2,
    name: 'Pepsi',
    description: 'Поколение Next',
    website: 'https://pepsi.com',
    contact_email: 'info@pepsi.com',
    primary_color: '#004B93',
    secondary_color: '#FFD700',
    logo: 'https://via.placeholder.com/40x40/004B93/FFFFFF?text=P',
    status: 'active',
    games_count: 980,
    created_at: '2024-01-20'
  },
  {
    id: 3,
    name: 'Nike',
    description: 'Just Do It',
    website: 'https://nike.com',
    contact_email: 'support@nike.com',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    logo: 'https://via.placeholder.com/40x40/000000/FFFFFF?text=N',
    status: 'active',
    games_count: 750,
    created_at: '2024-02-01'
  },
  {
    id: 4,
    name: 'Adidas',
    description: 'Impossible is Nothing',
    website: 'https://adidas.com',
    contact_email: 'help@adidas.com',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    logo: 'https://via.placeholder.com/40x40/000000/FFFFFF?text=A',
    status: 'inactive',
    games_count: 620,
    created_at: '2024-02-10'
  }
])

const filteredBrands = computed(() => {
  let filtered = brands.value

  if (statusFilter.value) {
    filtered = filtered.filter(brand => brand.status === statusFilter.value)
  }

  if (sortBy.value === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'created_at') {
    filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy.value === 'games_count') {
    filtered = filtered.sort((a, b) => b.games_count - a.games_count)
  }

  return filtered
})

const openCreateDialog = () => {
  isEdit.value = false
  brandForm.value = {
    name: '',
    description: '',
    website: '',
    contact_email: '',
    primary_color: '#1976D2',
    secondary_color: '#FFC107',
    logo_file: null,
    status: 'active'
  }
  dialog.value = true
}

const editBrand = (brand) => {
  isEdit.value = true
  brandForm.value = { ...brand }
  dialog.value = true
}

const saveBrand = () => {
  if (valid.value) {
    if (isEdit.value) {
      const index = brands.value.findIndex(b => b.id === brandForm.value.id)
      if (index !== -1) {
        brands.value[index] = { ...brandForm.value }
      }
    } else {
      const newBrand = {
        ...brandForm.value,
        id: Date.now(),
        games_count: 0,
        created_at: new Date().toISOString().split('T')[0]
      }
      brands.value.push(newBrand)
    }
    dialog.value = false
  }
}

const deleteBrand = (brand) => {
  brandToDelete.value = brand
  deleteDialog.value = true
}

const confirmDelete = () => {
  if (brandToDelete.value) {
    const index = brands.value.findIndex(b => b.id === brandToDelete.value.id)
    if (index !== -1) {
      brands.value.splice(index, 1)
    }
    deleteDialog.value = false
    brandToDelete.value = null
  }
}
</script>

