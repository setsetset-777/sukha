import type * as API from '@app/api/types'
import type { LocaleCode, Media } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cached, tags } from '@/helpers/cache'
import type { I18n } from '@payloadcms/translations'
import { CustomTFunction } from '@/i18n'

interface Props {
  locale: LocaleCode
  i18n: I18n
}

export const getContactData = async ({
  locale,
  i18n,
}: Props): Promise<{
  meta: API.Meta
  data: API.Contact.Data
}> => {
  return cached<{
    meta: API.Meta
    data: API.Contact.Data
  }>(async () => {
    const payload = await getPayload({
      config,
    })

    const pageContact = await payload.findGlobal({
      slug: 'pageContact',
      locale,
    })

    const { meta, title, image, catch: hook, address, email, phone } = pageContact

    const t = i18n.t as CustomTFunction

    return {
      meta: {
        title: meta?.title ?? undefined,
        description: meta?.description ?? undefined,
        image: (meta?.image as API.Media) ?? undefined,
      },
      data: {
        title: title,
        image: image ? (typeof image === 'string' ? null : (image as Media)) : undefined,
        hook: hook ?? undefined,
        address: address ?? undefined,
        email: email ?? undefined,
        phone: phone ?? undefined,
        logoAlt: t('general:logo'),
        setsetset: {
          label: t('general:setsetset'),
          url: 'https://setsetset.net',
        },
      },
    }
  }, tags.contact(locale))
}
