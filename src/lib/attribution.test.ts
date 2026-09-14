import { describe, expect, it } from 'vitest'
import {
  ATTRIBUTION_STORAGE_KEY,
  CAMPAIGN_STORAGE_KEY,
  normalizeCampaignValue,
  normalizeSource,
  resolveAttribution,
  resolveCampaign,
  sanitizeAnalyticsUrl,
  sourceFromReferrer,
  type AttributionStorage,
} from './attribution'

class MemoryStorage implements AttributionStorage {
  private readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

function resolve(
  href: string,
  storage: AttributionStorage | null = new MemoryStorage(),
  referrer = '',
) {
  let replacedUrl: string | undefined
  const url = new URL(href)
  const source = resolveAttribution({
    url,
    referrer,
    currentOrigin: 'https://www.mattecnologia.dev.br',
    storage,
    replaceUrl: (nextUrl) => {
      replacedUrl = nextUrl
    },
  })
  const campaign = resolveCampaign(url, storage)

  return { source, campaign, replacedUrl }
}

describe('atribuição da origem', () => {
  it('normaliza apenas slugs permitidos de até 40 caracteres', () => {
    expect(normalizeSource(' LinkedIn ')).toBe('linkedin')
    expect(normalizeSource('campanha_email-2')).toBe('campanha_email-2')
    expect(normalizeSource('a'.repeat(40))).toBe('a'.repeat(40))
    expect(normalizeSource('a'.repeat(41))).toBeNull()
    expect(normalizeSource('linkedin campanha')).toBeNull()
    expect(normalizeSource('../linkedin')).toBeNull()
  })

  it('normaliza valores de campanha sem aceitar conteúdo livre', () => {
    expect(normalizeCampaignValue(' Google ')).toBe('google')
    expect(normalizeCampaignValue('software sob medida')).toBe('software_sob_medida')
    expect(normalizeCampaignValue('sistemas_bh')).toBe('sistemas_bh')
    expect(normalizeCampaignValue('a'.repeat(81))).toBeNull()
    expect(normalizeCampaignValue('utm?invalido')).toBeNull()
    expect(normalizeCampaignValue('nome@empresa.com')).toBeNull()
  })

  it('usa a origem explícita mais recente e a persiste na sessão', () => {
    const storage = new MemoryStorage()

    expect(resolve('https://www.mattecnologia.dev.br/recrutadores/?origem=LinkedIn', storage).source).toBe('linkedin')
    expect(resolve('https://www.mattecnologia.dev.br/projetos/pdv/?origem=email', storage).source).toBe('email')
    expect(storage.getItem(ATTRIBUTION_STORAGE_KEY)).toBe('email')
    expect(resolve('https://www.mattecnologia.dev.br/privacidade/', storage).source).toBe('email')
  })

  it('usa utm_source como origem da sessão e persiste a campanha', () => {
    const storage = new MemoryStorage()
    const result = resolve(
      'https://www.mattecnologia.dev.br/sistemas-sob-medida-bh/?utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh&utm_term=software_sob_medida&utm_content=anuncio_1',
      storage,
    )

    expect(result.source).toBe('google')
    expect(result.campaign).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'sistemas_bh',
      utm_term: 'software_sob_medida',
      utm_content: 'anuncio_1',
    })
    expect(storage.getItem(ATTRIBUTION_STORAGE_KEY)).toBe('google')
    expect(storage.getItem(CAMPAIGN_STORAGE_KEY)).toContain('sistemas_bh')
    expect(resolve('https://www.mattecnologia.dev.br/projetos/estoque/', storage)).toMatchObject({
      source: 'google',
      campaign: {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'sistemas_bh',
        utm_term: 'software_sob_medida',
        utm_content: 'anuncio_1',
      },
    })
  })

  it('remove somente origem e preserva os outros parâmetros e o hash', () => {
    const result = resolve(
      'https://www.mattecnologia.dev.br/recrutadores/?vaga=fullstack&origem=gupy&idioma=pt#projetos',
    )

    expect(result.source).toBe('gupy')
    expect(result.replacedUrl).toBe('/recrutadores/?vaga=fullstack&idioma=pt#projetos')
  })

  it('descarta origem inválida, limpa a URL e usa o fallback', () => {
    const result = resolve('https://www.mattecnologia.dev.br/?origem=valor%20invalido&campanha=1')

    expect(result.source).toBe('direto')
    expect(result.replacedUrl).toBe('/?campanha=1')
  })

  it.each([
    ['https://www.linkedin.com/feed/', 'linkedin'],
    ['https://empresa.gupy.io/jobs/123', 'gupy'],
    ['https://github.com/MATTecno', 'github'],
    ['https://www.google.com.br/search?q=portfolio', 'google'],
    ['https://example.com/vaga', 'referencia_externa'],
    ['', 'direto'],
  ])('reconhece o referrer %s como %s', (referrer, expected) => {
    expect(sourceFromReferrer(referrer, 'https://www.mattecnologia.dev.br')).toBe(expected)
  })

  it('não falha quando o sessionStorage está indisponível', () => {
    const blockedStorage: AttributionStorage = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {
        throw new Error('bloqueado')
      },
    }

    expect(resolve('https://www.mattecnologia.dev.br/?origem=email', blockedStorage).source).toBe('email')
    expect(resolve('https://www.mattecnologia.dev.br/', blockedStorage).source).toBe('direto')
  })

  it('remove query strings livres e preserva UTM válidos e âncoras conhecidas', () => {
    expect(sanitizeAnalyticsUrl(new URL('https://www.mattecnologia.dev.br/?email=privado#contato')))
      .toBe('/#contato')
    expect(sanitizeAnalyticsUrl(new URL('https://www.mattecnologia.dev.br/recrutadores/?vaga=123#valor-livre')))
      .toBe('/recrutadores/')
    expect(
      sanitizeAnalyticsUrl(
        new URL(
          'https://www.mattecnologia.dev.br/sistemas-sob-medida-bh/?utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh&projeto=estoque-desktop#problemas',
        ),
      ),
    ).toBe(
      '/sistemas-sob-medida-bh/?utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh#problemas',
    )
  })
})
