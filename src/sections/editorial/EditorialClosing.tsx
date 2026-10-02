import WhatsAppCta from '../../components/WhatsAppCta'
import { WHATSAPP_CONTEXT_MESSAGES, projectWhatsAppMessage } from '../../lib/contact'
import type { ProjectReference } from '../../lib/estimate'

export function EditorialProcess() {
  return (
    <section className="mat-wrap mat-section mat-process" id="processo" data-progress="process">
      <div className="mat-section-heading">
        <p className="mat-label">04 / como trabalhamos</p>
        <h2>
          Antes do código,
          <br />
          uma boa conversa.
        </h2>
      </div>
      <div className="mat-process-steps">
        {[
          [
            'Entendemos o problema',
            'Você explica como funciona hoje, onde estão os gargalos e o que precisa melhorar.',
          ],
          [
            'Desenhamos a solução',
            'Organizamos fluxo, telas e funcionalidades antes de sair construindo coisas sem necessidade.',
          ],
          [
            'Construímos e colocamos para funcionar',
            'O projeto evolui com validações até chegar à operação real.',
          ],
        ].map(([title, description], index) => (
          <article key={title}>
            <span className="process-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="process-track mat-label">
        <span>Problema</span>
        <span>Fluxo</span>
        <span>Interface</span>
        <span>Produto ↗</span>
      </div>
    </section>
  )
}

export function EditorialAbout() {
  return (
    <section className="mat-about" id="sobre">
      <div className="mat-wrap about-layout" id="diferencial">
        <figure>
          <img
            src="/marcelo-profissional.webp"
            srcSet="/marcelo-profissional-320.webp 320w, /marcelo-profissional-480.webp 480w"
            sizes="(min-width: 768px) 480px, calc(100vw - 40px)"
            width="480"
            height="480"
            alt="Marcelo Teixeira, responsável pela MAT Tecnologia"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="mat-label">Marcelo Teixeira / à frente da MAT</figcaption>
        </figure>
        <div>
          <p className="mat-label">05 / quem está do outro lado</p>
          <h2>
            Tecnologia
            <br />
            feita de perto.
          </h2>
          <p>
            A MAT Tecnologia é uma empresa independente conduzida por Marcelo Teixeira,
            desenvolvedor que acompanha os projetos desde a conversa inicial até a implementação.
          </p>
          <p className="about-emphasis">
            Você conversa diretamente com quem entende e constrói a solução.
          </p>
          <div className="about-credentials mat-label">
            <span>Desenvolvimento full stack</span>
            <span>Sistemas empresariais</span>
            <span>Belo Horizonte — MG</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditorialCta({ reference }: { reference?: ProjectReference }) {
  return (
    <section className="mat-final" id="contato" data-progress="cta">
      <div className="mat-wrap">
        <p className="mat-label">O próximo projeto pode começar aqui ↘</p>
        <h2>Tem algum processo que sua empresa faz do jeito difícil?</h2>
        <p>Talvez dê para transformar isso em software.</p>
        {reference && <p className="mat-reference">Projeto de referência: {reference.title}</p>}
        <div className="mat-actions">
          <WhatsAppCta
            className="mat-button"
            location="commercial_final_cta"
            label="Quero resolver um problema ↗"
            message={
              reference ? projectWhatsAppMessage(reference.title) : WHATSAPP_CONTEXT_MESSAGES.final
            }
          />
          <a
            className="mat-text-link"
            href={`/contato/${reference ? `?projeto=${encodeURIComponent(reference.id)}` : ''}`}
          >
            Prefiro escrever pelo formulário ↗
          </a>
        </div>
      </div>
    </section>
  )
}
