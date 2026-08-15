import { describe, expect, it } from 'vitest'
import {
  CASE_STUDY_PROJECTS,
  FEATURED_PROJECTS,
  PROJECTS,
  getProjectBySlug,
  getProjectCasePath,
} from './projects'

describe('catálogo de projetos', () => {
  it('mantém identificadores únicos', () => {
    const ids = PROJECTS.map((project) => project.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('possui os três cases completos em destaque', () => {
    expect(FEATURED_PROJECTS).toHaveLength(3)

    for (const project of FEATURED_PROJECTS) {
      expect(project.cover.src).toMatch(/^\/projects\/.+\.webp$/)
      expect(project.cover.srcSet).toContain('480w')
      expect(project.cover.srcSet).toContain('800w')
      expect(project.cover.srcSet).toContain('1280w')
      expect(project.cover.alt.length).toBeGreaterThan(20)
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.solution.length).toBeGreaterThan(20)
      expect(project.highlights).toHaveLength(3)
    }
  })

  it('mantém os quatro cases completos e com slugs únicos', () => {
    expect(CASE_STUDY_PROJECTS).toHaveLength(4)

    const slugs = CASE_STUDY_PROJECTS.map((project) => project.caseStudy.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toEqual(['convites', 'estoque', 'zd-signature-input', 'pdv'])

    for (const project of CASE_STUDY_PROJECTS) {
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.solution.length).toBeGreaterThan(20)
      expect(project.caseStudy.role.length).toBeGreaterThan(20)
      expect(project.caseStudy.contributions.length).toBeGreaterThanOrEqual(3)
      expect(project.caseStudy.architecture.length).toBeGreaterThanOrEqual(3)
      expect(project.caseStudy.decisions.length).toBeGreaterThanOrEqual(3)
      expect(getProjectBySlug(project.caseStudy.slug)?.id).toBe(project.id)
      expect(getProjectCasePath(project)).toBe(`/projetos/${project.caseStudy.slug}/`)
    }
  })
})
