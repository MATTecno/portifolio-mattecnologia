export const CONSENT_COOKIE_NAME = 'mat_consent_v1'
export const CONSENT_VERSION = 1
export const CONSENT_DURATION_DAYS = 180
export const PRIVACY_PREFERENCES_OPEN_EVENT = 'mattecnologia:open-privacy-preferences'

const CONSENT_DURATION_MS = CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1_000

export type ConsentPreferences = {
  version: typeof CONSENT_VERSION
  analytics: boolean
  replay: boolean
  decidedAt: string
  expiresAt: string
}

export type ConsentChoice = Pick<ConsentPreferences, 'analytics' | 'replay'>
export type ConsentListener = (preferences: ConsentPreferences) => void

const listeners = new Set<ConsentListener>()

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

export function normalizeConsentChoice(choice: ConsentChoice): ConsentChoice {
  return {
    analytics: choice.analytics || choice.replay,
    replay: choice.replay,
  }
}

export function createConsentPreferences(
  choice: ConsentChoice,
  now = new Date(),
): ConsentPreferences {
  const normalized = normalizeConsentChoice(choice)
  return {
    version: CONSENT_VERSION,
    ...normalized,
    decidedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CONSENT_DURATION_MS).toISOString(),
  }
}

export function parseConsentCookie(
  cookieHeader: string,
  now = new Date(),
): ConsentPreferences | null {
  const encodedValue = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.slice(CONSENT_COOKIE_NAME.length + 1)

  if (!encodedValue) return null

  try {
    const candidate = JSON.parse(decodeURIComponent(encodedValue)) as Partial<ConsentPreferences>
    if (
      candidate.version !== CONSENT_VERSION
      || typeof candidate.analytics !== 'boolean'
      || typeof candidate.replay !== 'boolean'
      || !isValidDate(candidate.decidedAt)
      || !isValidDate(candidate.expiresAt)
      || Date.parse(candidate.expiresAt) <= now.getTime()
      || (candidate.replay && !candidate.analytics)
    ) {
      return null
    }

    return candidate as ConsentPreferences
  } catch {
    return null
  }
}

export function serializeConsentCookie(preferences: ConsentPreferences, now = new Date()): string {
  const maxAge = Math.max(
    0,
    Math.floor((Date.parse(preferences.expiresAt) - now.getTime()) / 1_000),
  )
  return [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}`,
    `Max-Age=${maxAge}`,
    `Expires=${new Date(preferences.expiresAt).toUTCString()}`,
    'Path=/',
    'SameSite=Lax',
    'Secure',
  ].join('; ')
}

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof document === 'undefined') return null
  return parseConsentCookie(document.cookie)
}

export function saveConsentPreferences(choice: ConsentChoice): ConsentPreferences {
  const preferences = createConsentPreferences(choice)
  document.cookie = serializeConsentCookie(preferences)
  listeners.forEach((listener) => listener(preferences))
  return preferences
}

export function clearConsentPreferences(): void {
  if (typeof document === 'undefined') return
  document.cookie = [
    `${CONSENT_COOKIE_NAME}=`,
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Path=/',
    'SameSite=Lax',
    'Secure',
  ].join('; ')
}

export function subscribeToConsent(listener: ConsentListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function openPrivacyPreferences(): void {
  window.dispatchEvent(new CustomEvent(PRIVACY_PREFERENCES_OPEN_EVENT))
}
