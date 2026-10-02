import type { CaseStudyProject } from '../data/projects'
import { getProjectDestination, trackProject } from '../lib/analytics'
import { projectWhatsAppMessage } from '../lib/contact'
import SignatureDemo from '../components/SignatureDemo'
import MatHeader from '../components/editorial/MatHeader'
import MatFooter from '../components/editorial/MatFooter'
import WhatsAppCta from '../components/WhatsAppCta'

export default function ProjectCasePage({ project }: { project: CaseStudyProject }) {
  return (
    <div className="commercial-theme mat-page mat-case-page">
      <MatHeader />
      <main id="conteudo">
        <section className="mat-wrap mat-internal-intro" id="case-content">
          <a href="/projetos/" className="mat-text-link">
            ← Todos os projetos
          </a>
          <p className="mat-label">
            {project.category} / {project.status}
          </p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="mat-case-links">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={link.primary ? 'mat-button' : 'mat-text-link'}
                onClick={() =>
                  trackProject(project.id, getProjectDestination(link.href), 'project_case_hero')
                }
              >
                {getProjectDestination(link.href) === 'live' ? 'Visitar projeto' : link.label} ↗
              </a>
            ))}
          </div>
        </section>
        <div className="mat-wrap">
          <figure className="mat-case-figure">
            {project.featured ? (
              <img
                {...project.cover}
                sizes="(min-width: 1600px) 1456px, calc(100vw - 80px)"
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
                ? project.captureCaption ?? 'Captura demonstrativa com dados fictícios.'
                : 'Projeto privado apresentado pela estrutura técnica, sem telas ou dados internos.'}
            </figcaption>
          </figure>
          {project.id === 'apublicitaria' && (
            <p className="mat-case-note">
              A interface apresentada é real. Os materiais dos trabalhos de Lavínia e o endereço
              público do site ainda estão em preparação.
            </p>
          )}
          <div className="mat-case-summary">
            <section>
              <p className="mat-label">01 / contexto</p>
              <h2>O problema</h2>
              <p>{project.problem}</p>
            </section>
            <section>
              <p className="mat-label">02 / construção</p>
              <h2>A solução</h2>
              <p>{project.solution}</p>
            </section>
          </div>
          {project.featured && (
            <section className="mat-case-details">
              <h2>O que a experiência reúne</h2>
              <ul>
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {project.id === 'zd-signature-input' && <SignatureDemo location="project_case_demo" />}
          <section className="mat-case-details">
            <h2 id="participacao-title">Nosso trabalho</h2>
            <div>
              <p>{project.caseStudy.role}</p>
              <ul>
                {project.caseStudy.contributions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mat-case-details">
            <h2 id="architecture-title">Como foi organizado</h2>
            <ul>
              {project.caseStudy.architecture.map((layer) => (
                <li key={layer.label}>
                  <strong>{layer.label}</strong>
                  <p>{layer.detail}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="mat-case-details">
            <h2 id="decisions-title">Decisões de projeto</h2>
            <ul>
              {project.caseStudy.decisions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="mat-case-details">
            <h2>Tecnologias utilizadas</h2>
            <div className="mat-case-stack">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>
        </div>
        <section className="mat-final">
          <div className="mat-wrap">
            <p className="mat-label">Seu projeto / próximo passo</p>
            <h2>Tem uma necessidade parecida?</h2>
            <div className="mat-actions">
              <WhatsAppCta
                className="mat-button"
                location="project_case_contact"
                label="Conversar sobre meu projeto ↗"
                message={projectWhatsAppMessage(project.title)}
              />
              <a
                className="mat-text-link"
                href={`/contato/?projeto=${encodeURIComponent(project.id)}#contato`}
              >
                Enviar um resumo pelo formulário ↗
              </a>
              <a className="mat-text-link" href="/projetos/">
                Ver outros projetos ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <MatFooter />
    </div>
  )
}
