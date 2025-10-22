// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    host: '127.0.0.1', // Явно указываем IPv4 localhost
    port: 8080
  },

  vite: {
    server: {
      allowedHosts: [
        'a5d807-2a05-fc1-40-3a--c.ru.tuna.am', // Ваш туннель
        'all' // Разрешить все хосты для туннелирования
      ]
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/eslint'
  ],

  css: ['~/assets/css/main.css'],
})