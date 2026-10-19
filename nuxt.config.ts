// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/styles/main.less'
  ],
  runtimeConfig: {
    public: {
      apiAlias: process.env.NUXT_PUBLIC_API_ALIAS || 'groshev',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://naukatv.ru/api/test/materials'
    }
  },
  app: {
    head: {
      title: 'Моя Планета — Материалы',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Материалы телеканала Моя Планета — Цифровое Телевидение' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
