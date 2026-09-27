import { setOwnerSession, verifyOwnerPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)
  const ownerEmail = process.env.OWNER_EMAIL

  if (!ownerEmail || !body?.email || !body.password || body.email !== ownerEmail || !verifyOwnerPassword(body.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  setOwnerSession(event, ownerEmail)

  return { email: ownerEmail }
})
