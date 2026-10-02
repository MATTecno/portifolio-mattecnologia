import { describe, expect, it } from 'vitest'
import { resolveProjectTheme } from './projectThemeController'
import { PROJECT_THEMES } from '../data/projectThemes'

const scenes = [
  { id: 'apublicitaria' as const, top: 100, bottom: 1100 },
  { id: 'brutona' as const, top: 1100, bottom: 2100 },
  { id: 'vm-viagens' as const, top: 2100, bottom: 3100 },
]
const scroll = (y: number) =>
  scenes.map((scene) => ({ ...scene, top: scene.top - y, bottom: scene.bottom - y }))

describe('projeto ativo e transição de direção de arte', () => {
  it('identifica cada projeto pelo foco da viewport e restaura fora da vitrine', () => {
    expect(resolveProjectTheme(scroll(-600), 1000, null).active).toBeNull()
    expect(resolveProjectTheme(scroll(0), 1000, null).active).toBe('apublicitaria')
    expect(resolveProjectTheme(scroll(1000), 1000, 'apublicitaria').active).toBe('brutona')
    expect(resolveProjectTheme(scroll(2000), 1000, 'brutona').active).toBe('vm-viagens')
    expect(resolveProjectTheme(scroll(2800), 1000, 'vm-viagens').active).toBeNull()
  })
  it('interpola no limite sem oscilar favicon por poucos pixels', () => {
    const before = resolveProjectTheme(scroll(550), 1000, 'apublicitaria')
    const after = resolveProjectTheme(scroll(650), 1000, 'apublicitaria')
    expect(before.from).toBe('apublicitaria')
    expect(before.to).toBe('brutona')
    expect(before.blend).toBeLessThan(after.blend)
    expect(resolveProjectTheme(scroll(603), 1000, 'apublicitaria').active).toBe('apublicitaria')
    expect(resolveProjectTheme(scroll(630), 1000, 'apublicitaria').active).toBe('brutona')
    expect(resolveProjectTheme(scroll(597), 1000, 'brutona').active).toBe('brutona')
  })
  it('não cria um tema para páginas sem vitrine e mantém favicons reais locais', () => {
    expect(resolveProjectTheme([], 900, null).active).toBeNull()
    for (const theme of Object.values(PROJECT_THEMES)) {
      expect(theme.favicon.href).toMatch(/^\/projects\/icons\/.+\.(png|ico)$/)
      expect(theme.themeColor).toBe(theme.surface)
    }
  })
})
