# Começar

_[English](../GETTING-STARTED.md) | Português_

> **Para quem:** quem acabou de clonar o repositório e quer ver a calculadora rodando.
> **O que tem aqui:** os pré-requisitos, cada comando na ordem com o que ele faz e como saber que deu certo, o primeiro resultado visível e os erros de primeira vez.
> **Onde ir para o resto:** como ela é feita está em [ARQUITETURA.md](ARQUITETURA.md); todo comando e arquivo, em [REFERENCIA.md](REFERENCIA.md); as falhas, em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md).

## Sumário

1. [O que você precisa](#1-o-que-você-precisa)
2. [Baixar e instalar](#2-baixar-e-instalar)
3. [O primeiro resultado](#3-o-primeiro-resultado)
4. [Conferir que está tudo certo](#4-conferir-que-está-tudo-certo)
5. [Próximos passos](#5-próximos-passos)
6. [Quando algo não funciona](#quando-algo-não-funciona)

## 1. O que você precisa

| Ferramenta | Versão mínima                                                                                 | Como conferir   | De onde vem                                  |
| ---------- | --------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------- |
| Node       | 22 (`engines` do [package.json](../../package.json)); o [.nvmrc](../../.nvmrc) e o CI usam 24 | `node -v`       | nodejs.org, ou `nvm use` dentro do repo      |
| Yarn       | 1.22 (`packageManager: yarn@1.22.22` no [package.json](../../package.json))                   | `yarn -v`       | `corepack enable`, ou o instalador do Yarn 1 |
| Git        | qualquer um recente                                                                           | `git --version` | o seu sistema                                |

Não há conta, chave nem variável de ambiente para configurar: o app não lê nada do ambiente
([REFERENCIA.md](REFERENCIA.md#variáveis-de-ambiente-e-configuração)).

## 2. Baixar e instalar

```bash
git clone https://github.com/roqueos-apps/calculadora.git
cd calculadora
yarn install --ignore-scripts
```

O `--ignore-scripts` é o jeito da família instalar: nenhuma dependência roda código na sua
máquina no install, e o próprio app não pode declarar script assim (`app check`, seção "scripts
de instalação"). Deu certo quando o Yarn termina com `Done in ...` e o `node_modules/` existe. O
SDK vem do GitHub pela tag (`github:roqueos-apps/app-sdk#v0.1.0`), então este passo precisa de
acesso ao github.com.

## 3. O primeiro resultado

```bash
yarn dev
```

O Vite imprime o endereço. Medido em 18/11/2026:

```text
  VITE v7.3.1  ready in 800 ms

  ➜  Local:   http://localhost:5173/
```

Abra. Aparece a calculadora dentro de uma janela falsa do RoqueOS ([dev/main.js](../../dev/main.js),
com o `montarNaJanelaFalsa` do SDK), no tamanho de janela do [app.json](../../app.json) e com o
seletor dos dez idiomas. Digite `42/6` e Enter no teclado físico: a linha de cima do visor mostra
`42÷6 =` em pontos e a de baixo mostra `7` em sete segmentos. Dois parâmetros de URL ajudam
enquanto se desenvolve:

| Parâmetro       | Efeito                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `?idioma=ar-AR` | abre em outro idioma (qualquer um dos dez); o árabe vira a janela da direita para a esquerda, o teclado continua da esquerda para a direita |
| `?leve=1`       | força o perfil leve: sem reflexo, grão, textura escovada nem cursor piscando                                                                |

## 4. Conferir que está tudo certo

```bash
yarn verificar
```

Ele roda, na ordem, `yarn lint`, `yarn format:check`, `yarn test` e `yarn app:check`, o mesmo
comando do CI ([.github/workflows/ci.yml](../../.github/workflows/ci.yml)). Medido em 18/11/2026:
8 arquivos de teste e 75 testes passaram, e o `app check` terminou com
`ok, o repo cumpre o contrato.` (o SDK imprime em português, e este documento cita como sai).

## 5. Próximos passos

Para mudar a calculadora, leia antes a [ARQUITETURA.md](ARQUITETURA.md) e, antes do pull
request, o [CONTRIBUTING.md](CONTRIBUTING.md). Para soltar uma versão e levar ao RoqueOS,
[OPERACAO.md](OPERACAO.md). Para consultar um comando ou arquivo, [REFERENCIA.md](REFERENCIA.md).

## Quando algo não funciona

Os erros de primeira vez estão em [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md#instalação): o SDK que
não baixa, o Node velho demais e o teclado físico que não faz nada na janela do `yarn dev`.
