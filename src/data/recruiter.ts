export type RecruiterLink = {
  label: string
  href: string
}

export type RecruiterExperience = {
  id: string
  company: string
  role: string
  period: string
  sortOrder: number
  highlights: readonly string[]
}

export type RecruiterProject = {
  id: string
  title: string
  category: string
  status: string
  summary: string
  contributions: readonly string[]
  stack: readonly string[]
  links: readonly RecruiterLink[]
  featured: boolean
  cover?: string
  coverAlt?: string
}

export type RecruiterSkillGroup = {
  title: string
  items: readonly string[]
}

export type RecruiterProfile = {
  name: string
  headline: string
  location: string
  email: string
  linkedin: string
  github: string
  availability: readonly string[]
  summary: readonly string[]
  experience: readonly RecruiterExperience[]
  skills: readonly RecruiterSkillGroup[]
  education: {
    course: string
    institution: string
    period: string
  }
  certifications: readonly string[]
  languages: readonly {
    language: string
    level: string
  }[]
}

export const RECRUITER_PROJECTS: readonly RecruiterProject[] = [
  {
    id: 'convites-saas',
    title: 'Convites — SaaS de convites personalizados',
    category: 'SaaS',
    status: 'Em pré-lançamento',
    summary:
      'Produto multi-tenant para criar, compartilhar e acompanhar convites personalizados por organização.',
    contributions: [
      'Planejamento da arquitetura e modelagem das entidades principais.',
      'Autenticação, organizações, usuários e isolamento de dados por cliente.',
      'Links públicos, painel privado, lista de espera e integrações de e-mail.',
    ],
    stack: ['Next.js', 'TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Vercel'],
    links: [{ label: 'Acessar produto', href: 'https://convites.mattecnologia.dev.br' }],
    featured: true,
    cover: '/projects/convites.webp',
    coverAlt: 'Landing page do SaaS Convites com formulário de lista de espera',
  },
  {
    id: 'zd-signature-input',
    title: 'ZdSignatureInput',
    category: 'Biblioteca reutilizável',
    status: 'Pacote publicado',
    summary:
      'Componente para captura de assinatura por canvas ou upload, distribuído como pacote versionado no NPM.',
    contributions: [
      'API configurável com validação, eventos e saída em PNG base64.',
      'Organização em pacotes reutilizáveis para integração em aplicações Vue.',
      'Pipeline de lint, build e verificação do pacote antes da publicação.',
    ],
    stack: ['TypeScript', 'Vue.js', 'Vuetify', 'Zeedhi', 'NPM'],
    links: [
      { label: 'GitHub', href: 'https://github.com/MATTecno/zd-signature-input' },
      { label: 'Pacote NPM', href: 'https://www.npmjs.com/package/@marcelodl49/zd-signature-input' },
    ],
    featured: true,
    cover: '/projects/zd-signature.webp',
    coverAlt: 'Demonstração do ZdSignatureInput com assinatura fictícia desenhada no canvas',
  },
  {
    id: 'estoque-desktop',
    title: 'Gerenciamento de Estoque Desktop',
    category: 'Aplicação desktop',
    status: 'MVP em evolução',
    summary:
      'Aplicação Windows offline para controlar produtos, entradas, saídas, validades e histórico operacional.',
    contributions: [
      'Arquitetura em camadas com persistência local e funcionamento sem internet.',
      'Controle de movimentações, alertas, auditoria e autorização administrativa.',
      'Relatórios em Excel, backup local, testes e instalador para Windows.',
    ],
    stack: ['C#', '.NET 10', 'Avalonia UI', 'SQLite', 'Dapper'],
    links: [],
    featured: true,
    cover: '/projects/estoque.webp',
    coverAlt: 'Painel do sistema desktop de estoque com dados totalmente fictícios',
  },
  {
    id: 'pdv',
    title: 'Sistema PDV Full Stack',
    category: 'Aplicação web',
    status: 'Projeto full stack',
    summary:
      'Sistema de ponto de venda com autenticação, produtos, estoque, usuários e comunicação entre frontend e backend.',
    contributions: [
      'APIs para integração entre a interface e as regras de negócio.',
      'Autenticação JWT, perfis de acesso e gerenciamento de produtos.',
      'Estrutura preparada para publicação em AWS e Vercel.',
    ],
    stack: ['React', 'Laravel', 'PostgreSQL', 'JWT', 'AWS', 'Vercel'],
    links: [],
    featured: true,
  },
  {
    id: 'android-barcode',
    title: 'Aplicativo Android para leitura de código de barras',
    category: 'Mobile',
    status: 'Projeto Android',
    summary:
      'Aplicativo para identificar produtos pela câmera e apoiar cadastro, consulta e gerenciamento de informações.',
    contributions: [],
    stack: ['Java', 'Android'],
    links: [],
    featured: false,
  },
  {
    id: 'controle-producao',
    title: 'Sistema de Controle de Produção',
    category: 'Sistema corporativo',
    status: 'Sistema sob medida',
    summary:
      'Ordens de produção, apontamentos, rastreabilidade, indicadores e integração com serviços internos.',
    contributions: [],
    stack: ['Laravel', 'PostgreSQL', 'Docker'],
    links: [],
    featured: false,
  },
  {
    id: 'automacao-emails',
    title: 'Automação de E-mails Corporativos',
    category: 'Automação',
    status: 'Integração',
    summary:
      'Processamento de anexos, validações, filas, retentativas e envio de dados para uma API.',
    contributions: [],
    stack: ['Node.js', 'Gmail API', 'Queues'],
    links: [],
    featured: false,
  },
]

