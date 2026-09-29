// O visor montado: o texto de verdade fica legível (leitor de tela e testes), e o desenho
// acende o que o valor pede.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Visor from '../src/Visor.vue'
import { SEGMENTOS } from '../src/visor/segmentos.js'

const montar = (props = {}) => mount(Visor, { props })
const tinta = (w) => w.find('.lcd__digitos .lcd__tinta').attributes('d')
const subcaminhos = (d) => (d.match(/M/g) ?? []).length
const segs = (texto) => [...texto].reduce((n, c) => n + (SEGMENTOS[c] ?? '').length, 0)

describe('o visor', () => {
  it('guarda o texto de verdade das duas linhas, e o desenho fica fora do leitor de tela', () => {
    const w = montar({ expressao: '12×3+7', valor: '43' })
    expect(w.find('.ros-calc__expr .lcd__texto').text()).toBe('12×3+7')
    expect(w.find('.ros-calc__main .lcd__texto').text()).toBe('43')
    for (const svg of w.findAll('svg')) expect(svg.attributes('aria-hidden')).toBe('true')
  })

  it('acende só os segmentos do valor, com o ponto e o sinal', () => {
    expect(subcaminhos(tinta(montar({ valor: '43' })))).toBe(segs('43'))
    // o ponto decimal é mais um desenho, na célula do 1
    expect(subcaminhos(tinta(montar({ valor: '1.5' })))).toBe(segs('15') + 1)
    // o sinal de menos acende à esquerda das células
    const negativo = tinta(montar({ valor: '-6' }))
    expect(subcaminhos(negativo)).toBe(segs('6') + 1)
    expect(negativo.startsWith('M0 9l1 -1H4l1 1l-1 1H1Z')).toBe(true)
  })

  it('com expoente, acende o ×10 e o expoente pequeno', () => {
    // mantissa, ponto, expoente e o ×10 (duas barras, o 1 e o 0)
    const d = tinta(montar({ valor: '7.055079e+190' }))
    expect(subcaminhos(d)).toBe(segs('7055079') + 1 + segs('190') + 2 + segs('10'))
    const semExpoente = tinta(montar({ valor: '7055079' }))
    expect(subcaminhos(semExpoente)).toBe(segs('7055079'))
  })

  it('o cursor pisca só enquanto se digita', () => {
    expect(montar({ expressao: '12', cursor: true }).find('.lcd__cursor').exists()).toBe(true)
    expect(montar({ expressao: '12 =', cursor: false }).find('.lcd__cursor').exists()).toBe(false)
  })

  it('a seta da esquerda acende quando o começo da conta ficou de fora', () => {
    const seta = (w) => w.find('.lcd__anunc--seta').classes()
    expect(seta(montar({ expressao: '1+2' }))).not.toContain('is-on')
    expect(seta(montar({ expressao: '123456789+987654321×3' }))).toContain('is-on')
  })

  it('os indicadores acendem o que o estado pede, e o resto fica fantasma', () => {
    const w = montar({ anunciadores: { segunda: true, memoria: false, deg: false, rad: true } })
    const aceso = (nome) =>
      w
        .findAll('.lcd__anunc')
        .find((a) => a.text() === nome)
        .classes()
        .includes('is-on')
    expect([aceso('2nd'), aceso('M'), aceso('DEG'), aceso('RAD')]).toEqual([
      true,
      false,
      false,
      true,
    ])
  })
})
