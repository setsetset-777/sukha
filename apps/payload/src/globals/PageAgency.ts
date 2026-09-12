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
    titleField(),
    ...urlFields({ source: 'title', slug: 'pageAgency' }),
    {
      name: 'name',
      type: 'text',
      label: localizedLabels.fields.name,
    },
    {
      name: 'job',
      type: 'text',
      label: localizedLabels.fields.job,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'text',
      type: 'richText',
      label: localizedLabels.fields.text,
      localized: true,
    },
    {
      name: 'partners',
      type: 'group',
      label: localizedLabels.collections.partners?.plural,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: localizedLabels.fields.title,
          localized: true,
        },
        linkToCollectionField({ slug: 'partners', label: '' }),
      ],
    },
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
