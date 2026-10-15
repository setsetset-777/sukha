import { init, request, buildUrl } from './api'
import { ProjectsSearchParams } from './schemas/projects-search-params'
import type { General, PageData, Projects, Locale, LocaleCode } from './types/api'

init({
  apiUrl: `${process.env.PAYLOAD_API_URL}`,
  serviceUser: `${process.env.PAYLOAD_SERVICE_USER}`,
  servicePassword: `${process.env.PAYLOAD_SERVICE_PASSWORD}`,
})

const general = async (locale?: Locale | LocaleCode): Promise<General.Data | null> => {
  const code = typeof locale === 'string' ? locale : locale?.code
  return request(
    buildUrl({
      slug: 'general',
      params: { locale: code },
    }),
  )
}

const page = async (path: string, locale?: Locale | LocaleCode): Promise<PageData | null> => {
  const code = typeof locale === 'string' ? locale : locale?.code
  return request(
    buildUrl({
      slug: 'page',
      params: { path, locale: code },
    }),
  )
}

const projects = async (
  params: {
    tag?: string[]
    page?: string
    limit?: string
  },
  locale?: Locale | LocaleCode,
): Promise<Projects.List | null> => {
  const safeParams = ProjectsSearchParams.safeParse(params)
  if (!safeParams.success) {
    throw new Error('Invalid query parameters')
  }

  locale = typeof locale === 'string' ? locale : locale?.code

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
