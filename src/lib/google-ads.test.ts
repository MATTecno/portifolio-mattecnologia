import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackContact } from './analytics'
import {
  GOOGLE_ADS_CONVERSION_CURRENCY,
  GOOGLE_ADS_CONVERSION_LABEL,
  GOOGLE_ADS_CONVERSION_VALUE,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_SCRIPT_SRC,
  applyGoogleAdsConsent,
  buildGoogleAdsConversionSendTo,
  resetGoogleAdsRuntime,
  trackWhatsAppAdsConversion,
} from './google-ads'

const GRANTED = {
  version: 1 as const,
  analytics: true,
  replay: false,
  decidedAt: '2026-09-14T00:00:00.000Z',
  expiresAt: '2027-03-13T00:00:00.000Z',
}

const CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
const CONVERSION_PAYLOAD = {
  send_to: CONVERSION_SEND_TO,
  value: GOOGLE_ADS_CONVERSION_VALUE,
  currency: GOOGLE_ADS_CONVERSION_CURRENCY,
}

function adsWindow() {
  return window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

function stubBrowser(gtag?: (...args: unknown[]) => void) {
  vi.stubGlobal('document', {
    cookie: '',
    querySelector: () => null,
    createElement: () => ({ async: false, src: '', onerror: null }),
    head: { append: vi.fn() },
  })
  vi.stubGlobal('window', { dataLayer: [], gtag })
  vi.stubGlobal('navigator', { doNotTrack: '0' })
}

afterEach(() => {
  resetGoogleAdsRuntime()
  vi.unstubAllGlobals()
})

describe('Google Ads', () => {
  it('monta o send_to oficial da conversão de WhatsApp', () => {
    expect(GOOGLE_ADS_CONVERSION_LABEL).toBe('akRVCPnAhfccEJ33091E')
    expect(buildGoogleAdsConversionSendTo(GOOGLE_ADS_CONVERSION_LABEL)).toBe(CONVERSION_SEND_TO)
    expect(buildGoogleAdsConversionSendTo(undefined)).toBeNull()
    expect(buildGoogleAdsConversionSendTo('')).toBeNull()
    expect(buildGoogleAdsConversionSendTo('AW-18450021277/falso')).toBeNull()
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
    applyGoogleAdsConsent({ ...GRANTED, analytics: false })

    expect(append).not.toHaveBeenCalled()
  })

  it('carrega a tag uma única vez após o opt-in de métricas', () => {
    const append = vi.fn()
    const script = { async: false, src: '', onerror: null as (() => void) | null }
    vi.stubGlobal('document', {
      cookie: '',
      querySelector: () => null,
      createElement: () => script,
      head: { append },
    })
    vi.stubGlobal('window', { dataLayer: undefined, gtag: undefined })
    vi.stubGlobal('navigator', { doNotTrack: '0' })

    applyGoogleAdsConsent(GRANTED)
    applyGoogleAdsConsent(GRANTED)

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

  it('dispara uma conversão no clique de WhatsApp com consentimento', () => {
    const gtag = vi.fn()
    stubBrowser(gtag)
    applyGoogleAdsConsent(GRANTED)

    trackContact('whatsapp', 'ads_hero')

    const conversions = gtag.mock.calls.filter((call) => call[0] === 'event' && call[1] === 'conversion')
    expect(conversions).toEqual([['event', 'conversion', CONVERSION_PAYLOAD]])
    expect(JSON.stringify(conversions)).not.toContain('event_callback')
  })

  it('não dispara conversão sem consentimento', () => {
    const gtag = vi.fn()
    stubBrowser(gtag)
    applyGoogleAdsConsent({ ...GRANTED, analytics: false })

    trackContact('whatsapp', 'ads_hero')
    trackWhatsAppAdsConversion()

    expect(gtag.mock.calls.some((call) => call[0] === 'event' && call[1] === 'conversion')).toBe(false)
  })

  it('não dispara conversão para e-mail, LinkedIn ou outros canais', () => {
    const gtag = vi.fn()
    stubBrowser(gtag)
    applyGoogleAdsConsent(GRANTED)

    trackContact('email', 'commercial_contact')
    trackContact('linkedin', 'recruiter_hero')

    expect(gtag.mock.calls.some((call) => call[0] === 'event' && call[1] === 'conversion')).toBe(false)
  })

  it('não duplica a conversão por múltiplos mecanismos no mesmo clique', () => {
    const gtag = vi.fn()
    stubBrowser(gtag)
    applyGoogleAdsConsent(GRANTED)

    trackContact('whatsapp', 'commercial_hero')

    expect(gtag.mock.calls.filter((call) => call[0] === 'event' && call[1] === 'conversion')).toHaveLength(1)
  })

  it('não quebra o clique quando gtag está indisponível', () => {
    stubBrowser(undefined)
    applyGoogleAdsConsent(GRANTED)

    expect(() => trackContact('whatsapp', 'floating_whatsapp')).not.toThrow()
    expect(() => trackWhatsAppAdsConversion()).not.toThrow()
  })

  it('não interrompe o fluxo quando a tag falha', () => {
    vi.stubGlobal('window', {
      get gtag() {
        throw new Error('bloqueado')
      },
    })
    vi.stubGlobal('navigator', { doNotTrack: '0' })

    expect(() => trackWhatsAppAdsConversion()).not.toThrow()
  })
})
