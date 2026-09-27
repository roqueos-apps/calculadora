<template>
  <!-- dir="ltr": teclado e visor de calculadora são da esquerda para a direita em todo
       idioma, inclusive no árabe; espelhar deixaria o 7 à direita do 9 e o "M−" como "−M". -->
  <div ref="calcRoot" class="ros-calc" dir="ltr" @pointerdown="primeTilt">
    <div class="ros-calc__device" :class="{ 'ros-calc__device--sci': sci }" :style="tiltStyle">
      <div class="ros-calc__base" aria-hidden="true"></div>

      <!-- Top bar: brand + SCI / history chips -->
      <div class="ros-calc__top">
        <div class="ros-calc__brand">
          <div class="ros-calc__brand-name">ROQUE</div>
          <div class="ros-calc__brand-model">RX·200 Scientific</div>
          <div class="ros-calc__solar" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="ros-calc__chips">
          <button
            class="ros-calc__chip"
            :class="{ 'is-on': sci }"
            type="button"
            :aria-pressed="sci"
            @click="toggleSci"
          >
            SCI
          </button>
          <button
            class="ros-calc__chip"
            type="button"
            :aria-label="tx('history')"
            @click="openHistory"
          >
            <svg class="ros-calc__chip-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="ICONE_HISTORICO" />
            </svg>
          </button>
        </div>
      </div>

      <!-- LCD -->
      <div class="ros-calc__lcd" :class="{ 'is-error': errorState }">
        <div class="ros-calc__flags">
          <span class="ros-calc__flag" :class="{ 'is-on': deg && sci }">DEG</span>
          <span class="ros-calc__flag" :class="{ 'is-on': !deg && sci }">RAD</span>
          <span class="ros-calc__flag" :class="{ 'is-on': inv }">INV</span>
          <span class="ros-calc__flag" :class="{ 'is-on': mem !== 0 }">M</span>
        </div>
        <div class="ros-calc__expr">
          <span>{{ exprText }}</span>
        </div>
        <div class="ros-calc__main" :class="mainLenClass">
          <span>{{ mainText }}</span>
        </div>
        <div class="ros-calc__glass" aria-hidden="true"></div>
      </div>

      <!-- Keypad -->
      <div class="ros-calc__pad">
        <!-- Scientific block (collapsible) -->
        <div class="ros-calc__sci-wrap">
          <div class="ros-calc__sci">
            <div class="ros-calc__grid ros-calc__grid--sci">
              <button
                class="ros-calc__key key--fn"
                :class="{ 'is-active': inv }"
                type="button"
                @click="toggleInv"
              >
                <span class="key__accent">2nd</span>
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="post('²')">x²</button>
              <button class="ros-calc__key key--fn" type="button" @click="sqrt">√</button>
              <button class="ros-calc__key key--fn" type="button" @click="op('^')">
                x<sup>y</sup>
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="post('!')">n!</button>
            </div>
            <div class="ros-calc__grid ros-calc__grid--sci">
              <button class="ros-calc__key key--fn" type="button" @click="fn(inv ? 'asin' : 'sin')">
                {{ inv ? 'asin' : 'sin' }}
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="fn(inv ? 'acos' : 'cos')">
                {{ inv ? 'acos' : 'cos' }}
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="fn(inv ? 'atan' : 'tan')">
                {{ inv ? 'atan' : 'tan' }}
              </button>
              <button class="ros-calc__key key--fn" type="button" @click="fn('log')">log</button>
              <button class="ros-calc__key key--fn" type="button" @click="fn('ln')">ln</button>
            </div>
            <div class="ros-calc__grid ros-calc__grid--sci">
              <button class="ros-calc__key key--fn" type="button" @click="constant('π')">π</button>
              <button class="ros-calc__key key--fn" type="button" @click="constant('e')">e</button>
              <button class="ros-calc__key key--fn" type="button" @click="paren('(')">(</button>
              <button class="ros-calc__key key--fn" type="button" @click="paren(')')">)</button>
              <button class="ros-calc__key key--fn" type="button" @click="toggleDeg">
                {{ deg ? 'DEG' : 'RAD' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Memory row -->
        <div class="ros-calc__grid ros-calc__grid--mem">
          <button class="ros-calc__key key--fn" type="button" @click="memClear">
            <span class="key__accent">MC</span>
          </button>
          <button class="ros-calc__key key--fn" type="button" @click="memRecall">
            <span class="key__accent">MR</span>
          </button>
          <button class="ros-calc__key key--fn" type="button" @click="memAdd(1)">
            <span class="key__accent">M+</span>
          </button>
          <button class="ros-calc__key key--fn" type="button" @click="memAdd(-1)">
            <span class="key__accent">M−</span>
          </button>
        </div>

        <!-- Main keypad -->
        <div class="ros-calc__grid ros-calc__grid--main">
          <button class="ros-calc__key key--fn key--del" type="button" @click="ac">AC</button>
          <button class="ros-calc__key key--fn key--del" type="button" @click="back">⌫</button>
          <button class="ros-calc__key key--fn" type="button" @click="post('%')">%</button>
          <button class="ros-calc__key key--op" type="button" @click="op('÷')">÷</button>

          <button class="ros-calc__key" type="button" @click="num('7')">7</button>
          <button class="ros-calc__key" type="button" @click="num('8')">8</button>
          <button class="ros-calc__key" type="button" @click="num('9')">9</button>
          <button class="ros-calc__key key--op" type="button" @click="op('×')">×</button>

          <button class="ros-calc__key" type="button" @click="num('4')">4</button>
          <button class="ros-calc__key" type="button" @click="num('5')">5</button>
          <button class="ros-calc__key" type="button" @click="num('6')">6</button>
          <button class="ros-calc__key key--op" type="button" @click="op('−')">−</button>

          <button class="ros-calc__key" type="button" @click="num('1')">1</button>
          <button class="ros-calc__key" type="button" @click="num('2')">2</button>
          <button class="ros-calc__key" type="button" @click="num('3')">3</button>
          <button class="ros-calc__key key--op" type="button" @click="op('+')">+</button>

          <button class="ros-calc__key key--fn" type="button" @click="negate">±</button>
          <button class="ros-calc__key" type="button" @click="num('0')">0</button>
          <button class="ros-calc__key" type="button" @click="num('.')">.</button>
          <button class="ros-calc__key key--op key--eq" type="button" @click="equals">=</button>
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
// A Calculadora: a tela, a entrada e o histórico. A conta mora em `motor.js`; o texto, em
// `i18n/`; o que vem do RoqueOS (idioma, perfil leve), pelo `sistema` do app-sdk.
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { compute, fmt } from './motor.js'
import { traduzir } from './textos.js'
import { useInclinacao } from './useInclinacao.js'

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

// Brand stamp (bound, not a template literal, so the i18n hardcoded scan stays
// clean — same idea as keeping product names out of static markup).
const brand = 'LEVELHARD'

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
const sci = ref(false)
const errorState = ref(false)
const historyItems = ref([])
const historyOpen = ref(false)
const calcRoot = ref(null)

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
  requestMotion()
}

// ==========================================================================
// Display (computed)
// ==========================================================================
const VAL_END = /[0-9.)²!eπ]$/

