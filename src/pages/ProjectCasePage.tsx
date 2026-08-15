import { FaArrowLeft, FaArrowUpRightFromSquare, FaCheck } from 'react-icons/fa6'
import type { CaseStudyProject } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'

type ProjectCasePageProps = {
  project: CaseStudyProject
}

function ProjectVisual({ project }: ProjectCasePageProps) {
  if (project.featured) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-2xl">
        <img
          src={project.cover.src}
          srcSet={project.cover.srcSet}
          sizes="(min-width: 1200px) 1120px, calc(100vw - 32px)"
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full object-contain"
        />
        <figcaption className="border-t border-white/10 px-5 py-3 text-sm text-white/60">
          Captura demonstrativa com dados fictícios.
        </figcaption>
      </figure>
    )
  }

  return (
    <div
      role="img"
      aria-label="Arquitetura simplificada do Sistema PDV Full Stack"
      className="rounded-2xl border border-white/10 bg-[#111118] p-6 shadow-2xl md:p-10"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">Visão técnica</p>
      <div className="mt-7 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {['Interface React', 'API Laravel + JWT', 'PostgreSQL'].map((layer, index) => (
          <div key={layer} className="contents">
            <div className="grid min-h-28 place-items-center rounded-xl border border-white/10 bg-white/5 p-5 text-center font-semibold">
              {layer}
            </div>
            {index < 2 && (
              <span aria-hidden="true" className="grid place-items-center text-2xl text-primary max-md:rotate-90">
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-7 text-center text-sm leading-relaxed text-white/60">
        Projeto privado apresentado por sua estrutura técnica, sem telas ou dados internos.
      </p>
    </div>
  )
}

export default function ProjectCasePage({ project }: ProjectCasePageProps) {
  return (
    <div className="min-h-screen bg-background text-ice">
      <header className="border-b border-white/10 bg-background/95">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Case do projeto">
          <a href="/" className="font-orbitron text-lg tracking-wide" aria-label="MATTecnologia — voltar ao portfólio">
            <span className="text-ice">MAT</span><span className="text-primary">Tecnologia</span>
          </a>
          <a href="/recrutadores/" className="text-sm text-white/70 transition hover:text-white focus:text-white">
            Perfil profissional
          </a>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-primary/20 blur-[110px]" />
          <div aria-hidden="true" className="absolute -bottom-36 -left-28 -z-10 size-96 rounded-full bg-secondary/15 blur-[110px]" />
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <a href="/#portfolio" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white focus:text-white">
              <FaArrowLeft aria-hidden="true" />
              Voltar aos projetos
            </a>

            <div className="mt-10 max-w-4xl">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-primary ring-1 ring-primary/30">{project.status}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-white/70 ring-1 ring-white/10">{project.category}</span>
              </div>
              <h1 className="mt-5 font-orbitron text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">{project.summary}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackProject(
                      project.id,
                      getProjectDestination(link.href),
                      'project_case_hero',
                    )}
                    className={link.primary
                      ? 'inline-flex items-center gap-2 rounded-mdplus bg-primary px-5 py-3 font-semibold shadow-glow transition hover:brightness-110'
                      : 'inline-flex items-center gap-2 rounded-mdplus border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5'}
                  >
                    {link.label}
                    <FaArrowUpRightFromSquare aria-hidden="true" className="text-xs" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <ProjectVisual project={project} />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <p className="text-sm font-semibold text-primary">O desafio</p>
              <h2 className="mt-3 font-orbitron text-2xl font-bold">O problema de partida</h2>
              <p className="mt-4 leading-relaxed text-white/70">{project.problem}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <p className="text-sm font-semibold text-secondary">A solução</p>
              <h2 className="mt-3 font-orbitron text-2xl font-bold">Como o produto responde</h2>
              <p className="mt-4 leading-relaxed text-white/75">{project.solution}</p>
            </article>
          </div>

          <section className="mt-16" aria-labelledby="participacao-title">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Participação no projeto</p>
            <h2 id="participacao-title" className="mt-3 font-orbitron text-3xl font-bold">Responsabilidade técnica</h2>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-white/75">{project.caseStudy.role}</p>
            <ul className="mt-7 grid gap-4 md:grid-cols-3">
              {project.caseStudy.contributions.map((contribution) => (
                <li key={contribution} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-5 leading-relaxed text-white/75">
                  <FaCheck aria-hidden="true" className="mt-1 shrink-0 text-primary" />
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16" aria-labelledby="architecture-title">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Arquitetura simplificada</p>
            <h2 id="architecture-title" className="mt-3 font-orbitron text-3xl font-bold">Como as partes se conectam</h2>
            <ol className="mt-8 grid gap-4 lg:grid-cols-4">
              {project.caseStudy.architecture.map((step, index) => (
                <li key={step.label} className="relative rounded-xl border border-white/10 bg-[#13131a] p-5">
                  <span className="text-xs font-semibold text-primary">ETAPA {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-semibold">{step.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <section aria-labelledby="decisions-title">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Decisões do projeto</p>
              <h2 id="decisions-title" className="mt-3 font-orbitron text-3xl font-bold">Escolhas guiadas pelo uso</h2>
              <ul className="mt-7 space-y-3">
                {project.caseStudy.decisions.map((decision) => (
                  <li key={decision} className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-4 leading-relaxed text-white/75">
                    {decision}
                  </li>
                ))}
              </ul>
            </section>

            <aside className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tecnologias</p>
              <h2 className="mt-3 font-orbitron text-2xl font-bold">Stack utilizada</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((technology) => (
                  <span key={technology} className="rounded-mdplus border border-white/10 bg-background/55 px-3 py-2 text-sm">
                    {technology}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.025]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-primary">Próximo passo</p>
              <h2 className="mt-2 font-orbitron text-2xl font-bold">Conheça os outros projetos</h2>
            </div>
            <a href="/#portfolio" className="inline-flex items-center gap-2 rounded-mdplus border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5">
              Ver portfólio completo
              <FaArrowUpRightFromSquare aria-hidden="true" className="text-xs" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-7 text-center text-sm text-white/50 sm:px-6">
        <p>MATTecnologia · Sistemas e produtos digitais sob medida</p>
        <a href="/privacidade/" className="mt-2 inline-block underline-offset-4 hover:underline focus:underline">
          Privacidade
        </a>
      </footer>
    </div>
  )
}
