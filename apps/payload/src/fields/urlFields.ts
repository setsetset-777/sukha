import { slugify } from 'payload/shared'
import type {
  TextField,
  LabelFunction,
  StaticLabel,
  FieldHook,
  GlobalSlug,
  CollectionSlug,
  TextFieldSingleValidation,
} from 'payload'
import { type CustomTFunction } from '@/i18n'
import { getRoutes, routesConfig } from '@/helpers/routes'
import type { Locale, Route, RouteConfigPage } from '@/types'

type UrlFieldsProps = {
  slug?: CollectionSlug | GlobalSlug
  source?: string
  label?: LabelFunction | StaticLabel
  value?: string
}

const defaultLabel = {
  en: 'URL slug',
  fr: "Segment d'URL",
}

// Transforms aceented letters to the letter before applying Payload's slugify method
const slugifyWithAccents = (value: string) => {
  const slug = value.normalize('NFKD').replace(/[\u0300-\u036F]/g, '')
  return slugify(slug)
}

const trimWhitespace: FieldHook = ({ value }) => {
  return typeof value === 'string' ? value.trim() : value
}

const getParentPage = (slug: CollectionSlug | GlobalSlug): RouteConfigPage | undefined => {
  return routesConfig.pages.find(({ children }) => children?.slug === slug)
}

export const urlFields = ({
  slug: pageSlug,
  source,
  label = defaultLabel,
  value: defaultValue,
}: UrlFieldsProps): TextField[] => {
  const hasDefaultValue = typeof defaultValue === 'string'

  return [
    {
      name: 'urlSlug',
      type: 'text',
      label,
      localized: true,
      hasMany: false,
      required: true,
      hidden: hasDefaultValue,
      admin: {
        readOnly: hasDefaultValue,
      },
      validate: (async (value, { id, req: { payload, t: defaultT, locale } }) => {
        if (hasDefaultValue || !source || !pageSlug) {
          return
        }
        // Check if url slug is unique among the document siblings
        let routeWithUrlSlug: Route | undefined
        const routes = await getRoutes(locale as Locale)

        const parentPage = getParentPage(pageSlug)

        routeWithUrlSlug = Object.values(routes)?.find(
          ({ slug, urlSlug, parent, id: itemId }: Route) => {
            if (parentPage) {
              return parentPage?.slug === parent && urlSlug === value && id !== itemId
            }
            return !parent && slug !== pageSlug && urlSlug === value
          },
        )

        const isUnique = !routeWithUrlSlug

        if (!isUnique) {
          const t = defaultT as CustomTFunction
          return t('validation:uniqueUrlSlug')
        }
      }) as TextFieldSingleValidation,
      hooks: {
        beforeValidate: [
          async ({ siblingData, value, previousValue, previousSiblingDoc }) => {
            if (hasDefaultValue) {
              return defaultValue
            }
            if (!source || !pageSlug) {
              return
            }
            // Populate url slug field if necessary
            let nextValue = value
            const isSlugEmpty = value === '' || typeof value === 'undefined'
            const hasSlugChange = previousValue !== value
            const wasSlugBasedOnSource =
              previousValue === slugifyWithAccents(previousSiblingDoc[source] ?? '')
            if (isSlugEmpty || (!hasSlugChange && wasSlugBasedOnSource)) {
              nextValue = slugifyWithAccents(siblingData.title ?? '')
            }
            return nextValue
          },
          trimWhitespace,
        ],
      },
    },
  ]
}
