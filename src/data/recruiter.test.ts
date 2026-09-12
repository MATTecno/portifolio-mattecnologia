import { describe, expect, it } from 'vitest'
import {
  FEATURED_RECRUITER_PROJECTS,
  RECRUITER_PROFILE,
  RECRUITER_PROJECTS,
  RESUME_PHONE,
  SECONDARY_RECRUITER_PROJECTS,
} from './recruiter'
import { getProjectById } from './projects'

describe('dados profissionais para recrutadores', () => {
  it('mantém identidade e contatos obrigatórios atualizados', () => {
    expect(RECRUITER_PROFILE.name).toBe('Marcelo Diogo Teixeira')
    expect(RECRUITER_PROFILE.email).toBe('marcelos.diogo8@gmail.com')
    expect(RECRUITER_PROFILE.github).toBe('https://github.com/MATTecno')
    expect(RECRUITER_PROFILE.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//)
    expect(RESUME_PHONE).toBe('(31) 99579-7235')

    const serialized = JSON.stringify(RECRUITER_PROFILE)
    expect(serialized).not.toContain('Marcelos161')
    expect(serialized).not.toContain('outlook.com')
  })

  it('mantém experiências em ordem cronológica decrescente', () => {
    const sortOrders = RECRUITER_PROFILE.experience.map((experience) => experience.sortOrder)
    expect(sortOrders).toEqual([...sortOrders].sort((a, b) => b - a))
  })

  it('mantém identificadores únicos em experiências e projetos', () => {
    const experienceIds = RECRUITER_PROFILE.experience.map((experience) => experience.id)
    const projectIds = RECRUITER_PROJECTS.map((project) => project.id)

    expect(new Set(experienceIds).size).toBe(experienceIds.length)
    expect(new Set(projectIds).size).toBe(projectIds.length)
  })

  it('prioriza assinatura, SaaS e PDV sem perder os projetos secundários', () => {
    expect(FEATURED_RECRUITER_PROJECTS.map((project) => project.id)).toEqual([
      'zd-signature-input', 'convites-saas', 'pdv',
    ])
    expect(SECONDARY_RECRUITER_PROJECTS).toHaveLength(6)
    for (const id of ['estoque-desktop', 'brutona', 'vm-viagens']) {
      expect(SECONDARY_RECRUITER_PROJECTS.find((project) => project.id === id)?.casePath).toMatch(/^\/projetos\/.+\/$/)
    }

    const illustratedProjects = FEATURED_RECRUITER_PROJECTS.filter((project) => project.cover)
    expect(illustratedProjects).toHaveLength(2)

    for (const project of illustratedProjects) {
      expect(project.cover?.src).toMatch(/^\/projects\/.+\.webp$/)
      expect(project.cover?.alt.length).toBeGreaterThan(20)
    }
  })

  it('referencia o catálogo canônico em todos os projetos com case', () => {
    for (const recruiterProject of RECRUITER_PROJECTS.filter((project) => project.casePath)) {
      const catalogProject = getProjectById(recruiterProject.id)

      expect(catalogProject).toBeDefined()
      expect(recruiterProject.title).toBe(catalogProject?.title)
      expect(recruiterProject.status).toBe(catalogProject?.status)
      expect(recruiterProject.category).toBe(catalogProject?.category)
      expect(recruiterProject.stack).toEqual(catalogProject?.stack)
      expect(recruiterProject.casePath).toMatch(/^\/projetos\/.+\/$/)
    }
  })
})
