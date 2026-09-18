const SERVICES = [
  [
    'Sistemas internos',
    'Controle de processos, equipes, atividades e informações da empresa.',
  ],
  [
    'Estoque e operações',
    'Entradas, saídas, produtos, lotes, movimentações e relatórios.',
  ],
  [
    'Automação de processos',
    'Substituição de tarefas manuais, planilhas e rotinas repetitivas.',
  ],
  [
    'Portais e plataformas',
    'Sistemas web personalizados para clientes, colaboradores ou parceiros.',
  ],
  [
    'Modernização de processos',
    'Transformação de controles existentes em sistemas mais organizados.',
  ],
]

export default function Servicos({ variant = 'home' }: { variant?: 'home' | 'landing' }) {
  const services = variant === 'landing' ? SERVICES : [
    ['Landing pages', 'Uma página para apresentar uma oferta, campanha ou serviço e facilitar o contato pelo WhatsApp ou formulário.'],
    ['Sites institucionais', 'Apresentação da empresa, dos serviços e do catálogo, com navegação adaptada ao celular.'],
    ...SERVICES,
  ]
  return (
    <section id="servicos" className="site-section services-section">
      <div className="site-container services-layout">
        <div className="section-heading">
          <p className="site-eyebrow">Soluções</p>
          <h2>Exemplos do que pode ser desenvolvido</h2>
          <p>
            Cada projeto parte da rotina da empresa. Estes são caminhos comuns, não uma lista fechada do que
            aceitamos.
          </p>
        </div>
        <div>
          {services.map(([title, description], index) => (
            <article className="service-row" key={title}>
              <span className="service-number">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
          <p className="services-note">
            Tem uma necessidade diferente? Conte o problema e avaliamos a melhor solução.
          </p>
        </div>
      </div>
    </section>
  )
}
