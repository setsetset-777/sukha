// src/pages/[locale]/sitemap.xml.ts
import { getGeneral } from '@/lib/page'
import { localization, defaultLocale } from '@app/api/i18n'
import type { LocaleCode, Route } from '@app/api/types'
import type { APIRoute } from 'astro'

export const prerender = false // on-demand rendering; see note below for static

export const GET: APIRoute = async ({ params, site, url }) => {
  const { locales } = localization
  const code = params.locale as LocaleCode
  const locale = locales.find(({ code: c }) => c === code)

  // Reject unknown locales so /foo/sitemap.xml 404s
  if (!locale) {
    return new Response('Not found', { status: 404 })
  }

  const baseUrl = (site?.origin ?? url.origin).replace(/\/$/, '')
  const general = await getGeneral(locale)

  const urls = Object.values<Route>(general?.routes || [])
    .filter((route) => route.locales?.[code]?.path)
    .map((route) => {
      const path = route.locales[code].path
      const lastmod = route.updatedAt
        ? `\n    <lastmod>${new Date(route.updatedAt).toISOString()}</lastmod>`
        : ''

      const alternates = Object.entries(route.locales)
        .filter(([, l]) => l?.path)
        .map(
          ([code, l]) =>
            `\n    <xhtml:link rel="alternate" hreflang="${code}" href="${baseUrl}${l.path}"/>`,
        )
        .join('')

      const defaultPath = route.locales[defaultLocale.code]?.path
      const xDefault = defaultPath
        ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${defaultPath}"/>`
        : ''

      return `
  <url>
    <loc>${baseUrl}${path}</loc>${lastmod}${alternates}${xDefault}
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
