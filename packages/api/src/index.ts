import { init, request, buildUrl } from './api'
import { ProjectsSearchParams } from './schemas/projects-search-params'
import type { General, PageData, Projects } from './types/api'
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

const projects = async (
  params: {
    tag?: string[]
    page?: string
    limit?: string
  },
  locale?: Payload.Locale,
): Promise<Projects.List | null> => {
  const safeParams = ProjectsSearchParams.safeParse(params)
  if (!safeParams.success) {
    throw new Error('Invalid query parameters')
  }

  return request(
    buildUrl({
      slug: 'projects-list',
      params: {
        locale,
        ...{
          ...params,
        },
      },
    }),
  )
}

export default {
  general,
  page,
  projects,
}
