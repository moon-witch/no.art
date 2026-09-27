import { desc, eq } from 'drizzle-orm'
import { assets, quotes, type LocalizedText } from '../database/schema'
import { useDatabase } from './database'

export type QuoteInput = {
  id?: string
  status: 'draft' | 'published'
  displayOrder: number
  imageAssetId?: string | null
  imageAlt: string
  quoteText: string
  attribution: string
  reflection: LocalizedText
}

const cleanText = (value: unknown) => typeof value === 'string' ? value.trim() : ''

export const parseQuoteInput = (body: Partial<QuoteInput>): QuoteInput => {
  const status = body.status === 'published' ? 'published' : 'draft'
  const reflection = {
    en: cleanText(body.reflection?.en),
    de: cleanText(body.reflection?.de),
  }

  const input = {
    status,
    displayOrder: Number.isFinite(body.displayOrder) ? Math.round(body.displayOrder) : 0,
    imageAssetId: body.imageAssetId || null,
    imageAlt: cleanText(body.imageAlt),
    quoteText: cleanText(body.quoteText),
    attribution: cleanText(body.attribution),
    reflection,
  } satisfies QuoteInput

  if (!input.imageAlt || !input.quoteText || !input.attribution || !input.reflection.en || !input.reflection.de) {
    throw createError({ statusCode: 400, statusMessage: 'Complete English and German quote content is required' })
  }

  if (input.status === 'published' && !input.imageAssetId) {
    throw createError({ statusCode: 400, statusMessage: 'A published quote needs an image' })
  }

  return input
}

export const listStudioQuotes = () => useDatabase()
  .select({
    id: quotes.id,
    status: quotes.status,
    displayOrder: quotes.displayOrder,
    imageAssetId: quotes.imageAssetId,
    imageAlt: quotes.imageAlt,
    quoteText: quotes.quoteText,
    attribution: quotes.attribution,
    reflection: quotes.reflection,
    imageKey: assets.objectKey,
  })
  .from(quotes)
  .leftJoin(assets, eq(quotes.imageAssetId, assets.id))
  .orderBy(desc(quotes.updatedAt))
