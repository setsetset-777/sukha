import type { Locale, Routes, PageSlug } from '../shared'

export namespace General {
  export interface Footer {
    text?: string
    logoAlt?: string
  }

  export interface Navigation {
    home: {
      url?: string
      linkLabel?: string
      logoAlt?: string
    }
    menu: NonNullable<
      Array<{
        title?: string
        url?: string
        slug?: PageSlug
      }>
    >
  }

  export interface Locales {
    current: Locale
    list: Locale[]
  }

  export interface Data {
    routes: Routes
    footer: Footer
    navigation: Navigation
  }
}
