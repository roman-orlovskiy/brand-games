<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление пользователями</h1>
          <v-btn color="primary" prepend-icon="mdi-account-plus">
            Добавить пользователя
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Список пользователей
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32" :color="item.avatar ? undefined : 'primary'">
                  <v-img v-if="item.avatar" :src="item.avatar"></v-img>
                  <span v-else class="text-white">{{ item.name.charAt(0) }}</span>
                </v-avatar>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.status === 'active' ? 'Активен' : 'Заблокирован' }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editUser(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteUser(item)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            Статистика пользователей
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Всего пользователей</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold">2,847</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Активных</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold text-success">2,654</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Новых сегодня</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold text-info">23</span>
                </template>
              </v-list-item>
            </v-list>
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

const loading = ref(false)

const headers = [
  { title: 'Аватар', key: 'avatar', sortable: false },
  { title: 'Имя', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Телефон', key: 'phone' },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Регистрация', key: 'createdAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const users = ref([
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    createdAt: '2024-01-15',
    avatar: null
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    status: 'active',
    createdAt: '2024-01-14',
    avatar: null
  },
  {
    id: 3,
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    phone: '+7 (999) 345-67-89',
    status: 'blocked',
    createdAt: '2024-01-10',
    avatar: null
  }
])

const editUser = (user) => {
  console.log('Редактировать пользователя:', user)
}

const deleteUser = (user) => {
  console.log('Удалить пользователя:', user)
}
</script>
