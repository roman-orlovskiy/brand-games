<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Настройки системы</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-cog</v-icon>
            Общие настройки
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="settings.siteName"
                label="Название сайта"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-textarea
                v-model="settings.description"
                label="Описание сайта"
                variant="outlined"
                rows="3"
                class="mb-4"
              ></v-textarea>

              <v-text-field
                v-model="settings.contactEmail"
                label="Контактный email"
                variant="outlined"
                type="email"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="settings.contactPhone"
                label="Контактный телефон"
                variant="outlined"
                class="mb-4"
              ></v-text-field>

              <v-switch
                v-model="settings.maintenanceMode"
                label="Режим обслуживания"
                color="warning"
                class="mb-4"
              ></v-switch>

              <v-btn color="primary" @click="saveSettings">
                Сохранить настройки
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-gamepad-variant</v-icon>
            Настройки игр
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="gameSettings.maxGamesPerUser"
                label="Максимум игр на пользователя"
                variant="outlined"
                type="number"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="gameSettings.gameTimeout"
                label="Таймаут игры (секунды)"
                variant="outlined"
                type="number"
                class="mb-4"
              ></v-text-field>

              <v-switch
                v-model="gameSettings.allowMultipleGames"
                label="Разрешить несколько игр одновременно"
                color="success"
                class="mb-4"
              ></v-switch>

              <v-switch
                v-model="gameSettings.requireRegistration"
                label="Требовать регистрацию для игры"
                color="info"
                class="mb-4"
              ></v-switch>

              <v-btn color="primary" @click="saveGameSettings">
                Сохранить настройки игр
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-gift</v-icon>
            Настройки призов
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="prizeSettings.minPrizeValue"
                    label="Минимальная стоимость приза"
                    variant="outlined"
                    type="number"
                    suffix="₽"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="prizeSettings.maxPrizeValue"
                    label="Максимальная стоимость приза"
                    variant="outlined"
                    type="number"
                    suffix="₽"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="prizeSettings.dailyPrizeLimit"
                    label="Лимит призов в день"
                    variant="outlined"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn color="primary" @click="savePrizeSettings">
                Сохранить настройки призов
              </v-btn>
            </v-form>
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

const settings = ref({
  siteName: 'Brand Games',
  description: 'Интерактивные игры с призами и брендингом',
  contactEmail: 'admin@brandgames.ru',
  contactPhone: '+7 (999) 123-45-67',
  maintenanceMode: false
})

const gameSettings = ref({
  maxGamesPerUser: 5,
  gameTimeout: 60,
  allowMultipleGames: true,
  requireRegistration: true
})

const prizeSettings = ref({
  minPrizeValue: 100,
  maxPrizeValue: 5000,
  dailyPrizeLimit: 100
})

const saveSettings = () => {
  console.log('Сохранение общих настроек:', settings.value)
  // Здесь будет логика сохранения
}

const saveGameSettings = () => {
  console.log('Сохранение настроек игр:', gameSettings.value)
  // Здесь будет логика сохранения
}

const savePrizeSettings = () => {
  console.log('Сохранение настроек призов:', prizeSettings.value)
  // Здесь будет логика сохранения
}
</script>
