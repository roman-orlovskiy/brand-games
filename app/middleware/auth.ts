export default defineNuxtRouteMiddleware((_to) => {
  const authStore = useAuthStore()
  
  // Инициализируем аутентификацию при первом запуске
  authStore.initializeAuth()
  
  // Если пользователь не авторизован, редиректим на логин
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
