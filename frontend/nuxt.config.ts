// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    }
  }
})
