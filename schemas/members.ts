import { z } from '@nuxt/content'
import {
  localizedTextSchema,
  heroSchema
} from './common'

// Shared researcher / collaborator section
const memberGroupSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  empty: localizedTextSchema
})

export const membersSchema = z.object({
  hero: heroSchema,

  researchers: memberGroupSchema,
  collaborators: memberGroupSchema,

  ui: z.object({
    profile: localizedTextSchema,
    specialties: localizedTextSchema,
    interests: localizedTextSchema,
    back: localizedTextSchema,
    cv: localizedTextSchema
  }),

  join: z.object({
    eyebrow: localizedTextSchema,
    title: localizedTextSchema,
    description: localizedTextSchema,
    button: localizedTextSchema
  }),

  email: localizedTextSchema,
  online: localizedTextSchema
})
