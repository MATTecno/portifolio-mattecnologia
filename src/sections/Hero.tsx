import { getProjectById } from '../data/projects'

const project = getProjectById('estoque-desktop')!

export default function Hero() {
  return (
    <section id="top" className="site-container commercial-hero">
      <div>
        <p className="site-eyebrow">MATTecnologia · Desenvolvimento de software</p>
        <h1>Sistemas para organizar o trabalho da sua empresa.</h1>
        <p className="site-lead">
          Desenvolvimento de sistemas web, aplicações desktop e automações. Você conversa diretamente com
          Marcelo, responsável pela MATTecnologia e pelo desenvolvimento do projeto.
        </p>
        <div className="site-actions">
          <a className="site-button" href="#estimativa">
            Conversar sobre meu projeto
          </a>
          <a className="site-text-link" href="#portfolio">
            Ver projetos <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <figure className="hero-project">
        {project.featured && (
          <a href="/projetos/estoque/" aria-label="Conhecer o projeto de Estoque Desktop">
            <img
              src={project.cover.src}
              srcSet={project.cover.srcSet}
              sizes="(min-width: 1024px) 560px, calc(100vw - 40px)"
              width={1280}
              height={720}
              alt={project.cover.alt}
              fetchPriority="high"
            />
          </a>
        )}
        <figcaption>
          <span>Estoque Desktop</span>
          <span>{project.status}</span>
        </figcaption>
        <p className="site-caption">Captura demonstrativa com dados fictícios.</p>
      </figure>
    </section>
  )
}
