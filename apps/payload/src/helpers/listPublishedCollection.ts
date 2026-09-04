import { Locale } from '@/types'
import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  PaginatedDocs,
  Where,
} from 'payload'

interface Props<T extends CollectionSlug> {
  slug: T
  payload: BasePayload
  locale?: Locale
  where?: Where
  pagination?: {
    page?: number
    limit?: number
  }
}

export default async function listPublishedCollection<T extends CollectionSlug>({
  slug,
  payload,
  locale,
  where,
  pagination,
}: Props<T>): Promise<PaginatedDocs<DataFromCollectionSlug<T>>> {
  return payload.find({
    collection: slug,
    draft: false,
    pagination: !!pagination,
    page: pagination?.page,
    limit: pagination?.limit,
    locale,
    where: {
      _status: {
        equals: 'published',
      },
      ...where,
    },
  })
}
