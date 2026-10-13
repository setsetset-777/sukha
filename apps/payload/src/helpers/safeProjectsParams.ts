import { ProjectsSearchParams as SearchParams, TagList } from '@app/api/schemas'
import type { LocaleCode } from '@/types'
import type { BasePayload } from 'payload'
import listPublishedCollection from './listPublishedCollection'

export default async function safeProjectsParams(
  params: {
    tag?: string[]
    page?: string
    limit?: string
  },
  payload: BasePayload,
  locale?: LocaleCode,
): Promise<SearchParams> {
  try {
    // Parse all parameters
    const safeParams = SearchParams.parse(params)

    // Confirm all services passed exists
    const tags = await listPublishedCollection({
      slug: 'projectTags',
      payload,
      locale,
    })

    TagList(tags.docs.map(({ urlSlug }) => urlSlug)).parse(params.tag ?? undefined)

    return safeParams
  } catch (e) {
    payload.logger.error(e)
    throw new Error('Unvalid search params')
  }
}
