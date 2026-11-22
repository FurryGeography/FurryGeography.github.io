<script setup lang="ts">
const { localize } = useLocalizedContent()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(
  'index',
  () => queryCollection('index').first()
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
    <!-- Hero -->
    <section class="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
      <p class="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
        {{ localize(page.hero.eyebrow) }}
      </p>

      <h1 class="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
        {{ localize(page.hero.title) }}
      </h1>

      <p class="mt-8 max-w-2xl text-lg leading-8 text-muted">
        {{ localize(page.hero.description) }}
      </p>

      <div class="mt-10">
        <UButton
          :to="localePath('/about')"
          :label="localize(page.hero.explore)"
          color="neutral"
          size="lg"
        />
      </div>
    </section>

        
    <!-- Research -->
    <section class="mx-auto max-w-5xl px-6 pb-24">
      <div class="border-t border-default pt-10">

        <!-- Section Heading -->
        <div class="mb-8 flex items-end justify-between gap-4">
          <h2 class="text-3xl font-medium tracking-tight">
            {{ localize(page.research.title) }}
          </h2>

          <span class="font-mono text-xs text-muted">
            {{ String(page.research.areas.length).padStart(2, '0') }}
          </span>
        </div>

        <!-- Research List -->
        <div class="border-t border-default">
          <div
            v-for="(area, index) in page.research.areas"
            :key="area.id"
            class="grid grid-cols-[3rem_minmax(0,1fr)]
                  gap-4 border-b border-default py-8
                  sm:grid-cols-[4rem_minmax(0,1fr)]
                  sm:gap-8"
          >
            <!-- Number -->
            <span class="pt-1 font-mono text-xs text-muted">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <!-- Content -->
            <div
              class="grid gap-3
                    lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
                    lg:gap-8"
            >
              <h3 class="text-xl font-medium leading-snug text-highlighted">
                {{ localize(area.title) }}
              </h3>

              <p class="max-w-xl text-sm leading-7 text-muted sm:text-base">
                {{ localize(area.description) }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>


    <!-- Collaboration -->
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <div class="border-t border-default pt-10">
        <h2 class="text-3xl font-medium">
          {{ localize(page.collaborations.title) }}
        </h2>

        <p class="mt-6 max-w-2xl leading-7 text-muted">
          {{ localize(page.collaborations.description) }}
        </p>
      </div>
    </section>
  </UPage>
</template>
