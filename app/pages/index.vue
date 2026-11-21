<script setup lang="ts">
const { t } = useI18n()
const { localize } = useLocalizedContent()

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
  title: () => t('home.title'),
  description: () => t('home.description')
})

const { locale } = useI18n()

const { data: researchAreasData } = await useAsyncData(
  'research-areas',
  () => queryCollection('researchAreas').first()
)

const researchAreas = computed(
  () => researchAreasData.value?.areas ?? []
)
</script>

<template>
  <UPage v-if="page">
    <!-- Hero -->
    <section class="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
      <p class="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
        {{ $t('home.eyebrow') }}
      </p>

      <h1 class="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
        {{ $t('home.title') }}
      </h1>

      <p class="mt-8 max-w-2xl text-lg leading-8 text-muted">
        	{{ $t('home.description') }}
      </p>

      <div class="mt-10">
        <UButton
          to="/about"
          :label="$t('home.explore')"
          color="neutral"
          size="lg"
        />
      </div>
    </section>

    <!-- Research -->
    <section class="mx-auto max-w-5xl px-6 pb-24">
      <div class="border-t border-default pt-10">
        <h2 class="mb-8 text-3xl font-medium">
          {{ $t('home.research') }}
        </h2>

        <div
          v-for="(area, index) in researchAreas"
          :key="area.id"
        >
          <h3>
            {{ localize(area.title) }}
          </h3>

          <p>
            {{ localize(area.description) }}
          </p>
        </div>
      </div>
    </section>


    <!-- Collaboration -->
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <div class="border-t border-default pt-10">
        <h2 class="text-3xl font-medium">
          {{ $t('home.collaborations') }}
        </h2>

        <p class="mt-6 max-w-2xl leading-7 text-muted">
          We welcome collaboration across geography,
          GIScience, social sciences, and computational
          research related to furry communities.
        </p>
      </div>
    </section>
  </UPage>
</template>
