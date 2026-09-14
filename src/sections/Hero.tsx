import WhatsAppCta from '../components/WhatsAppCta'
import { getProjectById } from '../data/projects'
import { WHATSAPP_ADS_MESSAGE, WHATSAPP_PROJECT_MESSAGE } from '../lib/contact'

const project = getProjectById('estoque-desktop')!

type HeroProps = {
  variant?: 'home' | 'landing'
}

export default function Hero({ variant = 'home' }: HeroProps) {
  const landing = variant === 'landing'
  return (
    <section id="top" className={`site-container commercial-hero ${landing ? 'is-copy-only' : ''}`}>
      <div>
        <p className="site-eyebrow">
          {landing
            ? 'MATTecnologia · Sistemas sob medida'
            : 'MATTecnologia · Desenvolvimento de software'}
        </p>
        <h1>
          {landing
            ? 'Desenvolvimento de sistemas sob medida em Belo Horizonte'
            : 'Sistemas sob medida para sua empresa'}
        </h1>
        <p className="site-lead">
          {landing
            ? 'Sistemas criados de acordo com a operação da sua empresa para reduzir trabalho manual, organizar informações e automatizar processos.'
            : 'Transforme planilhas, controles manuais e processos repetitivos em um sistema desenvolvido de acordo com a operação da sua empresa.'}
        </p>
        <p className="hero-note">
          Atendimento em Belo Horizonte e região • Desenvolvimento direto com o programador
        </p>
        <div className="site-actions">
          <WhatsAppCta
            location={landing ? 'ads_hero' : 'commercial_hero'}
            label="Falar sobre meu projeto"
            message={landing ? WHATSAPP_ADS_MESSAGE : WHATSAPP_PROJECT_MESSAGE}
            icon
          />
          <a className="site-text-link" href="#servicos">
            Ver soluções <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      {!landing && (
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
      )}
    </section>
  )
}
