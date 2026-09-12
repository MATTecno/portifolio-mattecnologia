import {
  getProjectById,
  getProjectCasePath,
  isCaseStudyProject,
  type CaseStudyProject,
  type ResponsiveImage,
} from './projects'

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
  focusAreas?: readonly {
    title: string
    context: string
    contribution: string
  }[]
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
  cover?: ResponsiveImage
  casePath?: string
}

export type RecruiterSkillGroup = {
  title: string
  description: string
  items: readonly string[]
  evidence: readonly RecruiterLink[]
}

export type RecruiterProfile = {
  name: string
  headline: string
  location: string
  email: string
  linkedin: string
  github: string
  availability: readonly string[]
  objective: string
  coreSkills: readonly string[]
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

function requireCaseProject(id: string): CaseStudyProject {
  const project = getProjectById(id)
  if (!project || !isCaseStudyProject(project)) {
    throw new Error(`Projeto de case não encontrado: ${id}`)
  }
  return project
}

function toRecruiterProject(id: string, featured = false): RecruiterProject {
  const project = requireCaseProject(id)
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    status: project.status,
    summary: project.summary,
    contributions: project.caseStudy.contributions,
    stack: project.stack,
    links: project.links.map(({ label, href }) => ({ label, href })),
    featured,
    cover: project.featured ? project.cover : undefined,
    casePath: getProjectCasePath(project),
  }
}

export const RECRUITER_PROJECTS: readonly RecruiterProject[] = [
  toRecruiterProject('zd-signature-input', true),
  toRecruiterProject('convites-saas', true),
  toRecruiterProject('pdv', true),
  toRecruiterProject('estoque-desktop'),
  toRecruiterProject('brutona'),
  toRecruiterProject('vm-viagens'),
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
  objective: 'Busco oportunidades como Desenvolvedor Full Stack ou Backend PHP, nos níveis Júnior e Pleno, com contratação CLT ou PJ.',
  coreSkills: ['PHP', 'TypeScript', 'Vue.js', 'Oracle', 'PostgreSQL', 'APIs REST'],
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
        'Participação em decisões técnicas, Code Reviews, validação de entregas e integração de novos colaboradores.',
      ],
      focusAreas: [
        {
          title: 'Sustentação de sistemas em produção',
          context: 'Problemas críticos identificados durante o uso dos sistemas corporativos.',
          contribution: 'Investigação e correção de bugs, com participação na validação das entregas.',
        },
        {
          title: 'Consultas e regras no banco de dados',
          context: 'Sistemas corporativos integrados a bancos Oracle e PostgreSQL.',
          contribution: 'Criação e otimização de consultas SQL, procedures e rotinas de banco de dados.',
        },
        {
          title: 'Requisitos, módulos e integrações',
          context: 'Demandas de clientes e equipes internas para evolução dos sistemas.',
          contribution: 'Levantamento e refinamento de requisitos, implementação de telas, regras de negócio e integrações por APIs REST.',
        },
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
    {
      title: 'Uso profissional',
      description: 'Tecnologias e práticas presentes na atuação com sistemas corporativos na Teknisa.',
      items: ['PHP', 'TypeScript', 'Vue.js', 'Oracle', 'PostgreSQL', 'SQL', 'APIs REST', 'Git', 'Code Review'],
      evidence: [{ label: 'Experiência na Teknisa', href: '#experiencia' }],
    },
    {
      title: 'Aplicadas em projetos',
      description: 'Tecnologias utilizadas nos produtos e componentes apresentados neste portfólio.',
      items: ['React', 'Laravel', 'Supabase', 'C# / .NET', 'SQLite', 'Docker', 'Vuetify', 'Zeedhi', 'NPM', 'GitHub', 'Vercel', 'Tailwind CSS', 'Java / Android'],
      evidence: [
        { label: 'ZdSignatureInput', href: '/projetos/zd-signature-input/' },
        { label: 'Convites', href: '/projetos/convites/' },
        { label: 'PDV', href: '/projetos/pdv/' },
        { label: 'Estoque Desktop', href: '/projetos/estoque/' },
        { label: 'Outros projetos', href: '#outros-projetos' },
      ],
    },
    {
      title: 'Conhecimentos complementares',
      description: 'Conhecimentos que complementam a atuação e os estudos em desenvolvimento de software.',
      items: ['JavaScript', 'MySQL', 'Postman', 'AWS', 'Arquitetura de Software', 'Clean Code', 'SOLID', 'Scrum', 'Kanban'],
      evidence: [],
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
