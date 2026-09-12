import type * as API from '@app/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { getRoutes } from '@/helpers/routes'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { localizedLabels } from '@/i18n'

type Props = {
  locale: Locale
}

export const getGeneralData = async ({ locale }: Props): Promise<API.General.Data> => {
  console.log('getGeneralData')
  return cached<API.General.Data>(async () => {
    const payload = await getPayload({
      config,
    })

    console.log('!!!! getGeneralData not cached')

    const [routes, general] = await Promise.all([
      getRoutes(locale),
      payload.findGlobal({ slug: 'general', draft: false }),
    ])

    const serviceItems = []

    for (const slug of general.navigation.navigationList || []) {
      const page = await payload.findGlobal({
        slug,
        locale: locale,
      })

      if (!page) continue

      serviceItems.push({
        title: page.title,
        url: routes[slug] && routes[slug].path,
        slug,
      })
    }

    return {
      routes,
      footer: {
        text: general.footer?.text ?? undefined,
        logoAlt: localizedLabels.arias.logo[locale],
      },
      navigation: {
        home: {
          url: routes['pageHome' as API.PageSlug].path,
          linkLabel: localizedLabels.arias.homeLink[locale],
          logoAlt: localizedLabels.arias.logo[locale],
        },
        menu: serviceItems,
      },
    }
  }, tags.general(locale))
}
