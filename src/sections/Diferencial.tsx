const POINTS = [
  ['Contato direto', 'Você conversa com quem vai entender a necessidade e desenvolver o sistema.'],
  ['Solução adaptada', 'O sistema é pensado para a operação da empresa, não o contrário.'],
  ['Acompanhamento', 'As etapas são apresentadas para validar o que foi combinado.'],
  ['Evolução', 'O sistema pode crescer conforme a necessidade, sem ficar preso a um pacote genérico.'],
  ['Transparência', 'Escopo e possibilidades são alinhados antes de seguir.'],
]

export default function Diferencial({ variant = 'home' }: { variant?: 'home' | 'landing' }) {
  const points = variant === 'landing' ? POINTS : [
    ['Contato direto', 'Você conversa com quem vai entender a necessidade e desenvolver seu projeto.'],
    ['Solução adaptada', 'Conteúdo, navegação e funcionalidades definidos de acordo com seu objetivo.'],
    ...POINTS.slice(2, 3),
    ['Evolução', 'Novas páginas e funcionalidades podem ser avaliadas conforme a necessidade.'],
    ...POINTS.slice(4),
  ]
  return (
    <section id="diferencial" className="site-section diferencial-section">
      <div className="site-container">
        <div className="section-heading">
          <p className="site-eyebrow">Do primeiro contato ao desenvolvimento</p>
          <h2>Você fala diretamente com quem desenvolve.</h2>
          <p>
            Sem intermediários e sem soluções genéricas empurradas para a empresa. A conversa começa pelo{' '}
            {variant === 'landing' ? 'problema real da operação.' : 'objetivo da sua empresa.'}
          </p>
        </div>
        <div className="diferencial-grid">
          {points.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
