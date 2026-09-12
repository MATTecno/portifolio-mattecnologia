import { PROJECTS, getProjectCasePath, isCaseStudyProject, type Project } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'

const selectedIds = ['estoque-desktop', 'brutona', 'convites-saas']
const selected = selectedIds.map((id) => PROJECTS.find((project) => project.id === id)!)
const others: Project[] = PROJECTS.filter((project) => !selectedIds.includes(project.id))

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="site-actions project-links">
      {isCaseStudyProject(project) && (
        <a
          className="site-text-link"
          href={getProjectCasePath(project)}
          onClick={() => trackProject(project.id, 'case', 'commercial_projects')}
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
          onClick={() => trackProject(project.id, getProjectDestination(link.href), 'commercial_projects')}
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  )
}

export default function Projetos() {
  return (
    <section id="portfolio" className="site-section site-container">
      <div className="section-heading">
        <p className="site-eyebrow">Trabalhos selecionados</p>
        <h2>Veja o que já foi desenvolvido.</h2>
        <p>Projetos com necessidades, formatos e estágios diferentes. Cada um tem sua história.</p>
      </div>
      <div className="selected-projects">
        {selected.map((project, index) => (
          <article key={project.id} className={`commercial-project ${index === 0 ? 'project-featured' : ''}`}>
            {project.featured && (
              <figure>
                <a
                  href={getProjectCasePath(project)}
                  onClick={() => trackProject(project.id, 'case', 'commercial_projects_image')}
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
                <figcaption>Captura demonstrativa com dados fictícios.</figcaption>
              </figure>
            )}
            <div className="project-story">
              <p className="site-eyebrow">
                {project.category} <span aria-hidden="true">/</span> {project.status}
              </p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              {index === 0 && isCaseStudyProject(project) && <p>{project.solution}</p>}
              <ProjectLinks project={project} />
            </div>
          </article>
        ))}
      </div>
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
              <ProjectLinks project={project} />
              {!isCaseStudyProject(project) && (
                <details>
                  <summary>Ver detalhes</summary>
                  <p>{project.details}</p>
                  <p className="site-caption">{project.stack.join(', ')}</p>
                </details>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
