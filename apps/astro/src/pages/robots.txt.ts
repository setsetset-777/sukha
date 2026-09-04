import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapURL: string) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`

export const GET: APIRoute = () => {
  const sitemapURL = `${process.env.MEDIA_URL}/sitemap.xml`
  return new Response(getRobotsTxt(sitemapURL))
}
