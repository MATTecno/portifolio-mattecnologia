import WhatsAppCta from '../components/WhatsAppCta'
import { getProjectById, getProjectCasePath, isCaseStudyProject } from '../data/projects'
import { trackProject } from '../lib/analytics'
import { WHATSAPP_ADS_MESSAGE, WHATSAPP_LANDING_MESSAGE, WHATSAPP_PROJECT_MESSAGE } from '../lib/contact'

const clientProjects = ['brutona', 'vm-viagens'].map((id) => getProjectById(id)!)

type HeroProps = { variant?: 'home' | 'landing' }

export default function Hero({ variant = 'home' }: HeroProps) {
  const landing = variant === 'landing'
  return (
    <section id="top" className={`site-container commercial-hero ${landing ? 'is-copy-only' : 'home-hero'}`}>
      <div className="hero-intro">
        <p className="site-eyebrow">MATTecnologia · {landing ? 'Sistemas sob medida' : 'Desenvolvimento de software'}</p>
        <h1>{landing ? 'Desenvolvimento de sistemas sob medida em Belo Horizonte' : 'Landing pages, sites e sistemas sob medida para sua empresa.'}</h1>
        <p className="site-lead">
          {landing
            ? 'Sistemas criados de acordo com a operação da sua empresa para reduzir trabalho manual, organizar informações e automatizar processos.'
            : 'Apresente seus serviços, facilite o contato com seus clientes e organize sua operação. Desenvolvimento direto com quem faz seu projeto.'}
        </p>
        <p className="hero-note">Atendimento em Belo Horizonte e região • Desenvolvimento direto com o programador</p>
        {landing ? (
          <div className="site-actions">
            <WhatsAppCta location="ads_hero" label="Falar sobre meu projeto" message={WHATSAPP_ADS_MESSAGE} icon />
            <a className="site-text-link" href="#servicos">Ver soluções <span aria-hidden="true">↓</span></a>
          </div>
        ) : (
          <>
            <div className="hero-offers">
              <article>
                <h2>Landing pages e sites</h2>
                <p>Apresente sua empresa e seus serviços com um caminho claro para receber contatos.</p>
                <WhatsAppCta location="commercial_hero_landing" label="Quero uma landing page ou site" message={WHATSAPP_LANDING_MESSAGE} icon />
              </article>
              <article>
                <h2>Sistemas sob medida</h2>
                <p>Organize informações, substitua planilhas e automatize processos da sua operação.</p>
                <WhatsAppCta location="commercial_hero_system" label="Quero um sistema" message={WHATSAPP_PROJECT_MESSAGE} icon />
              </article>
            </div>
            <div className="site-actions">
              <a className="site-text-link" href="#portfolio">Ver trabalhos realizados <span aria-hidden="true">↓</span></a>
              <p className="site-caption">Orçamento personalizado conforme o escopo.</p>
            </div>
          </>
        )}
      </div>
      {!landing && (
        <div className="hero-client-projects" aria-label="Sites desenvolvidos para clientes">
          {clientProjects.map((project) => project.featured && isCaseStudyProject(project) && (
            <figure className="hero-project" key={project.id}>
              <a href={getProjectCasePath(project)} aria-label={`Conhecer ${project.title}`}
                onClick={() => trackProject(project.id, 'case', 'commercial_hero_project')}>
                <img src={project.cover.src} srcSet={project.cover.srcSet}
                  sizes="(min-width: 1100px) 430px, (min-width: 640px) 45vw, calc(100vw - 40px)"
                  width={1280} height={720} alt={project.cover.alt} fetchPriority={project.id === 'brutona' ? 'high' : 'auto'} />
              </a>
              <figcaption><span>{project.id === 'brutona' ? 'Brutona' : 'VM Viagens'}</span><span>Trabalho para cliente</span></figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
