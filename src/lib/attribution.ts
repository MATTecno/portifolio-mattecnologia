export const ATTRIBUTION_STORAGE_KEY = 'mattecnologia:analytics-source'

const SOURCE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,39}$/
const SAFE_ANALYTICS_HASHES = new Set([
  'top',
  'sobre',
  'servicos',
  'processo',
  'portfolio',
  'estimativa',
  'contato',
  'resumo',
  'experiencia',
  'projetos',
  'competencias',
  'formacao',
  'participacao-title',
  'architecture-title',
  'decisions-title',
])

export type AttributionStorage = Pick<Storage, 'getItem' | 'setItem'>

export type AttributionInput = {
  url: URL
  referrer?: string
  currentOrigin: string
  storage?: AttributionStorage | null
  replaceUrl?: (url: string) => void
}

export function normalizeSource(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.trim().toLowerCase()
  return SOURCE_PATTERN.test(normalized) ? normalized : null
}

function recognizedReferrer(hostname: string): string | null {
  const host = hostname.toLowerCase().replace(/^www\./, '')

  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin'
  if (host === 'gupy.io' || host.endsWith('.gupy.io') || host === 'gupy.com.br' || host.endsWith('.gupy.com.br')) {
    return 'gupy'
  }
  if (host === 'github.com' || host.endsWith('.github.com')) return 'github'
  if (/^google\.[a-z.]+$/.test(host)) return 'google'

  return null
}

export function sourceFromReferrer(referrer: string | undefined, currentOrigin: string): string {
  if (!referrer) return 'direto'

  try {
    const referrerUrl = new URL(referrer)
    if (referrerUrl.origin === currentOrigin) return 'direto'
    return recognizedReferrer(referrerUrl.hostname) ?? 'referencia_externa'
  } catch {
    return 'direto'
  }
}

function readStoredSource(storage: AttributionStorage | null | undefined): string | null {
  try {
    return normalizeSource(storage?.getItem(ATTRIBUTION_STORAGE_KEY))
  } catch {
    return null
  }
}

function storeSource(storage: AttributionStorage | null | undefined, source: string): void {
  try {
    storage?.setItem(ATTRIBUTION_STORAGE_KEY, source)
  } catch {
    return
  }
}

export function resolveAttribution({
  url,
  referrer,
  currentOrigin,
  storage,
  replaceUrl,
}: AttributionInput): string {
  const hasExplicitSource = url.searchParams.has('origem')
  const explicitSource = normalizeSource(url.searchParams.get('origem'))

  if (hasExplicitSource) {
    url.searchParams.delete('origem')
    replaceUrl?.(`${url.pathname}${url.search}${url.hash}`)
  }

  if (explicitSource) {
    storeSource(storage, explicitSource)
    return explicitSource
  }

  const storedSource = readStoredSource(storage)
  if (storedSource) return storedSource

  return sourceFromReferrer(referrer, currentOrigin)
}

export function sanitizeAnalyticsUrl(url: URL): string {
  const hash = url.hash.slice(1)
  return `${url.pathname}${SAFE_ANALYTICS_HASHES.has(hash) ? `#${hash}` : ''}`
}

export function captureBrowserAttribution(): string {
  const url = new URL(window.location.href)
  let storage: AttributionStorage | null = null

  try {
    storage = window.sessionStorage
  } catch {
    storage = null
  }

  const source = resolveAttribution({
    url,
    referrer: document.referrer,
    currentOrigin: window.location.origin,
    storage,
  })

  const sanitizedUrl = sanitizeAnalyticsUrl(url)
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== sanitizedUrl) {
    window.history.replaceState(window.history.state, '', sanitizedUrl)
  }

  return source
}
