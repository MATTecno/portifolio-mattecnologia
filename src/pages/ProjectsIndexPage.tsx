import MatHeader from '../components/editorial/MatHeader'
import MatFooter from '../components/editorial/MatFooter'
import { PROJECTS, getProjectCasePath, isCaseStudyProject } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'
import { HOME_PROJECTS } from '../data/home'

const selectedIds = HOME_PROJECTS.map(({ id }) => id)
const projects = [
  ...HOME_PROJECTS.map(({ project }) => project),
  ...PROJECTS.filter((project) => !selectedIds.includes(project.id)),
]

export default function ProjectsIndexPage() {
  return (
    <div className="commercial-theme mat-page">
      <MatHeader />
      <main id="conteudo">
        <div className="mat-wrap mat-internal-intro">
          <a className="mat-text-link" href="/">
            ← Voltar à MAT
          </a>
          <p className="mat-label">Arquivo / projetos</p>
          <h1>
            Problemas diferentes.
            <br />
            Soluções próprias.
          </h1>
          <p>
            Experiências digitais, sistemas e ferramentas. Conheça o contexto e as decisões por trás
            de cada projeto.
          </p>
        </div>
        <div className="mat-wrap project-index-list">
          {projects.map((project) => (
            <article className="project-index-row" key={project.id}>
              {project.featured ? (
                <a
                  href={getProjectCasePath(project)}
                  aria-label={`Conhecer ${project.title}`}
                  onClick={() => trackProject(project.id, 'case', 'project_index_image')}
                >
                  <img
                    {...project.cover}
                    sizes="(min-width: 1100px) 560px, (min-width: 640px) 40vw, calc(100vw - 40px)"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ) : (
                <div className="project-index-no-image" aria-label="Tecnologias utilizadas">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              <div>
                <p className="mat-label">
                  {project.category} / {project.status}
                </p>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                {!project.featured && <p>{project.details}</p>}
                {isCaseStudyProject(project) && (
                  <a
                    className="mat-text-link"
                    href={getProjectCasePath(project)}
                    onClick={() => trackProject(project.id, 'case', 'project_index')}
                  >
                    Conhecer projeto ↗
                  </a>
                )}
                {!isCaseStudyProject(project) &&
                  project.links.map((link) => (
                    <a
                      key={link.href}
                      className="mat-text-link"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackProject(project.id, getProjectDestination(link.href), 'project_index')
                      }
                    >
                      {link.label} ↗
                    </a>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <MatFooter />
    </div>
  )
}
