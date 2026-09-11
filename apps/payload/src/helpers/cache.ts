import { normalLocale } from '@/i18n'
import { Locale } from '@/types'
import * as API from '@app/api/types'
import { LRUCache } from 'lru-cache'

type Tag = string

const store = new LRUCache<Tag, any>({
  max: 500,
})
const pending = new Map<Tag, Promise<any>>()

export function cached<T>(fn: () => Promise<T>, key: Tag): Promise<T> {
  if (store.has(key)) {
    // console.log(`>>>> cache: hitting cache for ${key}`)
    return store.get(key)
  }
  if (pending.has(key)) {
    // console.log(`>>>> cache: pending cache for ${key}`)
    return pending.get(key) as Promise<T>
  }

  // console.log(`>>>> cache: missing cache for ${key}`)

  const promise = fn()
    .then((result) => {
      store.set(key, result)
      pending.delete(key)
      return result
    })
    .catch((err) => {
      pending.delete(key)
      throw err
    })

  pending.set(key, promise)
  return promise
}

export function invalidate(key: Tag) {
  store.delete(key)
}

export const invalidateAll = () => {
  store.clear()
}

const prefixes = {
  general: 'general',
  routes: 'routes',
  home: 'home',
  projects: 'projects',
  project: 'project',
  presentation: 'agency',
  projectTags: 'projectTags',
  projectSpecs: 'projectSpecs',
  contact: 'contact',
  projectList: 'projectList',
  partners: 'partners',
} as const

type Prefix = (typeof prefixes)[keyof typeof prefixes]

export const invalidatePrefix = (prefix: Prefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(`${prefix}:`)) {
      store.delete(key)
    }
  }
}

export const tags = {
  routes: (locale: Locale) => `general:${normalLocale(locale)}`,
  general: (locale: Locale) => `general:${normalLocale(locale)}`,
  project: (id: string, locale: Locale) => `project:${id}:${normalLocale(locale)}`,
  projects: (params: API.Projects.SearchParams, locale: Locale) =>
    `${prefixes.projects}:${JSON.stringify(params)}:${normalLocale(locale)}`,
  projectList: (params: API.Projects.SearchParams, locale: Locale) =>
    `${prefixes.projectList}:${JSON.stringify(params)}:${normalLocale(locale)}`,
  home: (locale: Locale) => `home:${normalLocale(locale)}`,
  agency: (locale: Locale) => `agency:${normalLocale(locale)}`,
  projectTags: (locale: Locale) => `projectTags:${normalLocale(locale)}`,
  projectSpecs: (locale: Locale) => `projectSpecs:${normalLocale(locale)}`,
  contact: (locale: Locale) => `contact:${normalLocale(locale)}`,
  partners: (locale: Locale) => `partners:${normalLocale(locale)}`,
}
