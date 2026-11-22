<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="flex items-center gap-1 text-xs">
    <NuxtLink
      :to="switchLocalePath('en')"
      :class="locale === 'en'
        ? 'font-semibold text-highlighted'
        : 'text-muted hover:text-highlighted'"
    >
      EN
    </NuxtLink>

    <span class="text-muted">/</span>

    <NuxtLink
      :to="switchLocalePath('zh')"
      :class="locale === 'zh'
        ? 'font-semibold text-highlighted'
        : 'text-muted hover:text-highlighted'"
    >
      中文
    </NuxtLink>
  </div>
</template>
