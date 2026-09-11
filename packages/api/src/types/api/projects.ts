import type { PaginatedDocs } from '../shared'

export namespace Projects {
  export interface Project {}

  export interface SearchParams {
    service?: string[]
    limit?: number
    page?: number
  }

  export interface Data {}

  export type List = PaginatedDocs<Project>
}
