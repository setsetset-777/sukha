import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { invalidate, invalidatePrefix, tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'
import { Locale } from '@/types'

export const slug = 'projectTags'

export const ProjectTags: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
  },
  labels: localizedLabels.collections.projectTags,
  fields: [titleField({ localized: true })],
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidatePrefix('projects')
        invalidatePrefix('projectList')
        invalidate(tags.projectTags(req.locale as Locale))
      },
    ],
  },
}
