<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Настройки игры</h1>
          <v-btn color="primary" @click="saveSettings" :loading="saving">
            <v-icon left>mdi-content-save</v-icon>
            Сохранить настройки
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Основные настройки игры -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Основные настройки</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.game.title"
                  label="Название игры"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="settings.game.description"
                  label="Описание игры"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="settings.game.maxShots"
                  label="Максимум выстрелов"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="settings.game.timeLimit"
                  label="Лимит времени (сек)"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.game.enableTimer"
                  label="Включить таймер"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.game.enableSound"
                  label="Включить звуки"
                  color="primary"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Настройки физики -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Настройки физики</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-slider
                  v-model="settings.physics.gravity"
                  label="Гравитация"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  thumb-label
                  variant="outlined"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="settings.physics.windResistance"
                  label="Сопротивление ветра"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  thumb-label
                  variant="outlined"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="settings.physics.arrowSpeed"
                  label="Скорость стрелы"
                  min="5"
                  max="50"
                  step="1"
                  thumb-label
                  variant="outlined"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.physics.realisticPhysics"
                  label="Реалистичная физика"
                  color="primary"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <!-- Настройки призов -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Управление призами</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn @click="openPrizeDialog" color="primary" class="mb-4">
                  <v-icon left>mdi-plus</v-icon>
                  Добавить приз
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="prizeHeaders"
                  :items="settings.prizes"
                  class="elevation-1"
                >
                  <template v-slot:item.probability="{ item }">
                    {{ item.probability }}%
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
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Настройки скидок -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Настройки скидок</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.discounts.maxDiscount"
                  label="Максимальная скидка (%)"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.discounts.minDiscount"
                  label="Минимальная скидка (%)"
                  type="number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.discounts.cumulative"
                  label="Накопительные скидки"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.discounts.discountCode"
                  label="Префикс промокода"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <!-- Настройки зон попадания -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Зоны попадания</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="(zone, index) in settings.hitZones" :key="index">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1">
                    {{ zone.name }}
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="zone.radius"
                      label="Радиус зоны"
                      type="number"
                      density="compact"
                    ></v-text-field>
                    <v-text-field
                      v-model="zone.discount"
                      label="Скидка (%)"
                      type="number"
                      density="compact"
                    ></v-text-field>
                    <v-color-picker
                      v-model="zone.color"
                      label="Цвет зоны"
                      density="compact"
                    ></v-color-picker>
                    <v-switch
                      v-model="zone.active"
                      label="Активна"
                      density="compact"
                    ></v-switch>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-btn @click="addHitZone" class="mt-4">
              <v-icon left>mdi-plus</v-icon>
              Добавить зону
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог приза -->
    <v-dialog v-model="prizeDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ isEditPrize ? 'Редактировать приз' : 'Добавить приз' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="prizeForm" v-model="prizeValid">
            <v-text-field
              v-model="prizeForm.name"
              label="Название приза"
              :rules="prizeRules.name"
              required
            ></v-text-field>
            <v-text-field
              v-model="prizeForm.description"
              label="Описание"
            ></v-text-field>
            <v-text-field
              v-model="prizeForm.probability"
              label="Вероятность (%)"
              type="number"
              :rules="prizeRules.probability"
              required
            ></v-text-field>
            <v-text-field
              v-model="prizeForm.value"
              label="Стоимость приза"
              type="number"
            ></v-text-field>
            <v-color-picker
              v-model="prizeForm.color"
              label="Цвет приза"
            ></v-color-picker>
            <v-switch
              v-model="prizeForm.rare"
              label="Редкий приз"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="prizeDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="savePrize" :disabled="!prizeValid">
            {{ isEditPrize ? 'Сохранить' : 'Добавить' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const saving = ref(false)
const prizeDialog = ref(false)
const isEditPrize = ref(false)
const prizeValid = ref(false)

const settings = ref({
  game: {
    title: 'Попади в цель',
    description: 'Стреляйте из лука и выигрывайте призы!',
    maxShots: 5,
    timeLimit: 60,
    enableTimer: true,
    enableSound: true
  },
  physics: {
    gravity: 0.5,
    windResistance: 0.1,
    arrowSpeed: 20,
    realisticPhysics: true
  },
  prizes: [
    { id: 1, name: 'Скидка 10%', description: 'Небольшая скидка', probability: 40, value: 100, color: '#4CAF50', rare: false },
    { id: 2, name: 'Скидка 25%', description: 'Хорошая скидка', probability: 25, value: 250, color: '#FF9800', rare: false },
    { id: 3, name: 'Скидка 50%', description: 'Отличная скидка', probability: 15, value: 500, color: '#F44336', rare: true },
    { id: 4, name: 'Бесплатная доставка', description: 'Доставка в подарок', probability: 20, value: 200, color: '#2196F3', rare: false }
  ],
  discounts: {
    maxDiscount: 50,
    minDiscount: 5,
    cumulative: true,
    discountCode: 'BRAND'
  },
  hitZones: [
    { name: 'Центр', radius: 20, discount: 50, color: '#FF0000', active: true },
    { name: 'Средняя зона', radius: 40, discount: 25, color: '#FFA500', active: true },
    { name: 'Внешняя зона', radius: 60, discount: 10, color: '#00FF00', active: true }
  ]
})

const prizeForm = ref({
  name: '',
  description: '',
  probability: 0,
  value: 0,
  color: '#4CAF50',
  rare: false
})

const prizeHeaders = [
  { title: 'Название', key: 'name' },
  { title: 'Описание', key: 'description' },
  { title: 'Вероятность (%)', key: 'probability' },
  { title: 'Стоимость', key: 'value' },
  { title: 'Редкий', key: 'rare' },
  { title: 'Действия', key: 'actions', sortable: false }
]

const prizeRules = {
  name: [v => !!v || 'Название обязательно'],
  probability: [
    v => !!v || 'Вероятность обязательна',
    v => v >= 0 && v <= 100 || 'Вероятность должна быть от 0 до 100'
  ]
}

const openPrizeDialog = () => {
  isEditPrize.value = false
  prizeForm.value = {
    name: '',
    description: '',
    probability: 0,
    value: 0,
    color: '#4CAF50',
    rare: false
  }
  prizeDialog.value = true
}

const editPrize = (prize) => {
  isEditPrize.value = true
  prizeForm.value = { ...prize }
  prizeDialog.value = true
}

const savePrize = () => {
  if (prizeValid.value) {
    if (isEditPrize.value) {
      const index = settings.value.prizes.findIndex(p => p.id === prizeForm.value.id)
      if (index !== -1) {
        settings.value.prizes[index] = { ...prizeForm.value }
      }
    } else {
      const newPrize = {
        ...prizeForm.value,
        id: Date.now()
      }
      settings.value.prizes.push(newPrize)
    }
    prizeDialog.value = false
  }
}

const deletePrize = (prize) => {
  const index = settings.value.prizes.findIndex(p => p.id === prize.id)
  if (index !== -1) {
    settings.value.prizes.splice(index, 1)
  }
}

const addHitZone = () => {
  settings.value.hitZones.push({
    name: `Зона ${settings.value.hitZones.length + 1}`,
    radius: 50,
    discount: 15,
    color: '#808080',
    active: true
  })
}

const saveSettings = async () => {
  saving.value = true
  // Сохранение настроек
  setTimeout(() => {
    saving.value = false
    console.log('Game settings saved:', settings.value)
  }, 1000)
}
</script>

