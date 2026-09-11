'use client'

import React, { useCallback } from 'react'
import { UploadInput, useConfig, useForm } from '@payloadcms/ui'

type Props = {
  path: string
  schemaPath: string
}

type GalleryRow = {
  image?: string | number | { id?: string | number }
}

const getId = (value: unknown): string | number | undefined => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (value && typeof value === 'object' && 'id' in value) {
    return getId(value.id)
  }

  return undefined
}

export default function GalleryBulkUpload({ path, schemaPath }: Props) {
  const { addFieldRow, getDataByPath } = useForm()
  const { config } = useConfig()

  const handleChange = useCallback(
    (value: unknown) => {
      const values = Array.isArray(value) ? value : value ? [value] : []

      const selectedIds = values.map(getId).filter((id): id is string | number => id !== undefined)

      if (!selectedIds.length) {
        return
      }

      const existingRows = getDataByPath<GalleryRow[]>(path) ?? []

      const existingIds = new Set(
        existingRows
          .map((row) => getId(row.image))
          .filter((id): id is string | number => id !== undefined),
      )

      selectedIds
        .filter((id) => !existingIds.has(id))
        .forEach((id) => {
          addFieldRow({
            path,
            schemaPath,
            subFieldState: {
              image: {
                initialValue: id,
                value: id,
                valid: true,
              },
              fullwidth: {
                initialValue: false,
                value: false,
                valid: true,
              },
              before: {
                initialValue: false,
                value: false,
                valid: true,
              },
              description: {
                initialValue: null,
                value: null,
                valid: true,
              },
            },
          })
        })
    },
    [addFieldRow, getDataByPath, path, schemaPath],
  )

  return (
    <UploadInput
      api={config.routes.api}
      serverURL={config.serverURL}
      path={`${path}.__bulkUpload`}
      relationTo="media"
      hasMany
      allowCreate
      value={undefined}
      onChange={handleChange}
      displayPreview={false}
    />
  )
}
