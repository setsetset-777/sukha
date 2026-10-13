import { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { invalidate, tags } from '@/helpers/cache'
import { LocaleCode } from '@/types'

export const PageHome: GlobalConfig = {
  slug: 'pageHome',
  label: {
    en: 'Home',
    fr: 'Accueil',
  },
  fields: [
    titleField(),
    ...urlFields({
      value: '',
    }),
    {
      name: 'projectLinkLabel',
      type: 'text',
      label: {
        fr: 'Label du lien vers le project',
        en: 'Project Link Label',
      },
      localized: true,
    },
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.home(req.locale as LocaleCode))
      },
    ],
  },
}
