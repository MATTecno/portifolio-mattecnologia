import WhatsAppCta from '../../components/WhatsAppCta'
import { WHATSAPP_CONTEXT_MESSAGES } from '../../lib/contact'

export default function EditorialHero() {
  return (
    <section className="mat-hero" id="top" data-progress="hero">
      <div className="mat-wrap mat-hero-grid">
        <div className="mat-hero-copy">
          <p className="mat-label hero-enter">MAT Tecnologia / soluções digitais para empresas</p>
          <h1 className="hero-enter">
            Sua empresa não precisa se adaptar ao sistema.
            <br />
            <em>O sistema se adapta à sua empresa.</em>
          </h1>
          <p className="mat-hero-description hero-enter">
            Transformamos processos manuais, planilhas e ideias em sistemas simples, úteis e feitos
            para a rotina real do seu negócio.
          </p>
          <div className="mat-actions hero-enter">
            <WhatsAppCta
              className="mat-button"
              location="commercial_hero"
              label="Quero resolver um problema ↗"
              message={WHATSAPP_CONTEXT_MESSAGES.hero}
            />
            <a className="mat-text-link" href="#portfolio">
              Ver projetos <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <div className="mat-hero-art" data-pointer aria-hidden="true">
          <div className="hero-orbit" />
          <span className="hero-coordinate mat-label">01 / do problema à solução</span>
          <div className="hero-fragments">
            <div className="mat-hero-note">
              <span className="mat-label">Ponto de partida</span>
              <strong>
                “Tem como
                <br />
                simplificar isso?”
              </strong>
              <span className="note-arrow">↘</span>
            </div>
            <div className="hero-flow">
              <span className="mat-label">Seu processo</span>
              <div>
                <i />
                Entrada <span>→</span> Etapa <span>→</span> Pronto
              </div>
            </div>
            <div className="hero-window">
              <div className="window-bar">
                <span>•••</span>
                <span>operação / visão geral</span>
                <span>↗</span>
              </div>
              <div className="mini-table">
                <span>Atividade</span>
                <span>Status</span>
                <span>Conferir pedido</span>
                <b>Em andamento</b>
                <span>Organizar entrega</span>
                <b className="table-done">Concluído</b>
                <span>Próxima etapa</span>
                <span className="table-line" />
              </div>
              <div className="mini-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="hero-real">
            <img
              src="/projects/apublicitaria-800.webp"
              width="1280"
              height="720"
              alt=""
              loading="lazy"
            />
            <span className="mat-label">aPublicitária / projeto real</span>
          </div>
          <div className="hero-depth-line" />
          <span className="hero-art-foot mat-label">Sistemas · automações · experiências</span>
        </div>
      </div>
      <div className="mat-wrap hero-baseline">
        <span>Sob medida. Desde a primeira conversa.</span>
        <a href="#servicos" aria-label="Explorar soluções">
          Continue para explorar <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
