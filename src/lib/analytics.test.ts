import { describe, expect, it } from 'vitest'
import type { CaptureResult } from 'posthog-js'
import {
  buildAnalyticsEvent,
  createPostHogConfig,
  getProjectDestination,
  hasAnalyticsConfig,
  isDoNotTrackEnabled,
  sanitizeProviderEvent,
} from './analytics'

const page = { pageType: 'recruiter' } as const

describe('eventos públicos de analytics', () => {
  it('inicializa o provedor em modo cookieless e somente com captura manual', () => {
    const config = createPostHogConfig('https://us.i.posthog.com')

    expect(config).toMatchObject({
      api_host: 'https://us.i.posthog.com',
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
})
