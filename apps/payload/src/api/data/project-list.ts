import type * as API from '@app/api/types'
import type { LocaleCode } from '@/types'
import { getPayload } from 'payload'
import apiConfig from '@app/api/config'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { getPathOfRoute, getRouteByIdSync, getRoutes } from '@/helpers/routes'

interface Props {
  locale: LocaleCode
  pagination?: {}
  params?: API.Projects.SearchParams
}

export const getProjectListData = async ({
  locale,
  params = {},
}: Props): Promise<API.Projects.List> => {
  return cached<API.Projects.List>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const { tag: selectedTagsSlugs, page, limit } = params

      const [routes, tags] = await Promise.all([
        getRoutes(),
        payload.find({
          collection: 'projectTags',
          locale,
          draft: false,
          where: {
            urlSlug: {
              in: selectedTagsSlugs,
            },
          },
        }),
      ])

      const selectedTagssIds = tags.docs.map(({ id }) => id)

      const projects = await listPublishedCollection({
        slug: 'projects',
        payload,
        locale,
        pagination: {
          page: page ?? 1,
          limit: limit ?? apiConfig.projectsLimit,
        },
        where:
          selectedTagssIds.length > 0
            ? {
                tags: {
                  in: selectedTagssIds,
                },
              }
            : {},
      })

      return {
        ...projects,
        docs: projects.docs.map(({ id, mainImage, title }) => ({
          image: mainImage as API.Media,
          title,
          url: getPathOfRoute(getRouteByIdSync(id, routes), locale) ?? undefined,
        })),
      }
    },
    tags.projectList(params, locale),
  )
}
