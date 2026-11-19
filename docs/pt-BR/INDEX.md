# Documentação da Calculadora

_[English](../INDEX.md) | Português_

A calculadora científica do RoqueOS, no repositório aberto dela: para quem conserta uma conta,
muda a cara dela, solta uma versão ou leva uma versão nova para dentro do RoqueOS.

Por onde começar depende do que você quer.

| Quero...                                        | Leia                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Instalar e ver funcionando**                  | [COMECAR.md](COMECAR.md): do zero à calculadora numa janela falsa do RoqueOS              |
| **Soltar uma versão e levar ao RoqueOS**        | [OPERACAO.md](OPERACAO.md): a rotina, a tag, o pino no RoqueOS, desfazer                  |
| **Entender uma falha**                          | [QUANDO-QUEBRA.md](QUANDO-QUEBRA.md): sintoma, causa, o que fazer, com a mensagem literal |
| **Ver como ela é por dentro**                   | [ARQUITETURA.md](ARQUITETURA.md): contexto, componentes, fluxos, dados, decisões, limites |
| **Consultar um comando, arquivo ou formato**    | [REFERENCIA.md](REFERENCIA.md)                                                            |
| **Ver como o RoqueOS e o app conversam**        | [INTEGRACOES.md](INTEGRACOES.md): `definirApp`, `app.json`, `paridade.json`               |
| **Saber o que cada suíte de teste prova**       | [TESTES.md](TESTES.md): o gate e o critério de aceite                                     |
| **Saber o que já foi decidido e não se reabre** | [DECISOES.md](DECISOES.md)                                                                |
| **Achar um termo**                              | [GLOSSARIO.md](GLOSSARIO.md)                                                              |
| **Contribuir**                                  | [CONTRIBUTING.md](CONTRIBUTING.md)                                                        |
| **Ver o que mudou**                             | [../../CHANGELOG.md](../../CHANGELOG.md)                                                  |

## Diagramas

Todo diagrama é Mermaid dentro do Markdown que o explica: o GitHub renderiza e o texto é a
fonte. A imagem de capa é um print, não um diagrama.

| Diagrama                           | Fonte                                                                                            | Explicado em                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Contexto: o RoqueOS, o SDK e o app | bloco Mermaid                                                                                    | [ARQUITETURA.md, seção 2](ARQUITETURA.md#2-contexto-quem-usa-e-do-que-depende) |
| Montar e trocar de idioma          | bloco Mermaid                                                                                    | [ARQUITETURA.md, seção 5](ARQUITETURA.md#5-os-fluxos-principais)               |
| Da tecla apertada ao visor         | bloco Mermaid                                                                                    | [ARQUITETURA.md, seção 5](ARQUITETURA.md#5-os-fluxos-principais)               |
| Do commit ao RoqueOS               | bloco Mermaid                                                                                    | [OPERACAO.md, seção 2](OPERACAO.md#2-soltar-uma-versão)                        |
| Capa do README                     | [capa.jpg](../capa.jpg), print do Playwright de 28/09/2026 (veja o [ASSETS.md](../../ASSETS.md)) | [README.pt-BR.md](../../README.pt-BR.md)                                       |
