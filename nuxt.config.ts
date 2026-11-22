// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  ui: {
    eslint: {
      rules: {
        'no-unknown-classes': 'error',
        'no-conflicting-classes': 'error',
        'no-palette-colors': 'error'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    zeroRuntime: true
  },

  nitro: {
    publicAssets: [
      {
        dir: './content/members',
        baseURL: '/member-assets'
      }
    ],

    prerender: {
      routes: [
        '/',
        '/zh',
        '/members',
        '/zh/members'
      ],
      crawlLinks: true
    }
  },


  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        file: 'en.json'
      },
      {
        code: 'zh',
        name: '简体中文',
        language: 'zh-CN',
        file: 'zh.json'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    baseUrl: 'https://furrygeography.github.io'
  }
})
