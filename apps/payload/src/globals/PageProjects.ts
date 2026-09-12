import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { linkToCollectionField } from '@/fields/linkToCollectionField'
import { invalidatePrefix, tags } from '@/helpers/cache'

export const PageProjects: GlobalConfig = {
  slug: 'pageProjects',
  label: {
    en: 'Projects',
    fr: 'Projets',
  },
  fields: [
    titleField(),
    ...urlFields({ source: 'title', slug: 'pageProjects' }),
    {
      name: 'backLinkLabel',
      type: 'text',
      label: {
        en: 'Back link label',
        fr: 'Énoncé du lien de retour',
      },
      localized: true,
    },
    {
      name: 'beforeLabel',
      type: 'text',
      label: {
        en: 'Label for before section',
        fr: "Énoncé pour section 'Avant'",
      },
      localized: true,
    },
    {
      name: 'specsLabel',
      type: 'text',
      label: {
        en: 'Label for specifications section',
        fr: "Énoncé pour section 'Spécifications'",
      },
      localized: true,
    },
    linkToCollectionField({ slug: 'projects' }),
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async () => {
        invalidatePrefix('projects')
        invalidatePrefix('projectList')
      },
    ],
  },
}
