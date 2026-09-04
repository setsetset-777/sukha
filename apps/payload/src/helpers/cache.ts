import { normalLocale } from '@/i18n'
import { Locale } from '@/types'
import { revalidateTag } from 'next/cache'

const globalTags = {
  general: () => 'general',
  home: () => 'home',
  routes: () => 'routes',
  projectAll: () => 'project',
}

export const tags = {
  ...globalTags,
  generalLocale: (locale: Locale) => `general:${normalLocale(locale)}`,
  project: (id: string) => `project:${id}`,
  projectLocale: (id: string, locale: Locale) => `project:${id}:${normalLocale(locale)}`,
  homeLocale: (locale: Locale) => `home:${normalLocale(locale)}`,
}

export const invalidateAll = () => {
  Object.values(globalTags).forEach((tag) => {
    revalidateTag(tag(), 'max')
  })
}
