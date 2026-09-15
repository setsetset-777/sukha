import type { Media } from '../shared'
import type { Partner } from './partner'

export namespace Agency {
  interface Partners {
    title: string
    list: Partner[]
  }

  export interface Data {
    title: string
    image?: Media
    name?: string
    job?: string
    text?: string
    partners: Partners
  }
}
