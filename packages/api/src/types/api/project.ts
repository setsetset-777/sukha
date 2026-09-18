import { Media } from '../shared'
import { Tag } from '.'

export namespace Project {
  export type Gallery = GalleryItem[]

  export interface GalleryItem {
    image: Media
    fullWidth?: boolean
    description?: string
  }

  export interface Spec {
    label: string
    values?: string[]
  }

  export interface Credit {
    label?: string
    value: string
  }

  export interface Data {
    title: string
    image?: Media
    place?: string
    tags: Tag[]
    text?: string
    backLink?: {
      label?: string
      url: string
    }
    gallery: Gallery
    existing?: {
      label?: string
      images: Media[]
    }
    specs?: {
      label?: string
      list?: Spec[]
    }
    credit?: Credit
  }
}
