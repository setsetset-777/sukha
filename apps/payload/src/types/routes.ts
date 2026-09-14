import type {
  Locale as PayloadLocale,
  TypedLocale as PayloadTypedLocale,
  DataFromGlobalSlug,
  DataFromCollectionSlug,
} from 'payload'
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

export type LocaleCode = PayloadTypedLocale
export type Locale = {
  code: LocaleCode
  label: string
}

export interface LocalizedRoute {
  path: string
  urlSlug?: string
}

export type Route = {
  id: string
  slug: PageSlug
  parent?: PageSlug
  type: 'global' | 'collection'
  updatedAt?: string
  locales: Record<LocaleCode, LocalizedRoute>
}

export type Routes = Map<string, Route>
