<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Вход в админ панель</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
                    type="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="form.password"
                    label="Пароль"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login" :loading="loading">
                  Войти
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Email должен быть валидным'
]

const passwordRules = [
  v => !!v || 'Пароль обязателен',
  v => v.length >= 6 || 'Пароль должен содержать минимум 6 символов'
]

const login = async () => {
  loading.value = true
  
  // Мок аутентификация
  setTimeout(() => {
    if (form.value.email === 'admin@brandgames.com' && form.value.password === 'admin123') {
      // Сохраняем токен в localStorage
      localStorage.setItem('adminToken', 'mock-jwt-token')
      navigateTo('/admin')
    } else {
      alert('Неверные учетные данные')
    }
    loading.value = false
  }, 1000)
}

// Проверяем, авторизован ли пользователь
onMounted(() => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    navigateTo('/admin')
  }
})
</script>
