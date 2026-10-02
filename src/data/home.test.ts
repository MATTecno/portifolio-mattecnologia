import { describe, expect, it } from 'vitest'
import { EDITORIAL_FAQ, HOME_PROJECTS } from './home'
import { getProjectReference } from '../lib/estimate'
import { projectWhatsAppMessage, whatsappLink, WHATSAPP_CONTEXT_MESSAGES } from '../lib/contact'
import { buildAnalyticsEvent } from '../lib/analytics'

describe('contratos comerciais da home editorial', () => {
  it('apresenta exatamente os três cases pedidos, na ordem, sem duplicar o catálogo', () => {
    expect(HOME_PROJECTS.map(({ project }) => project.id)).toEqual([
      'apublicitaria',
      'brutona',
      'vm-viagens',
    ])
    expect(EDITORIAL_FAQ).toHaveLength(4)
    expect(
      HOME_PROJECTS.every(({ project }) => project.featured && project.cover && project.caseStudy)
    ).toBe(true)
  })
  it('preserva referência de cada case e contexto no link de WhatsApp', () => {
    for (const { project } of HOME_PROJECTS) {
      const reference = getProjectReference(
        new URL(`https://example.com/contato/?projeto=${project.id}`)
      )
      expect(reference?.title).toBe(project.title)
      const link = new URL(whatsappLink(projectWhatsAppMessage(reference!.title)))
      expect(link.hostname).toBe('wa.me')
      expect(link.searchParams.get('text')).toContain(project.title)
    }
    expect(new Set(Object.values(WHATSAPP_CONTEXT_MESSAGES)).size).toBe(6)
  })
  it('mantém origem e campanha nos novos eventos sem coletar texto livre', () => {
    const campaign = { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'sistemas_bh' }
    const event = buildAnalyticsEvent(
      'project_viewed',
      { project_id: 'brutona', location: 'commercial_projects' },
      { pageType: 'commercial' },
      'google',
      '/',
      campaign
    )
    expect(event.properties).toEqual({
      page_type: 'commercial',
      page_path: '/',
      source: 'google',
      ...campaign,
      project_id: 'brutona',
      location: 'commercial_projects',
    })
    const accordion = buildAnalyticsEvent(
      'service_interaction',
      { service_id: 'automation', state: 'open', location: 'commercial_services' },
      { pageType: 'commercial' },
      'direto',
      '/'
    )
    expect(accordion.name).toBe('service_interaction')
    expect(accordion.properties).not.toHaveProperty('message')
  })
})
