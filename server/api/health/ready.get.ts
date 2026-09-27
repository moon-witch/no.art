import { sql } from 'drizzle-orm'
import { useDatabase } from '../../utils/database'

export default defineEventHandler(async () => {
  await useDatabase().execute(sql`select 1`)

  return { status: 'ready' }
})
