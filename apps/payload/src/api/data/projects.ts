import type * as API from '@app/api/types'
import type { LocaleCode } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'
import { type CustomTFunction } from '@/i18n'
import type { I18n } from '@payloadcms/translations'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { getProjectListData } from './project-list'

interface Props {
  locale: LocaleCode
  i18n: I18n
  params?: API.Projects.SearchParams
}

export const getProjectsData = async ({
  params = {},
  locale,
  i18n,
}: Props): Promise<{
  meta: API.Meta
  data: API.Projects.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Projects.Data
  }>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const [pageProjects, projectTags, projects, general] = await Promise.all([
        payload.findGlobal({
          slug: 'pageProjects',
          locale,
          draft: false,
        }),
        listPublishedCollection({ slug: 'projectTags', payload, locale }),
        getProjectListData({
          locale,
          params,
        }),
        payload.findGlobal({
          slug: 'general',
          locale,
        }),
      ])

      const { meta, title, urlSlug } = pageProjects
      const t = i18n.t as CustomTFunction

      // filter down tags for which no projects exists
      const tags = (
        await Promise.all(
          projectTags.docs.map(async (project) => {
            const projects = await listPublishedCollection({
              slug: 'projects',
              payload,
              locale,
              where: {
                tags: {
                  in: [project.id],
                },
              },
            })
            return { ...project, length: projects.docs.length }
          }),
        )
      ).filter(({ length }) => length > 0)

      const { moreLabel } = general.misc ?? {}

      return {
        meta: {
          title: meta?.title ?? undefined,
          description: meta?.description ?? undefined,
          image: (meta?.image as API.Media) ?? undefined,
        },
        data: {
          title,
          urlSlug,
          moreLabel: moreLabel ?? undefined,
          tags: tags.map(({ title, urlSlug }) => {
            return {
              label: title,
              slug: urlSlug,
            }
          }),
          list: projects,
        },
      }
    },
    tags.projects(params, locale),
  )
}
