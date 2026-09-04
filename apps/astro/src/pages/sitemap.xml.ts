import { getGeneral } from '@/lib/page'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site, url }) => {
  const baseUrl = site?.href ?? url.origin
  const general = await getGeneral()

  const urls = Object.values(general?.routes || [])
    .map(({ path, updatedAt }) => {
      const lastmod = updatedAt ? `<lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ''

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
