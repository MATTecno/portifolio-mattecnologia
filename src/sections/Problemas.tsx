const PROBLEMS = [
  ['Muitas planilhas', 'A operação depende de várias planilhas para controlar o dia a dia.'],
  ['Informações espalhadas', 'Dados de clientes, pedidos ou estoque ficam em lugares diferentes.'],
  ['Processos manuais', 'A equipe repete as mesmas tarefas e perde tempo com controle feito à mão.'],
  ['Sistema pronto que não cabe', 'A ferramenta genérica não acompanha o jeito como a empresa realmente trabalha.'],
  ['Dificuldade para acompanhar', 'Fica difícil ter visão de estoque, pedidos, clientes ou atividades em um só lugar.'],
  ['Retrabalho e erros', 'Sem integração, a mesma informação é digitada mais de uma vez e os erros se acumulam.'],
  ['Precisa de um sistema específico', 'A operação pede um controle feito sob medida, e não um pacote genérico.'],
]

export default function Problemas({ variant = 'home' }: { variant?: 'home' | 'landing' }) {
  const problems = variant === 'landing' ? PROBLEMS : [
    ['Seus serviços não têm uma página própria', 'Clientes precisam de um lugar para conhecer sua empresa, entender sua oferta e entrar em contato.'],
    ['A divulgação não explica o que você oferece', 'Uma campanha ou serviço precisa de uma página com informações claras e um caminho para conversar.'],
    ...PROBLEMS.slice(0, 4),
  ]
  return (
    <section id="problemas" className="site-section problems-section">
      <div className="site-container">
        <div className="section-heading">
          <p className="site-eyebrow">Situações comuns</p>
          <h2>Seu negócio se identifica com algum desses problemas?</h2>
          <p>{variant === 'landing' ? 'Se alguma dessas situações acontece hoje, um sistema sob medida pode organizar o que já existe.' : 'Da apresentação dos seus serviços à organização da operação, o projeto começa pela sua necessidade.'}</p>
        </div>
        <div className="problems-grid">
          {problems.map(([title, description]) => (
            <article className="problem-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
