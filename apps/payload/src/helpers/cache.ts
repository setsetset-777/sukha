import { normalizeLocale } from '@app/api/i18n'
import type { LocaleCode } from '@/types'
import * as API from '@app/api/types'
import { LRUCache } from 'lru-cache'

type Tag = string

const store = new LRUCache<Tag, any>({
  max: 500,
})
const pending = new Map<Tag, Promise<any>>()

export async function cached<T>(fn: () => Promise<T>, key: Tag): Promise<T> {
  if (process.env.DISABLE_CACHE) {
    return fn()
      .then((result) => {
        return result
      })
      .catch((err) => {
        throw err
      })
  }

  if (store.has(key)) {
    return store.get(key)
  }
  if (pending.has(key)) {
    return pending.get(key) as Promise<T>
  }

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
  agency: 'agency',
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
  routes: () => `${prefixes.routes}`,
  general: (locale: LocaleCode) => `${prefixes.general}:${normalizeLocale(locale)}`,
  project: (id: string, locale: LocaleCode) =>
    `${prefixes.project}:${id}:${normalizeLocale(locale)}`,
  projects: (params: API.Projects.SearchParams, locale: LocaleCode) =>
    `${prefixes.projects}:${JSON.stringify(params)}:${normalizeLocale(locale)}`,
  projectList: (params: API.Projects.SearchParams, locale: LocaleCode) =>
    `${prefixes.projectList}:${JSON.stringify(params)}:${normalizeLocale(locale)}`,
  home: (locale: LocaleCode) => `${prefixes.home}:${normalizeLocale(locale)}`,
  agency: (locale: LocaleCode) => `${prefixes.agency}:${normalizeLocale(locale)}`,
  projectTags: (locale: LocaleCode) => `${prefixes.projectTags}:${normalizeLocale(locale)}`,
  projectSpecs: (locale: LocaleCode) => `${prefixes.projectSpecs}:${normalizeLocale(locale)}`,
  contact: (locale: LocaleCode) => `${prefixes.contact}:${normalizeLocale(locale)}`,
  partners: (locale: LocaleCode) => `${prefixes.partners}:${normalizeLocale(locale)}`,
}
