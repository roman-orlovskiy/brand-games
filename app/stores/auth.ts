import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  companyName?: string
  role?: string
  createdAt: string
  updatedAt?: string
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
      const response = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      user.value = response.user
      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Произошла ошибка при входе'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Проверка паролей на клиенте
      if (credentials.password !== credentials.confirmPassword) {
        error.value = 'Пароли не совпадают'
        return false
      }

      if (credentials.password.length < 6) {
        error.value = 'Пароль должен содержать минимум 6 символов'
        return false
      }

      const response = await $fetch<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name
        }
      })
      
      user.value = response.user
      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Произошла ошибка при регистрации'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (err: any) {
      // Игнорируем ошибки при выходе
      console.error('Ошибка при выходе:', err)
    } finally {
      // Очищаем состояние пользователя в любом случае
      user.value = null
      error.value = null
      isLoading.value = false
    }
  }

  const initializeAuth = async () => {
    // Загружаем пользователя через API при инициализации только на клиенте
    if (import.meta.client) {
      try {
        const response = await $fetch<{ user: User }>('/api/auth/me', {
          method: 'GET'
        })
        
        user.value = response.user
      } catch (err) {
        // Если не авторизован, просто очищаем состояние
        user.value = null
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
