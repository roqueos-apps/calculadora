# Origem dos assets

Todo arquivo em `public/` tem uma linha aqui, com a licença e a origem. O `app check` reprova
arquivo sem linha e licença fora da lista do SDK.

A Calculadora não tem `public/`: não usa imagem, som nem fonte de arquivo.

O único desenho de terceiro é o ícone do histórico, o `history` do
[Material Icons](https://fonts.google.com/icons), sob Apache-2.0, escrito como SVG inline em
`src/Calculadora.vue`. O ícone da janela e da Launchpad é o `calculate` do Material Icons,
desenhado pelo RoqueOS a partir do nome no `app.json`.
