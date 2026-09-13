import { localization, normalizeLocale } from '@app/api/i18n'
import { type BasePayload, getPayload } from 'payload'
import { cached, tags } from '@/helpers/cache'
import { trimPath } from '@/helpers/trimPath'
import config from '@payload-config'
import { PageSlug } from '@app/api/types'
import type {
  Manifest,
  RouteConfig,
  Locale,
  Route,
  RoutedGlobalSlug,
  RoutedCollectionSlug,
  Routes,
} from '@/types'

const { locales } = localization

export let cachedManifest: Manifest | null | undefined = null

export const routesConfig: RouteConfig = {
  pages: [
    {
      slug: 'pageHome',
    },
    {
      slug: 'pageAgency',
    },
    {
      slug: 'pageProjects',
      children: {
        slug: 'projects',
      },
    },
    {
      slug: 'pageContact',
    },
  ],
}

export const getRoutes = async (): Promise<Routes> => {
  return cached<Routes>(async () => {
    const payload = await getPayload({ config })

    return buildRoutes(payload)
  }, tags.routes())
}

const buildRoutes = async (payload: BasePayload): Promise<Routes> => {
  const routes: Routes = new Map()

  for (const { slug, path, children } of routesConfig.pages) {
    const global = (await payload.findGlobal({
      slug: slug as RoutedGlobalSlug,
      locale: 'all',
      select: {
        id: true,
        urlSlug: true,
        updatedAt: true,
      },
    })) as {
      id: string
      updatedAt: string
      urlSlug?: Partial<Record<Locale, string>>
    }

    routes.set(global.id, {
      id: global.id,
      slug,
      type: 'global',
      updatedAt: global.updatedAt ?? undefined,
      locales: locales.reduce<Route['locales']>(
        (acc, locale) => {
          // For home page, there is no urlSlug, we default to empty string
          const urlSlug = (global.urlSlug && global.urlSlug[locale as Locale]) ?? ''
          acc[locale as Locale] = {
            path: trimPath(`/${locale}/${path || urlSlug}`),
            urlSlug,
          }
          return acc
        },
        {} as Route['locales'],
      ),
    })

    if (children) {
      const collections = await payload.find({
        collection: children.slug as RoutedCollectionSlug,
        locale: 'all',
        select: {
          id: true,
          urlSlug: true,
          updatedAt: true,
        },
      })

      for (const collection of collections.docs) {
        routes.set(collection.id, {
          id: collection.id,
          slug,
          type: 'collection',
          updatedAt: collection.updatedAt ?? undefined,
          locales: locales.reduce<Route['locales']>(
            (acc, locale) => {
              const urlSlug = (collection.urlSlug as Partial<Record<Locale, string>>)[
                locale as Locale
              ]
              acc[locale as Locale] = {
                path: `/${locale}/${path || urlSlug}`,
                urlSlug,
              }
              return acc
            },
            {} as Route['locales'],
          ),
        })
      }
    }
  }

  return routes
}

export const resolveRoute = async ({
  path,
}: {
  path: string
}): Promise<{ route: Route | null; locale: Locale }> => {
  const paths = path.replace(/^\/+/, '').split('/')
  const locale = normalizeLocale(paths[0])
  const routes = await getRoutes()
  const normalLocale = normalizeLocale(locale)
  return {
    route: [...routes.values()].find((route) => route.locales[normalLocale].path === path) ?? null,
    locale,
  }
}

export const getRouteById = async (id: string): Promise<Route | null> => {
  const routes = await getRoutes()
  return routes.get(id) || null
}

export const getRouteBySlug = async (slug: PageSlug): Promise<Route | null> => {
  const routes = await getRoutes()
  return [...routes.values()].find((route) => route.slug === slug) ?? null
}

export const getPathBySlug = async (slug: PageSlug, locale: Locale): Promise<string | null> => {
  const route = await getRouteBySlug(slug)
  if (!route) {
    return null
  }
  return getPathOfRoute(route, locale)
}

export const getPathOfRoute = (route: Route | null, locale: Locale): string | null => {
  if (!route) {
    return null
  }
  return route.locales[locale].path
}
