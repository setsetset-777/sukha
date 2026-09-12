import { localizedLabels } from '@/i18n'
import type { Field, LabelFunction, StaticLabel } from 'payload'

type TitleField = {
  label?: LabelFunction | StaticLabel
  localized?: boolean
}

const defaultLabel = localizedLabels.fields.title

const localized = true

export const titleField = (
  { label = defaultLabel }: TitleField = {
    label: defaultLabel,
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
