import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const NAVIGATION = [
  ['Projetos', 'portfolio'],
  ['Serviços', 'servicos'],
  ['Como funciona', 'processo'],
  ['Seu projeto', 'estimativa'],
  ['Contato', 'contato'],
] as const

export default function CommercialHeader({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className="site-header">
      <a className="skip-link" href={home ? '#conteudo' : '#case-content'}>
        Pular para o conteúdo
      </a>
      <nav className="site-container site-navigation" aria-label="Principal">
        <a className="site-brand" href={home ? '#top' : '/'} aria-label="MATTecnologia, início">
          MAT<span>Tecnologia</span>
        </a>
        <button
          className="site-menu-toggle"
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
        <div id="site-menu" className={`site-menu ${open ? 'is-open' : ''}`}>
          {NAVIGATION.map(([label, id]) => (
            <a key={id} href={`${home ? '' : '/'}#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="site-professional-link" href="/recrutadores/">
            Perfil profissional ↗
          </a>
        </div>
      </nav>
    </header>
  )
}
