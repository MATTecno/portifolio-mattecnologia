import { useEffect, useState } from 'react'
import { FaBars, FaGithub, FaTimes, FaWhatsapp } from 'react-icons/fa'

const NAV_LINKS = [
  ['Sobre', '#sobre'],
  ['Serviços', '#servicos'],
  ['Projetos', '#portfolio'],
  ['Como trabalho', '#processo'],
  ['Estimativa', '#estimativa'],
  ['Contato', '#contato'],
] as const

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header id="top" className="relative isolate overflow-hidden">
      <div className="fixed inset-x-0 top-0 z-30 bg-background/90 backdrop-blur border-b border-white/10">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Principal">
          <a href="#top" aria-label="Ir para o início" className="font-orbitron text-xl tracking-wide">
            <span className="text-ice">MAT</span><span className="text-primary">Tecnologia</span>
          </a>

          <div className="hidden lg:flex items-center gap-5 text-sm">
            {NAV_LINKS.map(([label, href]) => (
              <a key={href} href={href} className="opacity-75 hover:opacity-100 focus:opacity-100 transition">
                {label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 -mr-2 rounded-mdplus border border-white/10 hover:bg-white/5"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </nav>

        {menuOpen && (
          <div id="mobile-navigation" className="lg:hidden border-t border-white/10 bg-background/95">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col">
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 border-b border-white/5 last:border-0 opacity-80 hover:opacity-100"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
        />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-primary/30 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-secondary/30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto grid items-center gap-10 px-6 pb-20 pt-32 md:pb-28 md:pt-40 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div>
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-4">Desenvolvimento de software para empresas</p>
          <h1 className="font-orbitron text-4xl md:text-5xl font-extrabold leading-tight">
            Sistemas sob medida para transformar <span className="text-primary">operações e ideias</span> em produtos digitais.
          </h1>
          <p className="mt-5 text-lg opacity-80 max-w-prose leading-relaxed">
            A MATTecnologia desenvolve SaaS, aplicações web e mobile, soluções desktop e integrações com foco na rotina real de cada negócio.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="px-6 py-3 bg-primary rounded-mdplus shadow-glow font-medium hover:brightness-110 transition"
            >
              Conhecer projetos
            </a>
            <a
              href="#estimativa"
              className="px-6 py-3 border border-secondary text-secondary rounded-mdplus hover:bg-secondary/10 transition"
            >
              Solicitar estimativa
            </a>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10">
            <span className="size-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.7)]" aria-hidden="true" />
            <span className="text-sm opacity-90"><strong>Agenda aberta</strong> para novos projetos</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {['Laravel', 'TypeScript', '.NET', 'React', 'Supabase', 'PostgreSQL', 'Docker', 'APIs'].map((technology) => (
              <span key={technology} className="px-3 py-1 rounded-mdplus border border-white/10 bg-white/5 text-sm">
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 text-xl">
            <a
              href="https://github.com/mattecno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="opacity-75 hover:opacity-100 transition"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://wa.me/5531995797235?text=Ol%C3%A1%2C%20vim%20pelo%20site%20MATTecnologia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="opacity-75 hover:opacity-100 transition"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Entrega de ponta a ponta</p>
          <h2 className="mt-3 text-2xl font-orbitron font-bold">Software pensado para a operação real</h2>
          <p className="mt-4 text-sm leading-relaxed opacity-70">
            Escopo claro, desenvolvimento próximo e uma base técnica preparada para evoluir sem depender de soluções improvisadas.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {['SaaS e sistemas web', 'Aplicações desktop', 'APIs e automações', 'MVPs e evolução de produtos'].map((service) => (
              <li key={service} className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/55 px-4 py-3 text-sm font-semibold">
                <span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(0,153,255,.65)]" aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.12em] opacity-60">
            <span>Projetos sob medida</span>
            <span>Web · Desktop · Mobile</span>
          </div>
        </aside>
      </div>
    </header>
  )
}
