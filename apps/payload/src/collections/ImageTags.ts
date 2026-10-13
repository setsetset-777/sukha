import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import type { CollectionConfig } from 'payload'

export const slug = 'imageTags'

export const ImageTags: CollectionConfig = {
  slug,
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
  },
  labels: localizedLabels.collections.imageTags,
  fields: [titleField({ localized: false })],
}
