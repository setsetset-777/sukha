import { GlobalSlug, CollectionSlug } from 'payload'
import type * as API from '@app/api/types'
import { PageAgency, PageContact, PageHome, PageProject, Project } from '@/types/payload'

export type PageSlug = Extract<
  GlobalSlug | CollectionSlug,
  'pageHome' | 'pageAgency' | 'pageProjects' | 'projects' | 'pageContact'
>

export type PageFetch =
  | {
      data: PageHome
      slug: 'pageHome'
    }
  | {
      data: PageAgency
      slug: 'pageAgency'
    }
  | {
      data: PageProject
      slug: 'pageProjects'
    }
  | {
      data: Project
      slug: 'projects'
    }
  | {
      data: PageContact
      slug: 'pageContact'
    }

export type PageResponse =
  | {
      data: API.Home.Data
      slug: 'pageHome'
    }
  | {
      data: API.Agency.Data
      slug: 'pageAgency'
    }
  | {
      data: API.Projects.Data
      slug: 'pageProjects'
    }
  | {
      data: API.Project.Data
      slug: 'projects'
    }
  | {
      data: API.Contact.Data
      slug: 'pageContact'
    }
