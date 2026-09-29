// A linha de cima do visor: a conta em matriz de pontos 5 × 7.
import { describe, it, expect } from 'vitest'
import {
  CARACTERES,
  FONTE,
  caminhoDaGrade,
  caminhoDosPontos,
  recorteDaLinha,
} from '../src/visor/matriz.js'

// Tudo o que a Calculadora escreve na linha de cima: dígitos, operadores, pós-fixos,
// constantes, as funções, o " =" do resultado e o número em notação científica do `fmt`.
const O_QUE_A_CALCULADORA_ESCREVE = '0123456789.+−×÷^()²!%πe√= -' + 'asincotanlogln' + 'E'

describe('a matriz de pontos do visor', () => {
  it('cada caractere tem sete linhas de cinco pontos', () => {
    for (const [ch, linhas] of Object.entries(FONTE)) {
      expect(linhas, ch).toHaveLength(7)
      for (const l of linhas) expect(l, ch).toMatch(/^[01]{5}$/)
    }
  })

  it('tudo o que a Calculadora escreve tem desenho próprio, sem cair no ?', () => {
    for (const ch of new Set(O_QUE_A_CALCULADORA_ESCREVE)) {
      expect(FONTE[ch], `falta o desenho de "${ch}"`).toBeDefined()
    }
  })

  it('cada ponto aceso vira um quadrado, e o que não tem desenho vira ?', () => {
    const acesos = (ch) => FONTE[ch].join('').replace(/0/g, '').length
    expect(caminhoDosPontos(['1']).match(/M/g)).toHaveLength(acesos('1'))
    expect(caminhoDosPontos(['1', '+']).match(/M/g)).toHaveLength(acesos('1') + acesos('+'))
    expect(caminhoDosPontos(['@'])).toBe(caminhoDosPontos(['?']))
    // o segundo caractere começa seis colunas depois do primeiro (cinco de pontos e uma de
    // espaço): o ponto final acende as colunas 7 e 8, e não a 6
    const ponto = caminhoDosPontos([' ', '.'])
    expect(ponto).toContain('M7 5h')
    expect(ponto).toContain('M8 5h')
    expect(ponto).not.toContain('M6 5h')
    expect(caminhoDosPontos([])).toBe('')
  })

  it('a grade apagada cobre as dezesseis posições', () => {
    expect(caminhoDaGrade().match(/M/g)).toHaveLength(CARACTERES * 35)
  })

  it('conta curta aparece inteira; conta longa mostra o fim e acende a seta', () => {
    expect(recorteDaLinha('12+3')).toEqual({
      visiveis: ['1', '2', '+', '3'],
      cortado: false,
      posicaoDoCursor: -1,
    })
    const longa = recorteDaLinha('123456789+987654321')
    expect(longa.cortado).toBe(true)
    expect(longa.visiveis.join('')).toBe('456789+987654321')
  })

  it('o cursor ocupa uma posição no fim', () => {
    expect(recorteDaLinha('12', { cursor: true }).posicaoDoCursor).toBe(2)
    const cheia = recorteDaLinha('1234567890123456', { cursor: true })
    expect(cheia.cortado).toBe(true)
    expect(cheia.visiveis).toHaveLength(CARACTERES - 1)
    expect(cheia.posicaoDoCursor).toBe(CARACTERES - 1)
  })
})
