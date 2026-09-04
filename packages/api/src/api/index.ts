import logger from '@app/logger'
import type { General, InitConfig, PageData } from '../types/api'
import type { Payload } from '../types/payload'

let token: string | null = null
let loginPromise: Promise<void> | null = null

// Default config
let config: InitConfig = {
  enable: false,
  apiUrl: '',
  serviceUser: '',
  servicePassord: '',
  env: 'production',
}

// ------------
// Exposed API
// ------------

/**
 * Fetch global page
 * @param path
 * @param locale
 * @returns
 */
export async function fetchPage(path: string, locale?: Payload.Locale): Promise<PageData | null> {
  return request(
    buildUrl({
      slug: 'page',
      params: { path, locale },
    }),
  )
}

/**
 * Fetch general page
 * @param locale
 * @returns
 */
export async function fetchGeneral(locale?: Payload.Locale): Promise<General.Data | null> {
  return request(
    buildUrl({
      slug: 'general',
      params: { locale },
    }),
  )
}

// ------------
// Initialise API
// ------------
init({
  enable: process.env.PAYLOAD_ENABLE === 'true',
  apiUrl: `${process.env.PAYLOAD_API_URL}`,
  serviceUser: `${process.env.PAYLOAD_SERVICE_USER}`,
  servicePassord: `${process.env.PAYLOAD_SERVICE_PASSWORD}`,
  env: `${process.env.NODE_ENV}` === 'development' ? 'development' : 'production',
})

// ------------
// Functions
// ------------

/**
 * API initializer with env variables
 * @param initConfig
 */
function init(initConfig: InitConfig) {
  config = {
    ...config,
    ...initConfig,
  }
}

/**
 * Call Payload for login
 */
async function fetchLogin() {
  const url = buildUrl({ slug: 'users/login' })

  logger.info(`Logging into Payload at ${url}`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: config.serviceUser,
      password: config.servicePassord,
    }),
  })

  if (!res.ok) {
    throw new Error(`Unable to login (${res.status})`)
  }

  const data = await res.json()
  token = data.token

  logger.info('Payload login successful')
}

/**
 * Wrap login fetch into a promise
 * @returns
 */
async function login(): Promise<void> {
  if (loginPromise) {
    return loginPromise
  }

  loginPromise = fetchLogin()

  try {
    await loginPromise
  } finally {
    loginPromise = null
  }
}

/**
 * Do request to payload
 * @param url
 * @returns
 */
async function request<T>(url: string): Promise<T | null> {
  if (!token) {
    await login()
  }

  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Token expired: refresh once
  if (res.status === 401) {
    logger.info('Payload token expired. Refreshing.')

    token = null

    await login()

    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  if (res.status === 401) {
    console.log('???????')
  }

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Payload request failed (${res.status}) for ${url}`)
  }

  return res.json()
}

/**
 * Helper to format url from slug and parameters
 * @param { slug, params }
 * @returns string
 */
function buildUrl({ slug, params }: { slug: string; params?: Record<string, any> }): string {
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
