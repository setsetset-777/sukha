'use client'

import { Fragment, useState } from 'react'
import { AfterListClientProps } from 'payload'
import { Button, useAuth, LoadingOverlay, useTranslation } from '@payloadcms/ui'
import { CustomTFunction } from '@/i18n'

export default function InvalidateCache(props: AfterListClientProps) {
  const { user } = useAuth()
  const { t: defaultT } = useTranslation()
  const t = defaultT as CustomTFunction

  if (!user || user.role !== 'admin') {
    return null
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function invalidateCache() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cache', {
        method: 'POST',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.message || `Request failed (${response.status})`)
      }
    } catch (err) {
      console.error(err)
      setError(err as string)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Fragment>
      <Button buttonStyle="secondary" onClick={invalidateCache} disabled={isLoading}>
        {t('cache:invalidate')}
      </Button>
      {isLoading && <LoadingOverlay />}
    </Fragment>
  )
}
