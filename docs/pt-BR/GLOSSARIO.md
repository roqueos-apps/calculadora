# Glossário

_[English](../GLOSSARY.md) | Português_

> **Para quem:** quem lê o código ou as conversas sobre ele e encontra uma palavra que quer dizer coisa específica aqui.
> **O que tem aqui:** cada termo como aparece no código, o que é, e onde mora.
> **Onde ir para o resto:** como as peças se encaixam, [ARQUITETURA.md](ARQUITETURA.md); os formatos, [REFERENCIA.md](REFERENCIA.md#formatos).

| Termo                             | O que é                                                                                                                    | Onde                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `app-sdk`                         | o pacote do contrato entre o RoqueOS e um app: `definirApp`, a janela de desenvolvimento, o sistema falso, o comando `app` | `@roqueos-apps/app-sdk`, pinado no [package.json](../../package.json)  |
| `app check`                       | o comando do SDK que confere o repositório contra o contrato do RoqueOS                                                    | `yarn app:check`; as seções na [REFERENCIA.md](REFERENCIA.md#scripts)  |
| `definirApp`                      | a função do SDK que declara o app: `id`, `capacidades`, `montar`                                                           | [src/index.js](../../src/index.js)                                     |
| `montar` / `ativar` / `desmontar` | monta o app num elemento; liga ou desliga o teclado físico com a janela; solta o Vue e o ouvinte de idioma                 | [src/index.js](../../src/index.js)                                     |
| `sistema`                         | o que o RoqueOS entrega ao app: `idioma`, `desempenho`, e o resto das capacidades do SDK                                   | prop do [src/Calculadora.vue](../../src/Calculadora.vue)               |
| `estado`                          | o `{ ativo, idioma, textos }` reativo que o `montar` mantém                                                                | [src/index.js](../../src/index.js)                                     |
| `manifesto`                       | o `app.json`: quem o app é                                                                                                 | [app.json](../../app.json)                                             |
| `id` permanente                   | `calculator`, o id que nunca muda                                                                                          | [app.json](../../app.json), [test/app.spec.js](../../test/app.spec.js) |
| primeira parte                    | a `camada` de app feito pela casa, com os dez idiomas obrigatórios                                                         | `camada` no [app.json](../../app.json)                                 |
| `paridade`                        | o inventário do que o app fazia dentro do RoqueOS e do que aconteceu com cada item na saída                                | [paridade.json](../../paridade.json)                                   |
| `mantida` / `mudou` / `perdida`   | os estados de um item de paridade: igual, mudou (com nota), perdida (só com decisão escrita)                               | [paridade.json](../../paridade.json)                                   |
| `motor`                           | a conta: fichas, notação polonesa reversa, avaliação, formatação                                                           | [src/motor.js](../../src/motor.js)                                     |
| `fmt`                             | a função que transforma o número no texto que o visor mostra, ou `"Error"`                                                 | [src/motor.js](../../src/motor.js)                                     |
| `visor`                           | o visor de cristal líquido de duas linhas                                                                                  | [src/Visor.vue](../../src/Visor.vue)                                   |
| `matriz`                          | a linha de cima: 16 caracteres numa fonte de pontos 5 × 7 desenhada aqui                                                   | [src/visor/matriz.js](../../src/visor/matriz.js)                       |
| `segmentos`                       | a linha de baixo: sinal, 13 células de sete segmentos e um expoente de 3 dígitos                                           | [src/visor/segmentos.js](../../src/visor/segmentos.js)                 |
| fantasma                          | os segmentos e pontos apagados, desenhados fracos como no cristal líquido de verdade                                       | `lcd__fantasma` no [src/Visor.vue](../../src/Visor.vue)                |
| `anunciadores`                    | os indicadores pequenos do visor: ◀, 2nd, M, DEG, RAD                                                                     | [src/Visor.vue](../../src/Visor.vue)                                   |
| `prévia`                          | o resultado que aparece na linha de baixo enquanto a conta ainda está sendo digitada                                       | `previa` no [src/Calculadora.vue](../../src/Calculadora.vue)           |
| 2nd                               | a tecla que troca sin, cos, tan pelas inversas; as legendas âmbar mostram                                                  | `inv` no [src/Calculadora.vue](../../src/Calculadora.vue)              |
| SCI                               | a chave deslizante que mostra ou esconde o bloco científico; ligada por padrão                                             | `sci` no [src/Calculadora.vue](../../src/Calculadora.vue)              |
| DRG                               | a tecla que troca graus e radianos; graus por padrão                                                                       | `deg` no [src/Calculadora.vue](../../src/Calculadora.vue)              |
| perfil leve / `modoLeve`          | o perfil que o RoqueOS pede no aparelho fraco; a classe `is-leve`                                                          | `sistema.desempenho.modoLeve()`                                        |
| `useInclinacao`                   | o reflexo que segue o sensor do aparelho ou o ponteiro                                                                     | [src/useInclinacao.js](../../src/useInclinacao.js)                     |
| janela falsa                      | a janela falsa do RoqueOS do `yarn dev` (`montarNaJanelaFalsa`)                                                            | [dev/main.js](../../dev/main.js)                                       |
| sistema falso                     | o sistema falso com que os testes montam o app                                                                             | [test/app.spec.js](../../test/app.spec.js)                             |
| `--calc-*`                        | as variáveis CSS do próprio app; `--ros-*` é do sistema                                                                    | [src/calculadora.scss](../../src/calculadora.scss)                     |
| `cqw`                             | unidade de largura do contêiner: a carcaça mede tudo nela para escalar como um objeto                                      | [src/calculadora.scss](../../src/calculadora.scss)                     |
| `yarn verificar`                  | o gate: lint, formato, testes e `app check`                                                                                | [package.json](../../package.json)                                     |
| DCO                               | o `Signed-off-by` que todo commit leva, conferido pelo CI                                                                  | [.github/workflows/dco.yml](../../.github/workflows/dco.yml)           |
