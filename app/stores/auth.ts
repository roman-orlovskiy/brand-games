import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed свойства
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => user.value?.name || '')

  // Действия
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Имитация проверки данных
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        user.value = {
          id: '1',
          email: credentials.email,
          name: 'Администратор',
          createdAt: new Date().toISOString()
        }
        
        // Сохраняем в localStorage для имитации сессии (только на клиенте)
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(user.value))
        }
        return true
      } else {
        error.value = 'Неверный email или пароль'
        return false
      }
    } catch {
      error.value = 'Произошла ошибка при входе'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Имитация проверки данных
      if (credentials.password !== credentials.confirmPassword) {
        error.value = 'Пароли не совпадают'
        return false
      }

      if (credentials.password.length < 6) {
        error.value = 'Пароль должен содержать минимум 6 символов'
        return false
      }

      // Имитация успешной регистрации
      user.value = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString()
      }

      // Сохраняем в localStorage для имитации сессии (только на клиенте)
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
      return true
    } catch {
      error.value = 'Произошла ошибка при регистрации'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth_user')
    }
    error.value = null
  }

  const initializeAuth = () => {
    // Проверяем localStorage при инициализации только на клиенте
    if (process.client) {
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch {
          localStorage.removeItem('auth_user')
        }
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Состояние
    user,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    userEmail,
    userName,
    
    // Действия
    login,
    register,
    logout,
    initializeAuth,
    clearError
  }
})
