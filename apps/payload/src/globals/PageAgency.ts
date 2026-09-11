import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { linkToCollectionField } from '@/fields/linkToCollectionField'
import { invalidate, tags } from '@/helpers/cache'
import { Locale } from '@/types'

export const PageAgency: GlobalConfig = {
  slug: 'pageAgency',
  label: {
    en: 'Agency',
    fr: 'Agence',
  },
  fields: [
    titleField({ localized: true }),
    ...urlFields({ source: 'title', slug: 'pageAgency' }),
    {
      name: 'name',
      type: 'text',
      label: localizedLabels.fields.name,
      localized: true,
    },
    {
      name: 'job',
      type: 'text',
      label: localizedLabels.fields.name,
      localized: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'text',
      type: 'richText',
      label: localizedLabels.fields.text,
      localized: true,
    },
    linkToCollectionField({ slug: 'partners' }),
  ],
  versions: {
    drafts: true,
  },
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.agency(req.locale as Locale))
      },
    ],
  },
}
