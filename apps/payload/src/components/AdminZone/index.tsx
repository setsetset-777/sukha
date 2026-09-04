'use client'
import { PropsWithChildren } from 'react'
import { useAuth } from '@payloadcms/ui'

import './styles.scss'

export default function functionMediaAdminZone({ children }: PropsWithChildren) {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="admin-zone gutter gutter--left gutter--right">
      <div className="admin-zone__inner">
        <h3>Admin zone</h3>
        <div className="admin-zone__content">{children}</div>
      </div>
    </div>
  )
}
