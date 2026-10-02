import { useEffect, useRef } from 'react'
import { PROJECT_THEMES, projectThemeStyles, type ProjectThemeId } from '../../data/projectThemes'
import { HOME_PROJECTS } from '../../data/home'
import { getProjectCasePath } from '../../data/projects'
import { trackProject, trackProjectView } from '../../lib/analytics'

export default function SelectedProjects() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackProjectView((entry.target as HTMLElement).dataset.projectId!)
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.45 }
    )
    root.current
      ?.querySelectorAll('[data-project-id]')
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return (
    <section className="mat-projects" id="portfolio" ref={root}>
      <div className="mat-wrap mat-section project-introduction">
        <p className="mat-label">03 / projetos selecionados</p>
        <h2>
          Alguns projetos que
          <br />
          já saíram do papel.
        </h2>
        <p>Projetos diferentes, construídos em torno de problemas diferentes.</p>
      </div>
      {HOME_PROJECTS.map(({ project, name, description, tags }, index) => (
        <article
          key={project.id}
          className="project-scene"
          data-progress="project"
          data-project-id={project.id}
          style={projectThemeStyles(PROJECT_THEMES[project.id as ProjectThemeId])}
        >
          <div className="project-sticky mat-wrap">
            <div className="project-meta mat-label">
              <span>0{index + 1} / projeto selecionado</span>
              <span>{tags.join(' / ')}</span>
            </div>
            <a
              className="project-media"
              data-pointer
              href={getProjectCasePath(project)}
              aria-label={`Conhecer projeto ${name}`}
              onClick={() => trackProject(project.id, 'case', 'commercial_projects_image')}
            >
              <img
                {...project.cover}
                sizes="(min-width: 1600px) 1456px, (min-width: 768px) calc(100vw - 112px), calc(100vw - 40px)"
                loading="lazy"
                decoding="async"
              />
              <span className="project-cursor" aria-hidden="true">
                Ver case ↗
              </span>
            </a>
            <div className="project-caption">
              <h3>
                {name}
                <span aria-hidden="true">.</span>
              </h3>
              <p>{description}</p>
              <a
                className="mat-text-link"
                href={getProjectCasePath(project)}
                onClick={() => trackProject(project.id, 'case', 'commercial_projects')}
              >
                Conhecer projeto ↗
              </a>
            </div>
          </div>
        </article>
      ))}
      <div className="mat-wrap projects-end" id="outros-projetos">
        <span className="mat-label">Outros problemas. Outras soluções.</span>
        <a className="mat-text-link" href="/projetos/">
          Explorar todos os projetos ↗
        </a>
      </div>
    </section>
  )
}
