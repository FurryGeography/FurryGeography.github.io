import { existsSync } from 'node:fs'

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
  },

  hooks: {
    'content:file:afterParse'({ collection, file, content }) {
      if (collection.name !== 'memberProfiles') return

      // Get the name of the parent directory of profile.yml
      const slug = file.id.split(/[/\\:]/).at(-2)

      if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        throw new Error(`Invalid member directory name: ${file.id}`)
      }

      content.slug = slug
      if (!content.photo) {
        const defaultPhoto = new URL(
          `./content/members/${slug}/photo.jpg`,
          import.meta.url
        )

        if (existsSync(defaultPhoto)) {
          content.photo = 'photo.jpg'
        }
      }
    }
  },
})
