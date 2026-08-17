import type { CaptureResult } from 'posthog-js'
import type { PostHogConfig } from 'posthog-js/dist/module.slim'
import { captureBrowserAttribution } from './attribution'
import {
  getConsentPreferences,
  subscribeToConsent,
  type ConsentPreferences,
} from './consent'

export type PageType = 'commercial' | 'recruiter' | 'case' | 'privacy'
export type ContactChannel = 'whatsapp' | 'email' | 'linkedin'
export type ProfilePlatform = 'github'
export type ProjectDestination = 'case' | 'live' | 'github' | 'npm'

export type PageContext = {
  pageType: PageType
}

type BaseEventProperties = {
  page_path: string
  page_type: PageType
  source: string
}

export type AnalyticsEvent =
  | { name: 'page_viewed'; properties: BaseEventProperties }
  | { name: 'resume_download_clicked'; properties: BaseEventProperties & { location: string } }
  | {
      name: 'contact_clicked'
      properties: BaseEventProperties & { channel: ContactChannel; location: string }
    }
  | {
      name: 'profile_clicked'
      properties: BaseEventProperties & { platform: ProfilePlatform; location: string }
    }
  | {
      name: 'project_clicked'
      properties: BaseEventProperties & {
        project_id: string
        destination: ProjectDestination
        location: string
      }
    }
  | { name: 'contact_form_submitted'; properties: BaseEventProperties & { location: string } }

type EventName = AnalyticsEvent['name']
type AnalyticsProvider = {
  capture: (name: string, properties: Record<string, unknown>) => unknown
  opt_in_capturing: (options?: { captureEventName?: false }) => void
  opt_out_capturing: () => void
  reset: (resetDeviceId?: boolean) => void
  startSessionRecording: (options?: { sampling?: boolean }) => void
  stopSessionRecording: () => void
}
type EventDetails = {
  page_viewed: Record<string, never>
  resume_download_clicked: { location: string }
  contact_clicked: { channel: ContactChannel; location: string }
  profile_clicked: { platform: ProfilePlatform; location: string }
  project_clicked: { project_id: string; destination: ProjectDestination; location: string }
  contact_form_submitted: { location: string }
}

const PRIVATE_PROVIDER_PROPERTIES = [
  '$current_url',
  '$referrer',
  '$referring_domain',
  '$initial_current_url',
  '$initial_referrer',
  '$initial_referring_domain',
  '$pathname',
  '$session_entry_url',
  '$session_entry_pathname',
  '$session_referrer',
] as const
const REPLAY_ELIGIBLE_AT_KEY = 'mattecnologia:replay-eligible-at'
export const REPLAY_MINIMUM_DURATION_MS = 10_000

let context: PageContext | null = null
let source = 'direto'
let pagePath = '/'
let posthogClient: AnalyticsProvider | null = null
let isInitialized = false
let isLoading = false
let isUnavailable = false
let analyticsGranted = false
let replayGranted = false
let pageViewTracked = false
let currentPreferences: ConsentPreferences | null = null
let replayStartTimer: ReturnType<typeof globalThis.setTimeout> | null = null
let queue: AnalyticsEvent[] = []

export function buildAnalyticsEvent<TName extends EventName>(
  name: TName,
  details: EventDetails[TName],
  page: PageContext,
  eventSource: string,
  eventPagePath: string,
): Extract<AnalyticsEvent, { name: TName }> {
  return {
    name,
    properties: {
      page_path: eventPagePath,
      page_type: page.pageType,
      source: eventSource,
      ...details,
    },
  } as Extract<AnalyticsEvent, { name: TName }>
}

export function sanitizeProviderEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null
  const properties = { ...event.properties }
  for (const property of PRIVATE_PROVIDER_PROPERTIES) delete properties[property]

  return { ...event, properties }
}

export function createPostHogConfig(
  apiHost: string,
  options: {
    extensionClasses?: PostHogConfig['__extensionClasses']
    surveysEnabled?: boolean
  } = {},
): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
    defaults: '2026-05-30',
    persistence: 'localStorage+cookie',
    cookie_expiration: 180,
    cross_subdomain_cookie: false,
    secure_cookie: true,
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    person_profiles: 'never',
    respect_dnt: true,
    autocapture: false,
    rageclick: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_performance: false,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: '.ph-mask',
      blockSelector: '.ph-no-capture',
      recordCrossOriginIframes: false,
      recordHeaders: false,
      recordBody: false,
      strictMinimumDuration: true,
      maskCapturedNetworkRequestFn: () => null,
    },
    enable_recording_console_log: false,
    disable_surveys: options.surveysEnabled === false,
    disable_surveys_automatic_display: options.surveysEnabled === false,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    save_referrer: false,
    save_campaign_params: false,
    disable_scroll_properties: true,
    property_denylist: [...PRIVATE_PROVIDER_PROPERTIES],
    before_send: sanitizeProviderEvent,
    __extensionClasses: options.extensionClasses,
  }
}

