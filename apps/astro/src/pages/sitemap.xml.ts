import { getGeneral } from '@/lib/page'
import { pathLocale } from '@app/api/i18n'
import type { Route } from '@app/api/types'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site, url }) => {
  const baseUrl = site?.href ?? url.origin
  const locale = pathLocale(Astro.url.pathname)
  const general = await getGeneral(locale)

  const urls = Object.values<Route>(general?.routes || [])
    .map(({ locales, updatedAt }) => {
      const lastmod = updatedAt ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ''
      const path = locales[locale].path

      return `
  <url>
    <loc>${baseUrl}${path}</loc>
    ${lastmod}
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
