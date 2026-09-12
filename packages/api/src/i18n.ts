import type { Locale } from '@app/api/types'

export const defaultLocale: Locale = 'fr'

export const localization: {
  locales: Locale[]
  defaultLocale: Locale
} = {
  locales: ['fr', 'en'],
  defaultLocale,
}

export const normalizeLocale = (locale?: Locale | string | null): Locale => {
  if (localization.locales.includes(locale as Locale)) {
    return locale as Locale
  }
  return localization.defaultLocale as Locale
}

export const pathLocale = (path: string): Locale => {
  const paths = path.replace(/^\/+/, '').split('/')
  return normalizeLocale(paths[0])
}
