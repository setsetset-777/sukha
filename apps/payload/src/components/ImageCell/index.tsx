import type { DefaultServerCellComponentProps } from 'payload'

const MainImageCell = async ({ cellData, payload }: DefaultServerCellComponentProps) => {
  if (!cellData) return null

  // cellData is either the populated doc or just an ID, depending on depth
  const media =
    typeof cellData === 'object'
      ? cellData
      : await payload.findByID({ collection: 'media', id: cellData, depth: 0 })

  const src = media?.sizes[200]?.url ?? media?.url
  if (!src) return null

  return (
    <img
      src={src}
      alt={media.alt ?? ''}
      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
    />
  )
}

export default MainImageCell
