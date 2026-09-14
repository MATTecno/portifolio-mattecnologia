import {
  getConsentPreferences,
  type ConsentPreferences,
} from './consent'

export const GOOGLE_ADS_ID = 'AW-18450021277'
export const GOOGLE_ADS_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`

// Conversion events stay disabled until a real label is provided.
export const GOOGLE_ADS_CONVERSION_LABEL: string | undefined = undefined

type GtagFn = (...args: unknown[]) => void

type AdsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: GtagFn
}

const CONSENT_DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const

const CONSENT_GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
} as const

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
  target.gtag ??= function gtag(...args: unknown[]) {
    target.dataLayer?.push(args)
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
}

function configureGoogleAds(): void {
  if (configured) return
  configured = true
  callGtag('consent', 'default', { ...CONSENT_DENIED, wait_for_update: 500 })
  callGtag('js', new Date())
  callGtag('config', GOOGLE_ADS_ID)
}

export function applyGoogleAdsConsent(preferences: ConsentPreferences | null): void {
  const granted = hasAdvertisingConsent(preferences)
  adsGranted = granted

  if (!granted) {
    if (configured) callGtag('consent', 'update', CONSENT_DENIED)
    return
  }

  configureGoogleAds()
  loadGoogleAdsScript()
  callGtag('consent', 'update', CONSENT_GRANTED)
}

export function syncGoogleAdsWithConsent(): void {
  applyGoogleAdsConsent(getConsentPreferences())
}

export function resetGoogleAdsRuntime(): void {
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

    gtag('event', 'conversion', { send_to: sendTo })
  } catch {
    return
  }
}
