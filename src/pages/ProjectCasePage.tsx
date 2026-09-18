import type { CaseStudyProject } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'
import SignatureDemo from '../components/SignatureDemo'
import CommercialHeader from '../components/CommercialHeader'
import Rodape from '../sections/Rodape'

export default function ProjectCasePage({ project }: { project: CaseStudyProject }) {
  return (
    <div className="commercial-theme case-page">
      <CommercialHeader />
      <main id="case-content">
        <section className="case-intro">
          <div className="site-container">
            <a href="/#portfolio" className="site-text-link">
              ← Voltar aos projetos
            </a>
            <p className="site-eyebrow">
              {project.category} · {project.status}
            </p>
            <h1>{project.title}</h1>
            <p className="site-lead">{project.summary}</p>
            <div className="site-actions">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.primary ? 'site-button' : 'site-button site-button-secondary'}
                  onClick={() =>
                    trackProject(project.id, getProjectDestination(link.href), 'project_case_hero')
                  }
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </section>
        <div className="site-container site-section">
          <figure className="case-visual">
            {project.featured ? (
              <img
                src={project.cover.src}
                srcSet={project.cover.srcSet}
                sizes="(min-width: 1200px) 1180px, calc(100vw - 40px)"
                width={1280}
                height={720}
                alt={project.cover.alt}
                fetchPriority="high"
              />
            ) : (
              <div
                className="case-diagram"
                role="img"
                aria-label="Arquitetura do PDV: interface React conectada à API Laravel com JWT e ao PostgreSQL"
              >
                <span>Interface React</span>
                <span>API Laravel + JWT</span>
                <span>PostgreSQL</span>
              </div>
            )}
            <figcaption>
              {project.featured
                ? (project.captureCaption ?? 'Captura demonstrativa com dados fictícios.')
                : 'Projeto privado apresentado pela estrutura técnica, sem telas ou dados internos.'}
            </figcaption>
          </figure>
          <div className="case-narrative">
            <section>
              <p className="site-eyebrow">O problema</p>
              <h2>O que precisava ser resolvido</h2>
              <p>{project.problem}</p>
            </section>
            <section>
              <p className="site-eyebrow">A solução</p>
              <h2>O que foi desenvolvido</h2>
              <p>{project.solution}</p>
            </section>
          </div>
          {project.id === 'zd-signature-input' && <SignatureDemo location="project_case_demo" />}
          <section className="case-section" aria-labelledby="participacao-title">
            <h2 id="participacao-title">Minha participação</h2>
            <p>{project.caseStudy.role}</p>
            <ul className="case-list">
              {project.caseStudy.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="case-section" aria-labelledby="architecture-title">
            <h2 id="architecture-title">Como o sistema está organizado</h2>
            <ul className="case-architecture">
              {project.caseStudy.architecture.map((layer) => (
                <li key={layer.label}>
                  <h3>{layer.label}</h3>
                  <p>{layer.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="case-section" aria-labelledby="decisions-title">
            <h2 id="decisions-title">Decisões de desenvolvimento</h2>
            <ul className="case-list">
              {project.caseStudy.decisions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="case-section">
            <h2>Tecnologias utilizadas</h2>
            <div className="case-tags">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>
        </div>
        <section className="case-contact">
          <div className="site-container">
            <div>
              <p className="site-eyebrow">Seu projeto</p>
              <h2>Tem uma necessidade parecida?</h2>
            </div>
            <div className="site-actions">
              <a className="site-button" href={`/?projeto=${encodeURIComponent(project.id)}#contato`}>
                Quero uma solução parecida
              </a>
              <a className="site-text-link" href="/#portfolio">
                Ver outros projetos
              </a>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </div>
  )
}
