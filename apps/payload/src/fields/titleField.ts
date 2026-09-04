import type { Field, LabelFunction, StaticLabel } from 'payload'

type TitleField = {
  label?: LabelFunction | StaticLabel
  localized?: boolean
}

const defaultLabel = {
  en: 'Title',
  fr: 'Titre',
}

export const titleField = (
  { label = defaultLabel, localized }: TitleField = {
    label: defaultLabel,
    localized: false,
  },
): Field => {
  return {
    name: 'title',
    type: 'text',
    label,
    localized,
    required: true,
  }
}
