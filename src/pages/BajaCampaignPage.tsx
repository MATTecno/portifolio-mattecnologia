import CommercialHeader from '../components/CommercialHeader'
import WhatsAppCta from '../components/WhatsAppCta'
import { FEATURED_PROJECTS, getProjectCasePath } from '../data/projects'
import {
  trackBajaWhatsappClick,
  trackProject,
  type BajaCtaPosition,
} from '../lib/analytics'
import { WHATSAPP_BAJA_MESSAGE } from '../lib/contact'
import Rodape from '../sections/Rodape'

const BAJA_NAVIGATION = [
  ['Baja x sistema', 'comparacao'],
  ['Soluções', 'servicos'],
  ['Projetos', 'portfolio'],
] as const

const COMPARISONS = [
  {
    title: 'O Baja',
    badge: 'Protótipo com história',
    items: [
      'Foi feito para uma necessidade específica.',
      'Foi adaptado.',
      'Foi melhorado com o tempo.',
      'Tem personalidade.',
      'Às vezes quebra. 😅',
    ],
  },
  {
    title: 'Um bom sistema',
    badge: 'Sob medida para operar',
    items: [
      'É criado para a realidade da sua empresa.',
      'Se adapta ao seu processo.',
      'Evolui junto com o negócio.',
      'Resolve problemas específicos.',
      'Preferencialmente quebra menos que o Baja.',
    ],
  },
] as const

const SERVICES = [
  {
    number: '01',
    title: 'Sistema interno',
    text: 'Ferramentas para organizar processos, clientes, equipes, estoque, serviços e outras rotinas.',
  },
  {
    number: '02',
    title: 'Automação',
    text: 'Tarefas repetitivas e processos manuais transformados em fluxos mais rápidos e confiáveis.',
  },
  {
    number: '03',
    title: 'Plataforma web',
    text: 'Sistemas acessíveis pelo navegador e construídos conforme a operação do negócio.',
  },
  {
    number: '04',
    title: 'Sites e landing pages',
    text: 'Presença profissional para apresentar sua empresa, captar clientes e gerar conversas.',
  },
] as const

const BAJA_PROJECT_IDS = ['brutona', 'estoque-desktop', 'convites-saas'] as const
const BAJA_PROJECTS = BAJA_PROJECT_IDS.map((id) => (
  FEATURED_PROJECTS.find((project) => project.id === id)
)).filter((project) => project !== undefined)

type CampaignCtaProps = {
  position: BajaCtaPosition
  label: string
  className?: string
  icon?: boolean
}

function CampaignCta({
  position,
  label,
  className,
  icon = true,
}: CampaignCtaProps) {
  return (
    <WhatsAppCta
      location={`baja_${position}`}
      label={label}
      className={className}
      message={WHATSAPP_BAJA_MESSAGE}
      icon={icon}
      onClick={() => trackBajaWhatsappClick(position)}
    />
  )
}

function BajaPhoto() {
  return (
    <figure className="baja-photo">
      <picture>
        <source
          type="image/webp"
          srcSet="/baja/baja-480.webp 480w, /baja/baja-720.webp 720w, /baja/baja-900.webp 900w"
          sizes="(min-width: 1024px) 540px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
        />
        <img
          src="/baja/baja-900.webp"
          width={900}
          height={1600}
          alt="Baja branco da MAT Tecnologia em uma estrada de terra, visto de frente"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="baja-photo-topline">
        <span>O BAJA DE VERDADE</span>
        <span>BOX 49</span>
      </div>
      <figcaption className="baja-photo-caption">
        <strong>BAJA / MAT TECNOLOGIA</strong>
        <span>Feito para terreno difícil. Igual a alguns processos.</span>
      </figcaption>
    </figure>
  )
}

