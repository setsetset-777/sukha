import { type CustomTFunction, localizedLabels } from '@/i18n'
import { Link } from '@payloadcms/ui'
import type { CollectionSlug, ServerComponentProps, TypedLocale } from 'payload'

export default function LinkToCOllection({ i18n, siblingData, req }: ServerComponentProps) {
  const t = i18n.t as CustomTFunction
  const collectionSlug = siblingData.slug
  // const slug = data.globalType
  const labels = localizedLabels.collections[collectionSlug as CollectionSlug]
  const locale = req.locale as TypedLocale
  return (
    <div>
      <p>{t('linkToCollection:description', { items: labels?.plural[locale] })}</p>
      <Link
        className="btn btn--style-secondary btn--size-medium"
        href={`/collections/${collectionSlug}`}
      >
        {t('linkToCollection:label', { collection: labels?.plural[locale] })}
      </Link>
    </div>
  )
}
