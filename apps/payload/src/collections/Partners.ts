import { localizedLabels } from '@/i18n'
import { invalidate, tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'
import { LocaleCode } from '@/types'

export const slug = 'partners'

export const Partners: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', '_status'],
  },
  labels: localizedLabels.collections.partners,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: localizedLabels.fields.name,
      localized: true,
    },
    {
      name: 'job',
      type: 'text',
      label: localizedLabels.fields.job,
      localized: true,
    },
    {
      name: 'text',
      type: 'richText',
      label: localizedLabels.fields.text,
      localized: true,
    },
    {
      name: 'url',
      type: 'text',
      label: localizedLabels.fields.url,
    },
  ],
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.routes())
        invalidate(tags.partners(req.locale as LocaleCode))
        invalidate(tags.agency(req.locale as LocaleCode))
      },
    ],
  },
}
