import type { PayloadRequest } from 'payload'
import type { Locale } from '@/types'
import * as API from '@app/api/types'

import { localization } from '@/i18n'
import { getGeneralData } from '@/api/data/general'

export const fetchGeneral = async (req: PayloadRequest): Promise<API.General.Data> => {
  const locale = (req.locale as Locale) ?? localization.defaultLocale

  const data = await getGeneralData({ locale })

  return data
}
