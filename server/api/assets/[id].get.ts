import { GetObjectCommand } from '@aws-sdk/client-s3'
import { and, eq } from 'drizzle-orm'
import { Readable } from 'node:stream'
import { assets, quotes } from '../../database/schema'
import { readOwnerSession } from '../../utils/auth'
import { useDatabase } from '../../utils/database'
import { getAssetsBucket, useS3 } from '../../utils/s3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Asset ID is required' })
  }

  const isOwner = Boolean(readOwnerSession(getCookie(event, 'stay-a-while-owner')))
  const database = useDatabase()
  const [asset] = isOwner
    ? await database.select().from(assets).where(eq(assets.id, id))
    : await database
      .select({ id: assets.id, objectKey: assets.objectKey, contentType: assets.contentType })
      .from(assets)
      .innerJoin(quotes, eq(quotes.imageAssetId, assets.id))
      .where(and(eq(assets.id, id), eq(quotes.status, 'published')))

  if (!asset) {
    throw createError({ statusCode: 404, statusMessage: 'Asset not found' })
  }

  const object = await useS3().send(new GetObjectCommand({ Bucket: getAssetsBucket(), Key: asset.objectKey }))

  if (!object.Body) {
    throw createError({ statusCode: 404, statusMessage: 'Asset object not found' })
  }

  setHeader(event, 'content-type', asset.contentType)
  setHeader(event, 'cache-control', isOwner ? 'private, no-store' : 'public, max-age=3600')

  return sendStream(event, object.Body as Readable)
})
