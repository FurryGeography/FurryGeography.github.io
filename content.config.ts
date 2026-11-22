
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const localizedTextSchema = z.record(z.string(), z.string())

const imageSchema = z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

// Researcher public schema
const memberSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  role: localizedTextSchema.optional(),
  affiliation: localizedTextSchema.optional(),
  interests: localizedTextSchema.optional(),
  image: z.string().optional(),
  email: z.string().email().optional(),
  profileUrl: z.string().url().optional(),
  bio: localizedTextSchema.optional()
})

const memberGroupSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  empty: localizedTextSchema,
  people: z.array(memberSchema),
  email: z.string().email().optional(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url()
    })
  ).optional(),
})

const memberProfileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  group: z.enum(['researcher', 'collaborator']),
  order: z.number().int().optional(),

  name: z.string(),
  role: localizedTextSchema.optional(),
  affiliation: localizedTextSchema.optional(),
  interests: localizedTextSchema.optional(),
  summary: localizedTextSchema.optional(),
  bio: localizedTextSchema.optional(),

  photo: z.string()
    .regex(/^[a-zA-Z0-9._-]+\.(webp|png|jpg|jpeg)$/i)
    .optional(),

  cv: z.string()
    .regex(/^[a-zA-Z0-9._-]+\.pdf$/i)
    .optional(),

  profileUrl: z.string().url().optional()
})


export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        hero: z.object({
          eyebrow: localizedTextSchema,
          title: localizedTextSchema,
          description: localizedTextSchema,
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
    }),
    
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        hero: z.object({
          eyebrow: z.record(z.string(), z.string()),
          title: z.record(z.string(), z.string()),
          description: z.record(z.string(), z.string())
        }),
        sections: z.array(
          z.object({
            id: z.string(),
            title: z.record(z.string(), z.string()),
            description: z.record(z.string(), z.string())
          })
        )
      })
    }),
    
    members: defineCollection({
      type: 'page',
      source: 'members/index.yml',
      schema: z.object({
        hero: z.object({
          eyebrow: localizedTextSchema,
          title: localizedTextSchema,
          description: localizedTextSchema
        }),
        researchers: z.object({
          title: localizedTextSchema,
          description: localizedTextSchema,
          empty: localizedTextSchema
        }),
        collaborators: z.object({
          title: localizedTextSchema,
          description: localizedTextSchema,
          empty: localizedTextSchema
        }),
        ui: z.object({
          profile: localizedTextSchema,
          specialties: localizedTextSchema,
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
        online: localizedTextSchema,
      })
    }),

    memberProfiles: defineCollection({
      type: 'data',
      source: 'members/*/profile.yml',
      schema: memberProfileSchema
    })

  }
})