export default function BajaCampaignPage() {
  return (
    <div className="commercial-theme commercial-page baja-page">
      <CommercialHeader home items={BAJA_NAVIGATION} />
      <main id="conteudo">
        <section id="top" className="site-container baja-hero" aria-labelledby="baja-title">
          <div className="baja-hero-copy">
            <p className="site-eyebrow">Você veio pelo Baja 👀</p>
            <h1 id="baja-title">Você veio pelo Baja. Agora vamos falar do seu negócio.</h1>
            <p className="site-lead">
              Eu crio sistemas sob medida para empresas que querem automatizar processos,
              organizar operações e parar de depender de soluções improvisadas.
            </p>
            <div className="site-actions baja-hero-actions">
              <CampaignCta position="hero" label="Quero construir meu sistema" />
              <a className="site-text-link" href="#comparacao">
                Entender a comparação <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="baja-hero-note">E, de quebra, você ainda ajuda a manter esse Baja vivo. 😨</p>
          </div>
          <BajaPhoto />
        </section>

        <section id="comparacao" className="baja-comparison-section site-section">
          <div className="site-container">
            <div className="section-heading baja-centered-heading">
              <p className="site-eyebrow">Engenharia aplicada</p>
              <h2>Esse Baja e um bom sistema têm mais em comum do que parece.</h2>
            </div>
            <div className="baja-comparison-grid">
              {COMPARISONS.map((comparison, index) => (
                <article className={`baja-comparison-card ${index === 0 ? 'is-baja' : 'is-system'}`} key={comparison.title}>
                  <div className="baja-card-heading">
                    <span className="baja-card-number">0{index + 1}</span>
                    <div>
                      <p>{comparison.badge}</p>
                      <h3>{comparison.title}</h3>
                    </div>
                  </div>
                  <ul>
                    {comparison.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicos" className="site-container site-section baja-services-section">
          <div className="section-heading">
            <p className="site-eyebrow">Da ideia para a pista</p>
            <h2>O que eu posso construir para sua empresa?</h2>
            <p>Soluções pensadas para a sua operação, sem encaixar o negócio à força em uma ferramenta genérica.</p>
          </div>
          <div className="baja-services-grid">
            {SERVICES.map((service) => (
              <article key={service.title}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
          <div className="site-actions baja-section-action">
            <CampaignCta position="services" label="Tenho uma ideia" />
          </div>
        </section>

        <section id="portfolio" className="baja-projects-section site-section">
          <div className="site-container">
            <div className="section-heading">
              <p className="site-eyebrow">Projetos reais</p>
              <h2>Algumas coisas que já construí</h2>
              <p>Projetos diferentes, todos partindo de uma necessidade concreta.</p>
            </div>
            <div className="baja-project-grid">
              {BAJA_PROJECTS.map((project) => (
                <article className="baja-project-card" key={project.id}>
                  <a
                    className="baja-project-image"
                    href={getProjectCasePath(project)}
                    aria-label={`Conhecer o projeto ${project.title}`}
                    onClick={() => trackProject(project.id, 'case', 'baja_projects_image')}
                  >
                    <img
                      src={project.cover.src}
                      srcSet={project.cover.srcSet}
                      sizes="(min-width: 900px) 360px, (min-width: 600px) 45vw, calc(100vw - 40px)"
                      width={project.cover.width}
                      height={project.cover.height}
                      alt={project.cover.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <div className="baja-project-copy">
                    <p className="site-eyebrow">{project.category}</p>
                    <h3>{project.title}</h3>
                    <dl>
                      <div>
                        <dt>Problema</dt>
                        <dd>{project.problem}</dd>
                      </div>
                      <div>
                        <dt>Solução</dt>
                        <dd>{project.solution}</dd>
                      </div>
                      <div>
                        <dt>Desenvolvido</dt>
                        <dd>{project.highlights[0]}</dd>
                      </div>
                    </dl>
                    <a
                      className="site-text-link"
                      href={getProjectCasePath(project)}
                      onClick={() => trackProject(project.id, 'case', 'baja_projects')}
                    >
                      Ver projeto <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-container site-section baja-mechanic-section" aria-labelledby="mechanic-title">
          <div className="baja-mechanic-copy">
            <p className="baja-dark-eyebrow">PIT STOP COMERCIAL</p>
            <h2 id="mechanic-title">Fundo oficial para o mecânico do Baja</h2>
            <p className="baja-mechanic-goal">Meta: conseguir novos projetos antes da próxima quebra.</p>
            <p>Cada projeto fechado aumenta as chances deste carro aparecer no próximo evento.</p>
            <CampaignCta position="mechanic" label="Ajudar o Baja" className="site-button baja-light-button" />
            <p className="baja-mechanic-disclaimer">É projeto, não doação. A conversa começa no WhatsApp.</p>
          </div>
          <div className="baja-progress-panel">
            <div className="baja-progress-meta">
              <span>MISSÃO</span>
              <span>PRÓXIMO EVENTO</span>
            </div>
            {/* Indicador puramente decorativo: não representa valor, clientes ou meta financeira. */}
            <div className="baja-progress-track" aria-hidden="true">
              <span />
            </div>
            <div className="baja-progress-labels">
              <span>Ideia</span>
              <span>Sistema em produção</span>
            </div>
            <p>Indicador ilustrativo — sem valores financeiros.</p>
          </div>
        </section>

        <section className="baja-final-section site-section">
          <div className="site-container baja-final-layout">
            <div>
              <p className="site-eyebrow">Última volta</p>
              <h2>Já que você chegou até aqui...</h2>
              <p>
                Se existe algum processo na sua empresa que ainda depende de planilha, WhatsApp,
                papel ou trabalho manual demais, talvez dê para transformar isso em um sistema.
              </p>
            </div>
            <div className="baja-final-action">
              <CampaignCta position="final_cta" label="Vamos conversar" />
              <p>O Baja agradece. O mecânico também.</p>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
      <CampaignCta
        position="sticky_mobile"
        label="Falar sobre meu sistema"
        className="baja-sticky-cta"
      />
    </div>
  )
}
