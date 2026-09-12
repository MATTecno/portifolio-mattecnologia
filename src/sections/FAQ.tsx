const QUESTIONS = [
  [
    'Como funciona a contratação?',
    'A conversa inicial serve para entender a necessidade. A proposta deve registrar escopo, entregáveis, responsabilidades, valores e condições de execução antes do início do trabalho.',
  ],
  [
    'O que será entregue?',
    'Os entregáveis variam conforme o projeto. Funcionalidades, documentação, orientações de uso e publicação precisam estar descritas na proposta para que você saiba o que está incluído.',
  ],
  [
    'Como funciona o pagamento?',
    'Valores, etapas de pagamento e eventuais serviços recorrentes são definidos na proposta. O formulário deste site reúne informações para essa conversa e não gera um orçamento automático.',
  ],
  [
    'Hospedagem e domínio estão incluídos?',
    'Depende do escopo. Hospedagem, domínio e serviços de terceiros devem ser discriminados na proposta, incluindo custos recorrentes e quem ficará responsável pelas contas. Aplicações locais podem ter necessidades diferentes.',
  ],
  [
    'Como ficam o código-fonte e os acessos?',
    'As condições de entrega do código-fonte, repositórios e acessos precisam ser combinadas e registradas na proposta. Bibliotecas e serviços de terceiros seguem suas respectivas licenças e condições.',
  ],
  [
    'Há suporte depois da entrega?',
    'O acompanhamento após a entrega deve ser definido na proposta, com período, canais e atividades incluídas. Manutenção contínua e novas funcionalidades precisam ter seu escopo combinado.',
  ],
]
export default function FAQ() {
  return (
    <section id="perguntas" className="site-section faq-section">
      <div className="site-container faq-layout">
        <div className="section-heading">
          <p className="site-eyebrow">Antes de começar</p>
          <h2>Perguntas frequentes.</h2>
        </div>
        <div>
          {QUESTIONS.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
