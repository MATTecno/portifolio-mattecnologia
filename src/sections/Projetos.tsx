import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowUpRightFromSquare, FaCheck, FaExpand } from 'react-icons/fa6'
import {
  FEATURED_PROJECTS,
  SUPPORTING_PROJECTS,
  type FeaturedProject,
  type SupportingProject,
} from '../data/projects'

export default function Projetos() {
  const [open, setOpen] = useState<SupportingProject | null>(null)
  const [preview, setPreview] = useState<FeaturedProject | null>(null)
  const [hoverPreview, setHoverPreview] = useState<FeaturedProject | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previewCloseButtonRef = useRef<HTMLButtonElement>(null)
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoverOpenTimer = () => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current)
      hoverOpenTimerRef.current = null
    }
  }

  const startHoverPreview = (project: FeaturedProject) => {
    clearHoverOpenTimer()
    hoverOpenTimerRef.current = setTimeout(() => {
      setHoverPreview(project)
      hoverOpenTimerRef.current = null
    }, 500)
  }

  const closeHoverPreview = () => {
    clearHoverOpenTimer()
    setHoverPreview(null)
  }

  const pinPreview = (project: FeaturedProject) => {
    clearHoverOpenTimer()
    setHoverPreview(null)
    setPreview(project)
  }

  useEffect(() => () => {
    clearHoverOpenTimer()
  }, [])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      previouslyFocused?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!preview) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreview(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    previewCloseButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      previouslyFocused?.focus()
    }
  }, [preview])

  return (
    <section id="portfolio" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-3xl mb-10">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">Projetos em destaque</p>
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold">Produtos construídos para problemas reais</h2>
        <p className="opacity-75 mt-4 leading-relaxed">
          Do SaaS à aplicação desktop, cada solução parte da rotina que precisa melhorar e termina em um produto pronto
          para ser usado e evoluído.
        </p>
      </div>

      <div className="space-y-8">
        {FEATURED_PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="relative isolate grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:grid-cols-2"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 hidden bg-cover bg-center lg:block"
              style={{ backgroundImage: `url("${project.cover}")` }}
            />
            <span aria-hidden="true" className="absolute inset-0 z-0 hidden bg-black/15 lg:block" />

            <button
              type="button"
              onClick={() => pinPreview(project)}
              onMouseEnter={() => startHoverPreview(project)}
              onMouseLeave={closeHoverPreview}
              aria-label={`Visualizar captura completa de ${project.title}`}
              className={`relative z-10 block aspect-video overflow-hidden bg-[#0b0b0f] text-left lg:aspect-auto lg:min-h-full lg:bg-transparent ${
                index % 2 === 1 ? 'lg:order-2' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-xl lg:hidden"
                style={{ backgroundImage: `url("${project.cover}")` }}
              />
              <span aria-hidden="true" className="absolute inset-0 bg-black/25 lg:hidden" />
              <img
                src={project.cover}
                alt={project.coverAlt}
                className="absolute inset-0 size-full object-contain transition duration-300 lg:opacity-0"
                loading="lazy"
                width={1280}
                height={720}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-12 text-sm opacity-90">
                <span>Ver captura completa</span>
                <FaExpand aria-hidden="true" />
              </span>
            </button>

            <div className="relative z-10 flex flex-col justify-center bg-[#15151a] p-6 md:p-8 lg:bg-[#15151a]/95 lg:p-10 lg:backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
                  {project.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 opacity-75 ring-1 ring-white/10">
                  {project.category}
                </span>
              </div>

              <h3 className="text-2xl font-orbitron font-bold">{project.title}</h3>
              <p className="mt-4 text-sm font-semibold text-primary">O desafio</p>
              <p className="mt-1 opacity-75 leading-relaxed">{project.problem}</p>
              <p className="mt-4 text-sm font-semibold text-secondary">A solução</p>
              <p className="mt-1 opacity-85 leading-relaxed">{project.solution}</p>

              <ul className="mt-5 space-y-2.5">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm opacity-80">
                    <FaCheck className="text-primary mt-1 shrink-0" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((technology) => (
                  <span key={technology} className="px-2.5 py-1 rounded-mdplus border border-white/10 text-xs bg-white/5">
                    {technology}
                  </span>
                ))}
              </div>

              {project.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        link.primary
                          ? 'inline-flex items-center gap-2 px-4 py-2.5 bg-primary rounded-mdplus shadow-glow text-sm font-medium hover:brightness-110 transition'
                          : 'inline-flex items-center gap-2 px-4 py-2.5 border border-white/15 rounded-mdplus text-sm hover:bg-white/5 transition'
                      }
                    >
                      {link.label}
                      <FaArrowUpRightFromSquare className="text-xs" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-orbitron font-bold">Outros trabalhos</h3>
        <p className="opacity-70 mt-2 mb-7">Soluções desenvolvidas para operações, integrações e vendas.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {SUPPORTING_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col hover:border-primary/35 hover:shadow-glow transition"
            >
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-primary">{project.status}</span>
                <span className="opacity-40" aria-hidden="true">•</span>
                <span className="opacity-60">{project.category}</span>
              </div>
              <h4 className="font-semibold text-lg mt-3">{project.title}</h4>
              <p className="text-sm opacity-70 mt-2 leading-relaxed grow">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((technology) => (
                  <span key={technology} className="px-2.5 py-1 rounded-mdplus border border-white/10 text-xs bg-white/5">
                    {technology}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setOpen(project)}
                className="mt-5 self-start px-3 py-2 border border-white/15 rounded-mdplus text-sm hover:bg-white/5 transition"
              >
                Ver detalhes
              </button>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          aria-describedby="project-dialog-details"
          className="fixed inset-0 z-50 grid place-items-center p-6"
          onClick={() => setOpen(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative z-10 max-w-2xl w-full rounded-2xl bg-[#13131a] ring-1 ring-white/10 p-6 md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-primary text-sm mb-1">{open.category}</p>
                <h3 id="project-dialog-title" className="text-xl font-semibold">{open.title}</h3>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setOpen(null)}
                className="px-3 py-1 rounded-mdplus border border-white/15 hover:bg-white/5"
                aria-label="Fechar detalhes do projeto"
              >
                Fechar
              </button>
            </div>
            <p id="project-dialog-details" className="opacity-80 mt-4 leading-relaxed">{open.details}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {open.stack.map((technology) => (
                <span key={technology} className="px-2.5 py-1 rounded-mdplus border border-white/10 text-xs bg-white/5">
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-preview-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col rounded-2xl border border-white/15 bg-[#101016] p-3 shadow-2xl md:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <h3 id="project-preview-title" className="truncate text-sm font-semibold md:text-base">
                {preview.title}
              </h3>
              <button
                ref={previewCloseButtonRef}
                type="button"
                onClick={() => setPreview(null)}
                className="shrink-0 rounded-mdplus border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
                aria-label="Fechar visualização da imagem"
              >
                Fechar
              </button>
            </div>
            <img
              src={preview.cover}
              alt={preview.coverAlt}
              className="min-h-0 w-full flex-1 rounded-xl object-contain"
              width={1280}
              height={720}
            />
          </div>
        </div>
      )}

      {hoverPreview && createPortal(
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1000] hidden place-items-center bg-black/85 p-8 backdrop-blur-sm md:grid"
        >
          <div className="flex max-h-full max-w-6xl flex-col gap-3 rounded-2xl border border-white/15 bg-[#101016] p-3 shadow-2xl">
            <img
              src={hoverPreview.cover}
              alt=""
              className="max-h-[calc(100vh-8rem)] w-auto max-w-full rounded-xl object-contain"
              width={1280}
              height={720}
            />
            <span className="px-2 pb-1 text-center text-sm text-white/75">
              Clique para manter a imagem aberta
            </span>
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}
