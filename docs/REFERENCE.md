# Reference

_English | [Português](pt-BR/REFERENCIA.md)_

> **Who it is for:** whoever needs a command, a file, a key binding or a field, and not a story.
> **What is here:** the package scripts, the `app check` sections, the physical keyboard, the files and folders, configuration, and the formats of `app.json`, `i18n/*.json` and `paridade.json`.
> **Where to go for the rest:** why things are this way is in [ARCHITECTURE.md](ARCHITECTURE.md); what to do when a command fails, in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md).

## Contents

1. [Commands](#commands)
2. [Scripts](#scripts)
3. [Physical keyboard](#physical-keyboard)
4. [Files and folders](#files-and-folders)
5. [Environment variables and configuration](#environment-variables-and-configuration)
6. [Formats](#formats)

## Commands

All of them are in `scripts` of [package.json](../package.json). The package manager is Yarn 1
(`packageManager: yarn@1.22.22`); the kit's hook rejects `npm` and `npx` in this repository.

| Command                         | What it does                                                                                 | Example                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `yarn install --ignore-scripts` | installs exactly the lockfile, without running install scripts (CI adds `--frozen-lockfile`) | first thing after the clone                   |
| `yarn dev`                      | `vite`: the calculator in a fake RoqueOS window, at `http://localhost:5173/` by default      | `yarn dev`, then `?idioma=ja-JP` or `?leve=1` |
| `yarn test`                     | `vitest run`: every `test/**/*.spec.js` under jsdom                                          | `yarn test test/motor.spec.js`                |
| `yarn lint`                     | `eslint .` with [eslint.config.js](../eslint.config.js)                                      | `yarn lint`                                   |
| `yarn format`                   | `prettier --write .`                                                                         | before committing                             |
| `yarn format:check`             | `prettier --check .`, including the Markdown                                                 | part of the gate                              |
| `yarn app:check`                | `app check` from the SDK: the repository against the RoqueOS contract                        | `yarn app:check`                              |
| `yarn verificar`                | `yarn lint && yarn format:check && yarn test && yarn app:check`: the gate                    | before every push and PR                      |

## Scripts

| Script                                                                 | Input                                                                                                | Output                                                                                                               | Exit codes                                                                                             |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `app check` (`node_modules/.bin/app`, SDK `v0.1.0`)                    | the current folder, or `app check <folder>`; `--json`                                                | one line per section, `ok` or `REPROVOU` with each problem, then `ok, o repo cumpre o contrato.` or `N problema(s).` | `0` all sections ok, `1` some problem, `2` unknown command (`uso: app check [pasta] [--sdk] [--json]`) |
| `vitest run`                                                           | `test/**/*.spec.js` ([vite.config.js](../vite.config.js))                                            | the Vitest report                                                                                                    | `0` green, `1` some test failed                                                                        |
| `prettier --check .`                                                   | everything but [.prettierignore](../.prettierignore) (`node_modules`, `yarn.lock`, `dist`, `public`) | `[warn]` per file out of style                                                                                       | `0` clean, `1` some file to format                                                                     |
| `node scripts/paridade-dos-apps.mjs <app folder>` (in `roqueos-front`) | this repository's `paridade.json`, `package.json` and `test/`                                        | `paridade ok: 63 funcionalidades (...)` or one `paridade:` line per problem                                          | `0` ok, `1` problem, `2` no folder given                                                               |

The sections of `app check` (from `src/verificacao.js` of the SDK), in the order it prints them:

| Section                            | Fails when                                                                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `scripts de instalação`            | `package.json` declares `preinstall`, `install`, `postinstall`, `prepare`, `prepack` or `postpack`                         |
| `manifesto`                        | `app.json` is missing, is not JSON, or fails the SDK's `validarManifesto`                                                  |
| `textos nos idiomas`               | `i18n/pt-BR.json` is missing, a language file is missing, or has a key more or less than pt-BR, or an empty text           |
| `origem dos assets`                | a file in `public/` has no line in `ASSETS.md`, or its license is outside `CC0-1.0, CC-BY-4.0, MIT, BSD-3-Clause, autoral` |
| `o app não fala com banco`         | `src/` imports `firebase`, `firebase/*` or `@firebase/*`                                                                   |
| `o app não importa o RoqueOS`      | `src/` imports `quasar` or a RoqueOS alias (`src/`, `stores/`, `boot/`, `components/`...)                                  |
| `variáveis do sistema no contrato` | `src/` reads a `--ros-*` variable outside the six of the contract, or declares any `--ros-*`                               |

## Physical keyboard

Only while the window is active (`estado.ativo`, set by `ativar`) and the focus is not in an
input, textarea or editable element ([src/Calculadora.vue](../src/Calculadora.vue), `onKeydown`).

| Key                | Does                                                    |
| ------------------ | ------------------------------------------------------- |
| `0` to `9`         | digit                                                   |
| `.` or `,`         | decimal point                                           |
| `+`, `-`, `*`, `/` | `+`, `−`, `×`, `÷`                                      |
| `^`                | power                                                   |
| `(`, `)`           | parentheses (`)` only when one is open)                 |
| `%`, `!`           | percent, factorial                                      |
| `Enter` or `=`     | equals                                                  |
| `Backspace`        | DEL (removes a whole `sin(`, `√(` and the like at once) |
| `Escape`           | closes the history if it is open, otherwise AC          |

## Files and folders

| Path                                                       | What it holds                                                               | Who writes it                         | Who reads it                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| [app.json](../app.json)                                    | the manifest                                                                | people, by PR                         | RoqueOS, `app check`, `dev/main.js`            |
| [src/](../src/index.js)                                    | the app                                                                     | people, by PR                         | RoqueOS (its Vite), Vitest                     |
| [i18n/](../i18n/pt-BR.json)                                | screen texts, ten languages                                                 | people, by PR                         | `src/textos.js`, `app check`                   |
| [paridade.json](../paridade.json)                          | parity inventory, 63 items                                                  | people, by PR, with the test it cites | RoqueOS parity check                           |
| [test/](../test/app.spec.js)                               | Vitest suites and [preparar.js](../test/preparar.js)                        | people                                | Vitest, the RoqueOS parity check (test titles) |
| [dev/main.js](../dev/main.js), [index.html](../index.html) | the `yarn dev` entry                                                        | people                                | Vite                                           |
| [ASSETS.md](../ASSETS.md)                                  | origin and license of every file in `public/` (there is no `public/` today) | people                                | `app check`                                    |
| [docs/](INDEX.md)                                          | this documentation and [capa.jpg](capa.jpg)                                 | people                                | readers; `docs/` is not in the package         |
| [.github/](../.github/workflows/ci.yml)                    | CI, DCO, CODEOWNERS, issue and PR templates                                 | people                                | GitHub                                         |
| [.claude/](../.claude/settings.json)                       | kit settings and the maintenance loop                                       | people                                | Claude Code                                    |

What goes into the package RoqueOS installs is `files` in [package.json](../package.json): `src`,
`i18n`, `app.json`, `paridade.json`, `ASSETS.md`, `LICENSE`, `README.md`.

## Environment variables and configuration

The app reads no environment variable. What configures it:

| Name                                      | Default                                       | What it changes                                                                                       |
| ----------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `?idioma=<language>` (only in `yarn dev`) | the browser language                          | the language of the fake window, one of the ten                                                       |
| `?leve=1` (only in `yarn dev`)            | off; touch screen or little memory turn it on | forces the light profile                                                                              |
| `sistema.desempenho.modoLeve()`           | decided by RoqueOS                            | `is-leve`: no reflection, grain, brushed texture or blinking cursor; `useInclinacao` attaches nothing |
| `prefers-reduced-motion: reduce`          | the system's                                  | `useInclinacao` attaches nothing                                                                      |
| `.nvmrc`                                  | `24`                                          | the Node of CI and of `nvm use`                                                                       |

## Formats

**`app.json`**, validated by the SDK's `validarManifesto`:

| Field               | Value here                                                                          | Meaning                                                           |
| ------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `id`                | `calculator`                                                                        | permanent; RoqueOS finds windows, shortcuts and preferences by it |
| `versaoDoContrato`  | `1`                                                                                 | version of the app contract                                       |
| `camada`            | `primeira-parte`                                                                    | first-party app (the ten languages are mandatory)                 |
| `nome`, `descricao` | one string per language, ten languages                                              | name and description shown by RoqueOS                             |
| `icone`             | `calculate`                                                                         | Material Icons name, drawn by RoqueOS                             |
| `cor`               | `#ff9500`                                                                           | app color                                                         |
| `categoria`         | `productivity`                                                                      | category in RoqueOS                                               |
| `janela`            | `largura 380`, `altura 680`, `minLargura 300`, `minAltura 540`, `maximizavel false` | window size                                                       |
| `capacidades`       | `[]`                                                                                | optional capabilities requested: none                             |
| `autor`, `licenca`  | `Roque Ribeiro`, `MIT`                                                              | authorship and license                                            |

**`i18n/<language>.json`**: a flat object with the same five keys in all ten files (`history`,
`clear`, `historyEmpty`, `historyEmptyHint`, `poweredBy`). The pt-BR file is canonical; an unknown
language falls back to it ([src/textos.js](../src/textos.js)). The example is `en-US.json`.

```json
{
  "history": "History",
  "clear": "Clear",
  "historyEmpty": "No calculations yet.",
  "historyEmptyHint": "Results will show up here.",
  "poweredBy": "powered by"
}
```

**`paridade.json`**: `versao` (1), `app` (the `id`), `antes` (where the app lived), `auditoria`
(when and how the inventory was made) and `funcionalidades`, a list where each item has `o_que`,
`estado` (`mantida`, `mudou` or `perdida`), `testes` (`"test/<file> › <exact it() title>"`),
`evidencia`, `nota` (required in `mudou`) and `decisao` (required in `perdida`). The rule is in
`scripts/paridade-dos-apps.mjs` of `roqueos-front`. The first item, shortened (one of its two
tests and the start of its evidence):

```json
{
  "o_que": "Dígitos de 0 a 9",
  "estado": "mantida",
  "testes": ["test/Calculadora.spec.js › adds two numbers and shows the expression"],
  "evidencia": "As teclas 7 a 0 do TECLADO e a função num, em src/Calculadora.vue ..."
}
```
