import { SearchParams } from '@app/api/schemas'
import type { Locale } from '@/types'
import type { BasePayload } from 'payload'

export default async function safeProjectsParams(
  params: {
    page?: string
    limit?: string
  },
  payload: BasePayload,
  locale?: Locale,
): Promise<SearchParams> {
  try {
    // Parse all parameters
    const safeParams = SearchParams.parse(params)

    return safeParams
  } catch (e) {
    payload.logger.error(e)
    throw new Error('Unvalid search params')
  }
}
