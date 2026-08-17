import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CaptureResult } from 'posthog-js'
import {
  buildAnalyticsEvent,
  clearPostHogBrowserStorage,
  createPostHogConfig,
  getProjectDestination,
  hasAnalyticsConsent,
  hasAnalyticsConfig,
  hasReplayConsent,
  isDoNotTrackEnabled,
  isPostHogBrowserStorageKey,
  replayStartDelay,
  sanitizeProviderEvent,
} from './analytics'

const page = { pageType: 'recruiter' } as const

afterEach(() => vi.unstubAllGlobals())

describe('eventos públicos de analytics', () => {
  it('inicializa o provedor somente após opt-in e com captura manual', () => {
    const config = createPostHogConfig('https://us.i.posthog.com')

    expect(config).toMatchObject({
      api_host: 'https://us.i.posthog.com',
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
      },
      enable_recording_console_log: false,
      disable_surveys: false,
      disable_surveys_automatic_display: false,
      disable_product_tours: true,
      disable_conversations: true,
      disable_web_experiments: true,
      disable_external_dependency_loading: true,
      save_referrer: false,
      save_campaign_params: false,
      disable_scroll_properties: true,
    })
  })

  it('desabilita pesquisas na página de privacidade', () => {
    expect(createPostHogConfig('https://us.i.posthog.com', { surveysEnabled: false })).toMatchObject({
      disable_surveys: true,
      disable_surveys_automatic_display: true,
    })
  })

  it('gera pageview somente com o contexto público', () => {
    expect(buildAnalyticsEvent('page_viewed', {}, page, 'linkedin', '/recrutadores/')).toEqual({
      name: 'page_viewed',
      properties: {
        page_path: '/recrutadores/',
        page_type: 'recruiter',
        source: 'linkedin',
      },
    })
  })

  it('gera eventos tipados com as propriedades exatas', () => {
    expect(buildAnalyticsEvent(
      'resume_download_clicked',
      { location: 'recruiter_hero' },
      page,
      'gupy',
      '/recrutadores/',
    ).properties).toEqual({
      page_path: '/recrutadores/',
      page_type: 'recruiter',
      source: 'gupy',
      location: 'recruiter_hero',
    })

    expect(buildAnalyticsEvent(
      'contact_clicked',
      { channel: 'linkedin', location: 'recruiter_hero' },
      page,
      'email',
      '/recrutadores/',
    ).properties).toEqual({
      page_path: '/recrutadores/',
      page_type: 'recruiter',
      source: 'email',
      channel: 'linkedin',
      location: 'recruiter_hero',
    })

    expect(buildAnalyticsEvent(
      'project_clicked',
      { project_id: 'convites-saas', destination: 'case', location: 'recruiter_projects' },
      page,
      'linkedin',
      '/recrutadores/',
    ).properties).toEqual({
      page_path: '/recrutadores/',
      page_type: 'recruiter',
      source: 'linkedin',
      project_id: 'convites-saas',
      destination: 'case',
      location: 'recruiter_projects',
    })

    expect(buildAnalyticsEvent(
      'profile_clicked',
      { platform: 'github', location: 'recruiter_contact' },
      page,
      'direto',
      '/recrutadores/',
    ).properties).toEqual({
      page_path: '/recrutadores/',
      page_type: 'recruiter',
      source: 'direto',
      platform: 'github',
      location: 'recruiter_contact',
    })

    expect(buildAnalyticsEvent(
      'contact_form_submitted',
      { location: 'commercial_contact_form' },
      { pageType: 'commercial' },
      'google',
      '/',
    ).properties).toEqual({
      page_path: '/',
      page_type: 'commercial',
      source: 'google',
      location: 'commercial_contact_form',
    })
  })

  it('não inclui query string, hash nem dados pessoais nas propriedades construídas', () => {
    const event = buildAnalyticsEvent(
      'contact_form_submitted',
      { location: 'commercial_contact_form' },
      { pageType: 'commercial' },
      'direto',
      '/contato/',
    )
    const serialized = JSON.stringify(event.properties)
    const propertyNames = Object.keys(event.properties)

    expect(serialized).not.toContain('?')
    expect(serialized).not.toContain('#')
    expect(propertyNames).not.toContain('email')
    expect(propertyNames).not.toContain('phone')
    expect(propertyNames).not.toContain('name')
    expect(propertyNames).not.toContain('message')
  })

  it('remove URLs e referrers adicionados automaticamente pelo provedor', () => {
    const event: CaptureResult = {
      uuid: 'f4706435-a535-48e7-ae93-fb015f587689',
      event: 'page_viewed',
      properties: {
        page_path: '/recrutadores/',
        $current_url: 'https://www.mattecnologia.dev.br/recrutadores/?origem=email',
        $referrer: 'https://example.com/?candidate=Marcelo',
        $initial_current_url: 'https://www.mattecnologia.dev.br/?origem=email',
      },
    }

    expect(sanitizeProviderEvent(event)?.properties).toEqual({ page_path: '/recrutadores/' })
    expect(sanitizeProviderEvent(null)).toBeNull()
  })

  it('classifica destinos públicos de projeto', () => {
    expect(getProjectDestination('https://github.com/MATTecno/zd-signature-input')).toBe('github')
    expect(getProjectDestination('https://www.npmjs.com/package/teste')).toBe('npm')
    expect(getProjectDestination('https://convites.mattecnologia.dev.br')).toBe('live')
  })

  it('permanece desativado sem configuração ou com DNT', () => {
    expect(hasAnalyticsConfig(undefined, undefined, undefined, false)).toBe(false)
    expect(hasAnalyticsConfig('true', 'phc_publico', 'https://us.i.posthog.com', true)).toBe(false)
    expect(hasAnalyticsConfig('true', 'phc_publico', 'https://us.i.posthog.com', false)).toBe(true)
    expect(isDoNotTrackEnabled({ doNotTrack: '1' })).toBe(true)
    expect(isDoNotTrackEnabled({ doNotTrack: '0' })).toBe(false)
  })

  it('exige consentimento explícito e respeita DNT para métricas e replay', () => {
    const analyticsOnly = {
      version: 1,
      analytics: true,
      replay: false,
      decidedAt: '2026-08-16T12:00:00.000Z',
      expiresAt: '2027-02-12T12:00:00.000Z',
    } as const
    const allAccepted = { ...analyticsOnly, replay: true }

    expect(hasAnalyticsConsent(null, false)).toBe(false)
    expect(hasAnalyticsConsent(analyticsOnly, false)).toBe(true)
    expect(hasAnalyticsConsent(analyticsOnly, true)).toBe(false)
    expect(hasReplayConsent(analyticsOnly, false)).toBe(false)
    expect(hasReplayConsent(allAccepted, false)).toBe(true)
    expect(hasReplayConsent(allAccepted, true)).toBe(false)
  })

  it('só inicia replay depois de dez segundos de sessão elegível', () => {
    expect(replayStartDelay(null, 1_000)).toBe(10_000)
    expect(replayStartDelay(11_000, 6_000)).toBe(5_000)
    expect(replayStartDelay(11_000, 12_000)).toBe(0)
  })

  it('reconhece toda a persistência do projeto que deve ser removida na revogação', () => {
    const projectKey = 'phc_publico'

    expect(isPostHogBrowserStorageKey('ph_phc_publico_posthog', projectKey)).toBe(true)
    expect(isPostHogBrowserStorageKey('__ph_opt_in_out_phc_publico', projectKey)).toBe(true)
    expect(isPostHogBrowserStorageKey('ph_outro_projeto_posthog', projectKey)).toBe(false)
    expect(isPostHogBrowserStorageKey('mat_consent_v1', projectKey)).toBe(false)
  })

  it('remove cookies e localStorage do PostHog ao revogar', () => {
    const removedKeys: string[] = []
    const cookieWrites: string[] = []
    const localStorage = {
      ph_phc_publico_posthog: 'identificador',
      __ph_opt_in_out_phc_publico: '1',
      app_preference: 'preservar',
    }
    Object.defineProperty(localStorage, 'removeItem', {
      enumerable: false,
      value: (key: string) => {
        removedKeys.push(key)
        delete localStorage[key as keyof typeof localStorage]
      },
    })

    vi.stubGlobal('window', {
      localStorage,
      location: { hostname: 'www.mattecnologia.dev.br' },
    })
    vi.stubGlobal('document', {
      get cookie() {
        return 'ph_phc_publico_posthog=valor; __ph_opt_in_out_phc_publico=1; outro=seguro'
      },
      set cookie(value: string) {
        cookieWrites.push(value)
      },
    })

    clearPostHogBrowserStorage('phc_publico')

    expect(removedKeys).toEqual([
      'ph_phc_publico_posthog',
      '__ph_opt_in_out_phc_publico',
    ])
    expect(localStorage.app_preference).toBe('preservar')
    expect(cookieWrites).toHaveLength(6)
    expect(cookieWrites.every((value) => value.includes('Max-Age=0'))).toBe(true)
    expect(cookieWrites.some((value) => value.startsWith('outro='))).toBe(false)
  })
})
