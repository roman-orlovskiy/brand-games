export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Все редиректы завязанные на localStorage выполняем только на клиенте
  if (import.meta.client) {
    authStore.initializeAuth()

    if (to.path.startsWith('/admin') && !authStore.isAuthenticated) {
      return navigateTo('/login')
    }

    if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
      return navigateTo('/admin')
    }
  }
})


