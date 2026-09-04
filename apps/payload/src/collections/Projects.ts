import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'

export const slug = 'projects'

export const Projects: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mainImage', '_status', 'featured'],
  },
  labels: localizedLabels.collections.projects,
  fields: [titleField(), ...urlFields({ source: 'title', slug })],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.project(doc.id), 'max')
      },
    ],
  },
}
