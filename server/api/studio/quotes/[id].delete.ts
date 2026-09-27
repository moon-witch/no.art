import { eq } from 'drizzle-orm'
import { quotes } from '../../../database/schema'
import { requireOwner, requireSameOrigin } from '../../../utils/auth'
import { useDatabase } from '../../../utils/database'

export default defineEventHandler(async (event) => {
  requireSameOrigin(event)
  requireOwner(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Quote ID is required' })
  }

  const [quote] = await useDatabase().delete(quotes).where(eq(quotes.id, id)).returning({ id: quotes.id })

  if (!quote) {
    throw createError({ statusCode: 404, statusMessage: 'Quote not found' })
  }

  return { ok: true }
})
