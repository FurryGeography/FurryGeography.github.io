<script setup lang="ts">
import { formatMemberHeading, formatMemberName } from '~/utils/memberName'

const route = useRoute()
const localePath = useLocalePath()
const { localize } = useLocalizedContent()
const { t, locale } = useI18n()
const photoFailed = ref(false)

const slug = computed(() => String(route.params.slug))

const { data: page } = await useAsyncData(
  'members-page',
  () => queryCollection('members').first()
)

const { data: member } = await useAsyncData(
  () => `member-profile-${slug.value}`,
  () => queryCollection('memberProfiles')
    .where('slug', '=', slug.value)
    .first()
)

if (!member.value || member.value.profileUrl) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Profile not found',
    fatal: true
  })
}

useSeoMeta({
  title: () => member.value ? formatMemberName(member.value, locale.value) : undefined,
  description: () => localize(member.value?.summary)
})

const bioParagraphs = computed(() => {
  const text = localize(member.value?.bio) || ''

  return text
    .trim()
    .split(/\n\s*\n/)
    .map(paragraph =>
      paragraph.replace(/\s*\n\s*/g, ' ').trim()
    )
    .filter(Boolean)
})
</script>

<template>
  <UPage v-if="page && member">
    <article class="mx-auto max-w-4xl px-6 pb-32 pt-28 md:pt-36">
      <!-- Back -->
      <NuxtLink
        :to="localePath('/members')"
        class="mb-14 inline-flex items-center gap-2 text-sm text-muted hover:text-highlighted"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        {{ localize(page.ui.back) }}
      </NuxtLink>

      <!-- Profile Header -->
      <header class="grid gap-10 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <!-- Left: Photo & Contact -->
        <div>
          <!-- Photo -->
          <div class="aspect-[3/4] overflow-hidden rounded-lg bg-elevated">
            <img
              v-if="member.photo && !photoFailed"
              :src="`/member-assets/${member.slug}/${member.photo}`"
              :alt="formatMemberName(member, locale)"
              class="h-full w-full object-cover"
              @error="photoFailed = true"
            >

            <div
              v-else
              class="flex h-full items-center justify-center"
            >
              <UIcon
                name="i-lucide-user-round"
                class="size-16 text-muted"
              />
            </div>
          </div>

          <!-- Optional Email -->
          <div
            v-if="member.email"
            class="mt-8"
          >
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted">
              {{ t('email') }}
            </h2>

            <a
              :href="`mailto:${member.email}`"
              class="mt-3 block break-all text-sm text-highlighted hover:underline"
            >
              {{ member.email }}
            </a>
          </div>

          <!-- Optional Links -->
          <div
            v-if="member.links?.length"
            class="mt-8"
          >
            <h2 class="text-xs font-semibold uppercase tracking-widest text-muted">
              {{ t('online') }}
            </h2>

            <div class="mt-3 flex flex-col items-start gap-2">
              <a
                v-for="link in member.links"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex max-w-full items-center gap-1 text-sm text-highlighted hover:underline"
              >
                <UIcon
                  v-if="link.icon"
                  :name="link.icon"
                  class="size-4 shrink-0"
                  aria-hidden="true"
                />
                <span class="break-words">{{ link.label }}</span>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-3 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
        <!-- Right: context -->
        <div>
          <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
            {{ formatMemberHeading(member, locale) }}
          </h1>

          <p
            v-if="member.role"
            class="mt-5 text-lg"
          >
            {{ localize(member.role) }}
          </p>

          <p
            v-if="member.affiliation"
            class="mt-2 text-muted"
          >
            {{ localize(member.affiliation) }}
          </p>

          <p
            v-if="member.summary"
            class="mt-6 leading-7 text-muted"
          >
            {{ localize(member.summary) }}
          </p>

          <div
            v-if="member.interests"
            class="mt-8 border-t border-default pt-5"
          >
            <p class="text-sm font-medium">
              {{ localize(page.ui.specialties) }}
            </p>

            <p class="mt-2 leading-7 text-muted">
              {{ localize(member.interests) }}
            </p>
          </div>

          <!-- Optional CV -->
          <a
            v-if="member.cv"
            :href="`/member-assets/${member.slug}/${member.cv}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-highlighted hover:underline"
          >
            <UIcon
              name="i-lucide-file-text"
              class="size-4"
            />
            {{ localize(page.ui.cv) }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-4"
            />
          </a>
        </div>
      </header>

      <!-- Biography -->
      <section
        v-if="bioParagraphs.length"
        class="mt-16 border-t border-default pt-12"
      >
        <div class="mx-auto max-w-3xl space-y-6">
          <p
            v-for="(paragraph, index) in bioParagraphs"
            :key="index"
            class="text-base leading-8 text-muted md:text-lg md:leading-9"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>
    </article>
  </UPage>
</template>
