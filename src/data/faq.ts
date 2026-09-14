export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const COMMERCIAL_FAQ: FaqItem[] = [
  {
    id: 'custo',
    question: 'Quanto custa desenvolver um sistema sob medida?',
    answer:
      'Depende do escopo, da quantidade de funcionalidades e da complexidade. Primeiro entendemos a necessidade da empresa e, a partir disso, elaboramos uma proposta.',
  },
  {
    id: 'regiao',
    question: 'Vocês desenvolvem apenas para empresas de Belo Horizonte?',
    answer:
      'O atendimento presencial e próximo é em Belo Horizonte e região. Projetos também podem ser conduzidos remotamente quando isso fizer sentido para a operação.',
  },
  {
    id: 'conhecimento',
    question: 'Preciso saber exatamente como o sistema deve funcionar?',
    answer:
      'Não. A conversa inicial serve justamente para entender o problema, organizar o que já existe e ajudar a estruturar a solução.',
  },
  {
    id: 'sistemas_existentes',
    question: 'Vocês trabalham com sistemas que já existem?',
    answer:
      'Sim. Melhorias, integrações e evolução de um sistema existente podem ser avaliadas conforme a necessidade e a complexidade do que já está em uso.',
  },
  {
    id: 'inicio',
    question: 'Como começa um projeto?',
    answer:
      'O caminho é simples: contato, conversa inicial, entendimento da necessidade, definição de escopo e envio da proposta.',
  },
]

export const SUPPORTING_FAQ: FaqItem[] = [
  {
    id: 'contratacao',
    question: 'Como funciona a contratação?',
    answer:
      'A conversa inicial serve para entender a necessidade. A proposta deve registrar escopo, entregáveis, responsabilidades, valores e condições de execução antes do início do trabalho.',
  },
  {
    id: 'entregaveis',
    question: 'O que será entregue?',
    answer:
      'Os entregáveis variam conforme o projeto. Funcionalidades, documentação, orientações de uso e publicação precisam estar descritas na proposta para que você saiba o que está incluído.',
  },
  {
    id: 'suporte',
    question: 'Há suporte depois da entrega?',
    answer:
      'O acompanhamento após a entrega deve ser definido na proposta, com período, canais e atividades incluídas. Manutenção contínua e novas funcionalidades precisam ter seu escopo combinado.',
  },
]
