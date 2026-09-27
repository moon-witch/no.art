import { PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { assets } from '../../database/schema'
import { requireOwner, requireSameOrigin } from '../../utils/auth'
import { useDatabase } from '../../utils/database'
import { getAssetsBucket, useS3 } from '../../utils/s3'

const maxUploadBytes = 10 * 1024 * 1024
const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export default defineEventHandler(async (event) => {
  requireSameOrigin(event)
  requireOwner(event)
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file')

  if (!file?.data || !file.filename || !file.type || !acceptedImageTypes.has(file.type) || file.data.byteLength > maxUploadBytes) {
    throw createError({ statusCode: 400, statusMessage: 'Upload a JPEG, PNG, WebP, or AVIF image smaller than 10 MB' })
  }

  const extension = file.filename.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'image'
  const objectKey = `quote-images/${randomUUID()}.${extension}`

  await useS3().send(new PutObjectCommand({
    Bucket: getAssetsBucket(),
    Key: objectKey,
    Body: file.data,
    ContentType: file.type,
  }))

  const [asset] = await useDatabase().insert(assets).values({
    objectKey,
    originalFilename: file.filename,
    contentType: file.type,
    sizeBytes: file.data.byteLength,
  }).returning()

  return asset
})
