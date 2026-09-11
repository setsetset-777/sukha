import { titleField } from '@/fields/titleField'
import { localizedLabels } from '@/i18n'
import { invalidate, invalidatePrefix, tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'
import { Locale } from '@/types'

export const slug = 'projectSpecs'

export const ProjectSpecs: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
  },
  labels: localizedLabels.collections.projectSpecs,
  fields: [titleField({ localized: true })],
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidatePrefix('project')
        invalidate(tags.projectSpecs(req.locale as Locale))
      },
    ],
  },
}
