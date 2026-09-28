<template>
  <!-- dir="ltr": teclado e visor de calculadora são da esquerda para a direita em todo
       idioma, inclusive no árabe; espelhar deixaria o 7 à direita do 9 e o "M−" como "−M". -->
  <div
    ref="calcRoot"
    class="ros-calc"
    :class="{ 'is-tab': navegandoComTab, 'is-leve': leve }"
    dir="ltr"
    @pointerdown="primeTilt"
    @keydown.tab="navegandoComTab = true"
  >
    <div class="ros-calc__device" :class="{ 'ros-calc__device--sci': sci }" :style="tiltStyle">
      <!-- O painel de cima, de alumínio escovado: a marca, as células solares, o visor e a
           chave deslizante do modo científico. -->
      <div class="ros-calc__painel">
        <div class="ros-calc__top">
          <div class="ros-calc__brand">
            <div class="ros-calc__brand-name">ROQUE</div>
            <div class="ros-calc__brand-model">
              RX·200 <span class="ros-calc__brand-tipo">Scientific</span>
            </div>
          </div>
          <div class="ros-calc__solar" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <Visor
          :expressao="exprText"
          :cursor="mode === 'editing'"
          :valor="mainText"
          :erro="errorState"
          :anunciadores="anunciadores"
        />

        <div class="ros-calc__controles">
          <button
            class="ros-calc__switch"
            :class="{ 'is-on': sci }"
            type="button"
            :aria-pressed="sci"
            @click="toggleSci"
          >
            SCI
            <span class="ros-calc__trilho" aria-hidden="true"><span></span></span>
          </button>
          <span class="ros-calc__rotulo" aria-hidden="true">{{ ROTULO_DO_PAINEL }}</span>
        </div>
      </div>

      <!-- O teclado. A legenda âmbar em cima de uma tecla é a função dela com o 2nd, como
           impressa na carcaça de uma calculadora de verdade; a tecla não muda de nome. -->
      <div class="ros-calc__pad">
        <div class="ros-calc__sci-wrap">
          <div class="ros-calc__sci">
            <div class="ros-calc__grid ros-calc__grid--fn">
              <button
                class="ros-calc__key key--fn key--2nd"
                :class="{ 'is-active': inv }"
                type="button"
                :aria-pressed="inv"
                @click="toggleInv"
              >
                2nd
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="post('²')">x²</button>
              <button class="ros-calc__key key--fn" type="button" @click="sqrt">√</button>
              <button
                class="ros-calc__key key--fn"
                :class="{ 'is-apertada': apertada === '^' }"
                type="button"
                @click="op('^')"
              >
                x<sup>y</sup>
              </button>
              <button
                class="ros-calc__key key--fn"
                :class="{ 'is-apertada': apertada === '!' }"
                type="button"
                @click="post('!')"
              >
                n!
              </button>
            </div>
            <div class="ros-calc__grid ros-calc__grid--fn ros-calc__grid--legendas">
              <div v-for="t in TRIGONOMETRICAS" :key="t" class="ros-calc__slot">
                <span class="ros-calc__legenda" :class="{ 'is-on': inv }" aria-hidden="true">
                  {{ t }}<sup>−1</sup>
                </span>
                <button
                  class="ros-calc__key key--fn"
                  type="button"
                  :aria-label="inv ? 'a' + t : t"
                  @click="fn(inv ? 'a' + t : t)"
                >
                  {{ t }}
                </button>
              </div>
              <div class="ros-calc__slot">
                <span class="ros-calc__legenda" aria-hidden="true"></span>
                <button class="ros-calc__key key--fn" type="button" @click="fn('log')">log</button>
              </div>
              <div class="ros-calc__slot">
                <span class="ros-calc__legenda" aria-hidden="true"></span>
                <button class="ros-calc__key key--fn" type="button" @click="fn('ln')">ln</button>
              </div>
            </div>
            <div class="ros-calc__grid ros-calc__grid--fn">
              <button class="ros-calc__key key--fn" type="button" @click="constant('π')">π</button>
              <button class="ros-calc__key key--fn" type="button" @click="constant('e')">e</button>
              <button
                class="ros-calc__key key--fn"
                :class="{ 'is-apertada': apertada === '(' }"
                type="button"
                @click="paren('(')"
              >
                (
              </button>
              <button
                class="ros-calc__key key--fn"
                :class="{ 'is-apertada': apertada === ')' }"
                type="button"
                @click="paren(')')"
              >
                )
              </button>
              <button
                class="ros-calc__key key--fn"
                type="button"
                :aria-label="deg ? 'DEG' : 'RAD'"
                @click="toggleDeg"
              >
                DRG
              </button>
            </div>
          </div>
        </div>

        <!-- Memória e histórico: ficam com o modo científico desligado também. -->
        <div class="ros-calc__grid ros-calc__grid--fn ros-calc__grid--mem">
          <button class="ros-calc__key key--fn" type="button" @click="memClear">MC</button>
          <button class="ros-calc__key key--fn" type="button" @click="memRecall">MR</button>
          <button class="ros-calc__key key--fn" type="button" @click="memAdd(1)">M+</button>
          <button class="ros-calc__key key--fn" type="button" @click="memAdd(-1)">M−</button>
          <button
            class="ros-calc__key key--fn key--hist"
            type="button"
            :aria-label="tx('history')"
            @click="openHistory"
          >
            <svg class="ros-calc__key-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="ICONE_HISTORICO" />
            </svg>
          </button>
        </div>

        <div class="ros-calc__grid ros-calc__grid--main">
          <button
            v-for="t in TECLADO"
            :key="t.rotulo"
            class="ros-calc__key"
            :class="[t.classe, { 'is-apertada': apertada === t.id }]"
            type="button"
            @click="t.acao()"
          >
            {{ t.rotulo }}
          </button>
        </div>
      </div>

      <!-- History drawer (scoped to the calculator window) -->
      <transition name="ros-calc-hist">
        <div v-if="historyOpen" class="ros-calc__history" @click.self="closeHistory">
          <div class="ros-calc__history-panel">
            <div class="ros-calc__history-head">
              <h2>{{ tx('history') }}</h2>
              <button type="button" @click="clearHistory">{{ tx('clear') }}</button>
            </div>
            <div class="ros-calc__history-list">
              <div v-if="!historyItems.length" class="ros-calc__history-empty">
                {{ tx('historyEmpty') }}<br />{{ tx('historyEmptyHint') }}
              </div>
              <button
                v-for="(h, i) in historyItems"
                :key="i"
                class="ros-calc__hitem"
                type="button"
                @click="recallHistory(h)"
              >
                <span class="ros-calc__hitem-expr">{{ h.expr }}</span>
                <span class="ros-calc__hitem-res">{{ h.result }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="ros-calc__footer">
      {{ tx('poweredBy') }} <span class="ros-calc__brandmark">{{ brand }}</span>
    </div>
  </div>
</template>

<script setup>
// A Calculadora: a tela, a entrada e o histórico. A conta mora em `motor.js`; o visor, em
// `Visor.vue`; o texto, em `i18n/`; o que vem do RoqueOS (idioma, perfil leve), pelo
// `sistema` do app-sdk.
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { compute, fmt } from './motor.js'
import { traduzir } from './textos.js'
import { useInclinacao } from './useInclinacao.js'
import Visor from './Visor.vue'

const props = defineProps({
  /** O `sistema` do app-sdk: idioma, perfil leve, avisos. */
  sistema: { type: Object, required: true },
  /** `{ ativo, idioma, textos }`, reativo, mantido pelo `montar` do index.js. */
  estado: { type: Object, required: true },
})

const tx = (chave) => traduzir(props.estado.textos, chave)

// O ícone `history` do Material Icons (Apache-2.0), desenhado aqui: o app monta o próprio
// Vue, e o `q-icon` do Quasar do RoqueOS não chega lá dentro.
const ICONE_HISTORICO =
  'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'

// O que vem impresso na carcaça (ligado, e não literal no template, para a varredura de
// texto sem tradução continuar limpa: é marca e gravação do aparelho, não frase de tela).
const brand = 'LEVELHARD'
const ROTULO_DO_PAINEL = 'TWO-LINE DISPLAY'
const TRIGONOMETRICAS = ['sin', 'cos', 'tan']

// ==========================================================================
// State
// ==========================================================================
const expr = ref('')
const mode = ref('editing') // 'editing' | 'result'
const result = ref('0')
const ans = ref(0)
const lastExpr = ref('')
const mem = ref(0)
const deg = ref(true)
const inv = ref(false)
// Liga com o bloco científico à mostra, como uma calculadora de engenharia de verdade; a
// chave SCI esconde o bloco e deixa só o teclado básico.
const sci = ref(true)
const errorState = ref(false)
const historyItems = ref([])
const historyOpen = ref(false)
const calcRoot = ref(null)

// O perfil leve vem do sistema (o RoqueOS decide uma vez, para o sistema inteiro): sem
// reflexo, sem grão, sem cursor piscando, sombra de uma camada só.
const leve = props.sistema.desempenho.modoLeve?.() === true

// "Catches light" like a physical object: the accelerometer (mobile) / pointer
// (desktop) drives moving specular highlights via CSS custom props. Inert under
// reduced-motion / low-end and static when motion permission is unavailable.
const { tiltX, tiltY, requestMotion } = useInclinacao(calcRoot, {
  pointerStrength: 0.85,
  modoLeve: props.sistema.desempenho.modoLeve,
})
const tiltStyle = computed(() => ({
  '--tilt-x': Number(tiltX.value.toFixed(3)),
  '--tilt-y': Number(tiltY.value.toFixed(3)),
}))
// iOS gates orientation behind a one-time permission prompt that must come from
// a user gesture — the first tap inside the calculator is that gesture.
const primeTilt = () => {
  navegandoComTab.value = false
  requestMotion()
}
// O anel de foco aparece para quem navega com Tab, e some quando se volta a clicar.
const navegandoComTab = ref(false)

// ==========================================================================
// Display (computed)
// ==========================================================================
// Como no visor de duas linhas: a conta em cima, com o cursor enquanto se digita, e o
// número embaixo. Enquanto se digita, embaixo fica a prévia do resultado; a conta que ainda
// não fecha (um "sin(" sozinho) deixa ali a última prévia que fechou.
const VAL_END = /[0-9.)²!eπ]$/
const previa = ref('0')

