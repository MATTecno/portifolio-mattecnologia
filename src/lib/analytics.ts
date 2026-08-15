import type { CaptureResult } from 'posthog-js'
import type { PostHogConfig } from 'posthog-js/dist/module.slim'
import { captureBrowserAttribution } from './attribution'

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
] as const

let context: PageContext | null = null
let source = 'direto'
let pagePath = '/'
let posthogClient: AnalyticsProvider | null = null
let isInitialized = false
let isUnavailable = false
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

export function createPostHogConfig(apiHost: string): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
    defaults: '2026-05-30',
    cookieless_mode: 'always',
    persistence: 'memory',
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
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
    save_referrer: false,
    save_campaign_params: false,
    disable_scroll_properties: true,
    property_denylist: [...PRIVATE_PROVIDER_PROPERTIES],
    before_send: sanitizeProviderEvent,
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

function capture(event: AnalyticsEvent): void {
  if (isUnavailable || !context) return

  if (!posthogClient) {
    queue.push(event)
    return
  }

  try {
    posthogClient.capture(event.name, event.properties)
  } catch {
    // Analytics nunca deve interferir na ação solicitada pelo visitante.
  }
}

function track<TName extends EventName>(name: TName, details: EventDetails[TName]): void {
  if (!context) return
  capture(buildAnalyticsEvent(name, details, context, source, pagePath))
}

async function loadPostHog(projectKey: string, apiHost: string): Promise<void> {
  try {
    const { default: posthog } = await import('posthog-js/dist/module.slim')
    posthog.init(projectKey, createPostHogConfig(apiHost))

    posthogClient = posthog
    const pendingEvents = queue
    queue = []
    pendingEvents.forEach(capture)
  } catch {
    isUnavailable = true
    queue = []
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

export function initAnalytics(pageContext: PageContext): void {
  if (isInitialized) return
  isInitialized = true
  context = pageContext
  source = captureBrowserAttribution()
  pagePath = window.location.pathname

  const enabled = import.meta.env.VITE_POSTHOG_ENABLED
  const projectKey = import.meta.env.VITE_POSTHOG_KEY
  const apiHost = import.meta.env.VITE_POSTHOG_HOST

  if (!enabled || !projectKey || !apiHost) {
    isUnavailable = true

    if (import.meta.env.DEV) {
      const missingVariable = !enabled
        ? 'VITE_POSTHOG_ENABLED'
        : !projectKey
          ? 'VITE_POSTHOG_KEY'
          : 'VITE_POSTHOG_HOST'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  if (!hasAnalyticsConfig(enabled, projectKey, apiHost, isDoNotTrackEnabled())) {
    isUnavailable = true
    return
  }

  track('page_viewed', {})
  schedulePostHogLoad(projectKey, apiHost)
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
    // Links desconhecidos são tratados como destino ao vivo.
  }
  return 'live'
}
