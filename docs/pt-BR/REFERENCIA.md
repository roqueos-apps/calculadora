# Referência

_[English](../REFERENCE.md) | Português_

> **Para quem:** quem precisa de um comando, um arquivo, uma tecla ou um campo, e não de uma história.
> **O que tem aqui:** os scripts do pacote, as seções do `app check`, o teclado físico, os arquivos e pastas, a configuração e os formatos do `app.json`, dos `i18n/*.json` e do `paridade.json`.
> **Onde ir para o resto:** por que as coisas são assim está na [ARQUITETURA.md](ARQUITETURA.md); o que fazer quando um comando falha, em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md).

## Sumário

1. [Comandos](#comandos)
2. [Scripts](#scripts)
3. [Teclado físico](#teclado-físico)
4. [Arquivos e pastas](#arquivos-e-pastas)
5. [Variáveis de ambiente e configuração](#variáveis-de-ambiente-e-configuração)
6. [Formatos](#formatos)

## Comandos

Todos estão no `scripts` do [package.json](../../package.json). O gerenciador é o Yarn 1
(`packageManager: yarn@1.22.22`); o gancho do kit recusa `npm` e `npx` neste repositório.

| Comando                         | O que faz                                                                                        | Exemplo                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `yarn install --ignore-scripts` | instala exatamente o lockfile, sem rodar script de install (o CI acrescenta `--frozen-lockfile`) | a primeira coisa depois do clone                |
| `yarn dev`                      | `vite`: a calculadora numa janela falsa do RoqueOS, em `http://localhost:5173/` por padrão       | `yarn dev`, depois `?idioma=ja-JP` ou `?leve=1` |
| `yarn test`                     | `vitest run`: todo `test/**/*.spec.js` com jsdom                                                 | `yarn test test/motor.spec.js`                  |
| `yarn lint`                     | `eslint .` com o [eslint.config.js](../../eslint.config.js)                                      | `yarn lint`                                     |
| `yarn format`                   | `prettier --write .`                                                                             | antes do commit                                 |
| `yarn format:check`             | `prettier --check .`, inclusive o Markdown                                                       | parte do gate                                   |
| `yarn app:check`                | o `app check` do SDK: o repositório contra o contrato do RoqueOS                                 | `yarn app:check`                                |
| `yarn verificar`                | `yarn lint && yarn format:check && yarn test && yarn app:check`: o gate                          | antes de todo push e PR                         |

## Scripts

| Script                                                                   | Entrada                                                                                               | Saída                                                                                                                   | Códigos de saída                                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app check` (`node_modules/.bin/app`, SDK `v0.1.0`)                      | a pasta atual, ou `app check <pasta>`; `--json`                                                       | uma linha por seção, `ok` ou `REPROVOU` com cada problema, e no fim `ok, o repo cumpre o contrato.` ou `N problema(s).` | `0` todas as seções ok, `1` algum problema, `2` comando desconhecido (`uso: app check [pasta] [--sdk] [--json]`) |
| `vitest run`                                                             | `test/**/*.spec.js` ([vite.config.js](../../vite.config.js))                                          | o relatório do Vitest                                                                                                   | `0` verde, `1` algum teste falhou                                                                                |
| `prettier --check .`                                                     | tudo menos o [.prettierignore](../../.prettierignore) (`node_modules`, `yarn.lock`, `dist`, `public`) | um `[warn]` por arquivo fora do estilo                                                                                  | `0` limpo, `1` algum arquivo a formatar                                                                          |
| `node scripts/paridade-dos-apps.mjs <pasta do app>` (no `roqueos-front`) | o `paridade.json`, o `package.json` e o `test/` deste repositório                                     | `paridade ok: 63 funcionalidades (...)` ou uma linha `paridade:` por problema                                           | `0` ok, `1` problema, `2` sem pasta                                                                              |

As seções do `app check` (do `src/verificacao.js` do SDK), na ordem em que ele imprime:

| Seção                              | Reprova quando                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts de instalação`            | o `package.json` declara `preinstall`, `install`, `postinstall`, `prepare`, `prepack` ou `postpack`                                   |
| `manifesto`                        | o `app.json` falta, não é JSON, ou não passa no `validarManifesto` do SDK                                                             |
| `textos nos idiomas`               | falta o `i18n/pt-BR.json`, falta um arquivo de idioma, ou ele tem chave a mais ou a menos que o pt-BR, ou texto vazio                 |
| `origem dos assets`                | um arquivo em `public/` não tem linha no `ASSETS.md`, ou a licença dele está fora de `CC0-1.0, CC-BY-4.0, MIT, BSD-3-Clause, autoral` |
| `o app não fala com banco`         | o `src/` importa `firebase`, `firebase/*` ou `@firebase/*`                                                                            |
| `o app não importa o RoqueOS`      | o `src/` importa `quasar` ou um apelido do RoqueOS (`src/`, `stores/`, `boot/`, `components/`...)                                     |
| `variáveis do sistema no contrato` | o `src/` lê uma variável `--ros-*` fora das seis do contrato, ou declara qualquer `--ros-*`                                           |

## Teclado físico

Só com a janela ativa (`estado.ativo`, que o `ativar` liga) e com o foco fora de input, textarea
ou elemento editável ([src/Calculadora.vue](../../src/Calculadora.vue), `onKeydown`).

| Tecla              | Faz                                                   |
| ------------------ | ----------------------------------------------------- |
| `0` a `9`          | dígito                                                |
| `.` ou `,`         | ponto decimal                                         |
| `+`, `-`, `*`, `/` | `+`, `−`, `×`, `÷`                                    |
| `^`                | potência                                              |
| `(`, `)`           | parênteses (o `)` só com um aberto)                   |
| `%`, `!`           | porcentagem, fatorial                                 |
| `Enter` ou `=`     | igual                                                 |
| `Backspace`        | DEL (tira um `sin(`, `√(` e afins inteiro de uma vez) |
| `Escape`           | fecha o histórico se estiver aberto, senão AC         |

## Arquivos e pastas

| Caminho                                                          | O que guarda                                                          | Quem escreve                        | Quem lê                                                             |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| [app.json](../../app.json)                                       | o manifesto                                                           | gente, por PR                       | o RoqueOS, o `app check`, o `dev/main.js`                           |
| [src/](../../src/index.js)                                       | o app                                                                 | gente, por PR                       | o RoqueOS (o Vite dele), o Vitest                                   |
| [i18n/](../../i18n/pt-BR.json)                                   | os textos da tela, dez idiomas                                        | gente, por PR                       | `src/textos.js`, `app check`                                        |
| [paridade.json](../../paridade.json)                             | o inventário de paridade, 63 itens                                    | gente, por PR, com o teste que cita | a conferência de paridade do RoqueOS                                |
| [test/](../../test/app.spec.js)                                  | as suítes do Vitest e o [preparar.js](../../test/preparar.js)         | gente                               | o Vitest, a conferência de paridade do RoqueOS (títulos dos testes) |
| [dev/main.js](../../dev/main.js), [index.html](../../index.html) | a entrada do `yarn dev`                                               | gente                               | o Vite                                                              |
| [ASSETS.md](../../ASSETS.md)                                     | origem e licença de cada arquivo em `public/` (hoje não há `public/`) | gente                               | o `app check`                                                       |
| [docs/](INDEX.md)                                                | esta documentação e a [capa.jpg](../capa.jpg)                         | gente                               | quem lê; `docs/` não vai no pacote                                  |
| [.github/](../../.github/workflows/ci.yml)                       | CI, DCO, CODEOWNERS, modelos de issue e PR                            | gente                               | o GitHub                                                            |
| [.claude/](../../.claude/settings.json)                          | configuração do kit e a rotina de manutenção                          | gente                               | o Claude Code                                                       |

O que vai no pacote que o RoqueOS instala é o `files` do [package.json](../../package.json):
`src`, `i18n`, `app.json`, `paridade.json`, `ASSETS.md`, `LICENSE`, `README.md`.

## Variáveis de ambiente e configuração

O app não lê variável de ambiente nenhuma. O que o configura:

| Nome                                  | Padrão                                          | O que muda                                                                                          |
| ------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `?idioma=<idioma>` (só no `yarn dev`) | o idioma do navegador                           | o idioma da janela falsa, um dos dez                                                                |
| `?leve=1` (só no `yarn dev`)          | desligado; tela de toque ou pouca memória ligam | força o perfil leve                                                                                 |
| `sistema.desempenho.modoLeve()`       | decidido pelo RoqueOS                           | `is-leve`: sem reflexo, grão, textura escovada nem cursor piscando; o `useInclinacao` não liga nada |
| `prefers-reduced-motion: reduce`      | o do sistema                                    | o `useInclinacao` não liga nada                                                                     |
| `.nvmrc`                              | `24`                                            | o Node do CI e do `nvm use`                                                                         |

## Formatos

**`app.json`**, validado pelo `validarManifesto` do SDK:

| Campo               | Valor aqui                                                                          | O que quer dizer                                                         |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `id`                | `calculator`                                                                        | permanente; é por ele que o RoqueOS acha janelas, atalhos e preferências |
| `versaoDoContrato`  | `1`                                                                                 | versão do contrato de app                                                |
| `camada`            | `primeira-parte`                                                                    | app de primeira parte (os dez idiomas são obrigatórios)                  |
| `nome`, `descricao` | um texto por idioma, dez idiomas                                                    | nome e descrição que o RoqueOS mostra                                    |
| `icone`             | `calculate`                                                                         | nome do Material Icons, desenhado pelo RoqueOS                           |
| `cor`               | `#ff9500`                                                                           | a cor do app                                                             |
| `categoria`         | `productivity`                                                                      | a categoria no RoqueOS                                                   |
| `janela`            | `largura 380`, `altura 680`, `minLargura 300`, `minAltura 540`, `maximizavel false` | o tamanho da janela                                                      |
| `capacidades`       | `[]`                                                                                | capacidades opcionais pedidas: nenhuma                                   |
| `autor`, `licenca`  | `Roque Ribeiro`, `MIT`                                                              | autoria e licença                                                        |

**`i18n/<idioma>.json`**: um objeto plano com as mesmas cinco chaves nos dez arquivos (`history`,
`clear`, `historyEmpty`, `historyEmptyHint`, `poweredBy`). O pt-BR é o canônico; idioma
desconhecido cai nele ([src/textos.js](../../src/textos.js)). O exemplo é o `en-US.json`.

```json
{
  "history": "History",
  "clear": "Clear",
  "historyEmpty": "No calculations yet.",
  "historyEmptyHint": "Results will show up here.",
  "poweredBy": "powered by"
}
```

**`paridade.json`**: `versao` (1), `app` (o `id`), `antes` (onde o app morava), `auditoria`
(quando e como o inventário foi feito) e `funcionalidades`, uma lista em que cada item tem
`o_que`, `estado` (`mantida`, `mudou` ou `perdida`), `testes` (`"test/<arquivo> › <título exato
do it()>"`), `evidencia`, `nota` (obrigatória em `mudou`) e `decisao` (obrigatória em `perdida`).
A regra está no `scripts/paridade-dos-apps.mjs` do `roqueos-front`. O primeiro item, encurtado
(um dos dois testes dele e o começo da evidência):

```json
{
  "o_que": "Dígitos de 0 a 9",
  "estado": "mantida",
  "testes": ["test/Calculadora.spec.js › adds two numbers and shows the expression"],
  "evidencia": "As teclas 7 a 0 do TECLADO e a função num, em src/Calculadora.vue ..."
}
```