export function isDoNotTrackEnabled(navigatorLike: Pick<Navigator, 'doNotTrack'> = navigator): boolean {
  return navigatorLike.doNotTrack === '1' || navigatorLike.doNotTrack === 'yes'
}

export function hasAnalyticsConfig(
  enabled: string | undefined,
  projectKey: string | undefined,
  apiHost: string | undefined,
  doNotTrack: boolean,
): boolean {
  return enabled === 'true' && Boolean(projectKey) && Boolean(apiHost) && !doNotTrack
}

export function hasAnalyticsConsent(
  preferences: ConsentPreferences | null,
  doNotTrack: boolean,
): boolean {
  return Boolean(preferences?.analytics) && !doNotTrack
}

export function hasReplayConsent(
  preferences: ConsentPreferences | null,
  doNotTrack: boolean,
): boolean {
  return hasAnalyticsConsent(preferences, doNotTrack) && Boolean(preferences?.replay)
}

function capture(event: AnalyticsEvent): void {
  if (!analyticsGranted || isUnavailable || !context) return

  if (!posthogClient) {
    queue.push(event)
    return
  }

  try {
    posthogClient.capture(event.name, event.properties)
  } catch {
    return
  }
}

function track<TName extends EventName>(name: TName, details: EventDetails[TName]): void {
  if (!context) return
  capture(buildAnalyticsEvent(name, details, context, source, pagePath))
}

