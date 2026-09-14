import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  GOOGLE_ADS_CONVERSION_LABEL,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_SCRIPT_SRC,
  applyGoogleAdsConsent,
  buildGoogleAdsConversionSendTo,
  resetGoogleAdsRuntime,
  trackWhatsAppAdsConversion,
} from './google-ads'

function adsWindow() {
  return window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

afterEach(() => {
  resetGoogleAdsRuntime()
  vi.unstubAllGlobals()
})

describe('Google Ads', () => {
  it('não monta um send_to sem um conversion label real', () => {
    expect(GOOGLE_ADS_CONVERSION_LABEL).toBeUndefined()
    expect(buildGoogleAdsConversionSendTo(undefined)).toBeNull()
    expect(buildGoogleAdsConversionSendTo('')).toBeNull()
    expect(buildGoogleAdsConversionSendTo('AW-18450021277/falso')).toBeNull()
    expect(buildGoogleAdsConversionSendTo('LABEL_REAL-1')).toBe(
      `${GOOGLE_ADS_ID}/LABEL_REAL-1`,
    )
  })

  it('não carrega a tag sem consentimento de métricas', () => {
    const append = vi.fn()
    vi.stubGlobal('document', {
      cookie: '',
      querySelector: () => null,
      createElement: () => ({ async: false, src: '', onerror: null }),
      head: { append },
    })
    vi.stubGlobal('window', { dataLayer: undefined, gtag: undefined })
    vi.stubGlobal('navigator', { doNotTrack: '0' })

    applyGoogleAdsConsent(null)
    applyGoogleAdsConsent({
      version: 1,
      analytics: false,
      replay: false,
      decidedAt: '2026-09-14T00:00:00.000Z',
      expiresAt: '2027-03-13T00:00:00.000Z',
    })

    expect(append).not.toHaveBeenCalled()
  })

  it('carrega a tag uma única vez após o opt-in de métricas', () => {
    const append = vi.fn()
    const script = { async: false, src: '', onerror: null as (() => void) | null }
    const target = { dataLayer: undefined as unknown[] | undefined, gtag: undefined }
    vi.stubGlobal('document', {
      cookie: '',
      querySelector: () => null,
      createElement: () => script,
      head: { append },
    })
    vi.stubGlobal('window', target)
    vi.stubGlobal('navigator', { doNotTrack: '0' })

    const granted = {
      version: 1 as const,
      analytics: true,
      replay: false,
      decidedAt: '2026-09-14T00:00:00.000Z',
      expiresAt: '2027-03-13T00:00:00.000Z',
    }

    applyGoogleAdsConsent(granted)
    applyGoogleAdsConsent(granted)

    expect(append).toHaveBeenCalledTimes(1)
    expect(script.async).toBe(true)
    expect(script.src).toBe(GOOGLE_ADS_SCRIPT_SRC)
    expect(adsWindow().dataLayer).toEqual(
      expect.arrayContaining([
        expect.arrayContaining(['consent', 'default']),
        expect.arrayContaining(['config', GOOGLE_ADS_ID]),
      ]),
    )
    expect(adsWindow().dataLayer?.some((entry) => JSON.stringify(entry).includes('G-'))).toBe(false)
  })

  it('não dispara conversão enquanto o label não existir, mesmo com gtag disponível', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag, dataLayer: [] })
    vi.stubGlobal('navigator', { doNotTrack: '0' })
    vi.stubGlobal('document', {
      cookie: '',
      querySelector: () => ({ src: GOOGLE_ADS_SCRIPT_SRC }),
      createElement: () => ({ async: false, src: '', onerror: null }),
      head: { append: vi.fn() },
    })

    applyGoogleAdsConsent({
      version: 1,
      analytics: true,
      replay: false,
      decidedAt: '2026-09-14T00:00:00.000Z',
      expiresAt: '2027-03-13T00:00:00.000Z',
    })
    trackWhatsAppAdsConversion()

    expect(gtag.mock.calls.some((call) => call[0] === 'event' && call[1] === 'conversion')).toBe(
      false,
    )
  })

  it('não interrompe o fluxo quando a tag falha', () => {
    vi.stubGlobal('window', {
      get gtag() {
        throw new Error('bloqueado')
      },
    })

    expect(() => trackWhatsAppAdsConversion()).not.toThrow()
  })
})
