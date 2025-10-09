import { useState } from 'react'

type Project = {
  id: string
  title: string
  stack: string[]
  cover: string   // caminho da imagem em /public
  short: string   // resumo curto
  demo?: string   // link demo (opcional)
  repo?: string   // link GitHub (opcional)
  details: string // descrição mais completa pro modal
}

const PROJECTS: Project[] = [
  {
    id: 'producao',
    title: 'Sistema de Controle de Produção',
    stack: ['Laravel', 'PostgreSQL', 'Docker'],
    cover: '/projects/producao.jpg',
    short: 'Painéis, ordens de produção e indicadores em tempo real.',
    demo: undefined,
    repo: undefined,
    details:
      'Sistema sob medida para indústria: cadastro de OPs, apontamentos em chão de fábrica, rastreabilidade e dashboards em tempo real. API interna para integração com ERP.',
  },
  {
    id: 'automacao-emails',
    title: 'Automação de E-mails Corporativos',
    stack: ['Node.js', 'Gmail API', 'Queues'],
    cover: '/projects/automacao-emails.jpg',
    short: 'Robô que processa anexos e alimenta um backend.',
    demo: undefined,
    repo: 'https://github.com/seu-usuario/automacao-emails',
    details:
      'Serviço que lê caixas específicas, extrai anexos (PDF/CSV), aplica validações e lança dados via API com retentativas e filas. Logs e alertas por webhook.',
  },
  {
    id: 'pdv-pao-nobre',
    title: 'PDV Pão Nobre',
    stack: ['Laravel', 'JWT', 'Docker'],
    cover: '/projects/pdv-pao-nobre.jpg',
    short: 'Ponto de venda com autenticação e emissão de comprovantes.',
    demo: undefined,
    repo: undefined,
    details:
      'Backoffice e PDV com controle de produtos, cupons e usuários. Autenticação JWT, perfis de acesso e integração com impressora térmica.',
  },
]

export default function Projetos() {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section id="portfolio" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-orbitron font-bold mb-3">Projetos</h2>
      <p className="opacity-80 mb-8">Alguns trabalhos e soluções sob medida que desenvolvi.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {PROJECTS.map((p) => (
          <article
            key={p.id}
            className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:shadow-glow transition-shadow"
          >
            {/* imagem de capa */}
            <div className="aspect-video overflow-hidden">
              <img
                src={p.cover}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
                width={1280}
                height={720}
              />
            </div>

            {/* conteúdo */}
            <div className="p-5">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm opacity-70 mt-1">{p.short}</p>

              {/* stack */}
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-mdplus border border-white/10 text-xs bg-white/5">
                    {t}
                  </span>
                ))}
              </div>

              {/* ações */}
              <div className="mt-4 flex flex-wrap gap-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-primary rounded-mdplus text-sm shadow-glow hover:brightness-110 transition"
                  >
                    Ver demo
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-white/15 rounded-mdplus text-sm hover:bg-white/5 transition"
                  >
                    GitHub
                  </a>
                )}
                <button
                  onClick={() => setOpen(p)}
                  className="px-3 py-2 border border-white/15 rounded-mdplus text-sm hover:bg-white/5 transition"
                >
                  Ver mais
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de detalhes (leve e acessível) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="proj-title"
          className="fixed inset-0 z-50 grid place-items-center p-6"
          onClick={() => setOpen(null)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* caixa */}
          <div
            className="relative z-10 max-w-2xl w-full rounded-2xl bg-[#13131a] ring-1 ring-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="proj-title" className="text-xl font-semibold">
                {open.title}
              </h3>
              <button
                onClick={() => setOpen(null)}
                className="px-3 py-1 rounded-mdplus border border-white/15 hover:bg-white/5"
                aria-label="Fechar"
              >
                Fechar
              </button>
            </div>

            <p className="opacity-80 mt-3">{open.details}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {open.stack.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-mdplus border border-white/10 text-xs bg-white/5">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {open.demo && (
                <a
                  href={open.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary rounded-mdplus shadow-glow text-sm"
                >
                  Ver demo
                </a>
              )}
              {open.repo && (
                <a
                  href={open.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/15 rounded-mdplus text-sm"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
