import { trackContact } from '../lib/analytics'

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
            <p className="mt-5 text-sm text-white/50">Última atualização: 15 de agosto de 2026.</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-6 px-5 py-14 sm:px-6 md:py-20">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="analytics-title">
            <h2 id="analytics-title" className="font-orbitron text-2xl font-bold">Analytics anônimo</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                O site usa o PostHog US Cloud para entender, de forma agregada, quais páginas e projetos são mais
                acessados e quais ações indicam intenção de contato.
              </p>
              <p>
                Podem ser registrados: caminho da página, tipo de página, origem da visita e cliques em currículo,
                WhatsApp, e-mail, LinkedIn, GitHub, NPM, produtos e estudos de caso. O envio bem-sucedido do formulário
                também gera um evento, sem incluir o conteúdo preenchido. O provedor acrescenta informações técnicas
                do navegador e do dispositivo para relatórios agregados.
              </p>
              <p>
                A configuração é cookieless: não usa cookies do PostHog, não identifica pessoas e não utiliza
                autocaptura, gravação de sessão, mapas de calor, pesquisas ou perfis individuais. Sinais de “Não
                rastrear” (DNT) são respeitados.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8" aria-labelledby="source-title">
            <h2 id="source-title" className="font-orbitron text-2xl font-bold">Origem da visita</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/70">
              <p>
                Links podem trazer um identificador simples, como <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">?origem=linkedin</code>,
                para relacionar uma visita ao canal em que o portfólio foi compartilhado. Esse parâmetro é removido da
                barra de endereço antes do envio dos eventos.
              </p>
              <p>
                Somente essa origem é mantida no <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">sessionStorage</code> e
                permanece até a aba ser fechada. Query strings, hashes, dados da estimativa, nome, e-mail, telefone e
                conteúdo do formulário não são enviados ao analytics.
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
        © {new Date().getFullYear()} MATTecnologia
      </footer>
    </div>
  )
}
