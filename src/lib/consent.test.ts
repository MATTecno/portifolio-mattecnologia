import { describe, expect, it } from 'vitest'
import {
  CONSENT_COOKIE_NAME,
  CONSENT_DURATION_DAYS,
  createConsentPreferences,
  normalizeConsentChoice,
  parseConsentCookie,
  serializeConsentCookie,
} from './consent'

const now = new Date('2026-08-16T12:00:00.000Z')

describe('preferências de consentimento', () => {
  it('faz a gravação depender de métricas e feedback', () => {
    expect(normalizeConsentChoice({ analytics: false, replay: true })).toEqual({
      analytics: true,
      replay: true,
    })
    expect(normalizeConsentChoice({ analytics: false, replay: false })).toEqual({
      analytics: false,
      replay: false,
    })
  })

  it('cria uma decisão válida por 180 dias', () => {
    const preferences = createConsentPreferences({ analytics: true, replay: false }, now)

    expect(preferences).toMatchObject({
      version: 1,
      analytics: true,
      replay: false,
      decidedAt: now.toISOString(),
    })
    expect(Date.parse(preferences.expiresAt) - now.getTime()).toBe(
      CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1_000,
    )
  })

  it('serializa o cookie necessário com os atributos de segurança', () => {
    const cookie = serializeConsentCookie(
      createConsentPreferences({ analytics: true, replay: true }, now),
      now,
    )

    expect(cookie).toContain(`${CONSENT_COOKIE_NAME}=`)
    expect(cookie).toContain(`Max-Age=${CONSENT_DURATION_DAYS * 24 * 60 * 60}`)
    expect(cookie).toContain('Path=/')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).toContain('Secure')
  })

  it('lê uma preferência válida entre outros cookies', () => {
    const preferences = createConsentPreferences({ analytics: true, replay: false }, now)
    const value = serializeConsentCookie(preferences, now).split(';')[0]

    expect(parseConsentCookie(`theme=dark; ${value}; other=1`, now)).toEqual(preferences)
  })

  it.each([
    ['', 'ausente'],
    [`${CONSENT_COOKIE_NAME}=valor-invalido`, 'corrompido'],
    [`${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ version: 0 }))}`, 'versão antiga'],
    [
      `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({
        ...createConsentPreferences({ analytics: true, replay: false }, now),
        expiresAt: '2026-08-15T12:00:00.000Z',
      }))}`,
      'expirado',
    ],
    [
      `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({
        ...createConsentPreferences({ analytics: true, replay: true }, now),
        analytics: false,
      }))}`,
      'dependência inválida',
    ],
  ])('rejeita cookie %s (%s)', (cookie) => {
    expect(parseConsentCookie(cookie, now)).toBeNull()
  })
})
