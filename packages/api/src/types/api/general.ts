import type { LocalizedRoutes, PageSlug } from '../shared'

export namespace General {
  export interface Footer {
    catch?: string
  }

  export interface Navigation {
    home: {
      url: string
      linkLabel: string
    }
    menu: NonNullable<
      Array<{
        title: string
        url: string
        slug: PageSlug
      }>
    >
  }

  export interface Data {
    routes: LocalizedRoutes
    footer: Footer
  }
}
