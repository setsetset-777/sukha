import { Media } from '../shared'

export namespace Home {
  export interface Project {
    id: string
    image: Media
    title: string
    url: string
    tags: Array<{
      label: string
      url: string
    }>
  }

  export interface Data {
    projects: Array<Project>
    slidesArialLabel?: string
    projectLinkLabel?: string
  }
}
