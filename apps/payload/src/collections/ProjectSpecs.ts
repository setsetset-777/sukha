import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'

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
      async ({ doc }) => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.projectAll(), 'max')
        revalidateTag(tags.projectSpecs(), 'max')
      },
    ],
  },
}
