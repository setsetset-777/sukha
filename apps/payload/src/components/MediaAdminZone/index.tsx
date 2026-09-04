'use client'

import { AfterListClientProps } from 'payload'
import AdminZone from '@/components/AdminZone'
import RegenerateMediaButton from '@/components/RegenerateMediaButton'

export default function MediaAdminZone(props: AfterListClientProps) {
  return (
    <AdminZone>
      <RegenerateMediaButton />
    </AdminZone>
  )
}
