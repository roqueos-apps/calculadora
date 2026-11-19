# When it breaks

_English | [Português](pt-BR/QUANDO-QUEBRA.md)_

> **Who it is for:** whoever has a red gate, a failed CI run, a parity check that refuses the version, or a calculator that misbehaves.
> **What is here:** a first diagnostic command, then symptom, cause and what to do, by area: install, gate, CI and release, the app itself.
> **Where to go for the rest:** how things should work is in [OPERATIONS.md](OPERATIONS.md); each command's exit codes, in [REFERENCE.md](REFERENCE.md#scripts).

The SDK, the RoqueOS scripts and the DCO workflow print in Portuguese; their messages are quoted
below exactly as they appear. Messages marked "reproduced on 18/11/2026" were produced on a
scratch copy of the repository on that date. A row with another date is a failure that really
happened.

## Contents

1. [First, the diagnosis](#1-first-the-diagnosis)
2. [Install](#install)
3. [The gate](#the-gate)
4. [CI and release](#ci-and-release)
5. [The app](#the-app)

## 1. First, the diagnosis

```bash
git status -sb && git log --oneline -3
node -v && yarn -v
yarn verificar
```

That says which branch you are on, whether Node and Yarn are the right ones (Node 22 or newer,
Yarn 1.22) and which of the four steps of the gate is red: lint, format, tests or `app check`.

## Install

| What shows up                                                | Cause                                                                                                                                        | What to do                                                                                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn install` fails fetching `@roqueos-apps/app-sdk`        | the SDK comes from GitHub by tag (`github:roqueos-apps/app-sdk#v0.1.0`) and the machine cannot reach github.com                              | fix the network or proxy and run `yarn install --ignore-scripts` again; the literal message depends on the network error and was not recorded |
| `yarn install` refuses because of the `node` engine          | Node older than 22 (`engines` in `package.json`)                                                                                             | `nvm use` (the `.nvmrc` says 24), or install Node 22+; the literal message was not recorded                                                   |
| the hook answers that this repository uses yarn, not npm/npx | the kit's `pkg-manager` hook reads `pkgManager` from the app manifest of `roqueos-kit`                                                       | use `yarn` and `node_modules/.bin/<tool>`; never `npm` or `npx` here                                                                          |
| in `yarn dev` the physical keyboard does nothing             | the dev window calls `ativar(false)` on `blur`; the keyboard only works while the window is active, and never while the focus is in an input | click inside the page so the browser window has focus again                                                                                   |

## The gate

| What shows up                                                                                                                                                         | Cause                                                         | What to do                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `[warn] Code style issues found in the above file. Run Prettier with --write to fix.` (reproduced on 18/11/2026)                                                      | a file, Markdown included, out of the Prettier style          | `yarn format`, review the diff, commit                                                 |
| `i18n/en-US.json sem: clear` (reproduced on 18/11/2026)                                                                                                               | a text key exists in `pt-BR.json` and not in another language | add the key to all ten `i18n/*.json` in the same commit                                |
| `package.json declara "postinstall", que roda sozinho no install de quem depende deste pacote` (reproduced on 18/11/2026)                                             | an install-time script in `package.json`                      | remove it; the family installs with `--ignore-scripts` and the app may not declare one |
| `src/visor.scss:138 usa --ros-accent, que não está entre as variáveis do sistema que um app pode usar (...)` (reproduced on 18/11/2026, with a line added on purpose) | a RoqueOS theme variable outside the six of the contract      | use a `--calc-*` color of the app; the calculator reads no theme color                 |
| `public/x.txt sem linha no ASSETS.md (caminho \| licença \| origem)` (reproduced on 18/11/2026)                                                                       | a file in `public/` without its line in `ASSETS.md`           | add the line with path, license from the SDK list and origin                           |
| `AssertionError: expected 'calc' to be 'calculator'` in `o id do app é o do manifesto, que é o id permanente de sempre` (reproduced on 18/11/2026)                    | the `id` in `app.json` changed                                | put back `calculator`; the id is permanent                                             |
| `importa "src/stores/roqueos", que só existe dentro do RoqueOS` (format from `src/verificacao.js` of the SDK; not reproduced)                                         | an import of a RoqueOS alias or of Quasar                     | what the app needs from the system comes through `sistema`                             |

## CI and release

| What shows up                                                                                                                                                             | Cause                                                                                               | What to do                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `::error::commit <sha> sem Signed-off-by. Refaça com: git commit --amend -s (ou git rebase --signoff)` (from [dco.yml](../.github/workflows/dco.yml))                     | a commit of the PR without `Signed-off-by`                                                          | `git rebase --signoff main` and push the branch again                                                                   |
| `verificar` red on GitHub and green locally                                                                                                                               | diverging environment: CI uses `.nvmrc` (24) and `--frozen-lockfile`                                | reproduce with Node 24 and `yarn install --frozen-lockfile --ignore-scripts` before touching code                       |
| `paridade: #3 (...): test/motor.spec.js não tem o teste "respeita a precedência e a associatividade da potência"` (reproduced on 18/11/2026 by renaming that test)        | a test cited in `paridade.json` was renamed or removed                                              | put the title back or update `paridade.json` in the same commit; RoqueOS refuses the version otherwise                  |
| `paridade: #N (...): mudou sem "nota"` or `perdida sem "decisao" (quem decidiu, quando, onde está escrito)` (format from `scripts/paridade-dos-apps.mjs`; not reproduced) | an item changed state without its note or decision                                                  | write the note; a loss needs the written decision of whoever decided                                                    |
| the RoqueOS build breaks on a JSON import (25/09/2026, measured in the games)                                                                                             | text loaded with a direct `import` of JSON; the vue-i18n plugin of RoqueOS wraps the JSON transform | load with `?raw` and `JSON.parse`, as [src/textos.js](../src/textos.js) does; this does not show up in `yarn verificar` |

## The app

| What shows up                                                                                                                                       | Cause                                                                                                                                    | What to do                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| the case comes out cut in `yarn dev` (27/09/2026)                                                                                                   | the app does not inherit the global `box-sizing: border-box` of RoqueOS, and the padding was added to the width                          | fixed in [src/calculadora.scss](../src/calculadora.scss) with its own box model; `does not depend on the RoqueOS global CSS for its own box model` guards it |
| continuing from a negative result lost the sign (2 − 8 = −6, then `+ 1 =` gave 7), and continuing from exponential notation gave Error (28/09/2026) | `tokenize` did not read the hyphen and the `e+` that `fmt` writes                                                                        | fixed in 0.2.0 ([src/motor.js](../src/motor.js)); guarded by `continues from a negative result without losing the sign` and the engine test of the same case |
| the "powered by" footer came out dark on the dark background in `yarn dev` (fixed in 0.2.0)                                                         | the app read a color from the RoqueOS theme                                                                                              | the app reads no theme color; its colors are `--calc-*`                                                                                                      |
| `Error` on the display                                                                                                                              | the engine threw (division by zero, factorial of a negative or fraction, a result that is not finite, an expression that does not parse) | expected behavior; AC clears, and a new number starts fresh input                                                                                            |
| the tilt reflection does not move                                                                                                                   | `prefers-reduced-motion`, the light profile, or iOS without the motion permission (asked on the first tap)                               | expected; with the permission denied the case stays static ([src/useInclinacao.js](../src/useInclinacao.js))                                                 |
