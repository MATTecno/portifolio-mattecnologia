import { useState, type FocusEvent } from 'react'
import WhatsAppCta from '../../components/WhatsAppCta'
import { WHATSAPP_CONTEXT_MESSAGES } from '../../lib/contact'
import { trackService } from '../../lib/analytics'

const services = [
  {
    id: 'systems',
    name: 'Sistemas sob medida',
    title: 'Seu processo. Seu sistema.',
    description: 'Uma ferramenta construída ao redor da operação da empresa, e não o contrário.',
    examples: ['Gestão', 'Operação', 'Financeiro', 'Atendimento'],
    cta: 'Conversar sobre um sistema',
  },
  {
    id: 'automation',
    name: 'Automações e integrações',
    title: 'Menos copiar. Menos conferir. Menos repetir.',
    description: 'Conectamos processos e ferramentas para reduzir tarefas manuais.',
    examples: ['Processos', 'Ferramentas', 'Dados conectados'],
    cta: 'Conversar sobre uma automação',
  },
  {
    id: 'digital',
    name: 'Sites e experiências',
    title: 'Sua empresa também precisa funcionar bem do lado de fora.',
    description:
      'Sites, landing pages e e-commerce feitos para apresentar sua empresa, vender ou gerar contato.',
    examples: ['Sites', 'E-commerce', 'Experiências digitais'],
    cta: 'Conversar sobre um projeto digital',
  },
] as const

function ServiceVisual({ kind }: { kind: string }) {
  return (
    <div className={`service-visual visual-${kind}`} aria-hidden="true">
      {kind === 'systems' ? (
        <>
          <div className="visual-module module-a">
            <span>01 / operação</span>
            <i />
            <i />
            <i />
          </div>
          <div className="visual-module module-b">
            <span>02 / gestão</span>
            <div className="module-bars">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <span className="visual-plus">+</span>
        </>
      ) : kind === 'automation' ? (
        <>
          <div className="visual-endpoint">
            Entrada<span>Informação</span>
          </div>
          <div className="visual-connection">
            <i />
            <i />
            <i />
          </div>
          <div className="visual-endpoint">
            Destino<span>Atualizado ✓</span>
          </div>
        </>
      ) : (
        <>
          <div className="visual-browser">
            <div>
              ••• <span>sua empresa ↗</span>
            </div>
            <strong>
              Uma experiência.
              <br />
              Um objetivo.
            </strong>
            <span className="visual-browser-cta">Vamos conversar ↗</span>
          </div>
          <div className="visual-phone">
            <span>Olá.</span>
            <i />
            <i />
            <b>↗</b>
          </div>
        </>
      )}
    </div>
  )
}

export default function EditorialServices() {
  const [selected, setSelected] = useState<string | null>(null)
  const select = (id: string | null) => {
    if (selected === id) return
    setSelected(id)
    if (id) trackService(id, 'open')
    else if (selected) trackService(selected, 'closed')
  }
  const finePointer = () =>
    window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)').matches
  const focus = (event: FocusEvent, id: string) => {
    if (finePointer() && event.target.matches(':focus-visible')) select(id)
  }
  return (
    <section className="mat-services mat-wrap mat-section" id="servicos">
      <div className="mat-section-heading">
        <p className="mat-label">01 / o que podemos construir</p>
        <h2>
          Tecnologia para resolver
          <br />
          problemas reais.
        </h2>
      </div>
      <div className="service-accordion">
        {services.map((service, index) => (
          <article
            className={`mat-service-row ${selected === service.id ? 'is-selected' : ''}`}
            key={service.id}
            onMouseEnter={() => {
              if (finePointer() && !document.activeElement?.closest('.service-panel'))
                select(service.id)
            }}
          >
            <h3>
              <button
                type="button"
                id={`service-button-${service.id}`}
                aria-expanded={selected === service.id}
                aria-controls={`service-${service.id}`}
                onFocus={(event) => focus(event, service.id)}
                onClick={() => select(selected === service.id ? null : service.id)}
              >
                <span className="mat-label">0{index + 1}</span>
                <span>{service.name}</span>
                <span className="service-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </h3>
            <div
              className="service-panel"
              id={`service-${service.id}`}
              role="region"
              aria-labelledby={`service-button-${service.id}`}
              hidden={selected !== service.id}
            >
              <div className="service-copy">
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <div className="mat-tags">
                  {service.examples.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <WhatsAppCta
                  className="mat-text-link"
                  location={`commercial_services_${service.id}`}
                  label={`${service.cta} ↗`}
                  message={WHATSAPP_CONTEXT_MESSAGES[service.id]}
                />
              </div>
              <ServiceVisual kind={service.id} />
            </div>
          </article>
        ))}
      </div>
      <div className="services-bottom">
        <p>
          Não encontrou o nome do que precisa?
          <br />
          <strong>Tudo bem. Começamos pelo problema.</strong>
        </p>
        <WhatsAppCta
          className="mat-text-link"
          location="commercial_services"
          label="Me conte o que está acontecendo ↗"
          message={WHATSAPP_CONTEXT_MESSAGES.hero}
        />
      </div>
    </section>
  )
}