export function clearPostHogBrowserStorage(projectKey: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  try {
    const matchingKeys = Object.keys(window.localStorage)
      .filter((key) => isPostHogBrowserStorageKey(key, projectKey))
    matchingKeys.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // Browsers can block storage. Consent cleanup must remain best-effort and non-fatal.
  }

  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => isPostHogBrowserStorageKey(name, projectKey))
  const hostname = window.location.hostname
  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`
    if (hostname) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${hostname}; SameSite=Lax; Secure`
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${hostname}; SameSite=Lax; Secure`
    }
  }
}

export function isPostHogBrowserStorageKey(key: string, projectKey: string): boolean {
  return key.includes(projectKey) && (key.startsWith('ph_') || key.startsWith('__ph_'))
}

export function replayStartDelay(eligibleAt: number | null, now = Date.now()): number {
  if (!eligibleAt || !Number.isFinite(eligibleAt)) return REPLAY_MINIMUM_DURATION_MS
  return Math.max(0, eligibleAt - now)
}

function cancelSessionReplay(clearEligibility: boolean): void {
  if (replayStartTimer) {
    globalThis.clearTimeout(replayStartTimer)
    replayStartTimer = null
  }
  if (clearEligibility) {
    try {
      window.sessionStorage.removeItem(REPLAY_ELIGIBLE_AT_KEY)
    } catch {
      // Session storage is optional; replay still remains consent-gated.
    }
  }
  posthogClient?.stopSessionRecording()
}

function scheduleSessionReplay(client: AnalyticsProvider): void {
  if (!replayGranted || replayStartTimer) return

  let eligibleAt: number | null = null
  try {
    const stored = Number(window.sessionStorage.getItem(REPLAY_ELIGIBLE_AT_KEY))
    eligibleAt = Number.isFinite(stored) && stored > 0
      ? stored
      : Date.now() + REPLAY_MINIMUM_DURATION_MS
    window.sessionStorage.setItem(REPLAY_ELIGIBLE_AT_KEY, String(eligibleAt))
  } catch {
    eligibleAt = Date.now() + REPLAY_MINIMUM_DURATION_MS
  }

  const start = () => {
    replayStartTimer = null
    if (analyticsGranted && replayGranted && posthogClient === client) {
      client.startSessionRecording({ sampling: true })
    }
  }
  const delay = replayStartDelay(eligibleAt)
  if (delay === 0) start()
  else replayStartTimer = globalThis.setTimeout(start, delay)
}

async function loadPostHog(projectKey: string, apiHost: string): Promise<void> {
  if (isLoading || posthogClient || !analyticsGranted) return
  isLoading = true

  try {
    const [{ default: posthog }, { SessionReplayExtensions, SurveysExtensions }] = await Promise.all([
      import('posthog-js/dist/module.slim'),
      import('posthog-js/dist/extension-bundles'),
    ])

    if (!analyticsGranted) return

    posthog.init(projectKey, createPostHogConfig(apiHost, {
      extensionClasses: {
        ...SessionReplayExtensions,
        ...SurveysExtensions,
      },
      surveysEnabled: context?.pageType !== 'privacy',
    }))

    posthog.reset()
    posthog.opt_in_capturing({ captureEventName: false })

    posthogClient = posthog
    if (replayGranted) scheduleSessionReplay(posthog)

    const pendingEvents = queue
    queue = []
    pendingEvents.forEach(capture)
  } catch {
    isUnavailable = true
    queue = []
  } finally {
    isLoading = false
  }
}

function schedulePostHogLoad(projectKey: string, apiHost: string): void {
  const load = () => void loadPostHog(projectKey, apiHost)

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(load, { timeout: 2_000 })
    return
  }

  globalThis.setTimeout(load, 0)
}

function analyticsEnvironment(): {
  enabled: string | undefined
  projectKey: string | undefined
  apiHost: string | undefined
} {
  return {
    enabled: import.meta.env.VITE_POSTHOG_ENABLED,
    projectKey: import.meta.env.VITE_POSTHOG_KEY,
    apiHost: import.meta.env.VITE_POSTHOG_HOST,
  }
}

function disableAnalytics(projectKey: string | undefined): void {
  analyticsGranted = false
  replayGranted = false
  pageViewTracked = false
  queue = []

  cancelSessionReplay(true)

  if (posthogClient) {
    try {
      posthogClient.opt_out_capturing()
      posthogClient.reset(true)
    } catch {
      // Cleanup continues below even when a browser extension blocks the SDK.
    }
  }

  if (projectKey) clearPostHogBrowserStorage(projectKey)
}

function applyConsent(preferences: ConsentPreferences | null): void {
  const { enabled, projectKey, apiHost } = analyticsEnvironment()
  const doNotTrack = isDoNotTrackEnabled()
  const hasConsent = hasAnalyticsConsent(preferences, doNotTrack)

  if (!hasConsent) {
    disableAnalytics(projectKey)
    return
  }

  if (!hasAnalyticsConfig(enabled, projectKey, apiHost, false)) {
    isUnavailable = true
    return
  }

  analyticsGranted = true
  replayGranted = hasReplayConsent(preferences, doNotTrack)

  if (!pageViewTracked) {
    pageViewTracked = true
    track('page_viewed', {})
  }

  if (posthogClient) {
    if (replayGranted) scheduleSessionReplay(posthogClient)
    else cancelSessionReplay(true)
    return
  }

  schedulePostHogLoad(projectKey!, apiHost!)
}

export function initAnalytics(pageContext: PageContext): void {
  if (isInitialized) return
  isInitialized = true
  context = pageContext
  source = captureBrowserAttribution()
  pagePath = window.location.pathname
  currentPreferences = getConsentPreferences()

  subscribeToConsent((preferences) => {
    const wasCollecting = Boolean(currentPreferences?.analytics)
    currentPreferences = preferences
    applyConsent(preferences)

    if (wasCollecting && !preferences.analytics) {
      globalThis.setTimeout(() => window.location.reload(), 0)
    }
  })

  applyConsent(currentPreferences)
}

export function trackResumeDownload(location: string): void {
  track('resume_download_clicked', { location })
}

export function trackContact(channel: ContactChannel, location: string): void {
  track('contact_clicked', { channel, location })
}

export function trackProfile(platform: ProfilePlatform, location: string): void {
  track('profile_clicked', { platform, location })
}

export function trackProject(
  projectId: string,
  destination: ProjectDestination,
  location: string,
): void {
  track('project_clicked', { project_id: projectId, destination, location })
}

export function trackContactFormSubmitted(location: string): void {
  track('contact_form_submitted', { location })
}

export function getProjectDestination(href: string): Exclude<ProjectDestination, 'case'> {
  try {
    const hostname = new URL(href).hostname.replace(/^www\./, '')
    if (hostname === 'github.com') return 'github'
    if (hostname === 'npmjs.com') return 'npm'
  } catch {
    return 'live'
  }
  return 'live'
}
