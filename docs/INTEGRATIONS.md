# Integrations

_English | [Português](pt-BR/INTEGRACOES.md)_

> **Who it is for:** whoever changes the boundary between the Calculator and RoqueOS, on either side.
> **What is here:** the one surface the app has toward the outside: the object it exports, the `sistema` it uses, the manifest, the texts and the parity inventory RoqueOS checks.
> **Where to go for the rest:** the fields one by one in [REFERENCE.md](REFERENCE.md#formats); releasing and pinning a version in [OPERATIONS.md](OPERATIONS.md).

## Contents

1. [The surface](#1-the-surface)
2. [What the app exports](#2-what-the-app-exports)
3. [What the app uses from `sistema`](#3-what-the-app-uses-from-sistema)
4. [What RoqueOS reads from the package](#4-what-roqueos-reads-from-the-package)
5. [What the app never does](#5-what-the-app-never-does)

## 1. The surface

The Calculator has no API, CLI, webhook or MCP. Its only consumer is RoqueOS, and the conversation
goes through the `app-sdk` contract (`v0.1.0`): RoqueOS installs the package by tag, reads three
files from it and mounts the exported object in a window. The same contract is what `yarn dev`
(`montarNaJanelaFalsa`) and the tests (`criarSistemaFalso`) use, so a change that breaks RoqueOS
usually breaks one of them first.

## 2. What the app exports

The default export of [src/index.js](../src/index.js) (also `exports["."]` in
[package.json](../package.json)) is the result of `definirApp`, in outline:

```js
export default definirApp({
  id: 'calculator',
  capacidades: [],
  montar(el, sistema, { ativo }) {
    // creates the Vue app inside el once the texts arrive
    return { ativar(sim) {}, desmontar() {} }
  },
})
```

RoqueOS calls `mount(el, sistema, { windowId, ativo })` on that object (the SDK wraps `montar`),
as [test/app.spec.js](../test/app.spec.js) does. The returned `ativar(true | false)` follows the
window focus; `desmontar()` unmounts Vue and stops listening to the language. `exports["./app.json"]`
publishes the manifest.

## 3. What the app uses from `sistema`

| Call                            | What for                                                       | Where                                                                                          |
| ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `sistema.idioma.atual()`        | the language at mount time                                     | [src/index.js](../src/index.js)                                                                |
| `sistema.idioma.aoMudar(fn)`    | switches the texts with the window open; the last request wins | [src/index.js](../src/index.js)                                                                |
| `sistema.desempenho.modoLeve()` | the light profile: `is-leve` class and no tilt listeners       | [src/Calculadora.vue](../src/Calculadora.vue), [src/useInclinacao.js](../src/useInclinacao.js) |

Nothing else. The app asks for no optional capability (`capacidades: []` both in `definirApp` and
in [app.json](../app.json)), and `o sistema falso cumpre o contrato que o app pede` in
[test/app.spec.js](../test/app.spec.js) checks the fake system with `verificarSistema`.

## 4. What RoqueOS reads from the package

| File                              | Read by (in `roqueos-front`)                                                                  | For                                                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [app.json](../app.json)           | `scripts/apps-de-primeira-parte.mjs`                                                          | generates the app registry entry, the window loader and the name and description per language              |
| [paridade.json](../paridade.json) | `scripts/paridade-dos-apps.mjs`, run by `tests/unit/architecture/apps-fora-do-nucleo.spec.js` | refuses a version whose inventory cites a missing test, has an unknown state, or a loss without a decision |
| [test/](../test/app.spec.js)      | the same parity check                                                                         | the test titles that `paridade.json` cites must exist in the package                                       |

`package.json` `files` puts `src`, `i18n`, `app.json`, `paridade.json`, `ASSETS.md`, `LICENSE` and
`README.md` in the package. The window component name RoqueOS derives from the id is
`ROSCalculator` (`componenteDo` in that script).

## 5. What the app never does

It imports nothing but `vue`, `@roqueos-apps/app-sdk` and its own files ([CLAUDE.md](../CLAUDE.md));
`app check` refuses Quasar, the RoqueOS aliases and Firebase, and the RoqueOS
`apps-fora-do-nucleo` check refuses the rest. It stores nothing, calls no server and reads no
theme color. Changing any of this is a contract change: it needs a new SDK capability first, then
RoqueOS, then the app ([OPERATIONS.md](OPERATIONS.md#3-updating-without-breaking)).
