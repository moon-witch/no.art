// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    fallbackLocale: 'en',
    langDir: 'locales',
    lazy: true,
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'stay-a-while-locale',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },
})
