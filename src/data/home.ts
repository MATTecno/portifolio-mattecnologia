import { getProjectById, type FeaturedProject } from './projects'
import type { FaqItem } from './faq'

export const HOME_PROJECTS = [
  {
    id: 'apublicitaria',
    name: 'aPublicitária',
    description:
      'Portfólio digital com uma experiência tão autoral quanto o trabalho que apresenta.',
    tags: ['Portfólio', 'Interação', 'Contato'],
  },
  {
    id: 'brutona',
    name: 'Brutona',
    description:
      'Uma experiência digital para levar a identidade artesanal da Brutona também para o online.',
    tags: ['Site', 'Catálogo', 'WhatsApp'],
  },
  {
    id: 'vm-viagens',
    name: 'VM Viagens',
    description:
      'Destinos para descobrir. Um planejador para transformar a próxima viagem em conversa.',
    tags: ['Experiência editorial', 'Destinos', 'WhatsApp'],
  },
].map((item) => ({ ...item, project: getProjectById(item.id) as FeaturedProject }))

export const EDITORIAL_FAQ: FaqItem[] = [
  {
    id: 'conhecimento',
    question: 'Preciso saber exatamente qual sistema quero?',
    answer: 'Não. Podemos começar pelo problema e entender juntos qual solução faz sentido.',
  },
  {
    id: 'solucoes',
    question: 'Vocês fazem apenas sistemas?',
    answer:
      'Também desenvolvemos sites, e-commerce, automações, integrações e experiências digitais. O formato depende do que a sua empresa precisa resolver.',
  },
  {
    id: 'regiao',
    question: 'Atendem empresas fora de Belo Horizonte?',
    answer:
      'Sim. Projetos digitais podem ser conduzidos remotamente. Em Belo Horizonte e região, podemos combinar um alinhamento presencial quando necessário.',
  },
  {
    id: 'inicio',
    question: 'Como funciona para pedir um orçamento?',
    answer:
      'Conte brevemente sua necessidade pelo WhatsApp. Entendemos o contexto e definimos o escopo para preparar uma proposta. Se preferir, use o formulário de contato.',
  },
]
