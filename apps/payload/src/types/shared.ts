import { GlobalSlug, CollectionSlug } from 'payload'
import type * as API from '@app/api/types'
import { PageHome } from './payload'

export type PageSlug = Extract<GlobalSlug | CollectionSlug, 'pageHome'>

export type PageFetch = {
  data: PageHome
  slug: 'pageHome'
}

export type PageResponse = {
  data: API.Home.Data
  slug: 'pageHome'
}
