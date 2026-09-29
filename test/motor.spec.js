// O motor da Calculadora sem a tela: a conta, a precedência, os graus e o formato do número.
import { describe, it, expect } from 'vitest'
import { autoClose, compute, fmt, tokenize } from '../src/motor.js'

describe('motor da Calculadora', () => {
  it('respeita a precedência e a associatividade da potência', () => {
    expect(compute('2+3×4', true)).toBe(14)
    expect(compute('2^3^2', true)).toBe(512)
    expect(compute('(2+3)×4', true)).toBe(20)
  })

  it('o menos unário liga mais forte que × e mais fraco que ^', () => {
    expect(compute('−2^2', true)).toBe(-4)
    expect(compute('3×−2', true)).toBe(-6)
  })

  it('trigonometria em graus e em radianos', () => {
    expect(compute('sin(90)', true)).toBeCloseTo(1, 12)
    expect(compute('sin(π÷2)', false)).toBeCloseTo(1, 12)
    expect(compute('asin(1)', true)).toBeCloseTo(90, 9)
  })

  it('pós-fixos: fatorial, quadrado e porcentagem', () => {
    expect(compute('5!', true)).toBe(120)
    expect(compute('3²', true)).toBe(9)
    expect(compute('50%', true)).toBe(0.5)
  })

  it('fecha parêntese aberto e ignora operador pendurado no fim', () => {
    expect(autoClose('√(9')).toBe('√(9)')
    expect(autoClose('2+3×')).toBe('2+3')
    expect(compute('√(16', true)).toBe(4)
  })

  it('conta impossível lança, e a tela mostra Error', () => {
    expect(() => compute('8÷0', true)).toThrow()
    expect(() => compute('(−1)!', true)).toThrow()
    expect(fmt(Infinity)).toBe('Error')
  })

  it('formata: doze dígitos significativos, e notação científica fora da faixa', () => {
    expect(fmt(0.1 + 0.2)).toBe('0.3')
    expect(fmt(1e13)).toBe('1e+13')
    expect(fmt(1.23456789e-10)).toBe('1.234568e-10')
    expect(fmt(0)).toBe('0')
  })

  it('o número que o visor mostra volta para a conta: sinal ASCII e notação científica', () => {
    // O `fmt` escreve "-6" e "7.055079e+190"; seguir a conta a partir deles perdia o sinal
    // ou dava Error (28/09/2026).
    expect(compute('-6+1', true)).toBe(-5)
    expect(compute('-7.055079e+190×2', true)).toBe(-1.4110158e191)
    expect(compute('1.2e-7×10', true)).toBeCloseTo(1.2e-6, 18)
    expect(compute('2×e', true)).toBeCloseTo(2 * Math.E, 12)
    expect(tokenize('2e').map((t) => t.t)).toEqual(['num', 'num'])
  })

  it('as fichas da expressão, com π e e como número', () => {
    expect(tokenize('2π').map((t) => t.t)).toEqual(['num', 'num'])
    expect(tokenize('log(e)').map((t) => t.t)).toEqual(['func', 'paren', 'num', 'paren'])
  })
})
