<script setup lang="ts">
const { localize } = useLocalizedContent()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(
  'collaborations',
  () => queryCollection('collaborations').first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const emailLink = computed(() => {
  if (!page.value) return ''
  const subject = encodeURIComponent(localize(page.value.subject))
  return `mailto:${page.value.email}?subject=${subject}`
})

useSeoMeta({
  title: () => localize(page.value?.hero.title),
  description: () => localize(page.value?.hero.description)
})
</script>

<template>
  <UPage v-if="page">
    <article class="mx-auto max-w-3xl px-6 pb-32 pt-28 md:pt-36">
      <header>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          {{ localize(page.hero.title) }}
        </h1>
        <p class="mt-8 text-lg leading-8 text-muted">
          {{ localize(page.hero.description) }}
        </p>
        <UButton
          :to="emailLink"
          :label="localize(page.emailButton)"
          icon="i-lucide-mail"
          color="neutral"
          size="lg"
          external
          class="mt-8"
        />
        <p
          v-if="page.email"
          class="mt-3 text-sm text-muted"
        >
          {{ page.email }}
        </p>
      </header>

      <section class="mt-16 border-t border-default pt-10">
        <h2 class="text-2xl font-medium">
          {{ localize(page.contactsTitle) }}
        </h2>
        <ul class="mt-6 divide-y divide-default">
          <li
            v-for="channel in page.channels"
            :key="channel.url"
            class="py-5"
          >
            <NuxtLink
              :to="channel.url.startsWith('/') ? localePath(channel.url) : channel.url"
              class="inline-flex items-center gap-2 font-medium text-highlighted hover:underline"
            >
              <UIcon
                :name="channel.icon || 'i-lucide-link'"
                class="size-5 shrink-0"
                aria-hidden="true"
              />
              {{ localize(channel.label) }}
            </NuxtLink>
            <p class="mt-1 text-sm leading-6 text-muted">
              {{ localize(channel.description) }}
            </p>
          </li>
        </ul>
      </section>
    </article>
  </UPage>
</template>
