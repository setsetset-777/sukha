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

export const GET: APIRoute = () => {
  const sitemapURL = `${process.env.CLIENT_URL}/sitemap.xml`
  const isProd =
    import.meta.env.PROD &&
    import.meta.env.MODE === 'production' &&
    process.env.NODE_ENV === 'production'
  const body = isProd ? prodBody(sitemapURL) : devBody()
  return new Response(body)
}
