# Testing

_English | [Português](pt-BR/TESTES.md)_

> **Who it is for:** whoever changes the calculator and needs to know which test proves what, and what "done" means here.
> **What is here:** the gate, each suite and what it proves, the rule that every fix brings a test, and the acceptance criteria.
> **Where to go for the rest:** a red gate, [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md#the-gate); the parity inventory, [INTEGRATIONS.md](INTEGRATIONS.md#4-what-roqueos-reads-from-the-package).

## Contents

1. [The gate](#1-the-gate)
2. [The suites](#2-the-suites)
3. [Tests and the parity inventory](#3-tests-and-the-parity-inventory)
4. [Acceptance criteria](#4-acceptance-criteria)

## 1. The gate

```bash
yarn verificar
```

Lint, format, tests and `app check`, in that order, stopping at the first red. CI runs the same
([.github/workflows/ci.yml](../.github/workflows/ci.yml)), and so does the pre-push hook installed
by `roqueos-ecosystem`. Vitest runs under jsdom with [test/preparar.js](../test/preparar.js), which
supplies the `ResizeObserver` and `matchMedia` jsdom lacks and unmounts every component at the end
of its test. Measured on 18/11/2026: 8 files, 75 tests, all green.

## 2. The suites

| File                                                            | Tests | What it proves                                                                                                                                                                                                |
| --------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [test/motor.spec.js](../test/motor.spec.js)                     | 9     | precedence and right associativity of `^`, unary minus, degrees and radians, postfix operators, auto-closing, errors, `fmt`, and that the text `fmt` writes reads back                                        |
| [test/Calculadora.spec.js](../test/Calculadora.spec.js)         | 25    | the screen: input rules, percent, negate, Error and AC, history, memory, SCI, both display lines, the preview, 2nd, physical keys, focus ring, light profile, texts, the keyboard only with the window active |
| [test/Visor.spec.js](../test/Visor.spec.js)                     | 6     | the real text stays readable and the drawing is `aria-hidden`; segments, exponent, cursor, ◀ and annunciators                                                                                                |
| [test/matriz.spec.js](../test/matriz.spec.js)                   | 6     | the 5 × 7 font, that everything the calculator writes has a glyph, the cut of a long line                                                                                                                     |
| [test/segmentos.spec.js](../test/segmentos.spec.js)             | 8     | the segments of each digit, the 13 cells, exponential notation, the `Error` word                                                                                                                              |
| [test/app.spec.js](../test/app.spec.js)                         | 8     | the app through the SDK: permanent id, contract, mount after texts, language switch, `ativar`, `desmontar`                                                                                                    |
| [test/troca-de-idioma.spec.js](../test/troca-de-idioma.spec.js) | 1     | two language switches out of order: the last request wins                                                                                                                                                     |
| [test/useInclinacao.spec.js](../test/useInclinacao.spec.js)     | 12    | the tilt: sensor and pointer, clamping, inert with reduced motion and with the light profile, the iOS permission asked once, passive listeners, cleanup                                                       |

## 3. Tests and the parity inventory

[paridade.json](../paridade.json) cites tests by file and exact title
(`"test/motor.spec.js › respeita a precedência e a associatividade da potência"`), and RoqueOS
refuses the version if a cited title no longer exists. Renaming or removing a test is therefore a
change to `paridade.json` in the same commit. The check can be run before tagging, from
`roqueos-front`: `node scripts/paridade-dos-apps.mjs ../calculadora`.

## 4. Acceptance criteria

- `yarn verificar` green, pasted as it came out.
- Every fix comes with a test that fails without it ([CLAUDE.md](../CLAUDE.md)); a wrong result
  becomes a case in [test/motor.spec.js](../test/motor.spec.js) with the expression and the
  expected value ([CONTRIBUTING.md](../CONTRIBUTING.md)).
- New text in all ten `i18n/*.json` (`app check` refuses otherwise).
- A visible change is opened for real in `yarn dev`, with a screenshot, before it is called done
  ([.claude/loop.md](../.claude/loop.md)).
- A test is never weakened to make the gate pass.
- What the suites do not cover: the real RoqueOS build, and real phones (the tilt is tested with a
  simulated sensor only).
