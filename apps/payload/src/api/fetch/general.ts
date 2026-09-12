import type { PayloadRequest } from 'payload'
import type { Locale } from '@/types'
import * as API from '@app/api/types'

import { normalizeLocale } from '@app/api/i18n'
import { getGeneralData } from '@/api/data/general'

export const fetchGeneral = async (locale: Locale): Promise<API.General.Data> => {
  locale = normalizeLocale(locale)

  const data = await getGeneralData({ locale })

  return data
}
