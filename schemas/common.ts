import { z } from '@nuxt/content'

// Localized text, e.g. { en: "...", zh: "..." }
export const localizedTextSchema = z.record(
  z.string(),
  z.string()
)

// Shared hero fields
export const heroSchema = z.object({
  eyebrow: localizedTextSchema,
  title: localizedTextSchema,
  description: localizedTextSchema
})
