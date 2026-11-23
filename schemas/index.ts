import { z } from '@nuxt/content'
import {
  localizedTextSchema,
  heroSchema
} from './common'

export const indexSchema = z.object({
  hero: heroSchema.extend({
    explore: localizedTextSchema
  }),

  research: z.object({
    title: localizedTextSchema,
    areas: z.array(
      z.object({
        id: z.string(),
        title: localizedTextSchema,
        description: localizedTextSchema
      })
    )
  }),

  collaborations: z.object({
    title: localizedTextSchema,
    description: localizedTextSchema
  })
})
