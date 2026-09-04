import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { LineIcon, CheckIcon } from '@payloadcms/ui'

export default function CollectionListCheck({ cellData }: DefaultCellComponentProps) {
  return <React.Fragment>{cellData ? <CheckIcon /> : <LineIcon />}</React.Fragment>
}
