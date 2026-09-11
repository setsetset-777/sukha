import type { LocalizationConfigWithNoLabels, Locale, CollectionSlug, TypedLocale } from 'payload'
import type { TFunction } from '@payloadcms/translations'
import { enTranslations } from '@payloadcms/translations/languages/en'
import { frTranslations } from '@payloadcms/translations/languages/fr'
import type { NestedKeysStripped } from '@payloadcms/translations'

const DEFAULT_LOCALE: TypedLocale = 'fr'

export const localization: LocalizationConfigWithNoLabels = {
  locales: ['fr', 'en'],
  defaultLocale: DEFAULT_LOCALE,
}

export const normalLocale = (locale?: TypedLocale | null): TypedLocale =>
  locale ?? (localization.defaultLocale as TypedLocale)

type LocalizedLabel = Record<Locale['code'], string>

export const localizedLabels: {
  groups: Record<string, LocalizedLabel>
  fields: Record<string, LocalizedLabel>
  descriptions: Record<string, LocalizedLabel>
  collections: Partial<
    Record<
      CollectionSlug,
      {
        singular: LocalizedLabel
        plural: LocalizedLabel
      }
    >
  >
} = {
  groups: {
    pages: {
      fr: 'Pages',
      en: 'Pages',
    },
  },
  fields: {
    name: {
      en: 'Name',
      fr: 'Nom',
    },
    title: {
      en: 'Title',
      fr: 'Titre',
    },
    text: {
      en: 'Text',
      fr: 'Texte',
    },
    url: {
      en: 'Web address',
      fr: 'Adresse internet',
    },
    job: {
      en: 'Job',
      fr: 'Métier',
    },
  },
  collections: {
    users: {
      singular: {
        en: 'User',
        fr: 'Utilisateur',
      },
      plural: {
        en: 'Users',
        fr: 'Utilisateurs',
      },
    },
    projects: {
      singular: {
        en: 'Project',
        fr: 'Projet',
      },
      plural: {
        en: 'Procjets',
        fr: 'Projets',
      },
    },
    partners: {
      singular: {
        en: 'Partner',
        fr: 'Partenaire',
      },
      plural: {
        en: 'Partners',
        fr: 'Partenaires',
      },
    },
    projectTags: {
      singular: {
        en: 'Project tag',
        fr: 'Tag de projet',
      },
      plural: {
        en: 'Project tags',
        fr: 'Tags de projet',
      },
    },
    projectSpecs: {
      singular: {
        en: 'Project specification',
        fr: 'Spécification de projet',
      },
      plural: {
        en: 'Project specifications',
        fr: 'Spécifications de projet',
      },
    },
  },
  descriptions: {
    urlSlug: {
      en: 'URL slugs must be unique and match the title when possible. Avoid spaces and special characters. Leave empty for the field to automatically fill.',
      fr: "Les segments d'URL doivent être uniques et correspondre au titre si possible. Éviter les espaces et les caractères spéciaux. Laisser vide pour que le champ se remplisse automatiquement.",
    },
  },
} as const

export const customTranslations: Record<Locale['code'], Record<string, any>> = {
  en: {
    validation: {
      uniqueUrlSlug: 'The URL segment already exists.',
    },
    pageHome: {
      adminProjectLinkLabel: 'Go to projects',
    },
    linkToCollection: {
      description:
        'Edit the visible {{items}} on the frontend directly from the collection page by editing their published status',
      label: 'Go to {{collection}}',
    },
    cache: {
      invalidate: 'Empty cache',
    },
  },
  fr: {
    general: {
      globals: 'Globales',
      createNew: 'Ajouter',
      createNewLabel: 'Ajouter',
    },
    validation: {
      uniqueUrlSlug: "Le segment d'URL existe déjà",
    },
    pageHome: {
      adminProjectLinkLabel: 'Aller aux réalisations',
    },
    linkToCollection: {
      description:
        'Éditez les {{items}} visibles sur le site directement à partir de leur page de collection en gérant leur statut de publication.',
      label: 'Aller aux {{collection}}',
    },
    cache: {
      invalidate: 'Vider le cache',
    },
  },
}

export type CustomTranslationsObject = typeof customTranslations.en &
  typeof frTranslations &
  typeof enTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>

export type CustomTFunction = TFunction<CustomTranslationsKeys>
