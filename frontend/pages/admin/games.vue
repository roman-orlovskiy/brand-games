<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление играми</h1>
          <v-btn color="primary" prepend-icon="mdi-plus">
            Добавить игру
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-gamepad-variant</v-icon>
            Список игр
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="games"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="item.status === 'active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.status === 'active' ? 'Активна' : 'Неактивна' }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editGame(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteGame(item)"
                ></v-btn>
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

const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Название', key: 'name', sortable: true },
  { title: 'Описание', key: 'description' },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Дата создания', key: 'createdAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const games = ref([
  {
    id: 1,
    name: 'Лук и стрелы',
    description: 'Классическая игра с луком и стрелами',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Дартс',
    description: 'Игра в дартс на точность',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'Кольцеброс',
    description: 'Набрось кольцо на цель',
    status: 'inactive',
    createdAt: '2024-01-05'
  }
])

const editGame = (game) => {
  console.log('Редактировать игру:', game)
}

const deleteGame = (game) => {
  console.log('Удалить игру:', game)
}
</script>
