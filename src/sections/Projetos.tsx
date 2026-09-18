import { PROJECTS, getProjectCasePath, isCaseStudyProject, type Project } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'

const HOME_SELECTED_IDS = ['brutona', 'vm-viagens', 'estoque-desktop', 'convites-saas']
const LANDING_SELECTED_IDS = ['estoque-desktop', 'pdv', 'producao']

function ProjectLinks({ project, location }: { project: Project; location: string }) {
  return (
    <div className="site-actions project-links">
      {isCaseStudyProject(project) && (
        <a
          className="site-text-link"
          href={getProjectCasePath(project)}
          onClick={() => trackProject(project.id, 'case', location)}
        >
          Conhecer o projeto <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.links.map((link) => (
        <a
          key={link.href}
          className="site-subtle-link"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackProject(project.id, getProjectDestination(link.href), location)}
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  )
}

function ProblemSolution({ project }: { project: Project }) {
  if (!isCaseStudyProject(project)) return null
  return (
    <div className="project-narrative">
      <div>
        <p className="site-caption">A necessidade</p>
        <p>{project.problem}</p>
      </div>
      <div>
        <p className="site-caption">O que foi desenvolvido</p>
        <p>{project.solution}</p>
      </div>
    </div>
  )
}

type ProjetosProps = {
  variant?: 'home' | 'landing'
}

export default function Projetos({ variant = 'home' }: ProjetosProps) {
  const selectedIds = variant === 'landing' ? LANDING_SELECTED_IDS : HOME_SELECTED_IDS
  const selected: Project[] = selectedIds.map((id) => PROJECTS.find((project) => project.id === id)!)
  const others =
    variant === 'home' ? PROJECTS.filter((project) => !selectedIds.includes(project.id)) : []
  const location = variant === 'landing' ? 'ads_projects' : 'commercial_projects'
  const imageLocation = variant === 'landing' ? 'ads_projects_image' : 'commercial_projects_image'

  return (
    <section id="portfolio" className="site-section site-container">
      <div className="section-heading">
        <p className="site-eyebrow">Trabalhos selecionados</p>
        <h2>Veja o que já foi desenvolvido.</h2>
        <p>Projetos reais, com necessidades e formatos diferentes. Cada um parte de um problema concreto.</p>
      </div>
      <div className="selected-projects">
        {selected.map((project, index) => (
          <article key={project.id} className={`commercial-project ${variant === 'landing' && index === 0 ? 'project-featured' : ''}`}>
            {project.featured && (
              <figure>
                <a
                  href={getProjectCasePath(project)}
                  onClick={() => trackProject(project.id, 'case', imageLocation)}
                  aria-label={`Conhecer ${project.title}`}
                >
                  <img
                    src={project.cover.src}
                    srcSet={project.cover.srcSet}
                    sizes="(min-width: 1024px) 600px, calc(100vw - 40px)"
                    width={1280}
                    height={720}
                    alt={project.cover.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <figcaption>{project.captureCaption ?? 'Captura demonstrativa com dados fictícios.'}</figcaption>
              </figure>
            )}
            <div className="project-story">
              <p className="site-eyebrow">
                {project.clientWork ? 'Trabalho para cliente · ' : ''}{project.category} <span aria-hidden="true">/</span> {project.status}
              </p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <ProblemSolution project={project} />
              {(project.clientWork || index === 0) && project.featured && (
                <ul className="project-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {!isCaseStudyProject(project) && 'details' in project && <p>{project.details}</p>}
              <p className="site-caption project-stack">{project.stack.join(' · ')}</p>
              <ProjectLinks project={project} location={location} />
            </div>
          </article>
        ))}
      </div>
      {others.length > 0 && (
        <div className="other-projects">
          <h3>Outros trabalhos</h3>
          {others.map((project) => (
            <article key={project.id}>
              <div>
                <p className="site-caption">
                  {project.category} · {project.status}
                </p>
                <h4>{project.title}</h4>
              </div>
              <div>
                <p>{project.summary}</p>
                <p className="site-caption project-stack">{project.stack.join(' · ')}</p>
                <ProjectLinks project={project} location={location} />
                {!isCaseStudyProject(project) && 'details' in project && (
                  <details>
                    <summary>Ver detalhes</summary>
                    <p>{project.details}</p>
                  </details>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
