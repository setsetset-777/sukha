import type { Locale, LocaleCode } from '@/types'

export const localization: {
  locales: Locale[]
  defaultLocale: LocaleCode
} = {
  locales: [
    {
      label: 'FR',
      code: 'fr',
    },
    {
      label: 'EN',
      code: 'en',
    },
  ],
  defaultLocale: 'fr',
}

export const defaultLocale = localization.locales.find(
  ({ code }) => code === localization.defaultLocale,
)!

export const localeCodes = localization.locales.map(({ code }) => code)

export const normalizeLocale = (code?: LocaleCode | string | null): Locale => {
  const locale = localization.locales.find((locale) => locale.code === code)
  return locale ?? defaultLocale
}

export const getLocaleFromPath = (path: string): Locale => {
  const { locale } = normalizePath(path)
  return locale
}

export const normalizePath = (
  path: string,
): {
  locale: Locale
  path: string | null
} => {
  const reg = /^(\/)?([a-z]{2}(?![a-z]))?(\/)?(.*)/
  const match = path.match(reg)
  if (!match) {
    return {
      locale: normalizeLocale(null),
      path: null,
    }
  }
  const locale = normalizeLocale(match[2])

  let cleanPath = `/${locale.code}`
  if (match[4]) {
    cleanPath += `/${match[4]}`
  }
  return {
    locale,
    path: cleanPath,
  }
}

export const getClientLocale = (path?: string) => {
  path = path ?? window.location.pathname
  return getLocaleFromPath(path)
}
