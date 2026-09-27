# Como contribuir

Obrigado por querer ajudar. A régua comum da organização está no
[CONTRIBUTING da roqueos-apps](https://github.com/roqueos-apps/.github/blob/main/CONTRIBUTING.md);
aqui entra só o que é da Calculadora.

1. Abra uma issue antes de mudar o que a pessoa vê ou como uma conta é feita. Correção
   pequena pode ir direto para o PR.
2. Faça o fork, crie um branch e rode `yarn install --ignore-scripts`.
3. Todo commit leva `Signed-off-by` (`git commit -s`, o DCO). O check `dco` do pull request
   reprova sem.
4. Toda correção vem com um teste que reprova sem ela. Conta errada vira caso em
   `test/motor.spec.js`, com a expressão e o resultado esperado.
5. Texto novo entra nos dez `i18n/*.json`, com as mesmas chaves. O `app check` reprova se
   faltar um idioma.
6. Rode `yarn verificar` antes de abrir o PR. É o mesmo que o CI roda. `yarn dev` abre a
   Calculadora numa janela falsa do RoqueOS, com o seletor de idiomas.

Não mude o `id` do `app.json` (`calculator`): é por ele que o RoqueOS acha as janelas, os
atalhos e as preferências de quem já usa.

O código, os comentários e as mensagens de commit são em português do Brasil. Issue e PR em
inglês são bem-vindos. Ao participar você concorda com o [código de conduta](CODE_OF_CONDUCT.md).

---

## Contributing (English)

The organization-wide guide is the
[roqueos-apps CONTRIBUTING](https://github.com/roqueos-apps/.github/blob/main/CONTRIBUTING.md).
Open an issue before changing what people see or how a calculation works; fork, branch,
`yarn install --ignore-scripts`; sign off every commit (`git commit -s`); every fix comes with
a test that fails without it (a wrong result becomes a case in `test/motor.spec.js`); new text
goes into all ten `i18n/*.json`; run `yarn verificar` before the pull request. `yarn dev` opens
the calculator in a fake RoqueOS window. Never change the `id` in `app.json`.
