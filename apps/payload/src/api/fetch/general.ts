import type { LocaleCode } from '@/types'
import * as API from '@app/api/types'

import { normalizeLocale } from '@app/api/i18n'
import { getGeneralData } from '@/api/data/general'
import { I18n } from '@payloadcms/translations'

export const fetchGeneral = async (locale: LocaleCode, i18n: I18n): Promise<API.General.Data> => {
  const { code } = normalizeLocale(locale)

  const data = await getGeneralData({ locale: code, i18n })

  return data
}
