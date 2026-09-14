import {
  getConsentPreferences,
  type ConsentPreferences,
} from './consent'

export const GOOGLE_ADS_ID = 'AW-18450021277'
export const GOOGLE_ADS_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`
export const GOOGLE_ADS_CONVERSION_LABEL = 'akRVCPnAhfccEJ33091E'
export const GOOGLE_ADS_CONVERSION_VALUE = 1.0
export const GOOGLE_ADS_CONVERSION_CURRENCY = 'BRL'

export const GOOGLE_ADS_CONSENT_DENIED = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const

export const GOOGLE_ADS_CONSENT_DEFAULT = {
  ...GOOGLE_ADS_CONSENT_DENIED,
  wait_for_update: 500,
} as const

export const GOOGLE_ADS_CONSENT_GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'denied',
} as const

type GtagFn = (...args: unknown[]) => void

type AdsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: GtagFn
}

let defaultSent = false
let updateSent = false
let scriptRequested = false
let configured = false
let adsGranted = false

export function buildGoogleAdsConversionSendTo(label: string | undefined): string | null {
  if (!label || !/^[A-Za-z0-9_-]{1,80}$/.test(label)) return null
  return `${GOOGLE_ADS_ID}/${label}`
}

function hasAdvertisingConsent(preferences: ConsentPreferences | null): boolean {
  const doNotTrack = typeof navigator !== 'undefined' &&
    (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes')
  return Boolean(preferences?.analytics) && !doNotTrack
}

function adsWindow(): AdsWindow | null {
  return typeof window === 'undefined' ? null : window
}

function ensureGtag(): GtagFn | null {
  const target = adsWindow()
  if (!target) return null

  target.dataLayer ??= []
  if (typeof target.gtag !== 'function') {
    target.gtag = function gtag() {
      // Consent Mode expects the official stub: dataLayer.push(arguments).
      // eslint-disable-next-line prefer-rest-params -- Google gtag bootstrap
      target.dataLayer?.push(arguments)
    }
  }

  return target.gtag
}

function callGtag(...args: unknown[]): void {
  try {
    ensureGtag()?.(...args)
  } catch {
    return
  }
}

function hasGoogleAdsScript(): boolean {
  if (typeof document === 'undefined') return false
  return Boolean(document.querySelector(`script[src="${GOOGLE_ADS_SCRIPT_SRC}"]`))
}

function loadGoogleAdsScript(): void {
  try {
    if (scriptRequested || hasGoogleAdsScript() || typeof document === 'undefined') {
      scriptRequested = scriptRequested || hasGoogleAdsScript()
      return
    }

    scriptRequested = true
    const script = document.createElement('script')
    script.async = true
    script.src = GOOGLE_ADS_SCRIPT_SRC
    script.onerror = () => {
      // WhatsApp navigation must not depend on this script.
    }
    document.head.append(script)
  } catch {
    return
  }
}

export function initializeGoogleAdsConsentDefault(): void {
  if (defaultSent) return
  defaultSent = true
  callGtag('consent', 'default', { ...GOOGLE_ADS_CONSENT_DEFAULT })
}

function configureGoogleAdsTag(): void {
  if (configured) return
  configured = true
  callGtag('js', new Date())
  callGtag('config', GOOGLE_ADS_ID)
}

export function applyGoogleAdsConsent(preferences: ConsentPreferences | null): void {
  initializeGoogleAdsConsentDefault()

  const granted = hasAdvertisingConsent(preferences)
  adsGranted = granted

  if (!granted) return

  if (!updateSent) {
    updateSent = true
    callGtag('consent', 'update', { ...GOOGLE_ADS_CONSENT_GRANTED })
  }

  loadGoogleAdsScript()
  configureGoogleAdsTag()
}

export function syncGoogleAdsWithConsent(): void {
  applyGoogleAdsConsent(getConsentPreferences())
}

export function resetGoogleAdsRuntime(): void {
  defaultSent = false
  updateSent = false
  scriptRequested = false
  configured = false
  adsGranted = false
}

export function trackWhatsAppAdsConversion(): void {
  try {
    const sendTo = buildGoogleAdsConversionSendTo(GOOGLE_ADS_CONVERSION_LABEL)
    if (!sendTo || !adsGranted) return

    const gtag = adsWindow()?.gtag
    if (typeof gtag !== 'function') return

    gtag('event', 'conversion', {
      send_to: sendTo,
      value: GOOGLE_ADS_CONVERSION_VALUE,
      currency: GOOGLE_ADS_CONVERSION_CURRENCY,
    })
  } catch {
    return
  }
}
