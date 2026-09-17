import { Media } from '../shared'
import { Tag } from '.'

export namespace Project {
  export interface GalleryItem {
    image: Media
    fullwidth?: boolean
    descrption?: string
  }

  export interface Spec {
    label: string
    values?: string[]
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
    gallery: GalleryItem[]
    existing?: {
      label?: string
      images: Media[]
    }
    specs?: {
      label?: string
      list?: Spec[]
    }
    credit?: {
      label?: string
      value: string
    }
  }
}
