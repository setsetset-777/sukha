import type * as API from '@app/api/types'
import type { LocaleCode, Media, PaginatedDocs, ProjectTag } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'
import {
  getPathOfRoute,
  getProjectsTagsUrlSync,
  getRouteByIdSync,
  getRoutes,
} from '@/helpers/routes'
import { type CustomTFunction } from '@/i18n'
import type { I18n } from '@payloadcms/translations'

interface Props {
  locale: LocaleCode
  i18n: I18n
}

export const getHomeData = async ({
  locale,
  i18n,
}: Props): Promise<{
  meta: API.Meta
  data: API.Home.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Home.Data
  }>(async () => {
    const payload = await getPayload({
      config,
    })

    const [routes, pageHome, projects] = await Promise.all([
      getRoutes(),
      payload.findGlobal({
        slug: 'pageHome',
        locale,
      }),
      payload.find({
        collection: 'projects',
        pagination: false,
        draft: false,
        where: {
          featured: {
            equals: 'true',
          },
        },
        select: {
          id: true,
          title: true,
          mainImage: true,
          tags: true,
        },
      }) as Promise<
        PaginatedDocs<{
          id: string
          title: string
          mainImage: Media
          tags: ProjectTag[]
        }>
      >,
    ])

    const { meta, projectLinkLabel } = pageHome
    const t = i18n.t as CustomTFunction

    return {
      meta: {
        title: meta?.title ?? undefined,
        description: meta?.description ?? undefined,
        image: (meta?.image as API.Media) ?? undefined,
      },
      data: {
        projects: projects.docs.map(({ id, title, mainImage, tags }) => ({
          id,
          title,
          image: mainImage,
          url: getPathOfRoute(getRouteByIdSync(id, routes), locale)!,
          tags: tags?.map(({ title, urlSlug }: ProjectTag) => ({
            label: title,
            url: getProjectsTagsUrlSync([urlSlug], locale, routes),
          })),
        })),
        slidesArialLabel: t('home:slidesArialLabel'),
        projectLinkLabel: projectLinkLabel ?? undefined,
      },
    }
  }, tags.home(locale))
}
