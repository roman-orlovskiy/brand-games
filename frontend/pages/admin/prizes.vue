<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Управление призами</h1>
          <v-btn color="primary" prepend-icon="mdi-plus">
            Добавить приз
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-gift</v-icon>
            Список призов
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="prizes"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.value="{ item }">
                <span class="font-weight-bold">{{ item.value }}₽</span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editPrize(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deletePrize(item)"
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
            Статистика призов
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Всего призов</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold">24</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Общая стоимость</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold">15,000₽</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Выдано сегодня</v-list-item>
                <template v-slot:append>
                  <span class="text-h6 font-weight-bold text-success">3</span>
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
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Название', key: 'name', sortable: true },
  { title: 'Описание', key: 'description' },
  { title: 'Стоимость', key: 'value', sortable: true },
  { title: 'Количество', key: 'quantity', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const prizes = ref([
  {
    id: 1,
    name: 'Скидка 10%',
    description: 'Скидка на следующий заказ',
    value: 500,
    quantity: 50
  },
  {
    id: 2,
    name: 'Бесплатная доставка',
    description: 'Бесплатная доставка на заказ от 1000₽',
    value: 300,
    quantity: 100
  },
  {
    id: 3,
    name: 'Подарочный сертификат',
    description: 'Сертификат на 1000₽',
    value: 1000,
    quantity: 10
  }
])

const editPrize = (prize) => {
  console.log('Редактировать приз:', prize)
}

const deletePrize = (prize) => {
  console.log('Удалить приз:', prize)
}
</script>
