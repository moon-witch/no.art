import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const sessionCookie = 'stay-a-while-owner'
const sessionLifetimeSeconds = 60 * 60 * 24 * 14

type OwnerSession = {
  email: string
  expiresAt: number
}

const required = (name: string) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`)
  }

  return value
}

const toBase64Url = (value: string) => Buffer.from(value).toString('base64url')
const fromBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8')

const sign = (payload: string) => createHmac('sha256', required('AUTH_SESSION_SECRET'))
  .update(payload)
  .digest('base64url')

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export const hashOwnerPassword = (password: string) => {
  const salt = randomBytes(16).toString('base64url')
  const hash = scryptSync(password, salt, 64).toString('base64url')

  return `scrypt$${salt}$${hash}`
}

export const verifyOwnerPassword = (password: string) => {
  const [algorithm, salt, expectedHash] = required('OWNER_PASSWORD_HASH').split('$')

  if (algorithm !== 'scrypt' || !salt || !expectedHash) {
    throw new Error('OWNER_PASSWORD_HASH must use the scrypt$<salt>$<hash> format')
  }

  const actualHash = scryptSync(password, salt, 64).toString('base64url')

  return safeEqual(actualHash, expectedHash)
}

export const createOwnerSession = (email: string) => {
  const payload = toBase64Url(JSON.stringify({
    email,
    expiresAt: Date.now() + (sessionLifetimeSeconds * 1000),
  } satisfies OwnerSession))

  return `${payload}.${sign(payload)}`
}

export const readOwnerSession = (token: string | undefined): OwnerSession | undefined => {
  if (!token) {
    return undefined
  }

  const [payload, signature] = token.split('.')

  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return undefined
  }

  try {
    const session = JSON.parse(fromBase64Url(payload)) as OwnerSession

    if (session.email !== required('OWNER_EMAIL') || session.expiresAt <= Date.now()) {
      return undefined
    }

    return session
  }
  catch {
    return undefined
  }
}

export const setOwnerSession = (event: Parameters<typeof setCookie>[0], email: string) => {
  setCookie(event, sessionCookie, createOwnerSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionLifetimeSeconds,
  })
}

export const clearOwnerSession = (event: Parameters<typeof setCookie>[0]) => {
  deleteCookie(event, sessionCookie, { path: '/' })
}

export const requireOwner = (event: Parameters<typeof getCookie>[0]) => {
  const session = readOwnerSession(getCookie(event, sessionCookie))

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Owner authentication required' })
  }

  return session
}

export const requireSameOrigin = (event: Parameters<typeof getRequestHeader>[0]) => {
  const origin = getRequestHeader(event, 'origin')

  if (origin && origin !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid request origin' })
  }
}
