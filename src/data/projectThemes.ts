import type { CSSProperties } from 'react'

// Tokens copied from the real projects. Provenance: docs/visual-refactor/ART-DIRECTION-2.md.
export const PROJECT_THEMES = {
  apublicitaria: {
    accent: '#fec800',
    secondaryAccent: '#f8f7f7',
    surface: '#4a1a3f',
    text: '#f8f7f7',
    headerAccent: '#4a1a3f',
    onAccent: '#4a1a3f',
    themeColor: '#4a1a3f',
    favicon: { href: '/projects/icons/apublicitaria.png', type: 'image/png', sizes: '64x64' },
  },
  brutona: {
    accent: '#ebd9c8',
    secondaryAccent: '#ecc7d8',
    surface: '#a0121b',
    text: '#faf8f4',
    headerAccent: '#a0121b',
    onAccent: '#3c2b27',
    themeColor: '#a0121b',
    favicon: { href: '/projects/icons/brutona.png', type: 'image/png', sizes: '32x32' },
  },
  'vm-viagens': {
    accent: '#ded4c8',
    secondaryAccent: '#f4f0ea',
    surface: '#102b4b',
    text: '#fbf8f3',
    headerAccent: '#173a64',
    onAccent: '#102b4b',
    themeColor: '#102b4b',
    favicon: { href: '/projects/icons/vm-viagens.ico', type: 'image/x-icon', sizes: '32x32' },
  },
} as const

export type ProjectThemeId = keyof typeof PROJECT_THEMES
export type ProjectTheme = (typeof PROJECT_THEMES)[ProjectThemeId]

export const MAT_PROJECT_THEME = {
  accent: '#f4f3ef',
  secondaryAccent: '#b9bec7',
  surface: '#1b1e22',
  text: '#f4f3ef',
  headerAccent: '#2457c5',
  onAccent: '#1b1e22',
}

export function projectThemeStyles(theme: ProjectTheme): CSSProperties {
  return {
    '--project-accent': theme.accent,
    '--project-accent-secondary': theme.secondaryAccent,
    '--project-surface': theme.surface,
    '--project-text': theme.text,
    '--project-on-accent': theme.onAccent,
    '--project-line': `color-mix(in srgb, ${theme.accent} 32%, transparent)`,
  } as CSSProperties
}
