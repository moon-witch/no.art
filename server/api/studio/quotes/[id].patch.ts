import { eq } from 'drizzle-orm'
import { quotes } from '../../../database/schema'
import { requireOwner, requireSameOrigin } from '../../../utils/auth'
import { useDatabase } from '../../../utils/database'
import { parseQuoteInput } from '../../../utils/studio'

export default defineEventHandler(async (event) => {
  requireSameOrigin(event)
  requireOwner(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Quote ID is required' })
  }

  const input = parseQuoteInput(await readBody(event))
  const now = new Date()
  const [quote] = await useDatabase().update(quotes).set({
    ...input,
    publishedAt: input.status === 'published' ? now : null,
    updatedAt: now,
  }).where(eq(quotes.id, id)).returning()

  if (!quote) {
    throw createError({ statusCode: 404, statusMessage: 'Quote not found' })
  }

  return quote
})
