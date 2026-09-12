import { resolveRoute } from '@/helpers/routes'
import type * as API from '@app/api/types'
import { getHomeData } from '@/api/data/home'
import type { SearchParams } from '@app/api/schemas'

export const fetchPage = async (
  path: string,
  params: SearchParams,
): Promise<API.PageData | null> => {
  try {
    const { route, locale } = await resolveRoute({ path })

    if (!route) {
      return null
    }

    const { slug } = route

    let data

    switch (slug) {
      case 'pageHome':
        data = await getHomeData({
          locale,
        })
        return {
          slug,
          ...data,
        }
    }
  } catch (e) {
    throw e
  }
  return null
}
