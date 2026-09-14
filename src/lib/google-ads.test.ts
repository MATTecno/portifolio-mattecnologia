import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackContact } from './analytics'
import {
  GOOGLE_ADS_CONSENT_DEFAULT,
  GOOGLE_ADS_CONSENT_DENIED,
  GOOGLE_ADS_CONSENT_GRANTED,
  GOOGLE_ADS_CONVERSION_CURRENCY,
  GOOGLE_ADS_CONVERSION_LABEL,
  GOOGLE_ADS_CONVERSION_VALUE,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_SCRIPT_SRC,
  applyGoogleAdsConsent,
  buildGoogleAdsConversionSendTo,
  initializeGoogleAdsConsentDefault,
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

function stubBrowser(options: { gtag?: (...args: unknown[]) => void; append?: ReturnType<typeof vi.fn> } = {}) {
  const append = options.append ?? vi.fn()
  vi.stubGlobal('document', {
    cookie: '',
    querySelector: () => null,
    createElement: () => ({ async: false, src: '', onerror: null }),
    head: { append },
  })
  vi.stubGlobal('window', { dataLayer: undefined, gtag: options.gtag })
  vi.stubGlobal('navigator', { doNotTrack: '0' })
  return { append }
}

function dataLayerCommands() {
  return (adsWindow().dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>))
}

function commandSequence() {
  return dataLayerCommands().map((items) => {
    if (items[0] === 'consent') return `consent:${String(items[1])}`
    return String(items[0])
  })
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

  it('define consent default denied na primeira visita, sem carregar a tag', () => {
    const { append } = stubBrowser()

    applyGoogleAdsConsent(null)

    expect(commandSequence()).toEqual(['consent:default'])
    expect(dataLayerCommands()[0]?.[2]).toEqual(GOOGLE_ADS_CONSENT_DEFAULT)
    expect(dataLayerCommands()[0]?.[2]).toMatchObject(GOOGLE_ADS_CONSENT_DENIED)
    expect(append).not.toHaveBeenCalled()
  })

  it('com consentimento salvo, envia default denied antes do update e do config', () => {
    const { append } = stubBrowser()

    applyGoogleAdsConsent(GRANTED)

    expect(commandSequence()).toEqual(['consent:default', 'consent:update', 'js', 'config'])
    expect(dataLayerCommands()[0]?.[2]).toEqual(GOOGLE_ADS_CONSENT_DEFAULT)
    expect(dataLayerCommands()[1]?.[2]).toEqual(GOOGLE_ADS_CONSENT_GRANTED)
    expect(dataLayerCommands()[3]?.[1]).toBe(GOOGLE_ADS_ID)
    expect(append).toHaveBeenCalledTimes(1)
    expect(append.mock.calls[0][0].src).toBe(GOOGLE_ADS_SCRIPT_SRC)
  })

  it('quando o usuário aceita durante a sessão, atualiza o consent e só então carrega a tag', () => {
    const { append } = stubBrowser()

    applyGoogleAdsConsent(null)
    expect(append).not.toHaveBeenCalled()

    applyGoogleAdsConsent(GRANTED)

    expect(commandSequence()).toEqual(['consent:default', 'consent:update', 'js', 'config'])
    expect(append).toHaveBeenCalledTimes(1)
  })

  it('quando o usuário rejeita, mantém default denied e não carrega a tag', () => {
    const { append } = stubBrowser()

    applyGoogleAdsConsent({ ...GRANTED, analytics: false })

    expect(commandSequence()).toEqual(['consent:default'])
    expect(dataLayerCommands()[0]?.[2]).toMatchObject(GOOGLE_ADS_CONSENT_DENIED)
    expect(append).not.toHaveBeenCalled()
  })

  it('envia o consent default antes de js, config e conversão', () => {
    const { append } = stubBrowser()
    initializeGoogleAdsConsentDefault()
    applyGoogleAdsConsent(GRANTED)
    trackContact('whatsapp', 'ads_hero')

    const sequence = commandSequence()
    expect(sequence[0]).toBe('consent:default')
    expect(sequence.indexOf('consent:default')).toBeLessThan(sequence.indexOf('js'))
    expect(sequence.indexOf('consent:default')).toBeLessThan(sequence.indexOf('config'))
    expect(sequence.indexOf('consent:update')).toBeLessThan(sequence.indexOf('js'))
    expect(sequence.indexOf('config')).toBeLessThan(sequence.indexOf('event'))
    expect(append).toHaveBeenCalledTimes(1)
  })

  it('não carrega a tag duas vezes depois do opt-in', () => {
    const { append } = stubBrowser()

    applyGoogleAdsConsent(GRANTED)
    applyGoogleAdsConsent(GRANTED)

    expect(append).toHaveBeenCalledTimes(1)
    expect(commandSequence()).toEqual(['consent:default', 'consent:update', 'js', 'config'])
    expect(adsWindow().dataLayer?.some((entry) => JSON.stringify(Array.from(entry as ArrayLike<unknown>)).includes('G-'))).toBe(false)
  })

  it('dispara uma conversão no clique de WhatsApp com consentimento', () => {
    const gtag = vi.fn()
    stubBrowser({ gtag })
    applyGoogleAdsConsent(GRANTED)

    trackContact('whatsapp', 'ads_hero')

    const conversions = gtag.mock.calls.filter((call) => call[0] === 'event' && call[1] === 'conversion')
    expect(conversions).toEqual([['event', 'conversion', CONVERSION_PAYLOAD]])
    expect(JSON.stringify(conversions)).not.toContain('event_callback')
  })

  it('não dispara conversão sem consentimento', () => {
    const gtag = vi.fn()
    stubBrowser({ gtag })
    applyGoogleAdsConsent({ ...GRANTED, analytics: false })

    trackContact('whatsapp', 'ads_hero')
    trackWhatsAppAdsConversion()

    expect(gtag.mock.calls.some((call) => call[0] === 'event' && call[1] === 'conversion')).toBe(false)
  })

  it('não dispara conversão para e-mail, LinkedIn ou outros canais', () => {
    const gtag = vi.fn()
    stubBrowser({ gtag })
    applyGoogleAdsConsent(GRANTED)

    trackContact('email', 'commercial_contact')
    trackContact('linkedin', 'recruiter_hero')

    expect(gtag.mock.calls.some((call) => call[0] === 'event' && call[1] === 'conversion')).toBe(false)
  })

  it('não duplica a conversão por múltiplos mecanismos no mesmo clique', () => {
    const gtag = vi.fn()
    stubBrowser({ gtag })
    applyGoogleAdsConsent(GRANTED)

    trackContact('whatsapp', 'commercial_hero')

    expect(gtag.mock.calls.filter((call) => call[0] === 'event' && call[1] === 'conversion')).toHaveLength(1)
  })

  it('não quebra o clique quando gtag está indisponível', () => {
    stubBrowser()
    applyGoogleAdsConsent(GRANTED)

    expect(() => trackContact('whatsapp', 'floating_whatsapp')).not.toThrow()
    expect(() => trackWhatsAppAdsConversion()).not.toThrow()
  })

  it('não interrompe o WhatsApp quando o Google Ads falha', () => {
    vi.stubGlobal('window', {
      dataLayer: undefined,
      get gtag() {
        throw new Error('bloqueado')
      },
    })
    vi.stubGlobal('navigator', { doNotTrack: '0' })

    expect(() => applyGoogleAdsConsent(GRANTED)).not.toThrow()
    expect(() => trackContact('whatsapp', 'floating_whatsapp')).not.toThrow()
    expect(() => trackWhatsAppAdsConversion()).not.toThrow()
  })
})
