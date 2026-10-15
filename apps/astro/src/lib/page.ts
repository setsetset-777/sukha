import type { General, Locale, LocaleCode, PageData } from '@app/api/types'
import api from '@app/api'

export const getPage = async (
  url: string,
  locale?: Locale | LocaleCode,
): Promise<PageData | null> => {
  return api.page(url, locale)
}

export const getGeneral = async (locale: Locale | LocaleCode): Promise<General.Data | null> => {
  return api.general(locale)
}
