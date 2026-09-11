import { init, request, buildUrl } from './api'
import type { General, PageData } from './types/api'
import type { Payload } from './types/payload'

init({
  apiUrl: `${process.env.PAYLOAD_API_URL}`,
  serviceUser: `${process.env.PAYLOAD_SERVICE_USER}`,
  servicePassword: `${process.env.PAYLOAD_SERVICE_PASSWORD}`,
})

const general = async (locale?: Payload.Locale): Promise<General.Data | null> => {
  return request(
    buildUrl({
      slug: 'general',
      params: { locale },
    }),
  )
}

const page = async (path: string, locale?: Payload.Locale): Promise<PageData | null> => {
  return request(
    buildUrl({
      slug: 'page',
      params: { path, locale },
    }),
  )
}

export default {
  general,
  page,
}
