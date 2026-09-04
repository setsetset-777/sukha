import { resolveRoute } from '@/helpers/routes'
import type { PayloadRequest } from 'payload'
import type * as API from '@app/api/types'
import { getHomeData } from '@/api/data/home'
import type { SearchParams } from '@app/api/schemas'

export const fetchPage = async (
  req: PayloadRequest,
  path: string,
  params: SearchParams,
): Promise<API.PageData | null> => {
  try {
    const route = await resolveRoute({ path, payload: req.payload })

    if (!route) {
      return null
    }

    const {
      locale,
      route: { slug, id },
    } = route

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
