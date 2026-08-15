export type ProjectLink = {
  label: string
  href: string
  primary?: boolean
}

export type ResponsiveImage = {
  src: string
  srcSet: string
  sizes: string
  width: number
  height: number
  alt: string
}

export type ArchitectureStep = {
  label: string
  detail: string
}

export type CaseStudy = {
  slug: string
  role: string
  contributions: readonly [string, ...string[]]
  architecture: readonly [ArchitectureStep, ...ArchitectureStep[]]
  decisions: readonly [string, ...string[]]
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

type ProjectNarrative = {
  problem: string
  solution: string
}

export type FeaturedProject = ProjectBase &
  ProjectNarrative & {
    featured: true
    cover: ResponsiveImage
    highlights: readonly [string, string, string]
    caseStudy: CaseStudy
  }

export type SupportingProjectWithoutCase = ProjectBase & {
  featured: false
  details: string
  caseStudy?: never
}

export type SupportingCaseProject = ProjectBase &
  ProjectNarrative & {
    featured: false
    details: string
    caseStudy: CaseStudy
  }

export type SupportingProject = SupportingProjectWithoutCase | SupportingCaseProject
export type Project = FeaturedProject | SupportingProject
export type CaseStudyProject = FeaturedProject | SupportingCaseProject

const PROJECT_IMAGE_SIZES = '(min-width: 1024px) 560px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)'

const projectImage = (name: string, alt: string): ResponsiveImage => ({
  src: `/projects/${name}.webp`,
  srcSet: `/projects/${name}-480.webp 480w, /projects/${name}-800.webp 800w, /projects/${name}.webp 1280w`,
  sizes: PROJECT_IMAGE_SIZES,
  width: 1280,
  height: 720,
  alt,
})

export const PROJECTS = [
  {
    id: 'convites-saas',
    title: 'Convites — SaaS de convites personalizados',
    status: 'Em pré-lançamento',
    category: 'SaaS',
    summary: 'Convites com página própria, respostas organizadas e um painel por cliente.',
    featured: true,
    cover: projectImage(
      'convites',
      'Landing page do SaaS Convites exibindo um convite demonstrativo e a lista de espera',
    ),
    problem:
      'Convites importantes acabam espalhados em mensagens, enquanto confirmações e detalhes se perdem na conversa.',
    solution:
      'Um SaaS multi-tenant que reúne criação, compartilhamento e acompanhamento de convites em uma experiência única.',
    highlights: [
      'Cadastro, login e organizações separadas para cada cliente.',
      'Links públicos personalizados com respostas e acompanhamento no painel.',
      'Planos, limites de uso, lista de espera e integrações de e-mail.',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'React', 'PostgreSQL', 'Vercel'],
    links: [
      {
        label: 'Conhecer o SaaS',
        href: 'https://convites.mattecnologia.dev.br',
        primary: true,
      },
    ],
    caseStudy: {
      slug: 'convites',
      role: 'Planejamento da arquitetura, modelagem das entidades e desenvolvimento das experiências pública e autenticada.',
      contributions: [
        'Estruturação da autenticação, das organizações e do isolamento de dados por cliente.',
        'Desenvolvimento dos links públicos, do painel privado e do fluxo da lista de espera.',
        'Integração da persistência e dos serviços de e-mail à aplicação.',
      ],
      architecture: [
        { label: 'Next.js e React', detail: 'Landing, páginas públicas e painel autenticado.' },
        { label: 'Autenticação e organizações', detail: 'Acesso e separação da operação de cada cliente.' },
        { label: 'Supabase e PostgreSQL', detail: 'Persistência das entidades e respostas dos convites.' },
        { label: 'Vercel', detail: 'Hospedagem da aplicação web.' },
      ],
      decisions: [
        'Separar a experiência pública do convite do painel privado de administração.',
        'Organizar usuários e dados por organização para sustentar o modelo multi-tenant.',
        'Manter planos e limites como parte da base do produto desde o pré-lançamento.',
      ],
    },
  },
  {
    id: 'estoque-desktop',
    title: 'Gerenciamento de Estoque Desktop',
    status: 'MVP desktop em evolução',
    category: 'Aplicação desktop',
    summary: 'Controle local e confiável para a rotina de um depósito, mesmo sem internet.',
    featured: true,
    cover: projectImage(
      'estoque',
      'Painel do sistema desktop de gerenciamento de estoque preenchido com dados fictícios',
    ),
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
    caseStudy: {
      slug: 'estoque',
      role: 'Definição da arquitetura em camadas e desenvolvimento da aplicação desktop, persistência e rotinas operacionais.',
      contributions: [
        'Implementação do controle de produtos, movimentações, saldos e validades.',
        'Criação dos alertas, da autorização administrativa e da trilha de auditoria.',
        'Preparação de relatórios, backup local, testes e instalador para Windows.',
      ],
      architecture: [
        { label: 'Avalonia UI', detail: 'Interface desktop para a rotina do depósito.' },
        { label: 'Regras da aplicação', detail: 'Validação de saldos, movimentações, alertas e permissões.' },
        { label: 'Dapper e SQLite', detail: 'Persistência local com funcionamento offline.' },
        { label: 'Backup e exportação', detail: 'Preservação do histórico e relatórios em Excel.' },
      ],
      decisions: [
        'Priorizar o funcionamento local para não tornar a operação dependente de internet.',
        'Separar interface, regras e persistência para permitir evolução do MVP.',
        'Proteger o histórico com auditoria e rotinas de backup.',
      ],
    },
  },
  {
    id: 'zd-signature-input',
    title: 'ZdSignatureInput',
    status: 'Pacote publicado',
    category: 'Componente reutilizável',
    summary: 'Captura de assinatura por desenho ou upload para aplicações da plataforma Zeedhi.',
    featured: true,
    cover: projectImage(
      'zd-signature',
      'Demo do componente ZdSignatureInput com uma assinatura fictícia desenhada no canvas',
    ),
    problem:
      'Aplicações Zeedhi precisavam coletar assinaturas de forma consistente, validável e integrada ao modelo dos demais campos.',
    solution:
      'Um componente configurável que aceita desenho ou imagem e entrega o resultado em PNG base64 por uma API previsível.',
    highlights: [
      'Canvas, upload, limpeza, validação e eventos de mudança.',
      'Opções de cor, tamanho, formatos aceitos e limite de arquivo.',
      'Pacotes versionados com lint, build e verificação antes da publicação.',
    ],
    stack: ['TypeScript', 'Vue.js', 'Vuetify', 'Zeedhi', 'NPM'],
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
    caseStudy: {
      slug: 'zd-signature-input',
      role: 'Desenvolvimento da API do componente, dos fluxos de entrada e do processo de empacotamento e publicação.',
      contributions: [
        'Implementação de desenho em canvas, upload, limpeza, validação e eventos de mudança.',
        'Criação de opções para cor, tamanho, formatos aceitos e limite de arquivo.',
        'Organização do lint, build e verificação do pacote antes da publicação.',
      ],
      architecture: [
        { label: 'Aplicação Vue e Zeedhi', detail: 'Contexto em que o campo reutilizável é consumido.' },
        { label: 'ZdSignatureInput', detail: 'Canvas, upload, validação e configuração do componente.' },
        { label: 'Eventos e PNG base64', detail: 'Contrato de saída para integração aos formulários.' },
        { label: 'NPM', detail: 'Distribuição e versionamento do pacote publicado.' },
      ],
      decisions: [
        'Oferecer desenho e upload no mesmo componente para atender fluxos diferentes.',
        'Entregar uma saída previsível em PNG base64 para simplificar a integração.',
        'Tratar validação e eventos como parte da API pública do campo.',
      ],
    },
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
    title: 'Sistema PDV Full Stack',
    status: 'Projeto full stack',
    category: 'Aplicação web',
    summary: 'Ponto de venda com produtos, estoque, usuários e comunicação entre frontend e backend.',
    featured: false,
    details:
      'Aplicação de ponto de venda com autenticação JWT, perfis de acesso, produtos, estoque e integração entre interface e API.',
    problem:
      'A operação de venda precisava reunir produtos, estoque e usuários em um fluxo único, com acesso controlado e regras centralizadas.',
    solution:
      'Uma aplicação full stack que separa a interface React, a API Laravel e a persistência PostgreSQL, com autenticação por JWT.',
    stack: ['React', 'Laravel', 'PostgreSQL', 'JWT', 'AWS', 'Vercel'],
    links: [],
    caseStudy: {
      slug: 'pdv',
      role: 'Desenvolvimento da integração entre frontend e backend, autenticação e estrutura das funcionalidades de produto e estoque.',
      contributions: [
        'Criação das APIs para conectar a interface às regras de negócio.',
        'Implementação da autenticação JWT e dos perfis de acesso.',
        'Estruturação do gerenciamento de produtos e estoque e da preparação para publicação.',
      ],
      architecture: [
        { label: 'React', detail: 'Interface do ponto de venda e do gerenciamento.' },
        { label: 'Laravel e JWT', detail: 'API, regras de negócio, autenticação e perfis de acesso.' },
        { label: 'PostgreSQL', detail: 'Persistência de usuários, produtos e estoque.' },
        { label: 'AWS e Vercel', detail: 'Estrutura preparada para publicação da API e da interface.' },
      ],
      decisions: [
        'Separar frontend e API para manter responsabilidades bem definidas.',
        'Centralizar autenticação e autorização no backend com JWT.',
        'Usar banco relacional para representar usuários, produtos e movimentações.',
      ],
    },
  },
] as const satisfies readonly Project[]

export const FEATURED_PROJECTS = PROJECTS.filter(
  (project): project is (typeof PROJECTS)[number] & FeaturedProject => project.featured,
)

export const SUPPORTING_PROJECTS = PROJECTS.filter(
  (project): project is (typeof PROJECTS)[number] & SupportingProject => !project.featured,
)

export function isCaseStudyProject(project: Project): project is CaseStudyProject {
  return 'caseStudy' in project && project.caseStudy !== undefined
}

export const CASE_STUDY_PROJECTS = PROJECTS.filter(
  (project): project is (typeof PROJECTS)[number] & CaseStudyProject => 'caseStudy' in project,
)

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id)
}

export function getProjectBySlug(slug: string): CaseStudyProject | undefined {
  return CASE_STUDY_PROJECTS.find((project) => project.caseStudy.slug === slug)
}

export function getProjectCasePath(project: CaseStudyProject): string {
  return `/projetos/${project.caseStudy.slug}/`
}
