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

    const { meta, title, urlSlug, sukha, founder, partners: partnersGroup } = pageAgency
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
        sukha: {
          title: sukha?.title ?? undefined,
          text: sukha?.text ? convertLexicalToHTML({ data: sukha.text }) : undefined,
          callout: sukha?.callout ?? undefined,
        },
        founder: {
          name: founder?.name ?? undefined,
          job: founder?.job ?? undefined,
          image: (founder?.image as Media) ?? undefined,
          text: founder?.text ? convertLexicalToHTML({ data: founder.text }) : undefined,
        },
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
