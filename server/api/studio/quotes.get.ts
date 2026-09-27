import { requireOwner } from '../../utils/auth'
import { listStudioQuotes } from '../../utils/studio'

export default defineEventHandler((event) => {
  requireOwner(event)

  return listStudioQuotes()
})
