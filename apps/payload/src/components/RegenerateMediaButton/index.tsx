'use client'
import { useState } from 'react'
import './styles.scss'
import { Button, useAuth, LoadingOverlay } from '@payloadcms/ui'

export default function RegenerateMediaButton() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!user || user.role !== 'admin') {
    return null
  }

  async function regenerate() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/regenerate-media', {
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
    <fieldset className="regenerate-media-button">
      <legend>Nettoie le dossier media et regénère toutes les tailles d'image.</legend>
      <Button buttonStyle="primary" onClick={regenerate} disabled={isLoading}>
        Regénérer media
      </Button>
      {isLoading && <LoadingOverlay />}
      {error && <p className="regenerate-media-button__error ">{error}</p>}
    </fieldset>
  )
}
