<template>
  <div class="index-page">
    <div class="index-page__container">
      <div class="index-page__content">
        <h1 class="index-page__title">Добро пожаловать!</h1>
        <p class="index-page__subtitle">Система управления брендовыми играми</p>
        
        <div class="index-page__actions">
          <UButton 
            v-if="isAuthenticated"
            @click="goToAdmin"
            size="lg"
            class="index-page__button"
          >
            Перейти в админ-панель
          </UButton>
          
          <div v-else class="index-page__auth-buttons">
            <UButton 
              @click="goToLogin"
              size="lg"
              class="index-page__button"
            >
              Войти
            </UButton>
            
            <UButton 
              @click="goToRegister"
              variant="outline"
              size="lg"
              class="index-page__button"
            >
              Зарегистрироваться
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Мета-данные страницы
definePageMeta({
  layout: false,
  title: 'Главная страница'
})

// Store аутентификации
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// Инициализируем аутентификацию
authStore.initializeAuth()

// Методы навигации
const goToAdmin = () => {
  navigateTo('/admin')
}

const goToLogin = () => {
  navigateTo('/login')
}

const goToRegister = () => {
  navigateTo('/register')
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;

  &__container {
    width: 100%;
    max-width: 600px;
  }

  &__content {
    text-align: center;
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  &__subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
  }

  &__actions {
    margin-top: 2rem;
  }

  &__auth-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__button {
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .index-page {
    &__auth-buttons {
      flex-direction: column;
      align-items: center;
    }

    &__button {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style>