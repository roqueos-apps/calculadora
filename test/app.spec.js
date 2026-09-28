// A Calculadora como o app-sdk entende um app: o `mount` que o RoqueOS chama, com o sistema
// falso do SDK. É o teste que vai junto para o repo dela na Onda 3.
import { describe, it, expect, afterEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { criarSistemaFalso } from '@roqueos-apps/app-sdk/sistema-falso'
import { validarManifesto, verificarSistema } from '@roqueos-apps/app-sdk'
import calculadora from '../src/index.js'
import manifesto from '../app.json'

const montar = ({ idioma = 'pt-BR', ativo = true, modoLeve = false } = {}) => {
  const falso = criarSistemaFalso({ appId: 'calculator', idioma, modoLeve })
  const el = document.createElement('div')
  document.body.appendChild(el)
  const montagem = calculadora.mount(el, falso.sistema, { windowId: 'w1', ativo })
  return { ...falso, el, montagem }
}
const rotuloDoHistorico = (el) => el.querySelector('.key--hist')?.getAttribute('aria-label') ?? null
// O texto desce por `import()` do JSON do idioma: mais que uma volta de microtarefa.
const montou = (el) => vi.waitFor(() => expect(el.querySelector('.ros-calc')).not.toBeNull())
const rotuloVira = (el, texto) => vi.waitFor(() => expect(rotuloDoHistorico(el)).toBe(texto))

describe('a Calculadora pelo app-sdk', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('o id do app é o do manifesto, que é o id permanente de sempre', () => {
    expect(calculadora.id).toBe('calculator')
    expect(manifesto.id).toBe(calculadora.id)
    expect(validarManifesto(manifesto)).toEqual([])
    expect(calculadora.capacidades).toEqual([])
  })

  it('o sistema falso cumpre o contrato que o app pede', () => {
    expect(
      verificarSistema(criarSistemaFalso().sistema, { exigidas: calculadora.capacidades }).ok,
    ).toBe(true)
  })

  it('monta com o texto no idioma do sistema, e só depois de o texto chegar', async () => {
    const { el, montagem } = montar({ idioma: 'ja-JP' })
    expect(el.querySelector('.ros-calc')).toBeNull()
    await montou(el)
    expect(rotuloDoHistorico(el)).toBe('履歴')
    montagem.desmontar()
  })

  it('troca o texto quando o idioma muda com a janela aberta', async () => {
    const { el, montagem, mudarIdioma } = montar()
    await montou(el)
    expect(rotuloDoHistorico(el)).toBe('Histórico')
    mudarIdioma('en-US')
    await rotuloVira(el, 'History')
    montagem.desmontar()
  })

  it('duas trocas seguidas: vale a última, mesmo que a primeira chegue depois', async () => {
    const { el, montagem, mudarIdioma } = montar()
    await montou(el)
    mudarIdioma('ar-AR')
    mudarIdioma('de-DE')
    await rotuloVira(el, 'Verlauf')
    // O árabe pediu primeiro e pode chegar depois: não pode sobrescrever o alemão.
    await new Promise((r) => setTimeout(r, 50))
    expect(rotuloDoHistorico(el)).toBe('Verlauf')
    montagem.desmontar()
  })

  it('ativar liga e desliga o teclado físico', async () => {
    const { el, montagem } = montar({ ativo: false })
    await montou(el)
    const tecla = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    tecla('9')
    await flushPromises()
    expect(el.querySelector('.ros-calc__main').textContent.trim()).toBe('0')
    montagem.ativar(true)
    tecla('9')
    await flushPromises()
    expect(el.querySelector('.ros-calc__main').textContent.trim()).toBe('9')
    montagem.desmontar()
  })

  it('desmontar solta o app Vue e o ouvinte de idioma', async () => {
    const { el, montagem, ouvintesVivos } = montar()
    await montou(el)
    expect(ouvintesVivos()).toBe(1)
    montagem.desmontar()
    expect(ouvintesVivos()).toBe(0)
    expect(el.querySelector('.ros-calc')).toBeNull()
  })

  it('desmontar antes do texto chegar não monta nada depois', async () => {
    const { el, montagem } = montar()
    montagem.desmontar()
    await new Promise((r) => setTimeout(r, 50))
    expect(el.querySelector('.ros-calc')).toBeNull()
  })
})
