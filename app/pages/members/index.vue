<script setup lang="ts">
import { formatMemberHeading, formatMemberName, memberComparator } from '~/utils/memberName'

const { locale } = useI18n()
const { localize } = useLocalizedContent()
const localePath = useLocalePath()
const brokenPhotos = ref<Record<string, boolean>>({})

const { data: page } = await useAsyncData(
  'members-page',
  () => queryCollection('members').first()
)

const { data: profiles } = await useAsyncData(
  'member-directory',
  () => queryCollection('memberProfiles').all()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Members page not found',
    fatal: true
  })
}

const sortedProfiles = computed(() =>
  [...(profiles.value ?? [])].sort(memberComparator(locale.value))
)

const groups = computed(() => {
  if (!page.value) return []

  return [
    {
      id: 'researcher',
      ...page.value.researchers,
      people: sortedProfiles.value.filter(
        member => member.group === 'researcher'
      )
    },
    {
      id: 'collaborator',
      ...page.value.collaborators,
      people: sortedProfiles.value.filter(
        member => member.group === 'collaborator'
      )
    }
  ]
})

const mappedMembers = computed(() => {
  const visibleMembers = groups.value.flatMap(group => group.people)

  return visibleMembers.flatMap((member) => {
    if (!member.coordinates) return []

    return [{
      latitude: member.coordinates.latitude,
      longitude: member.coordinates.longitude,
      slug: member.slug,
      name: formatMemberHeading(member, locale.value) || member.slug,
      href: member.profileUrl || localePath(`/members/${member.slug}`),
      external: Boolean(member.profileUrl)
    }]
  })
})

useSeoMeta({
  title: () => localize(page.value?.hero.title),
  description: () => localize(page.value?.hero.description)
})
</script>

<template>
  <UPage v-if="page">
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-36">
      <p class="mb-6 text-xs font-medium uppercase tracking-widest text-muted">
        {{ localize(page.hero.eyebrow) }}
      </p>

      <h1 class="text-5xl font-semibold tracking-tight md:text-7xl">
        {{ localize(page.hero.title) }}
      </h1>

      <p class="mt-8 max-w-2xl text-lg leading-8 text-muted">
        {{ localize(page.hero.description) }}
      </p>
    </section>

    <!-- Member Groups -->
    <section
      v-for="group in groups"
      :key="group.id"
      class="mx-auto max-w-6xl px-6 pb-24"
    >
      <div class="border-t border-default pt-10">
        <h2 class="text-3xl font-medium tracking-tight">
          {{ localize(group.title) }}
        </h2>

        <p class="mb-12 mt-4 max-w-2xl leading-7 text-muted">
          {{ localize(group.description) }}
        </p>

        <div
          v-if="group.people.length"
          class="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2"
        >
          <article
            v-for="member in group.people"
            :key="member.slug"
            class="flex min-w-0 items-start gap-5 border-b border-default pb-8"
          >
            <!-- Portrait -->
            <div
              class="h-36 w-28 shrink-0 overflow-hidden rounded-md bg-elevated sm:h-40 sm:w-32"
            >
              <img
                v-if="member.photo && !brokenPhotos[member.slug]"
                :src="`/member-assets/${member.slug}/${member.photo}`"
                :alt="formatMemberName(member, locale)"
                loading="lazy"
                class="h-full w-full object-cover"
                @error="brokenPhotos[member.slug] = true"
              >

              <div
                v-else
                class="flex h-full items-center justify-center"
              >
                <UIcon
                  name="i-lucide-user-round"
                  class="size-10 text-muted"
                />
              </div>
            </div>

            <!-- Member Information -->
            <div class="flex min-w-0 flex-1 flex-col">
              <h3 class="text-lg font-semibold text-highlighted">
                {{ formatMemberHeading(member, locale) }}
              </h3>

              <p
                v-if="member.role"
                class="mt-1 text-sm font-medium"
              >
                {{ localize(member.role) }}
              </p>

              <p
                v-if="member.affiliation"
                class="mt-1 text-sm text-muted"
              >
                {{ localize(member.affiliation) }}
              </p>

              <p
                v-if="member.interests"
                class="mt-3 text-sm leading-6 text-muted"
              >
                {{ localize(member.interests) }}
              </p>

              <p
                v-if="member.summary"
                class="mt-3 text-sm leading-6 text-muted"
              >
                {{ localize(member.summary) }}
                <!-- Optional Email -->
                <a
                  v-if="member.email"
                  :href="`mailto:${member.email}`"
                  class="mt-3 block w-fit break-all text-sm text-muted hover:text-highlighted hover:underline"
                >
                  {{ member.email }}
                </a>
              </p>

              <!-- Profile Link -->
              <NuxtLink
                :to="member.profileUrl || localePath(`/members/${member.slug}`)"
                :target="member.profileUrl ? '_blank' : undefined"
                :rel="member.profileUrl ? 'noopener noreferrer' : undefined"
                class="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-highlighted hover:underline"
              >
                {{ localize(page.ui.profile) }}

                <UIcon
                  :name="member.profileUrl
                    ? 'i-lucide-arrow-up-right'
                    : 'i-lucide-arrow-right'"
                  class="size-4"
                />
              </NuxtLink>
            </div>
          </article>
        </div>

        <p
          v-else
          class="py-8 text-sm text-muted"
        >
          {{ localize(group.empty) }}
        </p>
      </div>
    </section>

    <!-- Map -->
    <MembersLocationMap
      v-if="mappedMembers.length"
      :key="locale"
      :members="mappedMembers"
    />

    <!-- Join Us -->
    <section class="mx-auto max-w-6xl px-6 pb-28">
      <div class="border-t border-default pt-10">
        <div class="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div class="max-w-2xl">
            <p class="mb-5 text-xs font-medium uppercase tracking-widest text-muted">
              {{ localize(page.join.eyebrow) }}
            </p>

            <h2 class="text-3xl font-medium tracking-tight md:text-4xl">
              {{ localize(page.join.title) }}
            </h2>

            <p class="mt-5 leading-8 text-muted">
              {{ localize(page.join.description) }}
            </p>
          </div>

          <UButton
            :to="localePath('/collaborations')"
            :label="localize(page.join.button)"
            trailing-icon="i-lucide-arrow-up-right"
            color="neutral"
            size="lg"
            class="w-fit shrink-0"
          />
        </div>
      </div>
    </section>
  </UPage>
</template>
