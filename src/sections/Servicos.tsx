const SERVICES = [
  [
    'Organizar a operação',
    'Sistemas para registrar produtos, acompanhar estoque e reunir informações que hoje ficam espalhadas.',
    'Sistemas web e aplicações desktop',
  ],
  [
    'Apresentar produtos e serviços',
    'Sites com catálogo e caminhos de contato para quem quer conhecer o que sua empresa oferece.',
    'Sites e páginas de apresentação',
  ],
  [
    'Conectar ferramentas e automatizar tarefas',
    'Integrações entre sistemas, leitura de arquivos e processamento de dados para rotinas repetitivas.',
    'Integrações e automações',
  ],
  [
    'Criar ou evoluir um produto',
    'Desenvolvimento de uma primeira versão ou de novas funcionalidades para um sistema que já existe.',
    'Produtos digitais, aplicativos e manutenção evolutiva',
  ],
]
export default function Servicos() {
  return (
    <section id="servicos" className="site-section services-section">
      <div className="site-container services-layout">
        <div className="section-heading">
          <p className="site-eyebrow">Serviços</p>
          <h2>O que precisa funcionar melhor por aí?</h2>
          <p>
            A conversa começa pela sua rotina. As tecnologias vêm depois, conforme a necessidade do projeto.
          </p>
        </div>
        <div>
          {SERVICES.map(([title, description, format], index) => (
            <article className="service-row" key={title}>
              <span className="service-number">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <p className="site-caption">{format}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