export const RECRUITER_PROFILE: RecruiterProfile = {
  name: 'Marcelo Diogo Teixeira',
  headline: 'Desenvolvedor Full Stack',
  location: 'Belo Horizonte — MG',
  email: 'marcelos.diogo8@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marcelo-diogo-05289b264',
  github: 'https://github.com/MATTecno',
  availability: ['Remoto', 'Híbrido', 'Presencial em Belo Horizonte'],
  summary: [
    'Desenvolvedor Full Stack com experiência no desenvolvimento e na manutenção de sistemas corporativos, módulos, interfaces, APIs REST e integrações com bancos Oracle e PostgreSQL.',
    'Atuação em análise de regras de negócio, correção de problemas de produção, refinamento de requisitos com clientes e equipes internas, decisões técnicas e revisão de código.',
  ],
  experience: [
    {
      id: 'teknisa-junior',
      company: 'Teknisa Software',
      role: 'Desenvolvedor Full Stack Júnior',
      period: '2025 — Atual',
      sortOrder: 2025,
      highlights: [
        'Desenvolvimento e manutenção de sistemas corporativos com PHP, TypeScript, Vue.js, Oracle e PostgreSQL.',
        'Implementação de módulos, telas, regras de negócio e integrações por APIs REST.',
        'Investigação e correção de bugs críticos, incluindo problemas identificados em produção.',
        'Levantamento e refinamento de requisitos com clientes e equipes internas.',
        'Criação e otimização de consultas SQL, procedures e rotinas de banco de dados.',
        'Participação em decisões técnicas, Code Reviews, validação de entregas e integração de novos colaboradores.',
      ],
    },
    {
      id: 'teknisa-estagio',
      company: 'Teknisa Software',
      role: 'Estagiário em Desenvolvimento',
      period: '2024',
      sortOrder: 2024,
      highlights: [
        'Desenvolvimento de funcionalidades frontend e backend em sistemas corporativos.',
        'Implementação de telas, regras de negócio e integrações com Oracle.',
        'Investigação e correção de problemas relatados por usuários.',
        'Uso de Git no versionamento e acompanhamento das alterações.',
      ],
    },
  ],
  skills: [
    { title: 'Linguagens', items: ['PHP', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C#'] },
    { title: 'Frontend', items: ['Vue.js', 'React', 'Tailwind CSS', 'Vuetify'] },
    { title: 'Backend', items: ['PHP', 'Laravel', 'APIs REST', '.NET'] },
    { title: 'Bancos de dados', items: ['Oracle', 'PostgreSQL', 'MySQL', 'Supabase', 'SQLite'] },
    { title: 'Ferramentas', items: ['Docker', 'Git', 'GitHub', 'Postman', 'AWS', 'Vercel', 'NPM'] },
    {
      title: 'Práticas',
      items: ['Arquitetura de Software', 'Clean Code', 'SOLID', 'Code Review', 'Scrum', 'Kanban'],
    },
  ],
  education: {
    course: 'Bacharelado em Ciência da Computação',
    institution: 'UniBH',
    period: '2023 — Em andamento',
  },
  certifications: [
    'Oracle Java Foundation Learner',
    'JavaScript — Curso em Vídeo',
    'React.js — Marco Bruno',
    'Participação no Hackathon StartSe',
  ],
  languages: [
    { language: 'Português', level: 'Nativo' },
    {
      language: 'Inglês',
      level: 'Leitura e escrita técnica para documentação, APIs e ferramentas; conversação básica',
    },
  ],
}

export const RESUME_PHONE = '(31) 99579-7235'

export const FEATURED_RECRUITER_PROJECTS = RECRUITER_PROJECTS.filter((project) => project.featured)
export const SECONDARY_RECRUITER_PROJECTS = RECRUITER_PROJECTS.filter((project) => !project.featured)
