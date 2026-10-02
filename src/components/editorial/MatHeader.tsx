import { useEffect, useRef, useState } from 'react'
import WhatsAppCta from '../WhatsAppCta'
import { WHATSAPP_CONTEXT_MESSAGES } from '../../lib/contact'

const navigation = [
  ['Soluções', 'servicos'],
  ['Projetos', 'portfolio'],
  ['Como funciona', 'processo'],
  ['Sobre', 'sobre'],
  ['Contato', 'contato'],
] as const

export default function MatHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sentinel = document.getElementById('mat-top-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector('a')?.focus()
    const close = () => {
      setOpen(false)
      toggle.current?.focus()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
      if (event.key !== 'Tab') return
      const links = panel.current?.querySelectorAll<HTMLAnchorElement>('a')
      if (!links?.length) return
      if (event.shiftKey && document.activeElement === toggle.current) {
        event.preventDefault()
        links[links.length - 1].focus()
      } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
        event.preventDefault()
        toggle.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1100px)')
    const onResize = () => {
      if (desktop.matches) close()
    }
    desktop.addEventListener('change', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])
  return (
    <>
      <div id="mat-top-sentinel" aria-hidden="true" />
      <header className={`mat-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-open' : ''}`}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <nav className="mat-wrap mat-nav" aria-label="Principal">
          <a
            className="mat-brand"
            href={home ? '#top' : '/'}
            aria-label="MAT Tecnologia, início"
            onClick={() => setOpen(false)}
          >
            MAT<span className="brand-dot">.</span>
          </a>
          <button
            ref={toggle}
            type="button"
            className="mat-menu-toggle"
            aria-expanded={open}
            aria-controls="mat-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen(!open)}
          >
            <span>{open ? 'Fechar' : 'Menu'}</span>
            <span aria-hidden="true">{open ? '×' : '☰'}</span>
          </button>
          <div ref={panel} id="mat-menu" className={`mat-menu ${open ? 'is-open' : ''}`}>
            {navigation.map(([label, id]) => (
              <a key={id} href={`${home ? '' : '/'}#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <WhatsAppCta
              className="mat-button mat-header-cta"
              location="commercial_header"
              label="Falar sobre um projeto ↗"
              message={WHATSAPP_CONTEXT_MESSAGES.hero}
              onClick={() => setOpen(false)}
            />
          </div>
        </nav>
      </header>
    </>
  )
}
