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
