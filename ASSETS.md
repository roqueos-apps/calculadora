# Origem dos assets

Todo arquivo em `public/` tem uma linha aqui, com a licença e a origem. O `app check` reprova
arquivo sem linha e licença fora da lista do SDK.

A Calculadora não tem `public/`: não usa imagem, som nem fonte de arquivo. O visor é SVG: a
fonte 5 × 7 da matriz de pontos (`src/visor/matriz.js`) e a geometria dos sete segmentos
(`src/visor/segmentos.js`) foram desenhadas neste repo, ponto a ponto, e são MIT como o resto
dele. A carcaça, o painel escovado, as células solares e as teclas são CSS.

O único desenho de terceiro é o ícone do histórico, o `history` do
[Material Icons](https://fonts.google.com/icons), sob Apache-2.0, escrito como SVG inline em
`src/Calculadora.vue`. O ícone da janela e da Launchpad é o `calculate` do Material Icons,
desenhado pelo RoqueOS a partir do nome no `app.json`.

A capa do README (`docs/capa.jpg`) é um print do app dentro do RoqueOS (build 2581 do front, com a
0.2.0, em pt-BR), tirado com o Playwright numa sessão de teste com conteúdo de exemplo, em 28/09/2026;
autoral, MIT como o resto do repo. Ela não vai no pacote que o RoqueOS instala (o `files` do
`package.json` não leva `docs/`).
