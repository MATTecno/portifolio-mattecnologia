import CommercialHeader from '../components/CommercialHeader'
import Rodape from '../sections/Rodape'
import { trackContact } from '../lib/analytics'
import { openPrivacyPreferences } from '../lib/consent'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'marcelos.diogo8@gmail.com'

export default function PrivacyPage() {
  return (
    <div className="commercial-theme privacy-page">
      <CommercialHeader />

      <main id="case-content">
        <section className="legal-intro">
          <div className="site-container">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--site-accent)]">
              Transparência
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Política de privacidade
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed site-copy">
              Esta página explica quais informações são tratadas ao navegar pelo portfólio, enviar uma
              mensagem ou abrir serviços externos.
            </p>
            <p className="mt-5 text-sm site-caption">Última atualização: 12 de setembro de 2026.</p>
          </div>
        </section>

        <div className="site-container legal-content">
          <section className="legal-section" aria-labelledby="cookies-title">
            <h2 id="cookies-title" className="text-2xl font-bold">
              Cookies e sua escolha
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed site-copy">
              <p>
                Antes de qualquer medição opcional, o site solicita sua autorização. Você pode aceitar ou
                rejeitar todas as finalidades não necessárias ou escolher separadamente “Métricas e feedback”
                e “Gravações de sessão”. A recusa não limita páginas, projetos, formulário ou canais de
                contato.
              </p>
              <p>
                A preferência fica no cookie necessário{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">mat_consent_v1</code>{' '}
                por até 180 dias. Quando métricas são autorizadas, o PostHog usa o cookie próprio
                <code className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">
                  ph_&lt;project_api_key&gt;_posthog
                </code>{' '}
                e armazenamento local pelo mesmo período para manter um identificador anônimo, a sessão e a
                escolha de recursos habilitados.
              </p>
              <p>
                O sinal “Não rastrear” (DNT) do navegador prevalece sobre a preferência salva. Você pode
                revogar ou alterar sua decisão pelo botão abaixo ou pelo link presente em todos os rodapés.
              </p>
              <button
                type="button"
                onClick={openPrivacyPreferences}
                className="site-button site-button-secondary"
              >
                Abrir preferências de cookies
              </button>
            </div>
          </section>

          <section className="legal-section" aria-labelledby="analytics-title">
            <h2 id="analytics-title" className="text-2xl font-bold">
              Métricas e feedback
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed site-copy">
              <p>
                Com autorização, o site usa o PostHog Cloud US para entender quais páginas e projetos são
                acessados e quais ações indicam intenção de contato. Podem ser registrados o caminho e tipo de
                página, a origem da visita, parâmetros de campanha quando existirem, interação com a FAQ e
                cliques em currículo, WhatsApp, e-mail, LinkedIn, GitHub, NPM, produtos e estudos de caso.
              </p>
              <p>
                O envio bem-sucedido do formulário gera apenas um evento de conclusão. Nome, e-mail, telefone,
                mensagem e respostas do briefing não são incluídos nesses eventos. Autocaptura, mapas de
                calor, captura de erros, logs de console e conteúdo de requisições permanecem desativados.
              </p>
              <p>
                Um botão opcional de feedback pode pedir uma nota de 1 a 5 e um comentário. O comentário é
                enviado voluntariamente ao PostHog; por isso, a própria pesquisa orienta a não inserir dados
                pessoais ou informações confidenciais.
              </p>
              <p>
                Com a mesma autorização, o site também carrega a Google tag{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">
                  AW-18450021277
                </code>{' '}
                para medir campanhas de anúncios. Essa tag não substitui o PostHog, não envia o conteúdo
                digitado nos formulários e, neste momento, não registra conversões até uma ação específica ser
                configurada.
              </p>
            </div>
          </section>

          <section className="legal-section" aria-labelledby="replay-title">
            <h2 id="replay-title" className="text-2xl font-bold">
              Gravações de sessão
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed site-copy">
              <p>
                Se essa categoria também for autorizada, o PostHog pode reconstruir visualmente a navegação
                para identificar dúvidas, falhas de layout e etapas difíceis. Somente sessões consentidas com
                duração útil são mantidas, por até 30 dias.
              </p>
              <p>
                Valores digitados em inputs, seleções e áreas marcadas como sensíveis são mascarados no
                navegador antes do envio. Iframes externos, logs de console e payloads de rede não são
                gravados. O formulário de feedback também fica mascarado no vídeo, embora sua resposta seja
                enviada separadamente quando você a confirma.
              </p>
            </div>
          </section>

          <section className="legal-section" aria-labelledby="technical-title">
            <h2 id="technical-title" className="text-2xl font-bold">
              Dados técnicos, localização e retenção
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed site-copy">
              <p>
                Após o consentimento, o PostHog recebe o endereço IP técnico, identificadores anônimos de
                navegador, tipo de dispositivo, sistema, navegador e localização aproximada derivada do IP. O
                site não chama a função de identificação do PostHog e não cria perfis associados a nome ou
                e-mail.
              </p>
              <p>
                Eventos e respostas de pesquisa podem ser mantidos por até 12 meses; gravações, por 30 dias.
                Como o projeto usa o PostHog Cloud US, essas informações são processadas em infraestrutura
                localizada nos Estados Unidos.
              </p>
            </div>
          </section>

          <section className="legal-section" aria-labelledby="source-title">
            <h2 id="source-title" className="text-2xl font-bold">
              Origem da visita
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed site-copy">
              <p>
                Links podem trazer um identificador simples, como{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">
                  ?origem=linkedin
                </code>
                , para relacionar uma visita ao canal em que o portfólio foi compartilhado. Esse parâmetro é
                removido da barra de endereço antes do carregamento do analytics.
              </p>
              <p>
                Campanhas podem trazer parâmetros{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">utm_source</code>,{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">utm_medium</code>,{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">utm_campaign</code>,{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">utm_term</code> e{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">utm_content</code>.
                Esses valores, quando válidos, permanecem na barra de endereço, ficam no{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">sessionStorage</code>{' '}
                até a aba ser fechada e podem ser associados aos eventos de página e de contato. Não são
                capturados textos digitados, e-mails nem o conteúdo da mensagem enviada.
              </p>
              <p>
                A origem da visita e, quando existirem, os parâmetros UTM válidos são mantidos no{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-inherit">sessionStorage</code>{' '}
                até a aba ser fechada. Os demais parâmetros são removidos antes do PostHog ser carregado e
                apenas âncoras conhecidas do próprio site são preservadas.
              </p>
            </div>
          </section>

          <section className="legal-section" aria-labelledby="briefing-privacy-title">
            <h2 id="briefing-privacy-title">Briefing e referência de projeto</h2>
            <p className="mt-4">
              As respostas do briefing ficam na memória da página até você sair ou recarregá-la. O resumo é
              compartilhado somente quando você abre um canal externo ou envia o formulário. Um identificador
              de projeto na URL pode preencher a referência do contato; ele é validado pelo catálogo e
              removido da URL antes do analytics.
            </p>
            <p className="mt-4">
              Com consentimento para métricas, são registrados apenas o início e a conclusão do briefing.
              Descrição, recursos, data desejada e resumo não são incluídos nesses eventos e ficam mascarados
              nas gravações de sessão.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="form-title">
            <h2 id="form-title" className="text-2xl font-bold">
              Formulário de contato
            </h2>
            <p className="mt-4 leading-relaxed site-copy">
              Ao enviar o formulário, nome, e-mail, mensagem e o resumo do projeto, quando incluído, são
              fornecidos voluntariamente e processados pelo EmailJS para que a MATTecnologia receba e responda
              ao contato. Esses valores não são repassados ao PostHog.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="external-title">
            <h2 id="external-title" className="text-2xl font-bold">
              Serviços externos
            </h2>
            <p className="mt-4 leading-relaxed site-copy">
              Os links para WhatsApp, LinkedIn, GitHub, NPM e aplicativos de e-mail abrem serviços externos,
              sujeitos às políticas e configurações de privacidade de cada provedor.
            </p>
          </section>

          <section className="legal-section" aria-labelledby="questions-title">
            <h2 id="questions-title" className="text-2xl font-bold">
              Dúvidas sobre privacidade
            </h2>
            <p className="mt-4 leading-relaxed site-copy">
              Para solicitar esclarecimentos sobre o tratamento dessas informações, entre em contato pelo
              e-mail.
            </p>
            <a
              href={`mailto:${OWNER_EMAIL}?subject=Privacidade%20no%20site%20MATTecnologia`}
              onClick={() => trackContact('email', 'privacy_questions')}
              className="site-button mt-6"
            >
              {OWNER_EMAIL}
            </a>
          </section>
        </div>
      </main>

      <Rodape />
    </div>
  )
}
