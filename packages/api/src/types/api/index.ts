// TODO: Move data types and transformations to api package
// TODO: Use namespaces for pages (General, Presentation, etc.)

export * from '../shared'
export * from './general'
export * from './home'

import type { Home } from './home'
import type { Meta } from '../shared'

export type PageData = {
  meta: Meta
} & {
  data: Home.Data
  slug: 'pageHome'
  parentSlug?: undefined
}

export type FetchData = Promise<Record<string, any>>

export interface InitConfig {
  enable: boolean
  apiUrl: string
  serviceUser: string
  servicePassord: string
  env: 'production' | 'development'
}
