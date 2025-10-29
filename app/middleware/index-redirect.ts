export default defineNuxtRouteMiddleware((to) => {
  // Редиректим только с главной страницы
  if (to.path === '/') {
    const authStore = useAuthStore()

    // Инициализируем аутентификацию на клиенте
    if (import.meta.client) {
      authStore.initializeAuth()

      // Если авторизован - редирект на админ-панель
      if (authStore.isAuthenticated) {
        return navigateTo('/admin')
      }
    }

    // По умолчанию редирект на логин
    return navigateTo('/login')
  }
})

