import { tags } from '@/helpers/cache'
import { revalidateTag } from 'next/cache'
import { GlobalConfig } from 'payload'

export const General: GlobalConfig = {
  slug: 'general',
  label: {
    en: 'General',
    fr: 'Général',
  },
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        {
          name: 'navigationList',
          type: 'select',
          label: {
            en: 'Navigation elements',
            fr: 'Éléments de navigation',
          },
          required: true,
          options: [
            {
              label: {
                fr: 'Agence',
                en: 'AGency',
              },
              value: 'pageAgence',
            },
            {
              label: {
                fr: 'Projets',
                en: 'Projects',
              },
              value: 'pageProjects',
            },
            {
              label: 'Contact',
              value: 'pageContact',
            },
          ],
          hasMany: true,
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: {
        en: 'Footer',
        fr: 'Bas de page',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: {
            en: 'Text',
            fr: 'Texte',
          },
          localized: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        revalidateTag(tags.general(), 'max')
      },
    ],
  },
}
