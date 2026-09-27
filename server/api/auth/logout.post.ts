import { clearOwnerSession, requireOwner, requireSameOrigin } from '../../utils/auth'

export default defineEventHandler((event) => {
  requireSameOrigin(event)
  requireOwner(event)
  clearOwnerSession(event)

  return { ok: true }
})
