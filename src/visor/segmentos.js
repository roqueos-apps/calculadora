// A linha de baixo do visor: dígitos de sete segmentos, como no LCD de uma calculadora
// científica de verdade. Tudo aqui é puro (texto entra, geometria sai) e testado em
// test/segmentos.spec.js; quem desenha é o Visor.vue.
//
// O desenho do LCD é fixo, como no vidro de verdade: um sinal de menos à esquerda, TREZE
// células de dígito (o `fmt` do motor dá até doze algarismos significativos, e "0." mais
// doze casas são treze células) e, à direita, o expoente pequeno de três dígitos com o
// sinal dele. Cada célula acende os segmentos do caractere e deixa os outros "fantasma",
// fracos, que é o que faz um LCD parecer LCD.

/** Os segmentos de cada caractere: a (topo), b e c (direita), d (base), e e f (esquerda), g (meio). */
export const SEGMENTOS = Object.freeze({
  0: 'abcdef',
  1: 'bc',
  2: 'abdeg',
  3: 'abcdg',
  4: 'bcfg',
  5: 'acdfg',
  6: 'acdefg',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  E: 'adefg',
  r: 'eg',
  o: 'cdeg',
  ' ': '',
})

export const CELULAS = 13
export const CELULAS_DO_EXPOENTE = 3

/**
 * Distribui o texto que o motor devolve (`fmt`: "0", "-6", "0.333333333333",
 * "7.257416e+306", "Error") pelas células do visor.
 *
 * Número vai à direita, como numa calculadora; palavra ("Error") vai à esquerda. O ponto
 * decimal acende junto da célula do dígito que vem antes dele.
 *
 * @returns {{
 *   negativo: boolean,
 *   celulas: { ch: string, ponto: boolean }[],
 *   expoente: null | { negativo: boolean, digitos: string[] },
 *   cabe: boolean,
 * }}
 */
export function celulasDoValor(texto, { celulas = CELULAS, expoente = CELULAS_DO_EXPOENTE } = {}) {
  const t = String(texto ?? '').trim()
  const vazias = () => Array.from({ length: celulas }, () => ({ ch: ' ', ponto: false }))

  if (!/^-?[\d.]+(e[-+]\d+)?$/.test(t)) {
    // Palavra: cada letra conhecida numa célula, da esquerda para a direita.
    const out = vazias()
    const letras = [...t].filter((c) => c in SEGMENTOS)
    letras.slice(0, celulas).forEach((c, i) => (out[i] = { ch: c, ponto: false }))
    return { negativo: false, celulas: out, expoente: null, cabe: letras.length <= celulas }
  }

  let [mantissa, exp] = t.split('e')
  const negativo = mantissa.startsWith('-')
  if (negativo) mantissa = mantissa.slice(1)

  const lidas = []
  for (const c of mantissa) {
    if (c === '.') {
      if (lidas.length === 0) lidas.push({ ch: '0', ponto: true })
      else lidas[lidas.length - 1].ponto = true
    } else lidas.push({ ch: c, ponto: false })
  }
  const cabe = lidas.length <= celulas
  const visiveis = lidas.slice(-celulas)
  const out = vazias()
  visiveis.forEach((c, i) => (out[celulas - visiveis.length + i] = c))

  let expoenteOut = null
  if (exp !== undefined) {
    const negExp = exp.startsWith('-')
    const digitos = exp.slice(1)
    const d = Array.from({ length: expoente }, () => ' ')
    const vis = [...digitos].slice(-expoente)
    vis.forEach((c, i) => (d[expoente - vis.length + i] = c))
    expoenteOut = { negativo: negExp, digitos: d }
  }
  return { negativo, celulas: out, expoente: expoenteOut, cabe }
}

// ---------------------------------------------------------------------------------------
// Geometria. Uma célula mede 8 × 18 unidades (o dígito de LCD é alto e estreito); o
// segmento tem 1,8 de espessura e pontas em losango, com uma folga pequena entre um segmento
// e o vizinho, como no vidro. O ponto decimal fica à direita, embaixo.
// ---------------------------------------------------------------------------------------
const FOLGA = 0.45
const MEIA = 0.9 // metade da espessura do segmento
const horizontal = (x0, x1, y) => [
  [x0 + FOLGA, y],
  [x0 + FOLGA + MEIA, y - MEIA],
  [x1 - FOLGA - MEIA, y - MEIA],
  [x1 - FOLGA, y],
  [x1 - FOLGA - MEIA, y + MEIA],
  [x0 + FOLGA + MEIA, y + MEIA],
]
const vertical = (x, y0, y1) => [
  [x, y0 + FOLGA],
  [x + MEIA, y0 + FOLGA + MEIA],
  [x + MEIA, y1 - FOLGA - MEIA],
  [x, y1 - FOLGA],
  [x - MEIA, y1 - FOLGA - MEIA],
  [x - MEIA, y0 + FOLGA + MEIA],
]

/** Os sete segmentos de uma célula na origem, como listas de pontos. */
export const FORMAS = Object.freeze({
  a: horizontal(1, 7, 1),
  b: vertical(7, 1, 9),
  c: vertical(7, 9, 17),
  d: horizontal(1, 7, 17),
  e: vertical(1, 9, 17),
  f: vertical(1, 1, 9),
  g: horizontal(1, 7, 9),
})

const num = (n) => Number(n.toFixed(3))
const caminho = (pontos, dx, dy, escala) =>
  'M' + pontos.map(([x, y]) => `${num(dx + x * escala)} ${num(dy + y * escala)}`).join('L') + 'Z'

/** O `d` de um SVG com os segmentos pedidos de uma célula posta em (dx, dy). */
export function caminhoDosSegmentos(segmentos, dx = 0, dy = 0, escala = 1) {
  return [...segmentos].map((s) => caminho(FORMAS[s], dx, dy, escala)).join('')
}

/** O ponto decimal de uma célula posta em (dx, dy). */
export function caminhoDoPonto(dx = 0, dy = 0, escala = 1) {
  const x = dx + 8.3 * escala
  const y = dy + 16.1 * escala
  const l = 1.8 * escala
  return `M${num(x)} ${num(y)}h${num(l)}v${num(l)}h${num(-l)}Z`
}
