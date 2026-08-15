import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import {
  FaBars,
  FaBriefcase,
  FaCode,
  FaDownload,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa'
import {
  FEATURED_RECRUITER_PROJECTS,
  RECRUITER_PROFILE,
  SECONDARY_RECRUITER_PROJECTS,
} from '../data/recruiter'

const RESUME_PATH = '/Marcelo-Diogo-Teixeira-Curriculo.pdf'

const NAVIGATION = [
  ['Resumo', '#resumo'],
  ['Experiência', '#experiencia'],
  ['Projetos', '#projetos'],
  ['Competências', '#competencias'],
  ['Formação', '#formacao'],
] as const

export default function RecruiterPage() {
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
    <div className="recruiter-page min-h-screen bg-[#f7f8fa] text-slate-900">
      <header id="top" className="border-b border-slate-200 bg-white">
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-6" aria-label="Recrutadores">
            <a href="#top" className="text-base font-bold tracking-tight text-slate-950" aria-label="Ir para o início">
              Marcelo Diogo Teixeira
            </a>

            <div className="hidden items-center gap-5 text-sm text-slate-600 lg:flex">
              {NAVIGATION.map(([label, href]) => (
                <a key={href} href={href} className="transition hover:text-blue-700">
                  {label}
                </a>
              ))}
              <a
                href={RESUME_PATH}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                <FaDownload aria-hidden="true" />
                Currículo
              </a>
            </div>

            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 text-slate-800 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="recruiter-mobile-navigation"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </nav>

          {menuOpen && (
            <div id="recruiter-mobile-navigation" className="border-t border-slate-200 bg-white px-5 py-3 lg:hidden">
              <div className="mx-auto flex max-w-6xl flex-col">
                {NAVIGATION.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-slate-100 py-3 text-sm text-slate-700"
                  >
                    {label}
                  </a>
                ))}
                <a
                  href={RESUME_PATH}
                  download
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  <FaDownload aria-hidden="true" />
                  Baixar currículo
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-6 md:py-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Perfil profissional</p>
            <p className="text-lg font-semibold text-slate-600">{RECRUITER_PROFILE.name}</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              {RECRUITER_PROFILE.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Construo e evoluo sistemas corporativos, aplicações web, APIs e produtos digitais conectando decisões
              técnicas às necessidades do negócio.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={RESUME_PATH}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800"
              >
                <FaDownload aria-hidden="true" />
                Baixar currículo
              </a>
              <a
                href={RECRUITER_PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-blue-400 hover:text-blue-700"
              >
                <FaLinkedin aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href={`mailto:${RECRUITER_PROFILE.email}?subject=Oportunidade%20profissional%20para%20Marcelo%20Diogo`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-blue-400 hover:text-blue-700"
              >
                <FaEnvelope aria-hidden="true" />
                Entrar em contato
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <img
              src="/marcelo-profissional.webp"
              alt="Marcelo Diogo Teixeira"
              className="mx-auto aspect-square w-full max-w-[210px] rounded-2xl object-cover ring-1 ring-slate-200"
              loading="eager"
              fetchPriority="high"
              width={900}
              height={900}
            />
            <h2 className="mt-6 border-t border-slate-200 pt-5 font-bold text-slate-950">Disponibilidade</h2>
            <div className="mt-4 flex items-start gap-3 text-sm text-slate-600">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
              <span>{RECRUITER_PROFILE.location}</span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Modalidades de trabalho">
              {RECRUITER_PROFILE.availability.map((item) => (
                <li key={item} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <p><strong className="text-slate-900">Atuação profissional:</strong> desde 2024</p>
              <p className="mt-2"><strong className="text-slate-900">Foco atual:</strong> PHP, TypeScript, Vue.js, Oracle e PostgreSQL</p>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section id="resumo" className="scroll-mt-24 border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:px-6 md:py-20 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Resumo</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Experiência aplicada ao produto</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600">
              {RECRUITER_PROFILE.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="flex flex-wrap gap-2 pt-2">
                {['PHP', 'TypeScript', 'Vue.js', 'Oracle', 'PostgreSQL', 'APIs REST', 'Docker'].map((skill) => (
                  <span key={skill} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experiencia" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Experiência profissional</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Evolução em sistemas corporativos</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Atuação do desenvolvimento à sustentação, passando por requisitos, integrações, dados e validação das entregas.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {RECRUITER_PROFILE.experience.map((experience) => (
              <article key={experience.id} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[230px_1fr] md:p-8">
                <div>
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FaBriefcase aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">{experience.role}</h3>
                  <p className="mt-1 font-semibold text-blue-700">{experience.company}</p>
                  <p className="mt-2 text-sm text-slate-500">{experience.period}</p>
                </div>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600 md:text-base">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projetos" className="scroll-mt-24 border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Projetos</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Prática além do ambiente corporativo</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Produtos próprios que demonstram arquitetura, integração, experiência de uso e entrega em diferentes plataformas.
              </p>
            </div>

            <div className="mt-10 grid gap-7 lg:grid-cols-2">
              {FEATURED_RECRUITER_PROJECTS.map((project) => (
                <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {project.cover ? (
                    <div className="aspect-video border-b border-slate-200 bg-slate-100">
                      <img
                        src={project.cover}
                        alt={project.coverAlt}
                        className="size-full object-contain"
                        loading="lazy"
                        width={1280}
                        height={720}
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center border-b border-slate-200 bg-gradient-to-br from-slate-950 to-blue-900 text-white">
                      <div className="text-center">
                        <FaCode className="mx-auto text-4xl text-blue-300" aria-hidden="true" />
                        <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-blue-100">Projeto full stack</p>
                        <p className="mt-2 text-2xl font-bold">React + Laravel</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6 md:p-7">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{project.status}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{project.category}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{project.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-600">{project.summary}</p>
                    <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-slate-600">
                      {project.contributions.map((contribution) => (
                        <li key={contribution} className="flex gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                          <span>{contribution}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((technology) => (
                        <span key={technology} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
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
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-700"
                          >
                            {link.label}
                            <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <h3 className="mt-14 text-2xl font-bold text-slate-950">Outros projetos</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {SECONDARY_RECRUITER_PROJECTS.map((project) => (
                <article key={project.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{project.category}</p>
                  <h4 className="mt-3 text-lg font-bold text-slate-950">{project.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((technology) => (
                      <span key={technology} className="rounded bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        {technology}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="competencias" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Competências técnicas</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Stack e práticas de desenvolvimento</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECRUITER_PROFILE.skills.map((group) => (
              <article key={group.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-950">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-sm text-slate-700">{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="formacao" className="scroll-mt-24 border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:px-6 md:py-20 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-6 lg:col-span-1">
              <FaGraduationCap className="text-2xl text-blue-700" aria-hidden="true" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Formação</p>
              <h2 className="mt-3 text-xl font-bold text-slate-950">{RECRUITER_PROFILE.education.course}</h2>
              <p className="mt-2 text-slate-600">{RECRUITER_PROFILE.education.institution}</p>
              <p className="mt-1 text-sm text-slate-500">{RECRUITER_PROFILE.education.period}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Certificações e cursos</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
                {RECRUITER_PROFILE.certifications.map((certification) => (
                  <li key={certification} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                    <span>{certification}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Idiomas</p>
              <div className="mt-5 space-y-5">
                {RECRUITER_PROFILE.languages.map((language) => (
                  <div key={language.language}>
                    <h3 className="font-bold text-slate-950">{language.language}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{language.level}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="contato" className="scroll-mt-24 bg-slate-950 text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-6 md:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">Contato</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Vamos conversar sobre a oportunidade</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
              Estou aberto a posições Full Stack em formato remoto, híbrido ou presencial em Belo Horizonte.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${RECRUITER_PROFILE.email}?subject=Oportunidade%20profissional%20para%20Marcelo%20Diogo`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                <FaEnvelope aria-hidden="true" />
                {RECRUITER_PROFILE.email}
              </a>
              <a
                href={RECRUITER_PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-3 font-semibold transition hover:border-blue-400 hover:text-blue-300"
              >
                <FaGithub aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-6xl px-5 py-7 text-center text-sm md:px-6">
          <p>© {new Date().getFullYear()} Marcelo Diogo Teixeira</p>
        </div>
      </footer>

      <Analytics />
    </div>
  )
}
