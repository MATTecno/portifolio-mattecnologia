import Sobre from './Sobre'
const STEPS = [
  ['Conversa inicial', 'Você conta o que precisa resolver, quem vai usar o sistema e o que já existe hoje.'],
  [
    'Definição do escopo',
    'Organizamos as prioridades e os entregáveis. A proposta reúne o que será desenvolvido e as condições do trabalho.',
  ],
  [
    'Desenvolvimento e validação',
    'As partes do projeto são apresentadas para conferir os fluxos e ajustar o que foi combinado.',
  ],
  [
    'Entrega',
    'Revisamos a versão desenvolvida e as orientações de uso. Publicação e acompanhamento seguem o escopo da proposta.',
  ],
]
export default function ComoTrabalho() {
  return (
    <section id="processo" className="site-section site-container">
      <div className="section-heading">
        <p className="site-eyebrow">Como funciona</p>
        <h2>Do primeiro contato à entrega.</h2>
      </div>
      <ol className="process-steps">
        {STEPS.map(([title, description], index) => (
          <li key={title}>
            <span className="site-caption">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      <Sobre />
    </section>
  )
}
