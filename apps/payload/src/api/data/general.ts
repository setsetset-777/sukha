import type * as API from '@app/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import { getRoutes } from '@/helpers/routes'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import config from '@payload-config'

type Props = {
  locale: Locale
}

export const getGeneralData = async ({ locale }: Props): Promise<API.General.Data> => {
  'use cache'

  cacheTag(tags.general(), tags.generalLocale(locale))

  const payload = await getPayload({
    config,
  })

  const [routes] = await Promise.all([getRoutes(locale)])

  return {
    routes,
  }
}
