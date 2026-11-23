import { defineCollection, defineContentConfig } from '@nuxt/content'

import { indexSchema } from './schemas/index'
import { aboutSchema } from './schemas/about'
import { membersSchema } from './schemas/members'
import { memberProfileSchema } from './schemas/memberProfile'
import { collaborationsSchema } from './schemas/collaborations'

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: indexSchema
    }),

    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: aboutSchema
    }),

    members: defineCollection({
      type: 'page',
      source: 'members/index.yml',
      schema: membersSchema
    }),

    memberProfiles: defineCollection({
      type: 'data',
      source: 'members/*/profile.yml',
      schema: memberProfileSchema
    }),

    collaborations: defineCollection({
      type: 'page',
      source: 'collaborations.yml',
      schema: collaborationsSchema
    })
  }
})
