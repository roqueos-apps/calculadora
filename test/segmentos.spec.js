// A linha de baixo do visor: o texto do motor distribuído pelas células de sete segmentos.
import { describe, it, expect } from 'vitest'
import {
  CELULAS,
  FORMAS,
  SEGMENTOS,
  caminhoDoPonto,
  caminhoDosSegmentos,
  celulasDoValor,
} from '../src/visor/segmentos.js'

const texto = (c) => c.celulas.map((x) => x.ch + (x.ponto ? '.' : '')).join('')

describe('os sete segmentos do visor', () => {
  it('cada caractere acende segmentos que existem, e o 8 acende todos', () => {
    for (const [ch, segs] of Object.entries(SEGMENTOS)) {
      expect(
        [...segs].every((s) => s in FORMAS),
        ch,
      ).toBe(true)
    }
    expect(SEGMENTOS['-']).toBe('g')
  })

  it('os dez dígitos acendem os segmentos de sempre', () => {
    // a = topo, b e c = direita, d = base, e e f = esquerda, g = meio
    const esperado = [
      'abcdef',
      'bc',
      'abdeg',
      'abcdg',
      'bcfg',
      'acdfg',
      'acdefg',
      'abc',
      'abcdefg',
      'abcdfg',
    ]
    esperado.forEach((segs, d) => expect([...SEGMENTOS[d]].sort().join(''), String(d)).toBe(segs))
    expect(SEGMENTOS.E).toBe('adefg')
    expect(SEGMENTOS.r).toBe('eg')
    expect(SEGMENTOS.o).toBe('cdeg')
  })

  it('número vai à direita, com o ponto na célula do dígito de antes', () => {
    const c = celulasDoValor('1.5')
    expect(c.celulas).toHaveLength(CELULAS)
    expect(texto(c).trim()).toBe('1.5')
    expect(c.celulas.at(-2)).toEqual({ ch: '1', ponto: true })
    expect(c.celulas.at(-1)).toEqual({ ch: '5', ponto: false })
    expect(c.negativo).toBe(false)
    expect(c.expoente).toBeNull()
  })

  it('o maior número que o motor escreve cabe inteiro: sinal à parte e treze células', () => {
    const c = celulasDoValor('-0.333333333333')
    expect(c.negativo).toBe(true)
    expect(c.cabe).toBe(true)
    expect(c.celulas[0]).toEqual({ ch: '0', ponto: true })
    expect(c.celulas.slice(1).every((x) => x.ch === '3')).toBe(true)
  })

  it('notação científica: a mantissa nas células, o expoente pequeno com o sinal dele', () => {
    const grande = celulasDoValor('7.055079e+190')
    expect(texto(grande).trim()).toBe('7.055079')
    expect(grande.expoente).toEqual({ negativo: false, digitos: ['1', '9', '0'] })

    const pequeno = celulasDoValor('-1.234568e-10')
    expect(pequeno.negativo).toBe(true)
    expect(pequeno.expoente).toEqual({ negativo: true, digitos: [' ', '1', '0'] })
  })

  it('palavra vai à esquerda: o Error do motor', () => {
    const c = celulasDoValor('Error')
    expect(texto(c)).toBe('Error' + ' '.repeat(CELULAS - 5))
    expect(c.expoente).toBeNull()
  })

  it('o que não cabe fica marcado, e o visor mostra o fim', () => {
    const c = celulasDoValor('12345678901234')
    expect(c.cabe).toBe(false)
    expect(texto(c)).toBe('2345678901234')
  })

  it('desenha os segmentos pedidos, na posição e na escala pedidas', () => {
    expect(caminhoDosSegmentos('')).toBe('')
    expect(caminhoDosSegmentos('a')).toBe('M1.45 1L2.35 0.1L5.65 0.1L6.55 1L5.65 1.9L2.35 1.9Z')
    expect(caminhoDosSegmentos('f')).toBe('M1 1.45L1.9 2.35L1.9 7.65L1 8.55L0.1 7.65L0.1 2.35Z')
    const a = caminhoDosSegmentos('a', 10, 0)
    expect(a.match(/M/g)).toHaveLength(1)
    expect(a.match(/L/g)).toHaveLength(5)
    expect(a.startsWith('M11.45 1L')).toBe(true)
    expect(caminhoDosSegmentos('abcdefg').match(/M/g)).toHaveLength(7)
    const meia = caminhoDosSegmentos('d', 0, 0, 0.5)
    expect(meia.startsWith('M0.725 8.5L')).toBe(true)
    expect(caminhoDoPonto(0, 0)).toBe('M8.3 16.1h1.8v1.8h-1.8Z')
  })
})
