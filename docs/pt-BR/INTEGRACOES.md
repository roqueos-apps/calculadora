# Integrações

_[English](../INTEGRATIONS.md) | Português_

> **Para quem:** quem mexe na fronteira entre a Calculadora e o RoqueOS, de qualquer um dos lados.
> **O que tem aqui:** a única superfície que o app tem para fora: o objeto que ele exporta, o `sistema` que ele usa, o manifesto, os textos e o inventário de paridade que o RoqueOS confere.
> **Onde ir para o resto:** os campos um a um na [REFERENCIA.md](REFERENCIA.md#formatos); soltar e pinar uma versão em [OPERACAO.md](OPERACAO.md).

## Sumário

1. [A superfície](#1-a-superfície)
2. [O que o app exporta](#2-o-que-o-app-exporta)
3. [O que o app usa do `sistema`](#3-o-que-o-app-usa-do-sistema)
4. [O que o RoqueOS lê do pacote](#4-o-que-o-roqueos-lê-do-pacote)
5. [O que o app nunca faz](#5-o-que-o-app-nunca-faz)

## 1. A superfície

A Calculadora não tem API, CLI, webhook nem MCP. O único consumidor dela é o RoqueOS, e a conversa
passa pelo contrato do `app-sdk` (`v0.1.0`): o RoqueOS instala o pacote pela tag, lê três arquivos
dele e monta o objeto exportado numa janela. O mesmo contrato é o que o `yarn dev`
(`montarNaJanelaFalsa`) e os testes (`criarSistemaFalso`) usam, então uma mudança que quebra o
RoqueOS costuma quebrar um deles antes.

## 2. O que o app exporta

O export padrão do [src/index.js](../../src/index.js) (também o `exports["."]` do
[package.json](../../package.json)) é o resultado do `definirApp`, em linhas gerais:

```js
export default definirApp({
  id: 'calculator',
  capacidades: [],
  montar(el, sistema, { ativo }) {
    // cria o app Vue dentro de el quando os textos chegam
    return { ativar(sim) {}, desmontar() {} }
  },
})
```

O RoqueOS chama `mount(el, sistema, { windowId, ativo })` nesse objeto (o SDK embrulha o
`montar`), como faz o [test/app.spec.js](../../test/app.spec.js). O `ativar(true | false)`
devolvido segue o foco da janela; o `desmontar()` desmonta o Vue e para de ouvir o idioma. O
`exports["./app.json"]` publica o manifesto.

## 3. O que o app usa do `sistema`

| Chamada                         | Para quê                                                       | Onde                                                                                                 |
| ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `sistema.idioma.atual()`        | o idioma na hora de montar                                     | [src/index.js](../../src/index.js)                                                                   |
| `sistema.idioma.aoMudar(fn)`    | troca os textos com a janela aberta; vale o último pedido      | [src/index.js](../../src/index.js)                                                                   |
| `sistema.desempenho.modoLeve()` | o perfil leve: classe `is-leve` e nenhum ouvinte de inclinação | [src/Calculadora.vue](../../src/Calculadora.vue), [src/useInclinacao.js](../../src/useInclinacao.js) |

Nada mais. O app não pede capacidade opcional (`capacidades: []` no `definirApp` e no
[app.json](../../app.json)), e o teste `o sistema falso cumpre o contrato que o app pede` do
[test/app.spec.js](../../test/app.spec.js) confere o sistema falso com o `verificarSistema`.

## 4. O que o RoqueOS lê do pacote

| Arquivo                              | Quem lê (no `roqueos-front`)                                                                       | Para quê                                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [app.json](../../app.json)           | `scripts/apps-de-primeira-parte.mjs`                                                               | gera a entrada do registro de apps, o carregador da janela e o nome e a descrição por idioma             |
| [paridade.json](../../paridade.json) | `scripts/paridade-dos-apps.mjs`, rodado pelo `tests/unit/architecture/apps-fora-do-nucleo.spec.js` | recusa a versão cujo inventário cita teste que não existe, tem estado desconhecido, ou perda sem decisão |
| [test/](../../test/app.spec.js)      | a mesma conferência de paridade                                                                    | os títulos de teste que o `paridade.json` cita precisam existir no pacote                                |

O `files` do `package.json` põe no pacote `src`, `i18n`, `app.json`, `paridade.json`, `ASSETS.md`,
`LICENSE` e `README.md`. O nome do componente da janela que o RoqueOS deriva do id é
`ROSCalculator` (`componenteDo` naquele script).

## 5. O que o app nunca faz

Ele não importa nada além de `vue`, `@roqueos-apps/app-sdk` e os próprios arquivos
([CLAUDE.md](../../CLAUDE.md)); o `app check` recusa o Quasar, os apelidos do RoqueOS e o
Firebase, e a catraca `apps-fora-do-nucleo` do RoqueOS recusa o resto. Ele não grava nada, não
chama servidor e não lê cor do tema. Mudar qualquer coisa disso é mudança de contrato: precisa
primeiro de uma capacidade nova no SDK, depois do RoqueOS, depois do app
([OPERACAO.md](OPERACAO.md#3-atualizar-sem-quebrar)).
