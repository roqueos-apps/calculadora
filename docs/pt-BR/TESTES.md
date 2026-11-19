# Testes

_[English](../TESTING.md) | Português_

> **Para quem:** quem muda a calculadora e precisa saber qual teste prova o quê, e o que "pronto" quer dizer aqui.
> **O que tem aqui:** o gate, cada suíte e o que ela prova, a regra de que toda correção traz teste, e o critério de aceite.
> **Onde ir para o resto:** gate vermelho, [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md#o-gate); o inventário de paridade, [INTEGRACOES.md](INTEGRACOES.md#4-o-que-o-roqueos-lê-do-pacote).

## Sumário

1. [O gate](#1-o-gate)
2. [As suítes](#2-as-suítes)
3. [Os testes e o inventário de paridade](#3-os-testes-e-o-inventário-de-paridade)
4. [Critério de aceite](#4-critério-de-aceite)

## 1. O gate

```bash
yarn verificar
```

Lint, formato, testes e `app check`, nessa ordem, parando no primeiro vermelho. O CI roda o mesmo
([.github/workflows/ci.yml](../../.github/workflows/ci.yml)), e o gancho de pre-push que o
`roqueos-ecosystem` instala também. O Vitest roda com jsdom e o
[test/preparar.js](../../test/preparar.js), que fornece o `ResizeObserver` e o `matchMedia` que o
jsdom não tem e desmonta todo componente no fim do teste dele. Medido em 18/11/2026: 8 arquivos,
75 testes, todos verdes.

## 2. As suítes

| Arquivo                                                            | Testes | O que prova                                                                                                                                                                                                             |
| ------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [test/motor.spec.js](../../test/motor.spec.js)                     | 9      | precedência e associatividade à direita do `^`, menos unário, graus e radianos, pós-fixos, fechamento automático, erros, `fmt`, e que o texto que o `fmt` escreve volta para a conta                                    |
| [test/Calculadora.spec.js](../../test/Calculadora.spec.js)         | 25     | a tela: regras de entrada, porcentagem, troca de sinal, Error e AC, histórico, memória, SCI, as duas linhas do visor, a prévia, 2nd, teclas físicas, anel de foco, perfil leve, textos, o teclado só com a janela ativa |
| [test/Visor.spec.js](../../test/Visor.spec.js)                     | 6      | o texto de verdade fica legível e o desenho é `aria-hidden`; segmentos, expoente, cursor, ◀ e indicadores                                                                                                              |
| [test/matriz.spec.js](../../test/matriz.spec.js)                   | 6      | a fonte 5 × 7, que tudo o que a calculadora escreve tem desenho, o recorte da linha longa                                                                                                                               |
| [test/segmentos.spec.js](../../test/segmentos.spec.js)             | 8      | os segmentos de cada dígito, as 13 células, a notação científica, a palavra `Error`                                                                                                                                     |
| [test/app.spec.js](../../test/app.spec.js)                         | 8      | o app pelo SDK: id permanente, contrato, montar depois do texto, troca de idioma, `ativar`, `desmontar`                                                                                                                 |
| [test/troca-de-idioma.spec.js](../../test/troca-de-idioma.spec.js) | 1      | duas trocas de idioma fora de ordem: vale o último pedido                                                                                                                                                               |
| [test/useInclinacao.spec.js](../../test/useInclinacao.spec.js)     | 12     | a inclinação: sensor e ponteiro, limite, parada com movimento reduzido e com o perfil leve, a permissão do iOS pedida uma vez, ouvintes passivos, limpeza                                                               |

## 3. Os testes e o inventário de paridade

O [paridade.json](../../paridade.json) cita testes por arquivo e título exato
(`"test/motor.spec.js › respeita a precedência e a associatividade da potência"`), e o RoqueOS
recusa a versão se um título citado não existe mais. Renomear ou apagar um teste é, então, mudança
no `paridade.json` no mesmo commit. A conferência roda antes da tag, a partir do `roqueos-front`:
`node scripts/paridade-dos-apps.mjs ../calculadora`.

## 4. Critério de aceite

- `yarn verificar` verde, colado como saiu.
- Toda correção vem com um teste que reprova sem ela ([CLAUDE.md](../../CLAUDE.md)); conta errada
  vira caso no [test/motor.spec.js](../../test/motor.spec.js), com a expressão e o valor esperado
  ([CONTRIBUTING.md](CONTRIBUTING.md)).
- Texto novo nos dez `i18n/*.json` (o `app check` recusa se não).
- Mudança visível é aberta de verdade no `yarn dev`, com print, antes de ser dada como pronta
  ([.claude/loop.md](../../.claude/loop.md)).
- Teste nunca é enfraquecido para o gate passar.
- O que as suítes não cobrem: o build de verdade do RoqueOS, e celulares de verdade (a inclinação
  só é testada com sensor simulado).
