import type * as API from '@app/api/types'
import type { LocaleCode, Media, Partner, ProjectSpec, ProjectTag } from '@/types'
import { getPathBySlugSync, getProjectsTagsUrlSync, getRoutes } from '@/helpers/routes'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'

interface Props {
  id: string
  locale: LocaleCode
}

export const getProjectData = async ({
  id,
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Project.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Project.Data
  }>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const [routes, general, project] = await Promise.all([
        getRoutes(),
        payload.findGlobal({ slug: 'general', locale }),
        payload.findByID({
          collection: 'projects',
          locale,
          id,
          draft: false,
        }),
      ])

      const { meta, title, mainImage, place, tags, text, gallery, existing, specs, credit } =
        project
      const { backLinkLabel, existingLabel, specsLabel, creditsLabel } = general.misc ?? {}

      const backLinkUrl = getPathBySlugSync('pageProjects', locale, routes)

      return {
        meta: {
          title: meta?.title ?? undefined,
          description: meta?.description ?? undefined,
          image: (meta?.image as API.Media) ?? undefined,
        },
        data: {
          title,
          image: mainImage as API.Media,
          place: place ?? undefined,
          tags: (tags as ProjectTag[])?.map(({ title, urlSlug }) => ({
            label: title,
            url: getProjectsTagsUrlSync([urlSlug], locale, routes),
          })),
          text: text ? convertLexicalToHTML({ data: text }) : undefined,
          backLink: backLinkUrl
            ? {
                url: backLinkUrl,
                label: backLinkLabel ?? undefined,
              }
            : undefined,
          gallery:
            gallery?.map(({ image, fullwidth, description }) => ({
              image: image as Media,
              fullWidth: fullwidth ?? undefined,
              description: description ?? undefined,
            })) || [],
          existing:
            existing && existing.length > 0
              ? {
                  label: existingLabel ?? undefined,
                  images: existing as Media[],
                }
              : undefined,
          specs:
            specs && specs.length > 0
              ? {
                  label: specsLabel ?? undefined,
                  list: specs?.map(({ spec, values }) => {
                    return {
                      label: spec ? (spec as ProjectSpec).title : undefined,
                      values:
                        values && values.length > 0 ? values?.map(({ item }) => item) : undefined,
                    }
                  }),
                }
              : undefined,
          credit: credit
            ? {
                label: creditsLabel ?? undefined,
                value: (credit as Partner).name,
              }
            : undefined,
        },
      }
    },
    tags.project(id, locale),
  )
}
