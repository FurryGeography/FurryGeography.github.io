import { z } from '@nuxt/content'
import { localizedTextSchema } from './common'

export const memberProfileSchema = z.object({
  // Identity
  slug: z.string().regex(/^[a-z0-9-]+$/i),
  group: z.enum([
    'researcher',
    'collaborator',
    'template'
  ]),
  order: z.number().int().optional(),

  // Names
  givenName: z.string().optional(),
  middleName: z.string().optional(),
  familyName: z.string().optional(),
  displayName: localizedTextSchema.optional(),
  nickname: localizedTextSchema.optional(),
  name: z.string().optional(),

  // Contact
  email: z.string().email().optional(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
      icon: z.string().optional()
    })
  ).optional(),

  // Academic profile
  role: localizedTextSchema.optional(),
  affiliation: localizedTextSchema.optional(),
  interests: localizedTextSchema.optional(),
  summary: localizedTextSchema.optional(),
  bio: localizedTextSchema.optional(),

  // Media
  photo: z.string()
    .regex(/^[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg|svg)$/i)
    .optional(),

  cv: z.string()
    .regex(/^[a-zA-Z0-9._-]+\.pdf$/i)
    .optional(),

  // Geographic coordinates
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }).optional(),

  // External profile
  profileUrl: z.string().url().optional()
})
