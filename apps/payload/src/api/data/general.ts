import type * as API from '@app/api/types'
import type { LocaleCode } from '@/types'
import { getPayload } from 'payload'
import { getPathBySlug, getPathOfRoute, getRouteBySlug, getRoutes } from '@/helpers/routes'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { type CustomTFunction } from '@/i18n'
import { I18n } from '@payloadcms/translations'

type Props = {
  locale: LocaleCode
  i18n: I18n
}

export const getGeneralData = async ({ locale, i18n }: Props): Promise<API.General.Data> => {
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

    const t = i18n.t as CustomTFunction

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
        logoAlt: t('general:logo'),
      },
      navigation: {
        home: {
          url: (await getPathBySlug('pageHome', locale)) ?? undefined,
          linkLabel: t('general:homeLink'),
          logoAlt: t('general:logo'),
        },
        menu: serviceItems,
      },
    }
  }, tags.general(locale))
}
