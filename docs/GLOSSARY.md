# Glossary

_English | [Português](pt-BR/GLOSSARIO.md)_

> **Who it is for:** whoever reads the code (written in Portuguese) or the conversations about it and meets a word that means something specific here.
> **What is here:** each term as it appears in the code, what it is, and where it lives.
> **Where to go for the rest:** how the pieces fit, [ARCHITECTURE.md](ARCHITECTURE.md); the formats, [REFERENCE.md](REFERENCE.md#formats).

| Term                              | What it is                                                                                                               | Where                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `app-sdk`                         | the contract package between RoqueOS and an app: `definirApp`, the dev window, the fake system, the `app` command        | `@roqueos-apps/app-sdk`, pinned in [package.json](../package.json) |
| `app check`                       | the SDK command that checks the repository against the RoqueOS contract                                                  | `yarn app:check`; sections in [REFERENCE.md](REFERENCE.md#scripts) |
| `definirApp`                      | the SDK function that declares the app: `id`, `capacidades`, `montar`                                                    | [src/index.js](../src/index.js)                                    |
| `montar` / `ativar` / `desmontar` | mount the app in an element; turn the physical keyboard on or off with the window; release Vue and the language listener | [src/index.js](../src/index.js)                                    |
| `sistema`                         | what RoqueOS hands the app: `idioma`, `desempenho`, and the rest of the SDK capabilities                                 | prop of [src/Calculadora.vue](../src/Calculadora.vue)              |
| `estado`                          | the reactive `{ ativo, idioma, textos }` kept by `montar`                                                                | [src/index.js](../src/index.js)                                    |
| `manifesto`                       | the `app.json`: who the app is                                                                                           | [app.json](../app.json)                                            |
| `id` permanente                   | `calculator`, the id that never changes                                                                                  | [app.json](../app.json), [test/app.spec.js](../test/app.spec.js)   |
| primeira parte                    | the `camada` of an app made by the house, with all ten languages required                                                | `camada` in [app.json](../app.json)                                |
| `paridade`                        | the inventory of what the app did inside RoqueOS and what happened to each item on the way out                           | [paridade.json](../paridade.json)                                  |
| `mantida` / `mudou` / `perdida`   | kept, changed (with a note), lost (only with a written decision): the states of a parity item                            | [paridade.json](../paridade.json)                                  |
| `motor`                           | the arithmetic: tokens, reverse Polish notation, evaluation, formatting                                                  | [src/motor.js](../src/motor.js)                                    |
| `fmt`                             | the function that turns a number into the text the display shows, or `"Error"`                                           | [src/motor.js](../src/motor.js)                                    |
| `visor`                           | the two-line liquid crystal display                                                                                      | [src/Visor.vue](../src/Visor.vue)                                  |
| `matriz`                          | the top line: 16 characters in a 5 × 7 dot font drawn here                                                               | [src/visor/matriz.js](../src/visor/matriz.js)                      |
| `segmentos`                       | the bottom line: sign, 13 seven-segment cells and a 3-digit exponent                                                     | [src/visor/segmentos.js](../src/visor/segmentos.js)                |
| fantasma                          | the unlit segments and dots, drawn faint as on real liquid crystal                                                       | `lcd__fantasma` in [src/Visor.vue](../src/Visor.vue)               |
| `anunciadores`                    | the small indicators on the display: ◀, 2nd, M, DEG, RAD                                                                | [src/Visor.vue](../src/Visor.vue)                                  |
| `prévia`                          | the result shown on the bottom line while the expression is still being typed                                            | `previa` in [src/Calculadora.vue](../src/Calculadora.vue)          |
| 2nd                               | the key that turns sin, cos, tan into their inverses; the amber legends show it                                          | `inv` in [src/Calculadora.vue](../src/Calculadora.vue)             |
| SCI                               | the slide switch that shows or hides the scientific block; on by default                                                 | `sci` in [src/Calculadora.vue](../src/Calculadora.vue)             |
| DRG                               | the key that switches degrees and radians; degrees by default                                                            | `deg` in [src/Calculadora.vue](../src/Calculadora.vue)             |
| perfil leve / `modoLeve`          | the light profile RoqueOS asks for on weak devices; the `is-leve` class                                                  | `sistema.desempenho.modoLeve()`                                    |
| `useInclinacao`                   | the reflection that follows the device sensor or the pointer                                                             | [src/useInclinacao.js](../src/useInclinacao.js)                    |
| janela falsa                      | the fake RoqueOS window of `yarn dev` (`montarNaJanelaFalsa`)                                                            | [dev/main.js](../dev/main.js)                                      |
| sistema falso                     | the fake system the tests mount the app with                                                                             | [test/app.spec.js](../test/app.spec.js)                            |
| `--calc-*`                        | the app's own CSS variables; `--ros-*` belongs to the system                                                             | [src/calculadora.scss](../src/calculadora.scss)                    |
| `cqw`                             | container width unit: the case measures everything in it so it scales as one object                                      | [src/calculadora.scss](../src/calculadora.scss)                    |
| `yarn verificar`                  | the gate: lint, format, tests and `app check`                                                                            | [package.json](../package.json)                                    |
| DCO                               | the `Signed-off-by` every commit carries, checked by CI                                                                  | [.github/workflows/dco.yml](../.github/workflows/dco.yml)          |
