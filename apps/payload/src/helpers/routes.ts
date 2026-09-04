import { localization } from '@/i18n'
import {
  type BasePayload,
  type GlobalAfterChangeHook,
  type CollectionAfterChangeHook,
  getPayload,
} from 'payload'
import type {
  Manifest,
  RouteConfig,
  RoutedPages,
  Locale,
  Routes,
  LocalizedRoutes,
  Route,
  RoutedGlobalSlug,
  RoutedCollectionSlug,
  Media,
} from '@/types'
import { cacheTag } from 'next/cache'
import { tags } from './cache'
import config from '@payload-config'

const { locales, defaultLocale } = localization
const defaultSlugField = 'urlSlug' as const

export let cachedManifest: Manifest | null | undefined = null

export const routesConfig: RouteConfig = {
  pages: [
    {
      slug: 'pageHome',
    },
  ],
}

export const getRoutes = async (locale: Locale): Promise<LocalizedRoutes> => {
  'use cache'

  cacheTag(tags.routes())

  const payload = await getPayload({ config })

  locale = locale || (defaultLocale as Locale)

  const routes = await buildRoutes(payload)

  const localizedRoutes = routes[locale]

  return localizedRoutes ?? {}
}

const buildRoutes = async (payload: BasePayload): Promise<Routes> => {
  const routes: Routes = {}

  for (const locale of locales) {
    routes[locale as Locale] = {}
    for (const { slug, path, field = defaultSlugField, children } of routesConfig.pages) {
      const global = await payload.findGlobal({
        slug: slug as RoutedGlobalSlug,
        locale: locale as Locale,
      })

      const doc: RoutedPages = global
      const urlSlug = doc[field] || ''

      routes[locale as Locale]![slug] = {
        id: global.id,
        path: `/${path || urlSlug}`,
        slug: slug,
        urlSlug: urlSlug as string,
        type: 'global',
        updatedAt: doc.updatedAt ?? undefined,
        meta: {
          title: doc.meta?.title ?? undefined,
          description: doc.meta?.description ?? undefined,
          image: (doc.meta?.image as Media) ?? undefined,
        },
      }
      if (children) {
        const parent = doc
        const collections = await payload.find({
          collection: children.slug as RoutedCollectionSlug,
          locale: locale as Locale,
        })

        for (const collection of collections.docs) {
          const field = children.field || defaultSlugField
          const doc: RoutedPages = collection

          const urlSlug = doc[field] as string
          const separator = children.isHash ? '#' : '/'
          routes[locale as Locale]![collection.id] = {
            id: doc.id,
            path: `/${parent.urlSlug}${separator}${doc.urlSlug}`,
            slug: children.slug,
            urlSlug,
            parent: slug,
            type: 'collection',
            updatedAt: doc.updatedAt ?? undefined,
            meta: {
              title: doc.title,
            },
          }
        }
      }
    }
  }

  // payload.logger.info(routes, 'Built routes')

  return routes
}

export const resolveRoute = async ({
  path,
  locale,
}: {
  path: string
  locale?: Locale
}): Promise<{
  locale: Locale
  route: Route
} | null> => {
  try {
    const paths = path.replace(/^\/+/, '').split('/')
    locale = localization.locales.includes(paths[0]) ? (paths[0] as Locale) : (locale as Locale)

    if (locale) {
      // Remove locale
      path = path.replace(new RegExp(`^${locale}(?=\/|$)`), '')
    }

    const routes = await getRoutes(locale)

    const route = routes && Object.values(routes).find((value) => value.path === path)

    if (!route) {
      return null
    }

    return {
      locale,
      route,
    }
  } catch (e) {
    throw e
  }
}
