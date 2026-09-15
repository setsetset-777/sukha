export * from '../shared'
export * from './general'
export * from './home'
export * from './agency'
export * from './projects'
export * from './project'
export * from './contact'
export * from './partner'

import type { Home } from './home'
import type { Agency } from './agency'
import type { Project } from './project'
import type { Projects } from './projects'
import type { Contact } from './contact'
import type { Meta } from '../shared'

export type PageData = {
  meta: Meta
} & (
  | {
      data: Home.Data
      slug: 'pageHome'
      parentSlug?: undefined
    }
  | {
      data: Agency.Data
      slug: 'pageAgency'
      parentSlug?: undefined
    }
  | {
      data: Projects.Data
      slug: 'pageProjects'
      parentSlug?: undefined
    }
  | {
      data: Project.Data
      slug: 'projects'
      parentSlug?: undefined
    }
  | {
      data: Contact.Data
      slug: 'pageContact'
      parentSlug?: undefined
    }
)

export type FetchData = Promise<Record<string, any>>

export interface InitConfig {
  apiUrl: string
  serviceUser: string
  servicePassword: string
}