watch(
  [expr, deg, mode],
  () => {
    if (mode.value !== 'editing') return
    if (expr.value === '') {
      previa.value = '0'
      return
    }
    try {
      const f = fmt(compute(expr.value, deg.value))
      if (f !== 'Error') previa.value = f
    } catch {
      /* conta incompleta: fica a última prévia */
    }
  },
  { immediate: true },
)

const mainText = computed(() => (mode.value === 'result' ? result.value : previa.value))

const exprText = computed(() => (mode.value === 'result' ? lastExpr.value + ' =' : expr.value))

const anunciadores = computed(() => ({
  segunda: inv.value,
  memoria: mem.value !== 0,
  deg: deg.value && sci.value,
  rad: !deg.value && sci.value,
}))

// ==========================================================================
// Input helpers
// ==========================================================================
const openCount = () => {
  let o = 0
  for (const c of expr.value) {
    if (c === '(') o++
    else if (c === ')') o--
  }
  return o
}
const curNumber = () => {
  const m = expr.value.match(/[0-9.]*$/)
  return m ? m[0] : ''
}

function resetIfResult(forValue) {
  if (mode.value === 'result') {
    if (forValue) expr.value = ''
    else expr.value = result.value === 'Error' ? '' : result.value
    mode.value = 'editing'
  }
}

