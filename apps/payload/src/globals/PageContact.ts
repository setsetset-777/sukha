import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { urlFields } from '@/fields/urlFields'
import { titleField } from '@/fields/titleField'
import { invalidate, tags } from '@/helpers/cache'
import { Locale } from '@/types'

export const PageContact: GlobalConfig = {
  slug: 'pageContact',
  label: {
    en: 'Contact',
    fr: 'Contact',
  },
  fields: [
    titleField(),
    ...urlFields({ source: 'title', slug: 'pageContact' }),
    {
      name: 'catch',
      type: 'textarea',
      label: {
        en: 'Catch',
        fr: 'Signature',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: {
        en: 'Address',
        fr: 'Adresse',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: {
        en: 'Email',
        fr: 'E-mail',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: {
        en: 'Phone',
        fr: 'Téléphone',
      },
    },
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.contact(req.locale as Locale))
      },
    ],
  },
}
