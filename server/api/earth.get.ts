import { and, asc, eq } from 'drizzle-orm'
import { countries, countryMarkers } from '../database/schema'
import { useDatabase } from '../utils/database'

export default defineEventHandler(async () => {
  const database = useDatabase()

  const [visitedCountries, markers] = await Promise.all([
    database
      .select({ code: countries.code, note: countries.note })
      .from(countries)
      .where(and(eq(countries.status, 'published'), eq(countries.visited, true))),
    database
      .select({
        id: countryMarkers.id,
        countryCode: countryMarkers.countryCode,
        latitude: countryMarkers.latitude,
        longitude: countryMarkers.longitude,
        label: countryMarkers.label,
        note: countryMarkers.note,
      })
      .from(countryMarkers)
      .innerJoin(countries, eq(countryMarkers.countryCode, countries.code))
      .where(and(
        eq(countryMarkers.status, 'published'),
        eq(countries.status, 'published'),
        eq(countries.visited, true),
      ))
      .orderBy(asc(countryMarkers.createdAt)),
  ])

  return { countries: visitedCountries, markers }
})
