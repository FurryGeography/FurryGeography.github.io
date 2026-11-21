<script setup lang="ts">
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
  title: page.value.seo?.title || page.value.title,
  description:
    page.value.seo?.description || page.value.description
})

const researchAreas = [
  {
    title: 'Digital Geographies',
    description:
      'Exploring online communities, virtual spaces, and digital interactions.'
  },
  {
    title: 'Spatial Social Networks',
    description:
      'Understanding geographical relationships within social networks.'
  },
  {
    title: 'Furry Communities & Places',
    description:
      'Studying conventions, mobility, and the spatial organization of furry communities.'
  }
]
</script>

<template>
  <UPage v-if="page">
    <!-- Hero -->
    <section class="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
      <p class="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
        An Independent Academic Network
      </p>

      <h1 class="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
        {{ page.title }}
      </h1>

      <p class="mt-8 max-w-2xl text-lg leading-8 text-muted">
        {{ page.description }}
      </p>

      <div class="mt-10">
        <UButton
          to="/about"
          label="Explore the Network"
          color="neutral"
          size="lg"
        />
      </div>
    </section>

    <!-- Research -->
    <section class="mx-auto max-w-5xl px-6 pb-24">
      <div class="border-t border-default pt-10">
        <h2 class="mb-8 text-3xl font-medium">
          Research Interests
        </h2>

        <div
          v-for="(area, index) in researchAreas"
          :key="area.title"
          class="flex gap-6 border-b border-default py-6"
        >
          <span class="text-sm text-muted">
            0{{ index + 1 }}
          </span>

          <div>
            <h3 class="text-xl font-medium">
              {{ area.title }}
            </h3>
            <p class="mt-2 text-muted">
              {{ area.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Collaboration -->
    <section class="mx-auto max-w-5xl px-6 pb-28">
      <div class="border-t border-default pt-10">
        <h2 class="text-3xl font-medium">
          Open Collaborations
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
