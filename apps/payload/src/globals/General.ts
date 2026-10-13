import { invalidate, tags } from '@/helpers/cache'
import { LocaleCode } from '@/types'
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
                en: 'Agency',
              },
              value: 'pageAgency',
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
    {
      name: 'misc',
      type: 'group',
      label: {
        en: 'Miscellaneous',
        fr: 'Divers',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backLinkLabel',
              type: 'text',
              label: {
                en: 'Back link label',
                fr: 'Énoncé du lien de retour',
              },
              localized: true,
              admin: {
                description: {
                  en: 'Displayed on a project page',
                  fr: 'Affiché sur une page projet',
                },
              },
            },
            {
              name: 'moreLabel',
              type: 'text',
              label: {
                en: 'Label for load more button',
                fr: "Énoncé pour bouton 'Charger plus de projects'",
              },
              localized: true,
              admin: {
                description: {
                  en: 'Displayed on a project page',
                  fr: 'Affiché sur une page projet',
                },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'existingLabel',
              type: 'text',
              label: {
                en: "Label for section 'Existing'",
                fr: "Énoncé pour section 'Existant'",
              },
              localized: true,
              admin: {
                description: {
                  en: 'Displayed on a project page',
                  fr: 'Affiché sur une page projet',
                },
              },
            },
            {
              name: 'specsLabel',
              type: 'text',
              label: {
                en: "Label for section 'Specifications'",
                fr: "Énoncé pour section 'Spécifications'",
              },
              localized: true,
              admin: {
                description: {
                  en: 'Displayed on a project page',
                  fr: 'Affiché sur une page projet',
                },
              },
            },
          ],
        },
        {
          name: 'creditsLabel',
          type: 'text',
          label: {
            en: "Label for section 'Credits'",
            fr: "Énoncé pour section 'Crédits'",
          },
          localized: true,
          admin: {
            description: {
              en: 'Displayed on a project page',
              fr: 'Affiché sur une page projet',
            },
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.general(req.locale as LocaleCode))
      },
    ],
  },
}
