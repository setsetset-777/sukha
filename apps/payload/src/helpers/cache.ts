import { normalLocale } from '@/i18n'
import { Locale } from '@/types'
import { revalidateTag } from 'next/cache'

const globalTags = {
  general: () => 'general',
  home: () => 'home',
  routes: () => 'routes',
  projectAll: () => 'project',
  agency: () => 'agency',
  projects: () => 'projects',
  projectTags: () => 'projectTags',
  projectSpecs: () => 'projectSpecs',
  contact: () => 'contact',
}

export const tags = {
  ...globalTags,
  generalLocale: (locale: Locale) => `general:${normalLocale(locale)}`,
  project: (id: string) => `project:${id}`,
  projectLocale: (id: string, locale: Locale) => `project:${id}:${normalLocale(locale)}`,
  projectsLocale: (locale: Locale) => `projects:${normalLocale(locale)}`,
  homeLocale: (locale: Locale) => `home:${normalLocale(locale)}`,
  agencyLocale: (locale: Locale) => `agency:${normalLocale(locale)}`,
  projectTagsLocale: (locale: Locale) => `projectTags:${normalLocale(locale)}`,
  projectSpecsLocale: (locale: Locale) => `projectSpecs:${normalLocale(locale)}`,
  contactLocale: (locale: Locale) => `contact:${normalLocale(locale)}`,
}

export const invalidateAll = () => {
  Object.values(globalTags).forEach((tag) => {
    revalidateTag(tag(), 'max')
  })
}
