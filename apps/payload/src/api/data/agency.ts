import type * as API from '@app/api/types'
import type { LocaleCode, Media } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'
import { type CustomTFunction } from '@/i18n'
import type { I18n } from '@payloadcms/translations'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

interface Props {
  locale: LocaleCode
  i18n: I18n
}

export const getAgencyData = async ({
  locale,
  i18n,
}: Props): Promise<{
  meta: API.Meta
  data: API.Agency.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Agency.Data
  }>(async () => {
    const payload = await getPayload({
      config,
    })

    const [pageAgency, partners] = await Promise.all([
      payload.findGlobal({
        slug: 'pageAgency',
        locale,
      }),
      listPublishedCollection({
        slug: 'partners',
        locale,
        payload,
        select: {
          name: true,
          job: true,
          url: true,
          text: true,
        },
      }),
    ])

    const { meta, title, urlSlug, name, job, image, text, partners: partnersGroup } = pageAgency
    const t = i18n.t as CustomTFunction

    return {
      meta: {
        title: meta?.title ?? undefined,
        description: meta?.description ?? undefined,
        image: (meta?.image as API.Media) ?? undefined,
      },
      data: {
        title,
        urlSlug,
        name: name ?? undefined,
        job: job ?? undefined,
        image: (image as Media) ?? undefined,
        text: text ? convertLexicalToHTML({ data: text }) : undefined,
        partners: {
          title: partnersGroup?.title,
          list: partners.docs.map(({ name, job, url, text }) => ({
            name,
            job: job ?? undefined,
            url: url ?? undefined,
            text: text ? convertLexicalToHTML({ data: text }) : undefined,
          })),
        },
      },
    }
  }, tags.agency(locale))
}
