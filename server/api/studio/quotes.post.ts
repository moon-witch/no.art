import { quotes } from '../../database/schema'
import { requireOwner, requireSameOrigin } from '../../utils/auth'
import { useDatabase } from '../../utils/database'
import { parseQuoteInput } from '../../utils/studio'

export default defineEventHandler(async (event) => {
  requireSameOrigin(event)
  requireOwner(event)
  const input = parseQuoteInput(await readBody(event))
  const now = new Date()
  const [quote] = await useDatabase().insert(quotes).values({
    ...input,
    publishedAt: input.status === 'published' ? now : null,
    updatedAt: now,
  }).returning()

  return quote
})
