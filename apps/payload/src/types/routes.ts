import type { TypedLocale, DataFromGlobalSlug, DataFromCollectionSlug } from 'payload'
import type { PageSlug } from '@/types'
import type * as API from '@app/api/types'

export type Manifest = {
  generatedAt: number
  routes: Routes
}

export type RouteConfigPage = {
  slug: RoutedPageSlug
  path?: string
  field?: keyof RoutedPages
  children?: RouteConfigPage
  isHash?: boolean
}

export interface RouteConfig {
  pages: RouteConfigPage[]
}

export type RoutedGlobalSlug = 'pageHome' | 'pageAgency' | 'pageProjects' | 'pageContact'

export type RoutedCollectionSlug = 'projects'

export type RoutedPageSlug = RoutedGlobalSlug | RoutedCollectionSlug

export type RoutedPages = DataFromGlobalSlug<'pageHome'> | DataFromCollectionSlug<'projects'>

export type Locale = TypedLocale

export type Route = {
  id: string
  path: string
  slug: PageSlug
  urlSlug: string
  parent?: PageSlug
  type: 'global' | 'collection'
  updatedAt?: string
  meta?: API.Meta
}

export type LocalizedRoutes = { [key: string]: Route }

export type Routes = Partial<Record<Locale, LocalizedRoutes>>
