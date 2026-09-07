import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'

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
      async ({ doc }) => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.projects(), 'max')
        revalidateTag(tags.projectAll(), 'max')
        revalidateTag(tags.projectTags(), 'max')
        revalidateTag(tags.home(), 'max')
      },
    ],
  },
}
