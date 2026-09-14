import { localeCodes, normalizePath } from '@app/api/i18n'
import { type BasePayload, getPayload } from 'payload'
import { cached, tags } from '@/helpers/cache'
import { trimPath } from '@/helpers/trimPath'
import config from '@payload-config'
import type {
  Manifest,
  RouteConfig,
  Route,
  RoutedGlobalSlug,
  RoutedCollectionSlug,
  Routes,
  Locale,
  LocaleCode,
  PageSlug,
} from '@/types'

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
      urlSlug?: Partial<Record<LocaleCode, string>>
    }

    routes.set(global.id, {
      id: global.id,
      slug,
      type: 'global',
      updatedAt: global.updatedAt ?? undefined,
      locales: localeCodes.reduce<Route['locales']>(
        (acc, locale) => {
          // For home page, there is no urlSlug, we default to empty string
          const urlSlug = (global.urlSlug && global.urlSlug[locale as LocaleCode]) ?? ''
          acc[locale as LocaleCode] = {
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

      const separator = children.isHash ? '#' : '/'

      for (const collection of collections.docs) {
        routes.set(collection.id, {
          id: collection.id,
          slug,
          type: 'collection',
          updatedAt: collection.updatedAt ?? undefined,
          locales: localeCodes.reduce<Route['locales']>(
            (acc, locale) => {
              const parentUrlSlug = global.urlSlug![locale as LocaleCode]
              const urlSlug = (collection.urlSlug as Partial<Record<LocaleCode, string>>)[
                locale as LocaleCode
              ]
              acc[locale as LocaleCode] = {
                path: `/${locale}/${parentUrlSlug}${separator}${path || urlSlug}`,
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
  const { locale, path: search } = normalizePath(path)
  const routes = await getRoutes()

  const route =
    [...routes.values()].find(
      (route) => route.locales[locale.code as LocaleCode].path === search,
    ) ?? null

  return {
    route,
    locale,
  }
}

export const getRouteById = async (id: string): Promise<Route | null> => {
  const routes = await getRoutes()
  return getRouteByIdSync(id, routes)
}

export const getRouteByIdSync = (id: string, routes: Routes): Route | null => {
  return routes.get(id) || null
}

export const getRouteBySlug = async (slug: PageSlug): Promise<Route | null> => {
  const routes = await getRoutes()
  return getRouteBySlugSync(slug, routes)
}

export const getRouteBySlugSync = (slug: PageSlug, routes: Routes): Route | null => {
  return [...routes.values()].find((route) => route.slug === slug) ?? null
}

export const getPathBySlug = async (slug: PageSlug, locale: LocaleCode): Promise<string | null> => {
  const routes = await getRoutes()
  return getPathBySlugSync(slug, locale, routes)
}

export const getPathBySlugSync = (
  slug: PageSlug,
  locale: LocaleCode,
  routes: Routes,
): string | null => {
  const route = getRouteBySlugSync(slug, routes)
  if (!route) {
    return null
  }
  return getPathOfRoute(route, locale)
}

export const getPathOfRoute = (route: Route | null, locale: LocaleCode): string | null => {
  if (!route) {
    return null
  }
  return route.locales[locale].path
}

export const getProjectsTagsUrl = async (tags: string[], locale: LocaleCode): Promise<string> => {
  const routes = await getRoutes()
  return getProjectsTagsUrlSync(tags, locale, routes)
}

export const getProjectsTagsUrlSync = (
  tags: string[],
  locale: LocaleCode,
  routes: Routes,
): string => {
  const projectsUrl = getPathBySlugSync('pageProjects', locale, routes)
  const params = new URLSearchParams()
  tags.forEach((tag) => {
    params.append('tag', tag)
  })
  return `${projectsUrl}?${params.toString()}`
}
