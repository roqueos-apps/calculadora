# Getting started

_English | [Português](pt-BR/COMECAR.md)_

> **Who it is for:** someone who just cloned the repository and wants to see the calculator running.
> **What is here:** the prerequisites, each command in order with what it does and how you know it worked, the first visible result, and the first-time errors.
> **Where to go for the rest:** how it is built is in [ARCHITECTURE.md](ARCHITECTURE.md); every command and file, in [REFERENCE.md](REFERENCE.md); failures, in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md).

## Contents

1. [What you need](#1-what-you-need)
2. [Download and install](#2-download-and-install)
3. [The first result](#3-the-first-result)
4. [Check that everything is right](#4-check-that-everything-is-right)
5. [Next steps](#5-next-steps)
6. [When something does not work](#when-something-does-not-work)

## 1. What you need

| Tool | Minimum version                                                                      | How to check    | Where it comes from                        |
| ---- | ------------------------------------------------------------------------------------ | --------------- | ------------------------------------------ |
| Node | 22 (`engines` in [package.json](../package.json)); [.nvmrc](../.nvmrc) and CI use 24 | `node -v`       | nodejs.org, or `nvm use` inside the repo   |
| Yarn | 1.22 (`packageManager: yarn@1.22.22` in [package.json](../package.json))             | `yarn -v`       | `corepack enable`, or the Yarn 1 installer |
| Git  | any recent one                                                                       | `git --version` | your system                                |

There is no account, key or environment variable to set up: the app reads nothing from the
environment ([REFERENCE.md](REFERENCE.md#environment-variables-and-configuration)).

## 2. Download and install

```bash
git clone https://github.com/roqueos-apps/calculadora.git
cd calculadora
yarn install --ignore-scripts
```

`--ignore-scripts` is how this family installs: no dependency runs code on your machine at
install time, and the app itself is not allowed to declare such a script (`app check`, section
"scripts de instalação"). It worked when Yarn ends with `Done in ...` and `node_modules/` exists.
The SDK comes from GitHub by tag (`github:roqueos-apps/app-sdk#v0.1.0`), so this step needs
access to github.com.

## 3. The first result

```bash
yarn dev
```

Vite prints the address. Measured on 18/11/2026:

```text
  VITE v7.3.1  ready in 800 ms

  ➜  Local:   http://localhost:5173/
```

Open it. You see the calculator inside a fake RoqueOS window ([dev/main.js](../dev/main.js),
with `montarNaJanelaFalsa` from the SDK), with the window size from [app.json](../app.json) and a
picker for the ten languages. Type `42/6` and Enter on the physical keyboard: the top line of the
display shows `42÷6 =` in dots and the bottom line shows `7` in seven segments. Two URL
parameters help while developing:

| Parameter       | Effect                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `?idioma=ar-AR` | opens in another language (any of the ten); Arabic turns the window right to left, the keypad stays left to right |
| `?leve=1`       | forces the light profile: no reflection, grain, brushed texture or blinking cursor                                |

## 4. Check that everything is right

```bash
yarn verificar
```

It runs, in order, `yarn lint`, `yarn format:check`, `yarn test` and `yarn app:check`, the same
command CI runs ([.github/workflows/ci.yml](../.github/workflows/ci.yml)). Measured on
18/11/2026: 8 test files and 75 tests passed, and the `app check` ended with
`ok, o repo cumpre o contrato.` (the SDK prints in Portuguese, and this document quotes it as
printed).

## 5. Next steps

To change the calculator, read [ARCHITECTURE.md](ARCHITECTURE.md) first and
[CONTRIBUTING.md](../CONTRIBUTING.md) before the pull request. To release a version and get it
into RoqueOS, [OPERATIONS.md](OPERATIONS.md). To look up a command or file,
[REFERENCE.md](REFERENCE.md).

## When something does not work

The first-time errors are in [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md#install): the SDK that does
not download, the Node that is too old, and the physical keyboard that does nothing in the
`yarn dev` window.
