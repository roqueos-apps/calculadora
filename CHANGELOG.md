# Changelog

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto
usa [versionamento semântico](https://semver.org/lang/pt-BR/).

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
