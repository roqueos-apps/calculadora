# Changelog

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto
usa [versionamento semântico](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2026-09-28

O visual de uma calculadora de engenharia dos anos 2000, a pedido do founder ("deixe ela
realmente com cara de uma calculadora real").

### Mudado

- Visor de cristal líquido de duas linhas (`Visor.vue`):

  - a conta em matriz de pontos 5 × 7, com o fim à mostra, a seta ◀ quando o começo sai e o
    cursor piscando;
  - o valor em sete segmentos: sinal à parte, treze células e expoente pequeno com "×10";
  - o apagado fica fantasma;
  - indicadores 2nd (antes INV), M, DEG e RAD.

  A fonte e a geometria foram desenhadas aqui (`visor/matriz.js`, `visor/segmentos.js`). O
  texto das duas linhas continua legível para o leitor de tela.

- Carcaça grafite com grão, painel de alumínio escovado com as células solares e o visor na
  moldura preta. As teclas atravessam o furo da carcaça e afundam:

  - as de função em cápsula, com a legenda âmbar do 2nd impressa em cima;
  - DEL e AC em laranja;
  - o teclado de baixo em cinco colunas.

  Tudo mede em cqw da carcaça, que escala inteira e cabe na janela de 300 × 540.

- A Calculadora abre com o bloco científico à mostra; o chip SCI virou a chave deslizante SCI
  do painel. O ⌫ virou DEL, e a tecla DEG/RAD virou DRG. As teclas não mudam de nome com o
  2nd; o nome acessível muda (sin diz asin).
- O perfil leve vem de `sistema.desempenho.modoLeve()` (a classe `is-leve`), e não mais do
  atributo `data-low-end` do documento. Com ele não ligam o reflexo, o grão, a textura e o
  cursor piscando.
- A Calculadora não lê mais cor do tema do RoqueOS. O rodapé "powered by", que saía escuro
  sobre o fundo escuro no `yarn dev`, ficou visível.

### Adicionado

- A tecla da tela afunda quando a do teclado físico é apertada.
- O anel de foco aparece para quem navega com Tab, e não na tecla clicada antes de digitar.

### Corrigido

- Seguir a conta a partir de um resultado negativo perdia o sinal (2 − 8 = −6, depois
  "+ 1 =" dava 7). Seguir a partir de um resultado em notação científica dava Error. O motor
  agora lê o número que o próprio `fmt` escreve.

### Paridade

- `paridade.json` refeito para a 0.2.0: 63 itens, 41 mantidos, 22 mudaram (cada um com a nota
  do que mudou) e nenhum perdido. A evidência cita nomes de função, classe e constante, e não
  linhas.

## [0.1.1] - 2026-09-28

A auditoria de paridade de 28/09/2026 (Goal 28): o founder pediu que nenhuma funcionalidade
se perdesse na saída do núcleo.

### Adicionado

- `paridade.json`: o inventário do que a Calculadora fazia dentro do RoqueOS, item por item, e o
  que aconteceu com cada coisa na saída (63 itens: 54 mantidas, 9 mudaram, 0 perdidas). Cada
  item cita o teste deste repo que o prova, ou a evidência, e o RoqueOS confere o arquivo no
  pacote instalado: teste citado que não existe mais, estado de dúvida ou perda sem decisão
  escrita reprovam. O arquivo vai no pacote (`files`).

## [0.1.0] - 2026-09-27

### Adicionado

- A Calculadora sai do repositório do RoqueOS e passa a falar com ele só pelo `app-sdk` 0.1.0:
  cria o próprio app Vue dentro da janela, sem Quasar, i18n ou store do sistema.
- `app.json` com o `id` permanente (`calculator`), nome e descrição nos dez idiomas, ícone,
  cor, categoria e tamanho da janela. A descrição, que estava em inglês em oito idiomas no
  RoqueOS, foi traduzida.
- Textos da tela nos dez idiomas em `i18n/`, carregados sob demanda, e a troca de idioma com a
  janela aberta (a última pedida vence).
- O teclado físico só vale com a janela ativa, pelo `ativar` do SDK.
- O reflexo da carcaça lê o perfil leve pelo `sistema.desempenho`.
- `yarn dev` abre a Calculadora numa janela falsa do RoqueOS, com o seletor dos dez idiomas.
