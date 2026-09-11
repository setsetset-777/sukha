import type * as API from '@app/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'

interface Props {
  locale: Locale
}

export const getHomeData = async ({
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Home.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Home.Data
  }>(async () => {
    const payload = await getPayload({
      config,
    })

    const [pageHome] = await Promise.all([
      payload.findGlobal({
        slug: 'pageHome',
        locale,
      }),
    ])

    const { meta } = pageHome

    return {
      meta: {
        title: meta?.title ?? undefined,
        description: meta?.description ?? undefined,
        image: (meta?.image as API.Media) ?? undefined,
      },
      data: {},
    }
  }, tags.home(locale))
}
