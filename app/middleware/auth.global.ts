export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Инициализируем аутентификацию при первом запуске
  authStore.initializeAuth()
  
  // Если пользователь авторизован и пытается зайти на страницы логина/регистрации
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/admin')
  }
})
