import { LocaleCode } from '@/types'
import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  SelectType,
  Where,
} from 'payload'

interface Params<T> {
  id: string
  collection: T
  payload: BasePayload
  locale: LocaleCode
  where?: Where
  select?: SelectType
}

export default async function getNextItem<T extends CollectionSlug>({
  id,
  collection,
  payload,
  locale,
  where,
  select,
}: Params<T>): Promise<DataFromCollectionSlug<T> | null> {
  const next = await payload.find({
    collection,
    where: {
      ...where,
      id: {
        greater_than: id,
      },
    },
    locale,
    limit: 1,
    sort: 'createdAt',
    select,
  })
  return next.docs[0] ?? null
}
