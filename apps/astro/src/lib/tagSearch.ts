export function appendTagSearch(url?: string, search?: string): string | null {
  if (!url) return null

  if (!search) return url

  const params = new URLSearchParams(search)
  const tags = params.getAll('tag')

  if (tags.length <= 0) return url

  const tagQuery = tags.map((tag) => `tag=${encodeURIComponent(tag)}`).join('&')
  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}${tagQuery}`
}
