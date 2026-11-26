# Quando quebra

_[English](../WHEN-IT-BREAKS.md) | Português_

> **Para quem:** quem está com o gate vermelho, uma execução do CI que falhou, uma conferência de paridade que recusa a versão, ou uma calculadora que se comporta mal.
> **O que tem aqui:** um primeiro comando de diagnóstico, depois sintoma, causa e o que fazer, por área: instalação, gate, CI e release, o próprio app.
> **Onde ir para o resto:** como as coisas deveriam funcionar está em [OPERACAO.md](OPERACAO.md); os códigos de saída de cada comando, na [REFERENCIA.md](REFERENCIA.md#scripts).

O SDK, os scripts do RoqueOS e o workflow de DCO imprimem em português; as mensagens estão
citadas abaixo como aparecem. As marcadas "reproduzida em 18/11/2026" saíram de uma cópia de
rascunho do repositório nessa data. Linha com outra data é falha que aconteceu de verdade.

## Sumário

1. [Primeiro, o diagnóstico](#1-primeiro-o-diagnóstico)
2. [Instalação](#instalação)
3. [O gate](#o-gate)
4. [CI e release](#ci-e-release)
5. [O app](#o-app)

## 1. Primeiro, o diagnóstico

```bash
git status -sb && git log --oneline -3
node -v && yarn -v
yarn verificar
```

Isso diz em que branch você está, se o Node e o Yarn são os certos (Node 22 ou mais novo, Yarn
1.22) e qual dos quatro passos do gate está vermelho: lint, formato, testes ou `app check`.

## Instalação

| O que aparece                                                | Causa                                                                                                                           | O que fazer                                                                                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| o `yarn install` falha ao buscar o `@roqueos-apps/app-sdk`   | o SDK vem do GitHub pela tag (`github:roqueos-apps/app-sdk#v0.1.0`) e a máquina não alcança o github.com                        | conserte a rede ou o proxy e rode `yarn install --ignore-scripts` de novo; a mensagem literal depende do erro de rede e não foi registrada |
| o `yarn install` recusa por causa do engine `node`           | Node mais velho que 22 (`engines` do `package.json`)                                                                            | `nvm use` (o `.nvmrc` diz 24), ou instale Node 22+; a mensagem literal não foi registrada                                                  |
| o gancho responde que este repositório usa yarn, não npm/npx | o gancho `pkg-manager` do kit lê o `pkgManager` do manifesto de app do `roqueos-kit`                                            | use `yarn` e `node_modules/.bin/<ferramenta>`; nunca `npm` nem `npx` aqui                                                                  |
| no `yarn dev` o teclado físico não faz nada                  | a janela de desenvolvimento chama `ativar(false)` no `blur`; o teclado só vale com a janela ativa, e nunca com o foco num input | clique dentro da página para a janela do navegador voltar a ter foco                                                                       |

## O gate

| O que aparece                                                                                                                                                              | Causa                                                           | O que fazer                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `[warn] Code style issues found in the above file. Run Prettier with --write to fix.` (reproduzida em 18/11/2026)                                                          | um arquivo, Markdown incluído, fora do estilo do Prettier       | `yarn format`, revise o diff, commit                                        |
| `i18n/en-US.json sem: clear` (reproduzida em 18/11/2026)                                                                                                                   | uma chave de texto existe no `pt-BR.json` e não em outro idioma | acrescente a chave nos dez `i18n/*.json` no mesmo commit                    |
| `package.json declara "postinstall", que roda sozinho no install de quem depende deste pacote` (reproduzida em 18/11/2026)                                                 | um script de install no `package.json`                          | tire; a família instala com `--ignore-scripts` e o app não pode declarar um |
| `src/visor.scss:138 usa --ros-accent, que não está entre as variáveis do sistema que um app pode usar (...)` (reproduzida em 18/11/2026, com uma linha posta de propósito) | uma variável do tema do RoqueOS fora das seis do contrato       | use uma cor `--calc-*` do app; a calculadora não lê cor do tema             |
| `public/x.txt sem linha no ASSETS.md (caminho \| licença \| origem)` (reproduzida em 18/11/2026)                                                                           | um arquivo em `public/` sem a linha dele no `ASSETS.md`         | acrescente a linha com caminho, licença da lista do SDK e origem            |
| `AssertionError: expected 'calc' to be 'calculator'` em `o id do app é o do manifesto, que é o id permanente de sempre` (reproduzida em 18/11/2026)                        | o `id` do `app.json` mudou                                      | volte para `calculator`; o id é permanente                                  |
| `importa "src/stores/roqueos", que só existe dentro do RoqueOS` (formato do `src/verificacao.js` do SDK; não reproduzida)                                                  | import de um apelido do RoqueOS ou do Quasar                    | o que o app precisa do sistema vem pelo `sistema`                           |

## CI e release

| O que aparece                                                                                                                                                             | Causa                                                                                                     | O que fazer                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `::error::commit <sha> sem Signed-off-by. Refaça com: git commit --amend -s (ou git rebase --signoff)` (do [dco.yml](../../.github/workflows/dco.yml))                    | um commit do PR sem `Signed-off-by`                                                                       | `git rebase --signoff main` e mande o branch de novo                                                                      |
| `verificar` vermelho no GitHub e verde aqui                                                                                                                               | ambiente divergente: o CI usa o `.nvmrc` (24) e `--frozen-lockfile`                                       | reproduza com Node 24 e `yarn install --frozen-lockfile --ignore-scripts` antes de mexer no código                        |
| `paridade: #3 (...): test/motor.spec.js não tem o teste "respeita a precedência e a associatividade da potência"` (reproduzida em 18/11/2026, renomeando esse teste)      | um teste citado no `paridade.json` foi renomeado ou apagado                                               | volte o título ou atualize o `paridade.json` no mesmo commit; senão o RoqueOS recusa a versão                             |
| `paridade: #N (...): mudou sem "nota"` ou `perdida sem "decisao" (quem decidiu, quando, onde está escrito)` (formato do `scripts/paridade-dos-apps.mjs`; não reproduzida) | um item mudou de estado sem a nota ou a decisão                                                           | escreva a nota; perda precisa da decisão escrita de quem decidiu                                                          |
| o build do RoqueOS quebra num import de JSON (25/09/2026, medido nos jogos)                                                                                               | texto carregado com `import` direto de JSON; o plugin do vue-i18n do RoqueOS embrulha o transform do JSON | carregue com `?raw` e `JSON.parse`, como faz o [src/textos.js](../../src/textos.js); isso não aparece no `yarn verificar` |

## O app

| O que aparece                                                                                                                                                | Causa                                                                                                             | O que fazer                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a carcaça sai cortada no `yarn dev` (27/09/2026)                                                                                                             | o app não herda o `box-sizing: border-box` global do RoqueOS, e o padding somava à largura                        | corrigido no [src/calculadora.scss](../../src/calculadora.scss) com box model próprio; o teste `does not depend on the RoqueOS global CSS for its own box model` guarda |
| seguir a partir de um resultado negativo perdia o sinal (2 − 8 = −6, depois `+ 1 =` dava 7), e seguir a partir de notação científica dava Error (28/09/2026) | o `tokenize` não lia o hífen e o `e+` que o `fmt` escreve                                                         | corrigido na 0.2.0 ([src/motor.js](../../src/motor.js)); guardado por `continues from a negative result without losing the sign` e pelo teste do motor do mesmo caso    |
| o rodapé "powered by" saía escuro sobre o fundo escuro no `yarn dev` (corrigido na 0.2.0)                                                                    | o app lia uma cor do tema do RoqueOS                                                                              | o app não lê cor do tema; as cores dele são `--calc-*`                                                                                                                  |
| `Error` no visor                                                                                                                                             | o motor lançou (divisão por zero, fatorial de negativo ou fracionário, resultado não finito, conta que não fecha) | comportamento esperado; o AC limpa, e um número novo começa a entrada do zero                                                                                           |
| o reflexo da inclinação não se mexe                                                                                                                          | `prefers-reduced-motion`, o perfil leve, ou iOS sem a permissão de movimento (pedida no primeiro toque)           | esperado; com a permissão negada a carcaça fica parada ([src/useInclinacao.js](../../src/useInclinacao.js))                                                             |
