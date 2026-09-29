<template>
  <!-- O visor de cristal líquido: os indicadores em cima, a conta em matriz de pontos e o
       valor em sete segmentos. O texto de verdade fica nos <span> escondidos da vista (o
       leitor de tela e os testes leem dali); o desenho é todo aria-hidden. -->
  <div class="ros-calc__lcd" :class="{ 'is-erro': erro }">
    <div class="lcd__anunciadores" aria-hidden="true">
      <span class="lcd__anunc lcd__anunc--seta" :class="{ 'is-on': linha.cortado }">◀</span>
      <span class="lcd__anunc" :class="{ 'is-on': anunciadores.segunda }">2nd</span>
      <span class="lcd__anunc" :class="{ 'is-on': anunciadores.memoria }">M</span>
      <span class="lcd__espaco"></span>
      <span class="lcd__anunc" :class="{ 'is-on': anunciadores.deg }">DEG</span>
      <span class="lcd__anunc" :class="{ 'is-on': anunciadores.rad }">RAD</span>
    </div>

    <div class="ros-calc__expr">
      <span class="lcd__texto">{{ expressao }}</span>
      <svg
        class="lcd__matriz"
        :viewBox="`0 0 ${LARGURA_DA_MATRIZ} 7`"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
      >
        <path class="lcd__fantasma" :d="GRADE" />
        <path class="lcd__tinta" :d="pontos" />
        <path v-if="cursor" class="lcd__tinta lcd__cursor" :d="caminhoDoCursor" />
      </svg>
    </div>

    <div class="ros-calc__main">
      <span class="lcd__texto">{{ valor }}</span>
      <svg
        class="lcd__digitos"
        :viewBox="VIEWBOX_DOS_DIGITOS"
        preserveAspectRatio="xMaxYMid meet"
        aria-hidden="true"
      >
        <g transform="skewX(-6)">
          <path class="lcd__fantasma" :d="FANTASMA_DOS_DIGITOS" />
          <path class="lcd__tinta" :d="digitosAcesos" />
        </g>
      </svg>
    </div>

    <div class="lcd__vidro" aria-hidden="true"></div>
  </div>
</template>

<script setup>
// O visor da Calculadora. Recebe o que mostrar e desenha; a conta e o estado moram na
// Calculadora.vue. A geometria vem de visor/matriz.js e visor/segmentos.js, que são puros e
// testados.
import { computed } from 'vue'
import {
  CARACTERES,
  COLUNAS_POR_CARACTERE,
  caminhoDaGrade,
  caminhoDosPontos,
  recorteDaLinha,
} from './visor/matriz.js'
import {
  CELULAS,
  CELULAS_DO_EXPOENTE,
  SEGMENTOS,
  caminhoDoPonto,
  caminhoDosSegmentos,
  celulasDoValor,
} from './visor/segmentos.js'

const props = defineProps({
  /** A conta, na linha de cima. */
  expressao: { type: String, default: '' },
  /** O cursor piscando no fim da conta (enquanto se digita). */
  cursor: { type: Boolean, default: false },
  /** O valor, na linha de baixo: o texto do `fmt` do motor, ou "Error". */
  valor: { type: String, default: '0' },
  erro: { type: Boolean, default: false },
  /** Os indicadores acesos: `{ segunda, memoria, deg, rad }`. */
  anunciadores: { type: Object, default: () => ({}) },
})

// ---- linha de cima: matriz de pontos ----------------------------------------------------
const LARGURA_DA_MATRIZ = CARACTERES * COLUNAS_POR_CARACTERE - 1
const GRADE = caminhoDaGrade(CARACTERES)

const linha = computed(() => recorteDaLinha(props.expressao, { cursor: props.cursor }))
const pontos = computed(() => caminhoDosPontos(linha.value.visiveis))
const caminhoDoCursor = computed(() => {
  const x0 = linha.value.posicaoDoCursor * COLUNAS_POR_CARACTERE
  return `M${x0} 6h4.78v0.78h-4.78Z`
})

