import { resolveRoute } from '@/helpers/routes'
import { getHomeData } from '@/api/data/home'
import { getAgencyData } from '@/api/data/agency'
import { getContactData } from '@/api/data/contact'
import { getProjectsData } from '@/api/data/projects'
import { trimPath } from '@/helpers/trimPath'
import type * as API from '@app/api/types'
import type { SearchParams } from '@app/api/schemas'
import type { I18n } from '@payloadcms/translations'

export const fetchPage = async (
  path: string,
  params: SearchParams,
  i18n: I18n,
): Promise<API.PageData | null> => {
  try {
    const { route, locale } = await resolveRoute({ path: trimPath(path) })

    if (!route) {
      return null
    }

    const { slug } = route

    let data

    switch (slug) {
      case 'pageHome':
        data = await getHomeData({
          locale: locale.code,
          i18n,
        })
        return {
          slug,
          ...data,
        }

      case 'pageAgency':
        data = await getAgencyData({
          locale: locale.code,
          i18n,
        })
        return {
          slug,
          ...data,
        }

      case 'pageProjects':
        data = await getProjectsData({
          locale: locale.code,
          i18n,
        })
        return {
          slug,
          ...data,
        }

      case 'pageContact':
        data = await getContactData({
          locale: locale.code,
          i18n,
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