function num(d) {
  if (d === '.') return inputDecimal()
  if (mode.value === 'result') resetIfResult(true)
  if (/[)²!eπ]$/.test(expr.value)) expr.value += '×'
  expr.value += d
}

function inputDecimal() {
  if (mode.value === 'result') resetIfResult(true)
  if (curNumber().includes('.')) return
  if (expr.value === '' || /[+−×÷^(]$/.test(expr.value)) expr.value += '0'
  expr.value += '.'
}

function op(o) {
  if (o === '^') {
    // power behaves like an operator but is offered in the sci block
    if (mode.value === 'result') resetIfResult(false)
  } else if (mode.value === 'result') {
    resetIfResult(false)
  }
  if (expr.value === '') {
    if (o === '−') expr.value = '−'
    return
  }
  if (/[+−×÷^]$/.test(expr.value)) {
    if (o === '−' && /[×÷^(]$/.test(expr.value)) {
      expr.value += '−'
      return
    }
    expr.value = expr.value.slice(0, -1) + o
    return
  }
  if (/\($/.test(expr.value)) {
    if (o === '−') expr.value += '−'
    return
  }
  expr.value += o
}

function fn(name) {
  if (mode.value === 'result') resetIfResult(true)
  if (VAL_END.test(expr.value)) expr.value += '×'
  expr.value += name + '('
}
function sqrt() {
  if (mode.value === 'result') resetIfResult(true)
  if (VAL_END.test(expr.value)) expr.value += '×'
  expr.value += '√('
}
function constant(c) {
  if (mode.value === 'result') resetIfResult(true)
  if (VAL_END.test(expr.value)) expr.value += '×'
  expr.value += c
}
function paren(p) {
  if (mode.value === 'result') resetIfResult(p === '(')
  if (p === '(') {
    if (VAL_END.test(expr.value)) expr.value += '×'
    expr.value += '('
  } else if (openCount() > 0 && !/[+−×÷^(]$/.test(expr.value) && expr.value !== '') {
    expr.value += ')'
  }
}
function post(v) {
  if (mode.value === 'result') {
    if (result.value === 'Error') return
    expr.value = result.value
    mode.value = 'editing'
  }
  if (VAL_END.test(expr.value)) expr.value += v
}

function back() {
  if (mode.value === 'result') {
    ac()
    return
  }
  if (expr.value === '') return
  const funcMatch = expr.value.match(/(asin|acos|atan|sqrt|sin|cos|tan|log|ln)\($/)
  if (funcMatch) expr.value = expr.value.slice(0, -funcMatch[0].length)
  else if (expr.value.endsWith('√(')) expr.value = expr.value.slice(0, -2)
  else expr.value = expr.value.slice(0, -1)
}

function ac() {
  expr.value = ''
  result.value = '0'
  mode.value = 'editing'
  errorState.value = false
}

function negate() {
  if (mode.value === 'result') {
    if (result.value === 'Error') return
    expr.value = fmt(-ans.value)
    mode.value = 'editing'
    return
  }
  const m = expr.value.match(/(\d*\.?\d+|π|e)$/)
  if (m) {
    const idx = expr.value.length - m[0].length
    const before = expr.value.slice(0, idx)
    if (before.endsWith('(-') || /\(−$/.test(before)) {
      expr.value = before + m[0]
    } else {
      expr.value = before + '(−' + m[0] + ')'
    }
  } else if (expr.value === '') {
    expr.value = '(−'
  }
}

function equals() {
  if (expr.value.trim() === '') return
  let r
  try {
    r = compute(expr.value, deg.value)
  } catch {
    result.value = 'Error'
    lastExpr.value = expr.value
    mode.value = 'result'
    errorState.value = true
    return
  }
  errorState.value = false
  const out = fmt(r)
  historyItems.value = [{ expr: expr.value, result: out }, ...historyItems.value].slice(0, 60)
  ans.value = r
  result.value = out
  lastExpr.value = expr.value
  mode.value = 'result'
}

// ==========================================================================
// Memory
// ==========================================================================
function currentValue() {
  if (mode.value === 'result') return ans.value
  try {
    return compute(expr.value, deg.value)
  } catch {
    return null
  }
}
function memAdd(sign) {
  const v = currentValue()
  if (v === null) return
  mem.value += sign * v
}
function memClear() {
  mem.value = 0
}
function memRecall() {
  resetIfResult(true)
  if (VAL_END.test(expr.value)) expr.value += '×'
  expr.value += fmt(mem.value) === 'Error' ? '0' : String(mem.value)
}

// ==========================================================================
// Modes
// ==========================================================================
const toggleSci = () => {
  sci.value = !sci.value
}
const toggleInv = () => {
  inv.value = !inv.value
}
const toggleDeg = () => {
  deg.value = !deg.value
}

// ==========================================================================
// O teclado de baixo, em cinco colunas, como numa calculadora científica: DEL e AC em
// cima, à direita dos dígitos. `id` é a tecla física que aperta a mesma tecla na tela.
// ==========================================================================
const TECLADO = [
  { rotulo: '7', id: '7', acao: () => num('7') },
  { rotulo: '8', id: '8', acao: () => num('8') },
  { rotulo: '9', id: '9', acao: () => num('9') },
  { rotulo: 'DEL', id: 'del', classe: 'key--del', acao: back },
  { rotulo: 'AC', id: 'ac', classe: 'key--del', acao: ac },
  { rotulo: '4', id: '4', acao: () => num('4') },
  { rotulo: '5', id: '5', acao: () => num('5') },
  { rotulo: '6', id: '6', acao: () => num('6') },
  { rotulo: '×', id: '×', classe: 'key--op', acao: () => op('×') },
  { rotulo: '÷', id: '÷', classe: 'key--op', acao: () => op('÷') },
  { rotulo: '1', id: '1', acao: () => num('1') },
  { rotulo: '2', id: '2', acao: () => num('2') },
  { rotulo: '3', id: '3', acao: () => num('3') },
  { rotulo: '+', id: '+', classe: 'key--op', acao: () => op('+') },
  { rotulo: '−', id: '−', classe: 'key--op', acao: () => op('−') },
  { rotulo: '0', id: '0', acao: () => num('0') },
  { rotulo: '.', id: '.', acao: () => num('.') },
  { rotulo: '±', id: '±', classe: 'key--op', acao: negate },
  { rotulo: '%', id: '%', classe: 'key--op', acao: () => post('%') },
  { rotulo: '=', id: '=', classe: 'key--eq', acao: equals },
]

// A tecla da tela afunda quando a do teclado físico é apertada.
const apertada = ref(null)
let soltar = null
const apertar = (id) => {
  apertada.value = id
  clearTimeout(soltar)
  soltar = setTimeout(() => (apertada.value = null), 130)
}

// ==========================================================================
// History
// ==========================================================================
const openHistory = () => {
  historyOpen.value = true
}
const closeHistory = () => {
  historyOpen.value = false
}
const clearHistory = () => {
  historyItems.value = []
}
const recallHistory = (h) => {
  if (h.result === 'Error') return
  result.value = h.result
  ans.value = parseFloat(h.result)
  lastExpr.value = h.expr
  mode.value = 'result'
  closeHistory()
}

// ==========================================================================
// Physical keyboard — only when the calculator's window is the active one and
// the user isn't typing in an input elsewhere. "Active" comes from the system
// (`ativar` of the app-sdk mount), not from the RoqueOS window DOM.
// ==========================================================================
const onKeydown = (e) => {
  const target = e.target
  if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return
  if (target && target.isContentEditable) return
  if (!props.estado.ativo) return

  const k = e.key
  if (k >= '0' && k <= '9') {
    num(k)
    apertar(k)
  } else if (k === '.' || k === ',') {
    num('.')
    apertar('.')
  } else if (k === '+') {
    op('+')
    apertar('+')
  } else if (k === '-') {
    op('−')
    apertar('−')
  } else if (k === '*') {
    op('×')
    apertar('×')
  } else if (k === '/') {
    e.preventDefault()
    op('÷')
    apertar('÷')
  } else if (k === '^') {
    op('^')
    apertar('^')
  } else if (k === '(') {
    paren('(')
    apertar('(')
  } else if (k === ')') {
    paren(')')
    apertar(')')
  } else if (k === '%') {
    post('%')
    apertar('%')
  } else if (k === '!') {
    post('!')
    apertar('!')
  } else if (k === 'Enter' || k === '=') {
    e.preventDefault()
    equals()
    apertar('=')
  } else if (k === 'Backspace') {
    e.preventDefault()
    back()
    apertar('del')
  } else if (k === 'Escape') {
    if (historyOpen.value) closeHistory()
    else {
      ac()
      apertar('ac')
    }
  } else return
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(soltar)
})

// Exposed for tests + integrations.
defineExpose({ expr, result, mode, mem, deg, inv, sci, historyItems, mainText, exprText })
</script>

<style lang="scss" scoped>
@import './calculadora.scss';
</style>
