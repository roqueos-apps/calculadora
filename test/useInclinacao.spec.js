// O teste do reflexo da Calculadora. Veio de tests/unit/composables/useDeviceTilt.spec.js
// com o composable, que saiu do núcleo junto com o app (Goal 28, Onda 2).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useInclinacao } from '../src/useInclinacao.js'

// Drain rAF callbacks iteratively (the composable re-schedules until settled).
let rafQueue = []
const flushRaf = (max = 500) => {
  let n = 0
  while (rafQueue.length && n++ < max) rafQueue.shift()()
}

function mountTilt(opts) {
  const exposed = {}
  const el = document.createElement('div')
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 })
  const Comp = defineComponent({
    setup() {
      const target = ref(el)
      Object.assign(exposed, useInclinacao(target, opts), { el })
      return () => h('div')
    },
  })
  const wrapper = mount(Comp)
  return { wrapper, exposed, el }
}

const fireOrientation = (gamma, beta) => {
  const ev = new Event('deviceorientation')
  ev.gamma = gamma
  ev.beta = beta
  window.dispatchEvent(ev)
}

describe('useInclinacao', () => {
  beforeEach(() => {
    rafQueue = []
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      rafQueue.push(cb)
      return rafQueue.length
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    delete window.matchMedia
    delete window.DeviceOrientationEvent
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete window.matchMedia
    delete window.DeviceOrientationEvent
  })

  it('moves the tilt toward orientation input on permission-free browsers (Android)', () => {
    window.DeviceOrientationEvent = function () {} // no requestPermission → attaches at mount
    const { exposed, wrapper } = mountTilt()
    expect(exposed.tiltX.value).toBe(0)

    fireOrientation(32, 72) // gamma/32 = 1 ; (beta-40)/32 = 1
    flushRaf()

    expect(exposed.tiltX.value).toBeGreaterThan(0.9)
    expect(exposed.tiltY.value).toBeGreaterThan(0.9)
    wrapper.unmount()
  })

  it('clamps tilt to [-1, 1]', () => {
    window.DeviceOrientationEvent = function () {}
    const { exposed, wrapper } = mountTilt()
    fireOrientation(400, -400)
    flushRaf()
    expect(exposed.tiltX.value).toBeGreaterThanOrEqual(-1)
    expect(exposed.tiltX.value).toBeLessThanOrEqual(1)
    expect(exposed.tiltY.value).toBeGreaterThanOrEqual(-1)
    expect(exposed.tiltY.value).toBeLessThanOrEqual(1)
    wrapper.unmount()
  })

  it('ignores the RoqueOS data-low-end attribute: the light profile comes from the system', () => {
    // O atributo é detalhe do documento do RoqueOS; quem diz o perfil leve é o sistema.
    document.documentElement.setAttribute('data-low-end', '1')
    window.DeviceOrientationEvent = function () {}
    const { exposed, wrapper } = mountTilt({ modoLeve: () => false })
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBeGreaterThan(0.9)
    document.documentElement.removeAttribute('data-low-end')
    wrapper.unmount()
  })

  it('stays inert under prefers-reduced-motion (no listener, no movement)', () => {
    window.matchMedia = () => ({ matches: true })
    window.DeviceOrientationEvent = function () {}
    const addSpy = vi.spyOn(window, 'addEventListener')
    const { exposed, wrapper } = mountTilt()
    expect(addSpy).not.toHaveBeenCalledWith(
      'deviceorientation',
      expect.anything(),
      expect.anything(),
    )
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBe(0)
    wrapper.unmount()
  })

  it('stays inert when the system asks for the light profile (desempenho.modoLeve)', () => {
    window.DeviceOrientationEvent = function () {}
    const { exposed, wrapper } = mountTilt({ modoLeve: () => true })
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBe(0)
    wrapper.unmount()
  })

  it('requestMotion grants iOS orientation permission then listens', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted')
    window.DeviceOrientationEvent = Object.assign(function () {}, { requestPermission })
    const { exposed, wrapper } = mountTilt()

    // Not attached at mount on iOS — waits for the gesture.
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBe(0)

    await exposed.requestMotion()
    expect(requestPermission).toHaveBeenCalledTimes(1)
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBeGreaterThan(0.9)
    wrapper.unmount()
  })

  it('requestMotion stays static when permission is denied', async () => {
    const requestPermission = vi.fn().mockResolvedValue('denied')
    window.DeviceOrientationEvent = Object.assign(function () {}, { requestPermission })
    const { exposed, wrapper } = mountTilt()
    await exposed.requestMotion()
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBe(0)
    wrapper.unmount()
  })

  // ⚠️ `requested = true` sobrevivia a `false`: cada toque na tela abriria de
  // novo o pedido de permissão do iOS, e o usuário levaria um alerta do
  // sistema por gesto. A trava é uma só, e é esta.
  it('o pedido de permissão do iOS acontece UMA vez', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted')
    window.DeviceOrientationEvent = Object.assign(function () {}, { requestPermission })
    const { exposed, wrapper } = mountTilt()

    await exposed.requestMotion()
    await exposed.requestMotion()
    await exposed.requestMotion()
    expect(requestPermission.mock.calls).toEqual([[]])
    wrapper.unmount()
  })

  // ⚠️ `orientationActive = true` sobrevivia a `false`: com o giroscópio
  // mandando, o ponteiro voltaria a competir pelo mesmo alvo, e a cena
  // tremeria entre as duas fontes a cada dedo que passasse por cima.
  it('quando o giroscópio assume, o ponteiro para de mandar', () => {
    window.DeviceOrientationEvent = function () {}
    const { exposed, el, wrapper } = mountTilt({ smoothing: 1 })

    fireOrientation(32, 72) // giroscópio: canto direito
    flushRaf()
    const comGiro = exposed.tiltX.value
    expect(comGiro).toBeGreaterThan(0.9)

    const ev = new Event('pointermove')
    ev.clientX = 0 // borda ESQUERDA: puxaria para -1 se o ponteiro mandasse
    ev.clientY = 50
    el.dispatchEvent(ev)
    flushRaf()
    expect(exposed.tiltX.value, 'o ponteiro roubou o comando do giroscópio').toBe(comGiro)

    el.dispatchEvent(new Event('pointerleave'))
    flushRaf()
    expect(exposed.tiltX.value).toBe(comGiro)
    wrapper.unmount()
  })

  // ⚠️ `{ passive: true }` sobrevivia nos três ouvintes. Ouvinte de
  // `pointermove` e `deviceorientation` sem `passive` autoriza o navegador a
  // esperar por um `preventDefault` que nunca vem, e é isso que engasga a
  // rolagem no celular -- justamente o aparelho onde este efeito roda.
  it('os três ouvintes são passivos', () => {
    window.DeviceOrientationEvent = function () {}
    const registrados = []
    const original = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (tipo, fn, opcoes) {
      registrados.push([tipo, opcoes])
      return original.call(this, tipo, fn, opcoes)
    }
    // ⚠️ `window.addEventListener` no jsdom NÃO passa por
    // `EventTarget.prototype`: sem este segundo espião o ouvinte de
    // orientação simplesmente não aparece na lista.
    const naJanela = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation((tipo, fn, opcoes) => registrados.push([tipo, opcoes]))
    let wrapper
    try {
      wrapper = mountTilt().wrapper
    } finally {
      EventTarget.prototype.addEventListener = original
      naJanela.mockRestore()
    }

    // O que interessa é que EXISTA um registro passivo para cada um dos três.
    // Com `{ passive: false }` no fonte não sobra nenhum, e o navegador passa a
    // esperar por um `preventDefault` que nunca vem -- é isso que engasga a
    // rolagem no celular, justamente o aparelho onde este efeito roda.
    for (const tipo of ['deviceorientation', 'pointermove', 'pointerleave']) {
      const passivo = registrados.some(([t, o]) => t === tipo && o && o.passive === true)
      expect(passivo, `ouvinte de ${tipo} não foi registrado como passivo`).toBe(true)
    }
    wrapper.unmount()
  })

  it('falls back to pointer position over the target element', () => {
    const { exposed, el, wrapper } = mountTilt({ smoothing: 0.12 })
    const ev = new Event('pointermove')
    ev.clientX = 100 // right edge → +1
    ev.clientY = 50 // middle → 0
    el.dispatchEvent(ev)
    flushRaf()
    expect(exposed.tiltX.value).toBeGreaterThan(0.7) // *0.85 pointerStrength default
    expect(Math.abs(exposed.tiltY.value)).toBeLessThan(0.05)
    wrapper.unmount()
  })

  it('removes listeners on unmount', () => {
    window.DeviceOrientationEvent = function () {}
    const { exposed, wrapper } = mountTilt()
    wrapper.unmount()
    fireOrientation(32, 72)
    flushRaf()
    expect(exposed.tiltX.value).toBe(0)
  })
})
