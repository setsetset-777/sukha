import type { Media, PaginatedDocs } from '../shared'

export namespace Projects {
  export interface Project {
    title: string
    image?: Media
    url?: string
  }

  export type List = PaginatedDocs<Project>

  export interface SearchParams {
    tag?: string[]
    limit?: number
    page?: number
  }

  interface Tag {
    label: string
    slug: string
  }

  export interface Data {
    title: string
    urlSlug: string
    backLinkLabel?: string
    beforeLabel?: string
    specsLabel?: string
    moreLabel?: string
    tags: Tag[]
    list: List
  }
}
