import type { APIRoute } from 'astro'

const prodBody = (sitemapURL: string) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`

const devBody = () => `\
User-agent: *
Disallow: /
`

export const GET: APIRoute = ({ site, url }) => {
  const baseUrl = site?.href ?? url.origin
  const sitemapURL = `${baseUrl}/sitemap.xml`
  const isProd =
    import.meta.env.PROD &&
    import.meta.env.MODE === 'production' &&
    process.env.NODE_ENV === 'production'
  const body = isProd ? prodBody(sitemapURL) : devBody()
  return new Response(body)
}
