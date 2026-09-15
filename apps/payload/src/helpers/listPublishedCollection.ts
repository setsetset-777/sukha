import { LocaleCode } from '@/types'
import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  PaginatedDocs,
  Where,
  SelectType,
} from 'payload'

interface Props<T extends CollectionSlug> {
  slug: T
  payload: BasePayload
  locale?: LocaleCode
  where?: Where
  pagination?: {
    page?: number
    limit?: number
  }
  select?: SelectType
}

export default async function listPublishedCollection<T extends CollectionSlug>({
  slug,
  payload,
  locale,
  where,
  pagination,
  select,
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
    select,
  })
}
