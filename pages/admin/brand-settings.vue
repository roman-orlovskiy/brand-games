<template>
  <NuxtLayout name="admin">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Настройки брендинга</h1>
          <v-btn color="primary" @click="saveSettings" :loading="saving">
            <v-icon left>mdi-content-save</v-icon>
            Сохранить настройки
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Выбор бренда -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Выберите бренд</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedBrand"
              :items="brands"
              item-title="name"
              item-value="id"
              label="Бренд"
              variant="outlined"
              @update:model-value="loadBrandSettings"
            ></v-select>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Предпросмотр -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Предпросмотр игры</v-card-title>
          <v-card-text>
            <div class="brand-preview" :style="previewStyles">
              <div class="game-preview">
                <div class="target" :style="targetStyles">
                  <div class="target-center"></div>
                  <div class="target-rings">
                    <div class="ring ring-1"></div>
                    <div class="ring ring-2"></div>
                    <div class="ring ring-3"></div>
                  </div>
                </div>
                <div class="prizes">
                  <div class="prize" v-for="prize in previewPrizes" :key="prize.id" :style="prize.styles">
                    {{ prize.name }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <!-- Цветовая схема -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Цветовая схема</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="settings.colors.primary"
                  label="Основной цвет"
                  @update:model-value="updatePreview"
                ></v-color-picker>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="settings.colors.secondary"
                  label="Дополнительный цвет"
                  @update:model-value="updatePreview"
                ></v-color-picker>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="settings.colors.accent"
                  label="Акцентный цвет"
                  @update:model-value="updatePreview"
                ></v-color-picker>
              </v-col>
              <v-col cols="12" md="6">
                <v-color-picker
                  v-model="settings.colors.background"
                  label="Цвет фона"
                  @update:model-value="updatePreview"
                ></v-color-picker>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Настройки мишени -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Настройки мишени</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-slider
                  v-model="settings.target.size"
                  label="Размер мишени"
                  min="50"
                  max="200"
                  step="10"
                  thumb-label
                  @update:model-value="updatePreview"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="settings.target.style"
                  label="Стиль мишени"
                  :items="targetStyleOptions"
                  @update:model-value="updatePreview"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.target.showRings"
                  label="Показывать кольца"
                  @update:model-value="updatePreview"
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
          <v-card-title>Настройки призов</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.prizes.defaultPrize"
                  label="Приз по умолчанию"
                  @update:model-value="updatePreview"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="settings.prizes.count"
                  label="Количество призов"
                  min="3"
                  max="12"
                  step="1"
                  thumb-label
                  @update:model-value="updatePreview"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.prizes.showNames"
                  label="Показывать названия призов"
                  @update:model-value="updatePreview"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Логотип и изображения -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Логотип и изображения</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-file-input
                  v-model="settings.assets.logo"
                  label="Логотип бренда"
                  accept="image/*"
                  prepend-icon="mdi-image"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="settings.assets.background"
                  label="Фоновое изображение"
                  accept="image/*"
                  prepend-icon="mdi-image"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="settings.assets.logoPosition"
                  label="Позиция логотипа"
                  hint="top, bottom, left, right, center"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Настройки скидок по зонам -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Скидки по зонам попадания</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" v-for="(zone, index) in settings.discountZones" :key="index">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1">
                    Зона {{ index + 1 }}
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="zone.name"
                      label="Название зоны"
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
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-btn @click="addDiscountZone" class="mt-4">
              <v-icon left>mdi-plus</v-icon>
              Добавить зону
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

const selectedBrand = ref(null)
const saving = ref(false)

const brands = ref([
  { id: 1, name: 'Coca-Cola' },
  { id: 2, name: 'Pepsi' },
  { id: 3, name: 'Nike' },
  { id: 4, name: 'Adidas' }
])

const targetStyleOptions = [
  { title: 'Классическая', value: 'classic' },
  { title: 'Современная', value: 'modern' },
  { title: 'Минималистичная', value: 'minimal' }
]

const settings = ref({
  colors: {
    primary: '#1976D2',
    secondary: '#FFC107',
    accent: '#FF5722',
    background: '#F5F5F5'
  },
  target: {
    size: 120,
    style: 'classic',
    showRings: true
  },
  prizes: {
    defaultPrize: 'Подарок',
    count: 6,
    showNames: true
  },
  assets: {
    logo: null,
    background: null,
    logoPosition: 'top-right'
  },
  discountZones: [
    { name: 'Центр', discount: 50, color: '#FF0000' },
    { name: 'Средняя зона', discount: 30, color: '#FFA500' },
    { name: 'Внешняя зона', discount: 10, color: '#00FF00' }
  ]
})

const previewPrizes = computed(() => {
  const prizes = []
  for (let i = 0; i < settings.value.prizes.count; i++) {
    prizes.push({
      id: i,
      name: settings.value.prizes.defaultPrize,
      styles: {
        position: 'absolute',
        top: `${20 + (i * 60) % 200}px`,
        left: `${50 + (i * 80) % 300}px`,
        backgroundColor: settings.value.colors.accent,
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    })
  }
  return prizes
})

const previewStyles = computed(() => ({
  backgroundColor: settings.value.colors.background,
  padding: '20px',
  borderRadius: '8px',
  minHeight: '300px',
  position: 'relative'
}))

const targetStyles = computed(() => ({
  width: `${settings.value.target.size}px`,
  height: `${settings.value.target.size}px`,
  border: `4px solid ${settings.value.colors.primary}`,
  borderRadius: '50%',
  position: 'relative',
  margin: '20px auto',
  backgroundColor: settings.value.colors.secondary
}))

const loadBrandSettings = (brandId) => {
  // Загрузка настроек бренда (мок)
  console.log('Loading settings for brand:', brandId)
}

const updatePreview = () => {
  // Обновление предпросмотра
  console.log('Updating preview')
}

const addDiscountZone = () => {
  settings.value.discountZones.push({
    name: `Зона ${settings.value.discountZones.length + 1}`,
    discount: 5,
    color: '#808080'
  })
}

const saveSettings = async () => {
  saving.value = true
  // Сохранение настроек
  setTimeout(() => {
    saving.value = false
    console.log('Settings saved:', settings.value)
  }, 1000)
}

onMounted(() => {
  if (brands.value.length > 0) {
    selectedBrand.value = brands.value[0].id
    loadBrandSettings(selectedBrand.value)
  }
})
</script>

<style scoped>
.brand-preview {
  border: 2px dashed #ccc;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.game-preview {
  position: relative;
  height: 300px;
}

.target {
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-center {
  width: 20px;
  height: 20px;
  background-color: #000;
  border-radius: 50%;
  position: absolute;
  z-index: 3;
}

.ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  z-index: 2;
}

.ring-1 {
  width: 60px;
  height: 60px;
  border-color: #FF0000;
}

.ring-2 {
  width: 80px;
  height: 80px;
  border-color: #FFA500;
}

.ring-3 {
  width: 100px;
  height: 100px;
  border-color: #00FF00;
}

.prizes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
</style>

