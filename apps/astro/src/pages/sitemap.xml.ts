import { getGeneral } from '@/lib/page'
import { localization } from '@app/api/i18n'
import type { Route } from '@app/api/types'
import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ site, url }) => {
  const baseUrl = (site?.origin ?? url.origin).replace(/\/$/, '')

  const entries = await Promise.all(
    localization.locales.map(async (locale) => {
      const general = await getGeneral(locale)
      const dates = Object.values<Route>(general?.routes || [])
        .map((r) => (r.updatedAt ? new Date(r.updatedAt).getTime() : 0))
        .filter(Boolean)
      const lastmod = dates.length
        ? `\n    <lastmod>${new Date(Math.max(...dates)).toISOString()}</lastmod>`
        : ''
      return `
  <sitemap>
    <loc>${baseUrl}/${locale.code}/sitemap.xml</loc>${lastmod}
  </sitemap>`
    }),
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}
</sitemapindex>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
