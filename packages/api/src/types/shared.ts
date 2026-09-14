import type { Payload } from './payload'

// TODO Check Paylaod dependency
export type PageSlug = Payload.PageSlug
export type Media = Payload.Media | null
export type Locale = Payload.Locale
export type LocaleCode = Payload.LocaleCode

export interface Meta {
  title?: string
  description?: string
  image?: Media
}

// Base on Payloads pagination response
// https://payloadcms.com/docs/queries/pagination#response
export interface PaginatedDocs<Item> extends Omit<Payload.PaginatedDocs, 'docs'> {
  docs: Item[]
}

export interface Route {
  id: string
  slug: PageSlug
  parent?: PageSlug
  updatedAt?: string
  locales: Record<
    LocaleCode,
    {
      path: string
      urlSlug?: string
    }
  >
}

export type Routes = Record<string, Route>
