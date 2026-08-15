import { describe, expect, it } from 'vitest'
import {
  calculateEstimate,
  DEFAULT_ESTIMATE_INPUT,
  type EstimateInput,
} from './estimate'

describe('calculateEstimate', () => {
  it('calcula o cenário padrão definido para o portfólio', () => {
    expect(calculateEstimate(DEFAULT_ESTIMATE_INPUT)).toEqual({
      effortDays: [12, 18],
      scheduleDays: [12, 18],
      price: [1500, 2250],
    })
  })

  it('aplica o peso do tamanho ao esforço', () => {
    expect(calculateEstimate({ ...DEFAULT_ESTIMATE_INPUT, size: 'grande' }).effortDays).toEqual([17, 26])
  })

  it('combina os pesos dos recursos selecionados', () => {
    const result = calculateEstimate({
      ...DEFAULT_ESTIMATE_INPUT,
      features: ['login', 'pagamentos'],
    })

    expect(result.price).toEqual([2156, 3234])
  })

  it('reduz o prazo e adiciona o fator de urgência ao preço', () => {
    const accelerated = calculateEstimate({ ...DEFAULT_ESTIMATE_INPUT, urgency: 'acelerada' })
    const critical = calculateEstimate({ ...DEFAULT_ESTIMATE_INPUT, urgency: 'critica' })

    expect(accelerated.scheduleDays).toEqual([10, 15])
    expect(accelerated.price).toEqual([1875, 2813])
    expect(critical.scheduleDays).toEqual([8, 12])
    expect(critical.price).toEqual([2250, 3375])
  })

  it('arredonda esforço, prazo e valor de forma determinística', () => {
    const input: EstimateInput = {
      project: 'landing',
      size: 'amplo',
      features: ['arquivos'],
      urgency: 'critica',
    }

    expect(calculateEstimate(input)).toEqual({
      effortDays: [4, 8],
      scheduleDays: [3, 6],
      price: [660, 1320],
    })
  })
})
