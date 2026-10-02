import WhatsAppCta from '../../components/WhatsAppCta'
import { WHATSAPP_CONTEXT_MESSAGES } from '../../lib/contact'

export default function ChaosStory() {
  return (
    <section
      className="chaos-story"
      id="problemas"
      data-progress="chaos"
      aria-labelledby="chaos-title"
    >
      <div className="chaos-sticky">
        <div className="chaos-blue" aria-hidden="true" />
        <div className="mat-wrap chaos-content">
          <div className="chaos-heading">
            <p className="mat-label">02 / da rotina ao fluxo</p>
            <h2 id="chaos-title">
              Sua empresa ainda
              <br />
              funciona assim?
            </h2>
            <p>Planilha, WhatsApp, papel e memória.</p>
          </div>
          <div
            className="chaos-stage"
            aria-label="Ilustração de informações espalhadas que passam a compor um fluxo organizado"
          >
            <div className="chaos-scatter" aria-hidden="true">
              <div className="chaos-sheet">
                <div>▦ &nbsp; controle_final_v12.xlsx</div>
                <div className="sheet-grid">
                  <span>Pedido</span>
                  <span>Status</span>
                  <span>Responsável</span>
                  <span>Entrega</span>
                  <span>Conferir de novo</span>
                  <span>?</span>
                  <span>Cliente</span>
                  <span>Desatualizado</span>
                  <span>—</span>
                </div>
                <small>copiar → colar → conferir</small>
              </div>
              <div className="chaos-message">
                <span className="mat-label">Pedido no WhatsApp</span>
                <p>“Manda no grupo?”</p>
                <p>“Cadê esse arquivo?”</p>
                <span>digitando...</span>
              </div>
              <div className="chaos-paper">
                <span>lembrete!</span>
                <strong>
                  quem sabe fazer
                  <br />
                  isso é o João.
                </strong>
                <span className="paper-arrow">↗</span>
              </div>
              <div className="chaos-file">↳ controle_final_AGORA_VAI.xlsx</div>
            </div>
            <div className="organized-flow">
              <div className="flow-toolbar">
                <span className="flow-brand">
                  M<span>.</span>
                </span>
                <strong>Sua operação, organizada.</strong>
                <span className="flow-status">● Tudo conectado</span>
              </div>
              <div className="flow-path">
                <span>Informação</span>
                <i />
                <span>Responsável</span>
                <i />
                <span>Próxima etapa</span>
              </div>
              <div className="flow-columns">
                {[
                  ['01', 'Recebido', 'Pedido registrado', 'Informações reunidas'],
                  ['02', 'Em andamento', 'Atendimento', 'Responsável definido'],
                  ['03', 'Concluído', 'Entrega organizada', 'Histórico disponível'],
                ].map(([n, title, task, detail]) => (
                  <div className="flow-column" key={n}>
                    <div>
                      <span>{title}</span>
                      <small>{n}</small>
                    </div>
                    <article>
                      <span className="flow-task-mark" />
                      <strong>{task}</strong>
                      <p>{detail}</p>
                      <span className="flow-task-foot">
                        Etapa acompanhada <span>↗</span>
                      </span>
                    </article>
                  </div>
                ))}
              </div>
            </div>
            <p className="chaos-disclaimer mat-label">Cenário ilustrativo / interface conceitual</p>
          </div>
          <div className="chaos-conclusion">
            <h3>
              Um sistema transforma
              <br />
              caos em processo.
            </h3>
            <WhatsAppCta
              className="mat-button mat-button-paper"
              location="commercial_chaos"
              label="Tenho um processo assim ↗"
              message={WHATSAPP_CONTEXT_MESSAGES.chaos}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