// ---- linha de baixo: sete segmentos -----------------------------------------------------
// Em unidades do SVG: o sinal de menos em 0–5, as treze células a partir de 7 (passo 10,6),
// e à direita o "×10" embaixo e o expoente pequeno em cima, como no vidro de verdade.
const PASSO = 10.6
const X_DAS_CELULAS = 7
const X_DO_EXPOENTE = X_DAS_CELULAS + CELULAS * PASSO + 0.6
const X_DO_MENOS_DO_EXPOENTE = X_DO_EXPOENTE + 12.8
const X_DOS_DIGITOS_DO_EXPOENTE = X_DO_MENOS_DO_EXPOENTE + 4.6
const PASSO_DO_EXPOENTE = 5.4
const ESCALA_DO_EXPOENTE = 0.5
const FIM = X_DOS_DIGITOS_DO_EXPOENTE + CELULAS_DO_EXPOENTE * PASSO_DO_EXPOENTE
const VIEWBOX_DOS_DIGITOS = `-2.5 -0.2 ${(FIM + 2.5).toFixed(2)} 18.4`

const menos = (x0, x1, y, escala = 1) =>
  `M${x0} ${y}l${escala} -${escala}H${x1 - escala}l${escala} ${escala}l-${escala} ${escala}H${x0 + escala}Z`

// O "×10" do vidro, desenhado em segmentos (sem fonte): o × em duas barras e o 10 pequeno.
const barra = (x0, y0, x1, y1, t) => {
  const dx = y1 - y0
  const dy = x0 - x1
  const k = t / 2 / Math.hypot(dx, dy)
  const p = [
    [x0 + dx * k, y0 + dy * k],
    [x1 + dx * k, y1 + dy * k],
    [x1 - dx * k, y1 - dy * k],
    [x0 - dx * k, y0 - dy * k],
  ]
  return 'M' + p.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z'
}
const ESCALA_DO_DEZ = 0.42
const VEZES_DEZ = [
  barra(X_DO_EXPOENTE + 0.6, 11.4, X_DO_EXPOENTE + 3.8, 14.6, 0.75),
  barra(X_DO_EXPOENTE + 0.6, 14.6, X_DO_EXPOENTE + 3.8, 11.4, 0.75),
  caminhoDosSegmentos(SEGMENTOS[1], X_DO_EXPOENTE + 4.4, 10.2, ESCALA_DO_DEZ),
  caminhoDosSegmentos(SEGMENTOS[0], X_DO_EXPOENTE + 8.4, 10.2, ESCALA_DO_DEZ),
].join('')

const celula = (i) => X_DAS_CELULAS + i * PASSO
const celulaDoExpoente = (j) => X_DOS_DIGITOS_DO_EXPOENTE + j * PASSO_DO_EXPOENTE

const FANTASMA_DOS_DIGITOS = [
  menos(0, 5, 9),
  ...Array.from({ length: CELULAS }, (_, i) => [
    caminhoDosSegmentos(SEGMENTOS[8], celula(i), 0),
    caminhoDoPonto(celula(i), 0),
  ]).flat(),
  menos(X_DO_MENOS_DO_EXPOENTE, X_DO_MENOS_DO_EXPOENTE + 4, 4.5, 0.5),
  VEZES_DEZ,
  ...Array.from({ length: CELULAS_DO_EXPOENTE }, (_, j) =>
    caminhoDosSegmentos(SEGMENTOS[8], celulaDoExpoente(j), 0, ESCALA_DO_EXPOENTE),
  ),
].join('')

const celulas = computed(() => celulasDoValor(props.valor))
const digitosAcesos = computed(() => {
  const c = celulas.value
  const partes = []
  if (c.negativo) partes.push(menos(0, 5, 9))
  c.celulas.forEach(({ ch, ponto }, i) => {
    partes.push(caminhoDosSegmentos(SEGMENTOS[ch] ?? '', celula(i), 0))
    if (ponto) partes.push(caminhoDoPonto(celula(i), 0))
  })
  if (c.expoente) {
    partes.push(VEZES_DEZ)
    if (c.expoente.negativo)
      partes.push(menos(X_DO_MENOS_DO_EXPOENTE, X_DO_MENOS_DO_EXPOENTE + 4, 4.5, 0.5))
    c.expoente.digitos.forEach((ch, j) =>
      partes.push(
        caminhoDosSegmentos(SEGMENTOS[ch] ?? '', celulaDoExpoente(j), 0, ESCALA_DO_EXPOENTE),
      ),
    )
  }
  return partes.join('')
})
</script>

<style lang="scss" scoped>
@import './visor.scss';
</style>
