import { describe, expect, it } from 'vitest'
import { FEATURED_PROJECTS, PROJECTS } from './projects'

describe('catálogo de projetos', () => {
  it('mantém identificadores únicos', () => {
    const ids = PROJECTS.map((project) => project.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('possui os três cases completos em destaque', () => {
    expect(FEATURED_PROJECTS).toHaveLength(3)

    for (const project of FEATURED_PROJECTS) {
      expect(project.cover).toMatch(/^\/projects\/.+\.webp$/)
      expect(project.coverAlt.length).toBeGreaterThan(20)
      expect(project.problem.length).toBeGreaterThan(20)
      expect(project.solution.length).toBeGreaterThan(20)
      expect(project.highlights).toHaveLength(3)
    }
  })
})
