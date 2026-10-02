import { useEffect, type RefObject } from 'react'
import { createProjectThemeController } from './projectThemeController'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

/** One scheduled frame for visible narratives, no scroll interception or React render per frame. */
export function useEditorialMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = root.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 1100px)')
    const fine = window.matchMedia('(pointer: fine)')
    const themes = createProjectThemeController(element)
    let cleanup = () => {}
    const setup = () => {
      cleanup()
      if (reduced.matches) {
        element.classList.remove('motion-ready')
        element
          .querySelectorAll<HTMLElement>('[data-progress]')
          .forEach((node) => node.style.setProperty('--progress', '1'))
      } else element.classList.add('motion-ready')
      let frame = 0
      const active = new Set<HTMLElement>()
      const nodes = [...element.querySelectorAll<HTMLElement>('[data-progress]')]
      const draw = () => {
        frame = 0
        // Batch geometry reads before writes.
        const values = (reduced.matches ? [] : [...active]).map((node) => {
          const rect = node.getBoundingClientRect()
          let progress: number
          if (node.dataset.progress === 'chaos' && desktop.matches)
            progress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight))
          else if (node.dataset.progress === 'hero')
            progress = clamp(
              window.scrollY / Math.max(1, Math.min(window.innerHeight * 0.65, rect.height * 0.7))
            )
          else
            progress = clamp((window.innerHeight * 0.85 - rect.top) / (window.innerHeight * 0.75))
          return { node, progress }
        })
        const applyTheme = themes.measure()
        applyTheme()
        values.forEach(({ node, progress }) =>
          node.style.setProperty('--progress', progress.toFixed(4))
        )
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(draw)
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              active.add(entry.target as HTMLElement)
              entry.target.classList.add('is-visible')
            } else active.delete(entry.target as HTMLElement)
          })
          schedule()
        },
        { rootMargin: '120px' }
      )
      nodes.forEach((node) => observer.observe(node))
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      const interactive = [...element.querySelectorAll<HTMLElement>('[data-pointer]')]
      const pointerCleanup = interactive.map((node) => {
        let pointerFrame = 0
        let x = 0,
          y = 0
        const move = (event: PointerEvent) => {
          if (reduced.matches || !fine.matches || event.pointerType === 'touch') return
          const rect = node.getBoundingClientRect()
          x = ((event.clientX - rect.left) / rect.width - 0.5) * 8
          y = ((event.clientY - rect.top) / rect.height - 0.5) * 8
          if (!pointerFrame)
            pointerFrame = requestAnimationFrame(() => {
              node.style.setProperty('--px', `${x}px`)
              node.style.setProperty('--py', `${y}px`)
              if (node.classList.contains('project-media')) {
                node.style.setProperty(
                  '--cursor-x',
                  `${Math.max(72, Math.min(rect.width - 72, event.clientX - rect.left))}px`
                )
                node.style.setProperty(
                  '--cursor-y',
                  `${Math.max(32, Math.min(rect.height - 32, event.clientY - rect.top))}px`
                )
              }
              pointerFrame = 0
            })
        }
        const leave = () => {
          cancelAnimationFrame(pointerFrame)
          pointerFrame = 0
          node.style.setProperty('--px', '0px')
          node.style.setProperty('--py', '0px')
        }
        node.addEventListener('pointermove', move)
        node.addEventListener('pointerleave', leave)
        return () => {
          leave()
          node.removeEventListener('pointermove', move)
          node.removeEventListener('pointerleave', leave)
        }
      })
      schedule()
      cleanup = () => {
        observer.disconnect()
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
        pointerCleanup.forEach((fn) => fn())
      }
    }
    setup()
    reduced.addEventListener('change', setup)
    desktop.addEventListener('change', setup)
    return () => {
      cleanup()
      themes.destroy()
      reduced.removeEventListener('change', setup)
      desktop.removeEventListener('change', setup)
    }
  }, [root])
}