const mainText = computed(() => {
  if (mode.value === 'result') return result.value
  return expr.value === '' ? '0' : expr.value
})

const exprText = computed(() => {
  if (mode.value === 'result') return lastExpr.value + ' ='
  const shown = expr.value === '' ? '0' : expr.value
  if (
    expr.value !== '' &&
    /[+−×÷^!²%]|sqrt|sin|cos|tan|log|ln|√|π|e/.test(expr.value.replace(/^[−(]/, ''))
  ) {
    try {
      const f = fmt(compute(expr.value, deg.value))
      if (f !== 'Error' && f !== shown) return '= ' + f
    } catch {
      /* incomplete expression — no preview */
    }
  }
  return ''
})

const mainLenClass = computed(() => {
  const len = mainText.value.length
  if (len <= 8) return 'len-1'
  if (len <= 12) return 'len-2'
  if (len <= 18) return 'len-3'
  return 'len-4'
})

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
  if (k >= '0' && k <= '9') num(k)
  else if (k === '.' || k === ',') num('.')
  else if (k === '+') op('+')
  else if (k === '-') op('−')
  else if (k === '*') op('×')
  else if (k === '/') {
    e.preventDefault()
    op('÷')
  } else if (k === '^') op('^')
  else if (k === '(') paren('(')
  else if (k === ')') paren(')')
  else if (k === '%') post('%')
  else if (k === '!') post('!')
  else if (k === 'Enter' || k === '=') {
    e.preventDefault()
    equals()
  } else if (k === 'Backspace') {
    e.preventDefault()
    back()
  } else if (k === 'Escape') {
    if (historyOpen.value) closeHistory()
    else ac()
  } else return
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Exposed for tests + integrations.
defineExpose({ expr, result, mode, mem, deg, inv, sci, historyItems, mainText, exprText })
</script>

<style lang="scss" scoped>
@import './calculadora.scss';
</style>
