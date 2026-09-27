import { and, asc, eq } from 'drizzle-orm'
import { assets, quotes } from '../database/schema'
import { useDatabase } from '../utils/database'

export default defineEventHandler(async () => {
  const database = useDatabase()

  return database
    .select({
      id: quotes.id,
      quoteText: quotes.quoteText,
      attribution: quotes.attribution,
      reflection: quotes.reflection,
      imageAlt: quotes.imageAlt,
      imageAssetId: quotes.imageAssetId,
      imageKey: assets.objectKey,
      desktopPlacement: quotes.desktopPlacement,
      mobilePlacement: quotes.mobilePlacement,
    })
    .from(quotes)
    .leftJoin(assets, eq(quotes.imageAssetId, assets.id))
    .where(and(eq(quotes.status, 'published'), eq(assets.id, quotes.imageAssetId)))
    .orderBy(asc(quotes.displayOrder))
})
