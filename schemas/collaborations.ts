import { z } from '@nuxt/content'
import { localizedTextSchema } from './common'

export const collaborationsSchema = z.object({
  hero: z.object({
    title: localizedTextSchema,
    description: localizedTextSchema
  }),

  email: z.string().email(),
  emailButton: localizedTextSchema,
  subject: localizedTextSchema,
  contactsTitle: localizedTextSchema,

  channels: z.array(
    z.object({
      icon: z.string().optional(),
      label: localizedTextSchema,
      description: localizedTextSchema,
      url: z.string()
    })
  )
})
