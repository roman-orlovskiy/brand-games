export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Работает только на клиенте, так как используем localStorage
  if (import.meta.client) {
    authStore.initializeAuth()

    // Редиректим авторизованного пользователя со страниц логина/регистрации
    if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
      return navigateTo('/admin')
    }
  }
})
