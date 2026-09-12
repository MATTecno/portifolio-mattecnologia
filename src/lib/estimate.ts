import { getProjectById } from '../data/projects'

export const PROJECT_OPTIONS = {
  orientacao: 'Não sei / preciso de orientação',
  site: 'Site ou página de apresentação',
  web: 'Sistema web',
  desktop: 'Aplicação desktop',
  mobile: 'Aplicativo mobile',
  web_mobile: 'Web e mobile',
  automacao: 'Automação e integração',
  evolucao: 'Evolução de um sistema existente',
} as const

export const FEATURE_OPTIONS = {
  usuarios: 'Acesso de usuários',
  dados: 'Painel e dados',
  integracoes: 'Integrações',
  pagamentos: 'Pagamentos',
  arquivos: 'Arquivos e uploads',
  offline: 'Funcionamento offline',
} as const

export type ProjectBriefing = {
  project: keyof typeof PROJECT_OPTIONS
  description: string
  features: (keyof typeof FEATURE_OPTIONS)[]
  deadline: 'undefined' | 'date'
  desiredDate: string
}
export type ProjectReference = { id: string; title: string }

export const EMPTY_BRIEFING: ProjectBriefing = {
  project: 'orientacao',
  description: '',
  features: [],
  deadline: 'undefined',
  desiredDate: '',
}

export function getProjectReference(url: URL): ProjectReference | undefined {
  const id = url.searchParams.get('projeto')
  const project = id ? getProjectById(id) : undefined
  return project ? { id: project.id, title: project.title } : undefined
}

export function validateBriefing(briefing: ProjectBriefing): string | null {
  if (briefing.description.length > 2000) return 'Descreva a necessidade em até 2.000 caracteres.'
  if (briefing.deadline === 'date') {
    const date = briefing.desiredDate
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Informe a data desejada ou selecione “Sem data definida”.'
    const parsed = new Date(`${date}T12:00:00Z`)
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
      return 'Informe uma data válida.'
  }
  return null
}

export function formatBriefing(briefing: ProjectBriefing): string {
  const date =
    briefing.deadline === 'date' && briefing.desiredDate
      ? briefing.desiredDate.split('-').reverse().join('/')
      : 'A definir'
  return [
    'Resumo do projeto',
    `Necessidade: ${PROJECT_OPTIONS[briefing.project]}`,
    `Descrição: ${briefing.description.trim() || 'A definir'}`,
    `Recursos: ${briefing.features.length ? briefing.features.map((feature) => FEATURE_OPTIONS[feature]).join(', ') : 'A definir'}`,
    `Data desejada: ${date}${date !== 'A definir' ? ' (preferência, a confirmar após análise)' : ''}`,
  ].join('\n')
}

export function composeContactMessage(
  message: string,
  briefing?: ProjectBriefing,
  reference?: ProjectReference,
): string {
  return [
    reference ? `Projeto de referência: ${reference.title}` : '',
    briefing ? formatBriefing(briefing) : '',
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n\n')
}
