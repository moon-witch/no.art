import { requireOwner } from '../../utils/auth'

export default defineEventHandler((event) => {
  const session = requireOwner(event)

  return { email: session.email }
})
