import { trackContact } from '../lib/analytics'
import { openPrivacyPreferences } from '../lib/consent'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'marcelos.diogo8@gmail.com'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-ice">
      <header className="border-b border-white/10 bg-background/95">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-6" aria-label="Privacidade">
          <a href="/" className="font-orbitron text-lg tracking-wide" aria-label="MATTecnologia — página inicial">
            <span className="text-ice">MAT</span><span className="text-primary">Tecnologia</span>
          </a>
          <a href="/" className="text-sm text-white/70 transition hover:text-white focus:text-white">
            Voltar ao site
          </a>
        </nav>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-primary/20 blur-[110px]" />
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 md:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Transparência</p>
            <h1 className="mt-4 max-w-3xl font-orbitron text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Política de privacidade
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
              Esta página explica quais informações são tratadas ao navegar pelo portfólio, enviar uma mensagem ou
              abrir serviços externos.
            </p>
            <p className="mt-5 text-sm text-white/50">Última atualização: 16 de agosto de 2026.</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-6 px-5 py-14 sm:px-6 md:py-20">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="cookies-title">
            <h2 id="cookies-title" className="font-orbitron text-2xl font-bold">Cookies e sua escolha</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Antes de qualquer medição opcional, o site solicita sua autorização. Você pode aceitar ou rejeitar
                todas as finalidades não necessárias ou escolher separadamente “Métricas e feedback” e “Gravações de
                sessão”. A recusa não limita páginas, projetos, formulário ou canais de contato.
              </p>
              <p>
                A preferência fica no cookie necessário <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">mat_consent_v1</code> por
                até 180 dias. Quando métricas são autorizadas, o PostHog usa o cookie próprio
                <code className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">ph_&lt;project_api_key&gt;_posthog</code> e
                armazenamento local pelo mesmo período para manter um identificador anônimo, a sessão e a escolha de
                recursos habilitados.
              </p>
              <p>
                O sinal “Não rastrear” (DNT) do navegador prevalece sobre a preferência salva. Você pode revogar ou
                alterar sua decisão pelo botão abaixo ou pelo link presente em todos os rodapés.
              </p>
              <button
                type="button"
                onClick={openPrivacyPreferences}
                className="inline-flex rounded-mdplus border border-primary/50 px-4 py-2.5 font-semibold text-primary transition hover:bg-primary/10"
              >
                Abrir preferências de cookies
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="analytics-title">
            <h2 id="analytics-title" className="font-orbitron text-2xl font-bold">Métricas e feedback</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Com autorização, o site usa o PostHog Cloud US para entender quais páginas e projetos são acessados e
                quais ações indicam intenção de contato. Podem ser registrados o caminho e tipo de página, a origem da
                visita e cliques em currículo, WhatsApp, e-mail, LinkedIn, GitHub, NPM, produtos e estudos de caso.
              </p>
              <p>
                O envio bem-sucedido do formulário gera apenas um evento de conclusão. Nome, e-mail, telefone,
                mensagem e escolhas da estimativa não são incluídos nesses eventos. Autocaptura, mapas de calor,
                captura de erros, logs de console e conteúdo de requisições permanecem desativados.
              </p>
              <p>
                Um botão opcional de feedback pode pedir uma nota de 1 a 5 e um comentário. O comentário é enviado
                voluntariamente ao PostHog; por isso, a própria pesquisa orienta a não inserir dados pessoais ou
                informações confidenciais.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="replay-title">
            <h2 id="replay-title" className="font-orbitron text-2xl font-bold">Gravações de sessão</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Se essa categoria também for autorizada, o PostHog pode reconstruir visualmente a navegação para
                identificar dúvidas, falhas de layout e etapas difíceis. Somente sessões consentidas com duração útil
                são mantidas, por até 30 dias.
              </p>
              <p>
                Valores digitados em inputs, seleções e áreas marcadas como sensíveis são mascarados no navegador
                antes do envio. Iframes externos, logs de console e payloads de rede não são gravados. O formulário de
                feedback também fica mascarado no vídeo, embora sua resposta seja enviada separadamente quando você a
                confirma.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="technical-title">
            <h2 id="technical-title" className="font-orbitron text-2xl font-bold">Dados técnicos, localização e retenção</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Após o consentimento, o PostHog recebe o endereço IP técnico, identificadores anônimos de navegador,
                tipo de dispositivo, sistema, navegador e localização aproximada derivada do IP. O site não chama a
                função de identificação do PostHog e não cria perfis associados a nome ou e-mail.
              </p>
              <p>
                Eventos e respostas de pesquisa podem ser mantidos por até 12 meses; gravações, por 30 dias. Como o
                projeto usa o PostHog Cloud US, essas informações são processadas em infraestrutura localizada nos
                Estados Unidos.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="source-title">
            <h2 id="source-title" className="font-orbitron text-2xl font-bold">Origem da visita</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Links podem trazer um identificador simples, como <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">?origem=linkedin</code>,
                para relacionar uma visita ao canal em que o portfólio foi compartilhado. Esse parâmetro é removido da
                barra de endereço antes do carregamento do analytics.
              </p>
              <p>
                Somente essa origem é mantida no <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">sessionStorage</code> e
                permanece até a aba ser fechada. Outros parâmetros são removidos antes do PostHog ser carregado e
                apenas âncoras conhecidas do próprio site são preservadas.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="form-title">
            <h2 id="form-title" className="font-orbitron text-2xl font-bold">Formulário de contato</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Ao enviar o formulário, nome, e-mail e mensagem são fornecidos voluntariamente e processados pelo
              EmailJS para que a MATTecnologia receba e responda ao contato. Esses valores não são repassados ao
              PostHog.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="external-title">
            <h2 id="external-title" className="font-orbitron text-2xl font-bold">Serviços externos</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Os links para WhatsApp, LinkedIn, GitHub, NPM e aplicativos de e-mail abrem serviços externos, sujeitos
              às políticas e configurações de privacidade de cada provedor.
            </p>
          </section>

          <section className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 md:p-8" aria-labelledby="questions-title">
            <h2 id="questions-title" className="font-orbitron text-2xl font-bold">Dúvidas sobre privacidade</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Para solicitar esclarecimentos sobre o tratamento dessas informações, entre em contato pelo e-mail.
            </p>
            <a
              href={`mailto:${OWNER_EMAIL}?subject=Privacidade%20no%20site%20MATTecnologia`}
              onClick={() => trackContact('email', 'privacy_questions')}
              className="mt-6 inline-flex rounded-mdplus bg-primary px-5 py-3 font-semibold text-slate-950 shadow-glow transition hover:brightness-110"
            >
              {OWNER_EMAIL}
            </a>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 px-5 py-7 text-center text-sm text-white/50 sm:px-6">
        <p>© {new Date().getFullYear()} MATTecnologia</p>
        <button type="button" onClick={openPrivacyPreferences} className="mt-2 underline-offset-4 hover:underline focus:underline">
          Preferências de cookies
        </button>
      </footer>
    </div>
  )
}
