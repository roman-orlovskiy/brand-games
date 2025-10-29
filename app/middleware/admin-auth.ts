export default defineNuxtRouteMiddleware((_to) => {
  const authStore = useAuthStore()

  // Проверяем только на клиенте, так как используется localStorage
  if (import.meta.client) {
    authStore.initializeAuth()

    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
  }
})


