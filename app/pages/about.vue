<script setup lang="ts">
const { localize } = useLocalizedContent()

const { data: page } = await useAsyncData(
  'about',
  () => queryCollection('about').first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: () => localize(page.value?.hero.title),
  description: () => localize(page.value?.hero.description)
})
</script>

<template>
  <UPage v-if="page">
    <article class="mx-auto max-w-3xl px-6 pb-32 pt-28 md:pt-36">

      <!-- Introduction -->
      <header class="mb-20">
        <p
          class="mb-6 text-xs font-medium uppercase
                 tracking-widest text-muted"
        >
          {{ localize(page.hero.eyebrow) }}
        </p>

        <h1
          class="text-4xl font-semibold tracking-tight
                 sm:text-5xl md:text-6xl"
        >
          {{ localize(page.hero.title) }}
        </h1>

        <p
          class="mt-8 max-w-2xl text-lg leading-8
                 text-muted md:text-xl md:leading-9"
        >
          {{ localize(page.hero.description) }}
        </p>
      </header>

      <!-- Main Content -->
      <div class="border-t border-default pt-14">
        <section
          v-for="section in page.sections"
          :key="section.id"
          class="mb-16 last:mb-0"
        >
          <h2
            class="mb-6 text-2xl font-medium
                   tracking-tight text-highlighted"
          >
            {{ localize(section.title) }}
          </h2>

          <p
            class="text-base leading-8 text-muted
                   md:text-lg md:leading-9"
          >
            {{ localize(section.description) }}
          </p>
        </section>
      </div>

    </article>
  </UPage>
</template>