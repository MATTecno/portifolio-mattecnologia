export const ATTRIBUTION_STORAGE_KEY = 'mattecnologia:analytics-source'
export const CAMPAIGN_STORAGE_KEY = 'mattecnologia:analytics-campaign'
export const CAMPAIGN_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

const SOURCE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,39}$/
const CAMPAIGN_VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/
const SAFE_ANALYTICS_HASHES = new Set([
  'top',
  'sobre',
  'servicos',
  'processo',
  'portfolio',
  'estimativa',
  'contato',
  'perguntas',
  'demonstracao',
  'outros-projetos',
  'resumo',
  'experiencia',
  'projetos',
  'competencias',
  'formacao',
  'participacao-title',
  'architecture-title',
  'decisions-title',
  'problemas',
  'diferencial',
  'conversar',
])

export type AttributionStorage = Pick<Storage, 'getItem' | 'setItem'>
export type CampaignParam = (typeof CAMPAIGN_PARAM_KEYS)[number]
export type CampaignParams = Partial<Record<CampaignParam, string>>
export type AttributionResult = {
  source: string
  campaign: CampaignParams
}

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

export function normalizeCampaignValue(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.trim().toLowerCase().replace(/\s+/g, '_')
  return CAMPAIGN_VALUE_PATTERN.test(normalized) ? normalized : null
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

function readStoredCampaign(storage: AttributionStorage | null | undefined): CampaignParams {
  try {
    const raw = storage?.getItem(CAMPAIGN_STORAGE_KEY)
    if (!raw) return {}
    return sanitizeCampaign(JSON.parse(raw) as CampaignParams)
  } catch {
    return {}
  }
}

function storeCampaign(storage: AttributionStorage | null | undefined, campaign: CampaignParams): void {
  if (!hasCampaign(campaign)) return

  try {
    storage?.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign))
  } catch {
    return
  }
}

export function sanitizeCampaign(value: unknown): CampaignParams {
  if (!value || typeof value !== 'object') return {}

  const campaign: CampaignParams = {}
  for (const key of CAMPAIGN_PARAM_KEYS) {
    const normalized = normalizeCampaignValue((value as CampaignParams)[key])
    if (normalized) campaign[key] = normalized
  }
  return campaign
}

export function hasCampaign(campaign: CampaignParams): boolean {
  return CAMPAIGN_PARAM_KEYS.some((key) => Boolean(campaign[key]))
}

export function campaignFromSearchParams(url: URL): CampaignParams {
  const campaign: CampaignParams = {}
  for (const key of CAMPAIGN_PARAM_KEYS) {
    const normalized = normalizeCampaignValue(url.searchParams.get(key))
    if (normalized) campaign[key] = normalized
  }
  return campaign
}

export function resolveCampaign(
  url: URL,
  storage?: AttributionStorage | null,
): CampaignParams {
  const fromUrl = campaignFromSearchParams(url)
  if (hasCampaign(fromUrl)) {
    storeCampaign(storage, fromUrl)
    return fromUrl
  }
  return readStoredCampaign(storage)
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

  const utmSource = normalizeSource(campaignFromSearchParams(url).utm_source)
  if (utmSource) {
    storeSource(storage, utmSource)
    return utmSource
  }

  const storedSource = readStoredSource(storage)
  if (storedSource) return storedSource

  return sourceFromReferrer(referrer, currentOrigin)
}

export function sanitizeAnalyticsUrl(url: URL): string {
  const preserved = new URLSearchParams()
  for (const key of CAMPAIGN_PARAM_KEYS) {
    const value = normalizeCampaignValue(url.searchParams.get(key))
    if (value) preserved.set(key, value)
  }

  const search = preserved.toString()
  const hash = url.hash.slice(1)
  return `${url.pathname}${search ? `?${search}` : ''}${SAFE_ANALYTICS_HASHES.has(hash) ? `#${hash}` : ''}`
}

export function captureBrowserAttribution(): AttributionResult {
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
  const campaign = resolveCampaign(url, storage)

  const sanitizedUrl = sanitizeAnalyticsUrl(url)
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== sanitizedUrl) {
    window.history.replaceState(window.history.state, '', sanitizedUrl)
  }

  return { source, campaign }
}
