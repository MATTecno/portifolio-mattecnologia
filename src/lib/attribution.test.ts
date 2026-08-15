import { describe, expect, it } from 'vitest'
import {
  ATTRIBUTION_STORAGE_KEY,
  normalizeSource,
  resolveAttribution,
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
  const source = resolveAttribution({
    url: new URL(href),
    referrer,
    currentOrigin: 'https://www.mattecnologia.dev.br',
    storage,
    replaceUrl: (url) => {
      replacedUrl = url
    },
  })

  return { source, replacedUrl }
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

  it('usa a origem explícita mais recente e a persiste na sessão', () => {
    const storage = new MemoryStorage()

    expect(resolve('https://www.mattecnologia.dev.br/recrutadores/?origem=LinkedIn', storage).source).toBe('linkedin')
    expect(resolve('https://www.mattecnologia.dev.br/projetos/pdv/?origem=email', storage).source).toBe('email')
    expect(storage.getItem(ATTRIBUTION_STORAGE_KEY)).toBe('email')
    expect(resolve('https://www.mattecnologia.dev.br/privacidade/', storage).source).toBe('email')
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
})
