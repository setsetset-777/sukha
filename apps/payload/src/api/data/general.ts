import type * as API from '@app/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { getRoutes } from '@/helpers/routes'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'

type Props = {
  locale: Locale
}

export const getGeneralData = async ({ locale }: Props): Promise<API.General.Data> => {
  return cached<API.General.Data>(async () => {
    const payload = await getPayload({
      config,
    })

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
        catch: general.footer?.text ?? undefined,
      },
      navigation: {
        home: {
          url: routes['pageHome' as API.PageSlug].path,
          linkLabel: "Retour à l'accueil",
        },
        menu: serviceItems,
      },
    }
  }, tags.general(locale))
}
