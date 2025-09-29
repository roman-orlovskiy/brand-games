export default defineNuxtRouteMiddleware((to, from) => {
  // Проверяем наличие токена в localStorage
  if (process.client) {
    const token = localStorage.getItem('adminToken')
    
    if (!token && to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }
    
    if (token && to.path === '/admin/login') {
      return navigateTo('/admin')
    }
  }
})
