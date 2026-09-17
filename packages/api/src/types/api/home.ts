import { Media } from '../shared'
import { Tag } from '.'

export namespace Home {
  export interface Project {
    id: string
    image: Media
    title: string
    url: string
    tags: Array<Tag>
  }

  export interface Data {
    projects: Array<Project>
    slidesArialLabel?: string
    projectLinkLabel?: string
  }
}
