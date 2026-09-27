// A tela da Calculadora, montada com o sistema falso do app-sdk: nenhum plugin, store ou i18n do
// RoqueOS, do mesmo jeito que ela roda sozinha no repo dela. Veio de
// tests/component/roqueos/apps/ROSCalculator.spec.js (Goal 28, Onda 2).
import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { criarSistemaFalso } from '@roqueos-apps/app-sdk/sistema-falso'
import Calculadora from '../src/Calculadora.vue'
import ptBR from '../i18n/pt-BR.json'

const mountCalc = ({ ativo = true, textos = ptBR } = {}) => {
  const { sistema } = criarSistemaFalso({ appId: 'calculator' })
  const estado = reactive({ ativo, idioma: 'pt-BR', textos })
  const wrapper = mount(Calculadora, { props: { sistema, estado } })
  return Object.assign(wrapper, { estado })
}
const tecla = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key }))

const click = async (wrapper, text) => {
  const button = wrapper.findAll('button').find((b) => b.text().trim() === text)
  if (!button) throw new Error(`Button not found: ${text}`)
  await button.trigger('click')
}
const main = (wrapper) => wrapper.find('.ros-calc__main').text()

describe('Calculadora', () => {
  it('keeps the keypad left to right even in a right-to-left language', () => {
    // No árabe o RoqueOS e a janela falsa do SDK põem dir="rtl" em volta; a calculadora
    // espelhada punha o 7 à direita do 9 e escrevia "M−" como "−M" (27/09/2026).
    const w = mountCalc()
    expect(w.find('.ros-calc').attributes('dir')).toBe('ltr')
  })

  it('does not depend on the RoqueOS global CSS for its own box model', () => {
    // Fora do RoqueOS não há o `box-sizing: border-box` global do Quasar: sem declarar o
    // próprio, a carcaça saía cortada nas bordas no `yarn dev`.
    const scss = readFileSync('src/calculadora.scss', 'utf8')
    const raiz = scss.slice(
      scss.indexOf('.ros-calc {\n  --body-1'),
      scss.indexOf('// ----', scss.indexOf('--body-1')),
    )
    expect(raiz).toContain('box-sizing: border-box;')
    expect(scss).toMatch(
      /\.ros-calc \*,\s*\.ros-calc \*::before,\s*\.ros-calc \*::after \{\s*box-sizing: inherit;/,
    )
  })

  it('adds two numbers and shows the expression', async () => {
    const w = mountCalc()
    await click(w, '7')
    await click(w, '+')
    await click(w, '3')
    await click(w, '=')
    expect(main(w)).toBe('10')
    expect(w.find('.ros-calc__expr').text()).toContain('=')
  })

  it('respects operator precedence (× before +)', async () => {
    const w = mountCalc()
    await click(w, '2')
    await click(w, '+')
    await click(w, '3')
    await click(w, '×')
    await click(w, '4')
    await click(w, '=')
    expect(main(w)).toBe('14')
  })

  it('handles a decimal point and ignores a second dot', async () => {
    const w = mountCalc()
    await click(w, '1')
    await click(w, '.')
    await click(w, '5')
    expect(main(w)).toBe('1.5')
    await click(w, '.')
    expect(main(w)).toBe('1.5')
  })

  it('treats percent as a postfix (÷100)', async () => {
    const w = mountCalc()
    await click(w, '5')
    await click(w, '0')
    await click(w, '%')
    await click(w, '=')
    expect(main(w)).toBe('0.5')
  })

  it('negates the trailing number', async () => {
    const w = mountCalc()
    await click(w, '6')
    await click(w, '±')
    await click(w, '=')
    expect(main(w)).toBe('-6')
  })

  it('shows Error on divide-by-zero and clears with AC', async () => {
    const w = mountCalc()
    await click(w, '8')
    await click(w, '÷')
    await click(w, '0')
    await click(w, '=')
    expect(main(w)).toBe('Error')

    await click(w, 'AC')
    expect(main(w)).toBe('0')
    expect(w.find('.ros-calc__expr').text()).toBe('')
  })

  it('starts fresh input after an error', async () => {
    const w = mountCalc()
    await click(w, '8')
    await click(w, '÷')
    await click(w, '0')
    await click(w, '=')
    await click(w, '9')
    expect(main(w)).toBe('9')
  })

  it('backspace removes the last character', async () => {
    const w = mountCalc()
    await click(w, '1')
    await click(w, '2')
    await click(w, '3')
    await click(w, '⌫')
    expect(main(w)).toBe('12')
  })

  it('evaluates a scientific function (√)', async () => {
    const w = mountCalc()
    await click(w, '√')
    await click(w, '9')
    await click(w, '=')
    expect(main(w)).toBe('3')
  })

  it('records and recalls history', async () => {
    const w = mountCalc()
    await click(w, '2')
    await click(w, '+')
    await click(w, '2')
    await click(w, '=')
    expect(w.vm.historyItems.length).toBe(1)
    expect(w.vm.historyItems[0].result).toBe('4')
  })

  it('memory add then recall', async () => {
    const w = mountCalc()
    await click(w, '5')
    await click(w, 'M+')
    expect(w.vm.mem).toBe(5)
    await click(w, 'AC')
    await click(w, 'MR')
    expect(main(w)).toBe('5')
  })

  it('toggles scientific mode', async () => {
    const w = mountCalc()
    expect(w.vm.sci).toBe(false)
    await click(w, 'SCI')
    expect(w.vm.sci).toBe(true)
  })

  it('grows the LCD length class as the number gets longer', async () => {
    const w = mountCalc()
    expect(w.find('.ros-calc__main').classes()).toContain('len-1')
    for (let i = 0; i < 10; i++) await click(w, '9')
    expect(w.find('.ros-calc__main').classes()).toContain('len-2')
  })

  it('shows the texts it received, and the history button has its label', async () => {
    const w = mountCalc()
    expect(w.find('.ros-calc__footer').text()).toContain('powered by')
    const historico = w.findAll('.ros-calc__chip')[1]
    expect(historico.attributes('aria-label')).toBe('Histórico')
    expect(historico.find('svg path').attributes('d')).toMatch(/^M13 3a9 9/)
    await historico.trigger('click')
    expect(w.find('.ros-calc__history-head h2').text()).toBe('Histórico')
    expect(w.find('.ros-calc__history-empty').text()).toContain('Nenhum cálculo ainda.')
    w.unmount()
  })

  it('without texts yet, shows no label instead of the raw key', () => {
    const w = mountCalc({ textos: null })
    expect(w.findAll('.ros-calc__chip')[1].attributes('aria-label')).toBe('')
    w.unmount()
  })

  it('types from the physical keyboard only while the window is active', async () => {
    const w = mountCalc({ ativo: false })
    tecla('4')
    await w.vm.$nextTick()
    expect(main(w)).toBe('0')
    w.estado.ativo = true
    tecla('4')
    tecla('*')
    tecla('2')
    tecla('Enter')
    await w.vm.$nextTick()
    expect(main(w)).toBe('8')
    w.unmount()
  })

  it('stops listening to the keyboard when unmounted', async () => {
    const w = mountCalc()
    w.unmount()
    expect(() => tecla('7')).not.toThrow()
  })
})
