import { z } from '@nuxt/content'
import {
  localizedTextSchema,
  heroSchema
} from './common'

export const aboutSchema = z.object({
  hero: heroSchema,

  sections: z.array(
    z.object({
      id: z.string(),
      title: localizedTextSchema,
      description: localizedTextSchema
    })
  )
})
