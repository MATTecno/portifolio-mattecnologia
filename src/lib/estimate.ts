export const BASE_DAY_RATE = 100

export const PROJECT_CONFIG = {
  landing: { label: 'Landing', days: [3, 6], priceWeight: 1 },
  web_simples: { label: 'Web simples', days: [10, 15], priceWeight: 1.25 },
  web_completo: { label: 'SaaS / sistema completo', days: [20, 35], priceWeight: 1.4 },
  mobile: { label: 'Mobile', days: [20, 35], priceWeight: 1.6 },
  web_mobile: { label: 'Web + Mobile', days: [30, 50], priceWeight: 1.8 },
} as const

export const SIZE_CONFIG = {
  essencial: { label: 'Essencial', detail: '1–5 telas', effortWeight: 1 },
  medio: { label: 'Médio', detail: '6–12 telas', effortWeight: 1.2 },
  amplo: { label: 'Amplo', detail: '13–25 telas', effortWeight: 1.4 },
  grande: { label: 'Grande', detail: '26+ telas', effortWeight: 1.7 },
} as const

export const FEATURE_CONFIG = {
  login: { label: 'Login e perfis', priceWeight: 1.15 },
  dados: { label: 'Dados e painel', priceWeight: 1.25 },
  integracoes: { label: 'Integrações', priceWeight: 1.15 },
  pagamentos: { label: 'Pagamentos', priceWeight: 1.25 },
  arquivos: { label: 'Arquivos e uploads', priceWeight: 1.1 },
} as const

export const URGENCY_CONFIG = {
  normal: { label: 'Normal', priceWeight: 1, scheduleWeight: 1 },
  acelerada: { label: 'Acelerada', priceWeight: 1.25, scheduleWeight: 0.8 },
  critica: { label: 'Crítica', priceWeight: 1.5, scheduleWeight: 0.65 },
} as const

export type ProjectType = keyof typeof PROJECT_CONFIG
export type ProjectSize = keyof typeof SIZE_CONFIG
export type ProjectFeature = keyof typeof FEATURE_CONFIG
export type ProjectUrgency = keyof typeof URGENCY_CONFIG

export type EstimateInput = {
  project: ProjectType
  size: ProjectSize
  features: readonly ProjectFeature[]
  urgency: ProjectUrgency
}

export type EstimateResult = {
  effortDays: [min: number, max: number]
  scheduleDays: [min: number, max: number]
  price: [min: number, max: number]
}

export const DEFAULT_ESTIMATE_INPUT: EstimateInput = {
  project: 'web_simples',
  size: 'medio',
  features: [],
  urgency: 'normal',
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const project = PROJECT_CONFIG[input.project]
  const size = SIZE_CONFIG[input.size]
  const urgency = URGENCY_CONFIG[input.urgency]
  const featureWeight = input.features.reduce(
    (weight, feature) => weight * FEATURE_CONFIG[feature].priceWeight,
    1,
  )

  const effortDays: [number, number] = [
    Math.round(project.days[0] * size.effortWeight),
    Math.round(project.days[1] * size.effortWeight),
  ]
  const scheduleDays: [number, number] = [
    Math.max(1, Math.ceil(effortDays[0] * urgency.scheduleWeight)),
    Math.max(1, Math.ceil(effortDays[1] * urgency.scheduleWeight)),
  ]
  const totalPriceWeight = project.priceWeight * featureWeight * urgency.priceWeight
  const price: [number, number] = [
    Math.round(effortDays[0] * BASE_DAY_RATE * totalPriceWeight),
    Math.round(effortDays[1] * BASE_DAY_RATE * totalPriceWeight),
  ]

  return { effortDays, scheduleDays, price }
}

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatEstimateSummary(input: EstimateInput, result: EstimateResult) {
  const featureLabels = input.features.map((feature) => FEATURE_CONFIG[feature].label)

  return [
    'Estimativa inicial — MATTecnologia',
    `Projeto: ${PROJECT_CONFIG[input.project].label}`,
    `Tamanho: ${SIZE_CONFIG[input.size].label} (${SIZE_CONFIG[input.size].detail})`,
    `Recursos: ${featureLabels.length ? featureLabels.join(', ') : 'Nenhum adicional'}`,
    `Urgência: ${URGENCY_CONFIG[input.urgency].label}`,
    `Prazo estimado: ${result.scheduleDays[0]}–${result.scheduleDays[1]} dias`,
    `Faixa estimada: ${formatBRL(result.price[0])} a ${formatBRL(result.price[1])}`,
  ].join('\n')
}
