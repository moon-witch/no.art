import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'
import { getDatabaseUrl } from './environment'

let client: ReturnType<typeof postgres> | undefined

export const useDatabase = () => {
  client ??= postgres(getDatabaseUrl(), {
    max: 10,
    prepare: false,
  })

  return drizzle(client, { schema })
}
