import { describe, expect, it } from 'vitest'
import {
  EMPTY_BRIEFING,
  composeContactMessage,
  formatBriefing,
  getProjectReference,
  validateBriefing,
} from './estimate'
import { emailLink, whatsappLink } from './contact'
import { captureBrowserAttribution } from './attribution'
import { vi } from 'vitest'

describe('briefing comercial', () => {
  it.each(['landing', 'site'] as const)('preserva a oferta %s no resumo e nos canais', (project) => {
    const briefing = { ...EMPTY_BRIEFING, project, description: 'Apresentar serviços & receber contatos.' }
    const label = project === 'landing' ? 'Landing page' : 'Site institucional'
    expect(validateBriefing(briefing)).toBeNull()
    const message = composeContactMessage('Quero uma proposta.', briefing)
    expect(message).toContain(`Necessidade: ${label}`)
    expect(new URL(whatsappLink(message)).searchParams.get('text')).toBe(message)
    expect(new URL(emailLink(message)).searchParams.get('body')).toBe(message)
  })
  it('permite orientação sem escolhas técnicas e sem valores automáticos', () => {
    expect(validateBriefing(EMPTY_BRIEFING)).toBeNull()
    const summary = formatBriefing(EMPTY_BRIEFING)
    expect(summary).toContain('Não sei / preciso de orientação')
    expect(summary).toContain('Recursos: A definir')
    expect(summary).not.toMatch(/R\$|dias|Faixa estimada/)
  })
  it('inclui desktop, offline e a data como preferência', () => {
    expect(
      formatBriefing({
        ...EMPTY_BRIEFING,
        project: 'desktop',
        features: ['offline'],
        deadline: 'date',
        desiredDate: '2026-12-18',
      }),
    ).toContain('18/12/2026 (preferência, a confirmar após análise)')
    expect(formatBriefing({ ...EMPTY_BRIEFING, project: 'desktop', features: ['offline'] })).toContain(
      'Funcionamento offline',
    )
  })
  it('valida datas incompletas ou inexistentes, e o limite de texto', () => {
    for (const desiredDate of ['', 'invalid', '2026-02-30']) {
      expect(validateBriefing({ ...EMPTY_BRIEFING, deadline: 'date', desiredDate })).not.toBeNull()
    }
    expect(validateBriefing({ ...EMPTY_BRIEFING, deadline: 'date', desiredDate: '2028-02-29' })).toBeNull()
    expect(validateBriefing({ ...EMPTY_BRIEFING, description: 'a'.repeat(2001) })).not.toBeNull()
  })
  it('ignora uma data anterior quando o visitante seleciona sem data definida', () => {
    const briefing = { ...EMPTY_BRIEFING, desiredDate: '2026-01-01' }
    expect(validateBriefing(briefing)).toBeNull()
    expect(formatBriefing(briefing)).toContain('Data desejada: A definir')
  })
  it('compõe o contexto sem alterar a mensagem original e permite remover partes', () => {
    const reference = { id: 'estoque-desktop', title: 'Gerenciamento de Estoque Desktop' }
    const message = 'Já tenho um sistema.\nQuero integração com a operação.'
    const withContext = composeContactMessage(message, EMPTY_BRIEFING, reference)
    expect(withContext).toContain('Projeto de referência: Gerenciamento de Estoque Desktop')
    expect(withContext).toContain(message)
    expect(composeContactMessage(message)).toBe(message)
    expect(composeContactMessage(message, undefined, reference)).not.toContain('Resumo do projeto')
  })
  it('preserva acentos e quebras de linha nos canais alternativos', () => {
    const message = composeContactMessage('Integração & estoque?\nDescrição: ação, café.', {
      ...EMPTY_BRIEFING,
      description: 'A&B #1',
    })
    expect(new URL(whatsappLink(message)).searchParams.get('text')).toBe(message)
    expect(new URL(emailLink(message)).searchParams.get('body')).toBe(message)
  })
  it('aceita somente referências do catálogo', () => {
    expect(getProjectReference(new URL('https://example.com/?projeto=estoque-desktop'))?.id).toBe(
      'estoque-desktop',
    )
    expect(getProjectReference(new URL('https://example.com/?projeto=javascript:alert(1)'))).toBeUndefined()
    expect(getProjectReference(new URL('https://example.com/?projeto=desconhecido'))).toBeUndefined()
  })
  it('mantém a referência capturada antes da limpeza da URL pelas métricas', () => {
    const url = new URL('https://example.com/?projeto=estoque-desktop&origem=linkedin#contato')
    const initialReference = getProjectReference(url)
    const replaceState = vi.fn()
    vi.stubGlobal('window', {
      location: { href: url.href, origin: url.origin, pathname: '/', search: url.search, hash: url.hash },
      history: { state: null, replaceState },
      sessionStorage: { getItem: () => null, setItem: () => {} },
    })
    vi.stubGlobal('document', { referrer: '' })
    try {
      expect(captureBrowserAttribution()).toEqual({ source: 'linkedin', campaign: {} })
      expect(replaceState).toHaveBeenCalledWith(null, '', '/#contato')
      expect(initialReference?.title).toBe('Gerenciamento de Estoque Desktop')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('preserva UTM válidos ao limpar a referência de projeto', () => {
    const url = new URL(
      'https://example.com/?projeto=estoque-desktop&utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh#contato',
    )
    const replaceState = vi.fn()
    vi.stubGlobal('window', {
      location: { href: url.href, origin: url.origin, pathname: '/', search: url.search, hash: url.hash },
      history: { state: null, replaceState },
      sessionStorage: { getItem: () => null, setItem: () => {} },
    })
    vi.stubGlobal('document', { referrer: '' })
    try {
      expect(captureBrowserAttribution()).toEqual({
        source: 'google',
        campaign: {
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'sistemas_bh',
        },
      })
      expect(replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/?utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh#contato',
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
