<script setup lang="ts">
import type {
  NavigationMenuItem,
  DropdownMenuItem
} from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const { t, locale, locales, setLocale } = useI18n()

// Language
const currentLanguage = computed(() => {
  const current = locales.value.find(
    item => (typeof item === 'string'
      ? item
      : item.code) === locale.value
  )

  if (typeof current === 'string') return current

  return current?.name || locale.value
})

// i18n
const languageItems = computed<DropdownMenuItem[]>(() =>
  locales.value.map((item) => {
    const code = typeof item === 'string'
      ? item
      : item.code

    const name = typeof item === 'string'
      ? item
      : item.name || item.code

    return {
      label: name,
      icon: code === locale.value
        ? 'i-lucide-check'
        : undefined,

      onSelect: () => {
        void setLocale(code)
      }
    }
  })
)

// Small screen
const mobileItems = computed<DropdownMenuItem[]>(() =>
  props.links.map(item => ({
    label: item.label,
    icon: item.icon,
    to: item.to
  }))
)
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full
           border-b border-default
           bg-default
           shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
  >
    <div
      class="mx-auto grid h-[76px] max-w-[1600px]
             grid-cols-[1fr_auto]
             items-center px-4 sm:px-8
             xl:grid-cols-[1fr_auto_1fr]"
    >
      <!-- Left: mobile -->
      <NuxtLink
        to="/"
        class="text-sm font-semibold
               tracking-tight text-highlighted
               xl:invisible"
      >
        {{ t('nav.title') }}
      </NuxtLink>

      <!-- Middle: navigation -->
      <UNavigationMenu
        :items="links"
        variant="link"
        color="neutral"
        class="hidden xl:flex"
        :ui="{
          link: 'px-3 py-2 text-sm font-medium',
          linkLeadingIcon: 'hidden'
        }"
      />

      <!-- Right: langguage and search -->
      <div
        class="flex items-center justify-end
               gap-1 sm:gap-2"
      >
        <!-- Search -->
        <UContentSearchButton
          color="neutral"
          variant="ghost"
          size="lg"
          tooltip
        />

        <!-- Dark -->
        <ColorModeButton />

        <!-- Language -->
        <UDropdownMenu
          :items="languageItems"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-globe"
            trailing-icon="i-lucide-chevron-down"
            :label="currentLanguage"
            class="text-sm"
          />
        </UDropdownMenu>

        <!-- Small screen -->
        <UDropdownMenu
          :items="mobileItems"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            aria-label="Open navigation menu"
            class="xl:hidden"
          />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
