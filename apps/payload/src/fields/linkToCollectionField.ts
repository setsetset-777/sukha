import type { CollectionSlug, Field, LabelFunction, StaticLabel } from 'payload'
import { localizedLabels } from '@/i18n'

type LinkToCollectionField = {
  label?: LabelFunction | StaticLabel
  slug: CollectionSlug
  name?: string
  group?: string
}

const defaultLabel = {
  en: 'Title',
  fr: 'Titre',
}

export const linkToCollectionField = ({ slug, label }: LinkToCollectionField): Field => {
  return {
    name: 'collectionLink',
    type: 'group',
    label: label ?? localizedLabels.collections[slug]?.plural,
    fields: [
      {
        name: 'slug',
        type: 'text',
        hidden: true,
        virtual: true,
        defaultValue: slug,
      },
      {
        name: 'linkToCollection',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/LinkToCollection',
          },
        },
      },
    ],
  }
}
