import { MAT_PROJECT_THEME, PROJECT_THEMES, type ProjectThemeId } from '../data/projectThemes'

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (n: number) => {
  const t = clamp(n)
  return t * t * (3 - 2 * t)
}

type Scene = { id: ProjectThemeId; top: number; bottom: number }

/** Pure scroll model: narrow blend band, stable ownership at the viewport midpoint. */
export function resolveProjectTheme(
  scenes: Scene[],
  height: number,
  previous: ProjectThemeId | null
) {
  const probe = height * 0.5
  let active = scenes.find((scene) => scene.top <= probe && scene.bottom > probe)?.id ?? null
  // 12px hysteresis prevents favicon churn when a trackpad oscillates at a boundary.
  const retained = scenes.find((scene) => scene.id === previous)
  const inside =
    scenes.length > 0 && scenes[0].top <= probe && scenes[scenes.length - 1].bottom > probe
  if (inside && retained && retained.top <= probe + 12 && retained.bottom > probe - 12)
    active = previous
  const band = height * 0.18
  let from: ProjectThemeId | null = null
  let to: ProjectThemeId | null = null
  let blend = 0
  for (let i = 0; i <= scenes.length; i++) {
    const boundary = i === scenes.length ? scenes[i - 1]?.bottom : scenes[i]?.top
    if (boundary === undefined) break
    const distance = probe - boundary
    if (Math.abs(distance) < band) {
      from = scenes[i - 1]?.id ?? null
      to = scenes[i]?.id ?? null
      blend = smooth((distance + band) / (2 * band))
      return { active, from, to, blend }
    }
  }
  return { active, from: active, to: active, blend: 1 }
}

/** DOM writes are returned separately so the caller can batch all geometry reads first. */
export function createProjectThemeController(root: HTMLElement) {
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-project-id]')]
  const icons = [...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')]
  const iconSnapshots = icons.map((node) => ({
    node,
    attrs: ['href', 'type', 'sizes'].map((name) => [name, node.getAttribute(name)] as const),
  }))
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const originalMeta = meta?.getAttribute('content') ?? null
  let current: ProjectThemeId | null = null
  let lastColors = ''
  const properties = [
    'surface',
    'accent',
    'secondaryAccent',
    'text',
    'headerAccent',
    'onAccent',
  ] as const
  const cssNames = ['surface', 'accent', 'secondary', 'text', 'header-accent', 'on-accent']
  const restoreMetadata = () => {
    iconSnapshots.forEach(({ node, attrs }) =>
      attrs.forEach(([name, value]) => {
        if (value === null) node.removeAttribute(name)
        else node.setAttribute(name, value)
      })
    )
    if (meta) {
      if (originalMeta === null) meta.removeAttribute('content')
      else meta.setAttribute('content', originalMeta)
    }
  }
  return {
    measure() {
      const geometry = scenes.map((node) => {
        const rect = node.getBoundingClientRect()
        return { id: node.dataset.projectId as ProjectThemeId, top: rect.top, bottom: rect.bottom }
      })
      const state = resolveProjectTheme(geometry, window.innerHeight, current)
      return () => {
        if (state.active !== current) {
          current = state.active
          if (current) {
            const theme = PROJECT_THEMES[current]
            root.dataset.activeProject = current
            icons.forEach((node) => {
              node.setAttribute('href', theme.favicon.href)
              node.setAttribute('type', theme.favicon.type)
              node.setAttribute('sizes', theme.favicon.sizes)
            })
            meta?.setAttribute('content', theme.themeColor)
          } else {
            delete root.dataset.activeProject
            restoreMetadata()
          }
        }
        const key = `${state.from}/${state.to}/${state.blend.toFixed(3)}`
        if (lastColors === key) return
        lastColors = key
        const from = state.from ? PROJECT_THEMES[state.from] : MAT_PROJECT_THEME
        const to = state.to ? PROJECT_THEMES[state.to] : MAT_PROJECT_THEME
        properties.forEach((property, index) => {
          const value =
            from[property] === to[property]
              ? from[property]
              : `color-mix(in srgb, ${from[property]}, ${to[property]} ${(
                  state.blend * 100
                ).toFixed(1)}%)`
          root.style.setProperty(`--active-project-${cssNames[index]}`, value)
        })
      }
    },
    destroy() {
      restoreMetadata()
      delete root.dataset.activeProject
      cssNames.forEach((name) => root.style.removeProperty(`--active-project-${name}`))
    },
  }
}
