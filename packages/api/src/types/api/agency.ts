import type { Media } from '../shared'
import type { Partner } from './partner'

export namespace Agency {
  interface Partners {
    title: string
    list: Partner[]
  }

  export interface Data {
    title?: string
    sukha: {
      title?: string
      text?: string
      callout?: string
    }
    founder: {
      name?: string
      job?: string
      text?: string
      image?: Media
    }
    partners: Partners
  }
}
