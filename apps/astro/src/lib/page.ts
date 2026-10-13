import type { General, Locale, PageData } from '@app/api/types'
import api from '@app/api'

export const getPage = async (url: string, locale?: Locale): Promise<PageData | null> => {
  return api.page(url, locale)
}

export const getGeneral = async (locale: Locale): Promise<General.Data | null> => {
  return api.general(locale)
}
