import type { Field, LabelFunction, StaticLabel } from 'payload'

type HeroImageField = {
  label?: LabelFunction | StaticLabel
}

const defaultLabel = {
  en: 'Hero image',
  fr: "Image d'entête",
}

export const heroImageField = (
  { label = defaultLabel }: HeroImageField = {
    label: defaultLabel,
  },
): Field => {
  return {
    name: 'heroImage',
    label,
    type: 'upload',
    relationTo: 'media',
    required: true,
  }
}
