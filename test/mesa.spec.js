// A mesa em volta da calculadora segue o tema do RoqueOS, e a carcaça não. O tema chega pelo
// `--ros-text-100` do contrato: branco no escuro, preto no claro. Aqui o teste lê o estilo,
// resolve cada canal da mesa e do rodapé para os dois temas como o navegador resolve a cor
// relativa (`rgb(from ...)`), e mede o contraste do rodapé contra a mesa pela fórmula da WCAG.
import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { VARIAVEIS_DO_SISTEMA } from '@roqueos-apps/app-sdk'

const scss = readFileSync('src/calculadora.scss', 'utf8')
const ESCURO = 255 // o r de --ros-text-100 no tema escuro (texto branco)
const CLARO = 0 // e no claro (texto preto)

const blocoDoTema = () => {
  const inicio = scss.indexOf('@supports (color: rgb(from red r g b))')
  if (inicio < 0) return ''
  return scss.slice(inicio, scss.indexOf('\n}\n', inicio))
}

// O valor de uma variável --calc-* resolvido para um tema: lê os três `calc(A + (B - A) * r /
// 255)` da declaração e faz a conta com o r do tema.
const corNoTema = (nome, r) => {
  const declaracao = blocoDoTema().match(new RegExp(`${nome}:\\s*rgb\\(([\\s\\S]*?)\\);`))
  if (!declaracao) throw new Error(`${nome} não segue o tema`)
  expect(declaracao[1]).toMatch(/^\s*from var\(--ros-text-100, #fff\)/)
  const canais = [...declaracao[1].matchAll(/calc\((\d+) \+ \((\d+) - (\d+)\) \* r \/ 255\)/g)].map(
    ([, claro, escuro, claroDeNovo]) => {
      expect(claroDeNovo).toBe(claro)
      return Math.round(Number(claro) + ((Number(escuro) - Number(claro)) * r) / 255)
    },
  )
  expect(canais).toHaveLength(3)
  return canais
}

// O valor de fora do @supports (o navegador sem cor relativa e o ponto de partida do escuro).
const corDeBase = (nome) => {
  const antes = scss.slice(0, scss.indexOf('@supports (color: rgb(from'))
  const achado = antes.match(new RegExp(`${nome}: #([0-9a-f]{6});`))
  if (!achado) throw new Error(`${nome} sem cor de base opaca`)
  return [0, 2, 4].map((i) => parseInt(achado[1].slice(i, i + 2), 16))
}

const luminancia = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a, b) => {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}
// A luz de cima da mesa (branco a 7%) somada à cor: é o ponto mais claro da mesa.
const comLuz = (rgb) => rgb.map((c) => Math.round(c + (255 - c) * 0.07))

// Os pontos da mesa sob o rodapé, do mais claro ao mais escuro.
const pontosDaMesa = (r) => [
  comLuz(corNoTema('--calc-mesa-1', r)),
  corNoTema('--calc-mesa-1', r),
  corNoTema('--calc-mesa-2', r),
]

describe('a mesa segue o tema', () => {
  it('reads the theme only through a contract variable of the installed app-sdk', () => {
    const usadas = new Set([...scss.matchAll(/var\((--ros-[a-z0-9-]+)/g)].map((m) => m[1]))
    expect([...usadas]).toEqual(['--ros-text-100'])
    expect(VARIAVEIS_DO_SISTEMA).toContain('--ros-text-100')
  })

  it('keeps the dark desk exactly as before', () => {
    expect(corDeBase('--calc-mesa-1')).toEqual([0x1c, 0x1f, 0x24])
    expect(corDeBase('--calc-mesa-2')).toEqual([0x0f, 0x11, 0x14])
    for (const nome of ['--calc-mesa-1', '--calc-mesa-2', '--calc-rodape', '--calc-rodape-marca']) {
      expect(corNoTema(nome, ESCURO)).toEqual(corDeBase(nome))
    }
  })

  it('turns into a light desk in the light theme', () => {
    for (const nome of ['--calc-mesa-1', '--calc-mesa-2']) {
      expect(luminancia(corNoTema(nome, CLARO))).toBeGreaterThan(0.55)
      expect(luminancia(corNoTema(nome, ESCURO))).toBeLessThan(0.02)
    }
  })

  it('keeps the footer text at 4.5:1 or more over the desk in both themes', () => {
    for (const r of [ESCURO, CLARO]) {
      for (const nome of ['--calc-rodape', '--calc-rodape-marca']) {
        for (const mesa of pontosDaMesa(r)) {
          expect(contraste(corNoTema(nome, r), mesa)).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  it('keeps 4.5:1 on the dark fallback, without relative color support', () => {
    const mesa = [comLuz(corDeBase('--calc-mesa-1')), corDeBase('--calc-mesa-2')]
    for (const nome of ['--calc-rodape', '--calc-rodape-marca']) {
      for (const ponto of mesa) {
        expect(contraste(corDeBase(nome), ponto)).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('leaves the device body out of the theme', () => {
    const tema = blocoDoTema()
    expect(tema).not.toBe('')
    const variaveis = [...tema.matchAll(/(--calc-[a-z0-9-]+):/g)].map((m) => m[1])
    expect(variaveis.sort()).toEqual([
      '--calc-mesa-1',
      '--calc-mesa-2',
      '--calc-rodape',
      '--calc-rodape-marca',
    ])
  })
})
