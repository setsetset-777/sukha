import { LocaleCode } from '@/types'
import { BasePayload } from 'payload'

interface Params {
  slugs?: string[]
  payload: BasePayload
  locale: LocaleCode
}

export default async function getTagIdsFromSlugs({
  slugs,
  payload,
  locale,
}: Params): Promise<string[]> {
  const tags = await payload.find({
    collection: 'projectTags',
    locale,
    draft: false,
    where: {
      urlSlug: {
        in: slugs,
      },
    },
  })
  return tags.docs.map(({ id }) => id)
}
