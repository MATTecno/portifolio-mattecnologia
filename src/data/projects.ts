export type ProjectLink = {
  label: string
  href: string
  primary?: boolean
}

type ProjectBase = {
  id: string
  title: string
  status: string
  category: string
  summary: string
  stack: readonly string[]
  links: readonly ProjectLink[]
}

export type FeaturedProject = ProjectBase & {
  featured: true
  cover: string
  coverAlt: string
  problem: string
  solution: string
  highlights: readonly [string, string, string]
}

export type SupportingProject = ProjectBase & {
  featured: false
  details: string
}

export type Project = FeaturedProject | SupportingProject

export const PROJECTS: readonly Project[] = [
  {
    id: 'convites-saas',
    title: 'Convites — SaaS de convites personalizados',
    status: 'Em pré-lançamento',
    category: 'SaaS',
    summary: 'Convites com página própria, respostas organizadas e um painel por cliente.',
    featured: true,
    cover: '/projects/convites.webp',
    coverAlt: 'Landing page do SaaS Convites exibindo um convite demonstrativo e a lista de espera',
    problem:
      'Convites importantes acabam espalhados em mensagens, enquanto confirmações e detalhes se perdem na conversa.',
    solution:
      'Um SaaS multi-tenant que reúne criação, compartilhamento e acompanhamento de convites em uma experiência única.',
    highlights: [
      'Cadastro, login e organizações separadas para cada cliente.',
      'Links públicos personalizados com respostas e acompanhamento no painel.',
      'Planos, limites de uso, lista de espera e integrações de e-mail.',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'React', 'Vercel'],
    links: [
      {
        label: 'Conhecer o SaaS',
        href: 'https://convites.mattecnologia.dev.br',
        primary: true,
      },
    ],
  },
  {
    id: 'estoque-desktop',
    title: 'Gerenciamento de Estoque Desktop',
    status: 'MVP desktop em evolução',
    category: 'Aplicação desktop',
    summary: 'Controle local e confiável para a rotina de um depósito, mesmo sem internet.',
    featured: true,
    cover: '/projects/estoque.webp',
    coverAlt: 'Painel do sistema desktop de gerenciamento de estoque preenchido com dados fictícios',
    problem:
      'A operação precisava registrar entradas, saídas e validades em um único computador, sem depender de nuvem ou mensalidade.',
    solution:
      'Uma aplicação Windows offline, pensada para uma rotina operacional simples e para preservar todo o histórico do estoque.',
    highlights: [
      'Entradas e saídas com saldo protegido e controle interno por validade.',
      'Alertas, autorização administrativa e trilha de auditoria.',
      'Relatórios em Excel, backups e instalador para entrega no Windows.',
    ],
    stack: ['C#', '.NET 10', 'Avalonia UI', 'SQLite', 'Dapper'],
    links: [],
  },
  {
    id: 'zd-signature-input',
    title: 'ZdSignatureInput',
    status: 'Pacote publicado',
    category: 'Componente reutilizável',
    summary: 'Captura de assinatura por desenho ou upload para aplicações da plataforma Zeedhi.',
    featured: true,
    cover: '/projects/zd-signature.webp',
    coverAlt: 'Demo do componente ZdSignatureInput com uma assinatura fictícia desenhada no canvas',
    problem:
      'Aplicações Zeedhi precisavam coletar assinaturas de forma consistente, validável e integrada ao modelo dos demais campos.',
    solution:
      'Um componente configurável que aceita desenho ou imagem e entrega o resultado em PNG base64 por uma API previsível.',
    highlights: [
      'Canvas, upload, limpeza, validação e eventos de mudança.',
      'Opções de cor, tamanho, formatos aceitos e limite de arquivo.',
      'Pacotes versionados com lint, build e verificação antes da publicação.',
    ],
    stack: ['TypeScript', 'Vue', 'Vuetify', 'Zeedhi', 'NPM'],
    links: [
      {
        label: 'Ver no GitHub',
        href: 'https://github.com/MATTecno/zd-signature-input',
        primary: true,
      },
      {
        label: 'Ver pacote NPM',
        href: 'https://www.npmjs.com/package/@marcelodl49/zd-signature-input',
      },
    ],
  },
  {
    id: 'producao',
    title: 'Sistema de Controle de Produção',
    status: 'Sistema sob medida',
    category: 'Operação industrial',
    summary: 'Ordens de produção, rastreabilidade e indicadores operacionais em tempo real.',
    featured: false,
    details:
      'Sistema para cadastro de ordens, apontamentos no chão de fábrica, rastreabilidade e dashboards, com API interna para integração ao ERP.',
    stack: ['Laravel', 'PostgreSQL', 'Docker'],
    links: [],
  },
  {
    id: 'automacao-emails',
    title: 'Automação de E-mails Corporativos',
    status: 'Automação',
    category: 'Integração',
    summary: 'Processamento automático de anexos com validações, filas e integração a backend.',
    featured: false,
    details:
      'Serviço que lê caixas específicas, extrai anexos PDF e CSV, valida os arquivos e envia os dados para uma API com retentativas, logs e alertas.',
    stack: ['Node.js', 'Gmail API', 'Queues'],
    links: [],
  },
  {
    id: 'pdv',
    title: 'PDV',
    status: 'Produto web',
    category: 'Varejo',
    summary: 'Ponto de venda com produtos, usuários, cupons e emissão de comprovantes.',
    featured: false,
    details:
      'Backoffice e PDV com autenticação JWT, perfis de acesso e integração com impressora térmica para a operação de vendas.',
    stack: ['Laravel', 'JWT', 'Docker'],
    links: [],
  },
]

export const FEATURED_PROJECTS = PROJECTS.filter(
  (project): project is FeaturedProject => project.featured,
)

export const SUPPORTING_PROJECTS = PROJECTS.filter(
  (project): project is SupportingProject => !project.featured,
)
