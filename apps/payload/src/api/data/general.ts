import type * as API from '@app/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { getPathBySlug, getPathOfRoute, getRouteBySlug, getRoutes } from '@/helpers/routes'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { localizedLabels } from '@/i18n'
import { localization } from '@app/api/i18n'

type Props = {
  locale: Locale
}

export const getGeneralData = async ({ locale }: Props): Promise<API.General.Data> => {
  return cached<API.General.Data>(async () => {
    const payload = await getPayload({
      config,
    })

    const [routes, general] = await Promise.all([
      getRoutes(),
      payload.findGlobal({ slug: 'general', draft: false }),
    ])

    const serviceItems = []

    for (const slug of general.navigation.navigationList || []) {
      const page = await payload.findGlobal({
        slug,
        locale,
        select: {
          title: true,
        },
      })

      if (!page) continue

      const route = await getRouteBySlug(slug)

      serviceItems.push({
        title: page.title,
        url: getPathOfRoute(route, locale) ?? undefined,
        slug,
      })
    }

    return {
      routes: Object.fromEntries(
        [...routes].map(([key, { id, slug, parent, updatedAt, locales }]) => [
          key,
          {
            id,
            slug,
            parent,
            updatedAt,
            locales,
          },
        ]),
      ),
      footer: {
        text: general.footer?.text ?? undefined,
        logoAlt: localizedLabels.arias.logo[locale],
      },
      navigation: {
        home: {
          url: (await getPathBySlug('pageHome', locale)) ?? undefined,
          linkLabel: localizedLabels.arias.homeLink[locale] ?? undefined,
          logoAlt: localizedLabels.arias.logo[locale] ?? undefined,
        },
        menu: serviceItems,
      },
    }
  }, tags.general(locale))
}
