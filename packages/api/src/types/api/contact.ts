import type { Media } from '../shared'
import type { Setsetset } from '.'

export namespace Contact {
  export interface Data {
    title: string
    image?: Media
    hook?: string
    address?: string
    email?: string
    phone?: string
    logoAlt?: string
    setsetset: Setsetset
  }
}
