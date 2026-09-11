import logger from '@app/logger'
import type { InitConfig } from '../types/api'

// Default config
export let config: InitConfig = {
  apiUrl: '',
  serviceUser: '',
  servicePassword: '',
}

/**
 * API initializer with env variables
 * @param initConfig
 */
export function init(initConfig: InitConfig) {
  config = {
    ...config,
    ...initConfig,
  }
}

/**
 * Do request to payload
 * @param url
 * @returns
 */
export async function request<T>(url: string): Promise<T | null> {
  let res = await fetch(url)

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')

    logger.error(`Payload request failed (${res.status}): ${body}`)

    throw new Error(`Payload request failed (${res.status}) for ${url}`)
  }

  return res.json()
}

/**
 * Helper to format url from slug and parameters
 * @param { slug, params }
 * @returns string
 */
export function buildUrl({ slug, params }: { slug: string; params?: Record<string, any> }): string {
  const url = new URL(`${config.apiUrl}/${slug}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') {
        url.searchParams.set(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item))
      }
    })
  }

  return url.toString()
}
