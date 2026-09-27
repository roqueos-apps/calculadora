# Calculadora

App da organização roqueos-apps, montado pelo RoqueOS através do `app-sdk`. Leia o README
antes de mudar qualquer coisa.

- Gate: `yarn verificar` (o mesmo do CI e do pre-push).
- O app só importa `vue`, `@roqueos-apps/app-sdk` e arquivo deste repo. O `app check` e a
  catraca `apps-fora-do-nucleo` do RoqueOS reprovam outra coisa.
- JSON de texto entra com `?raw` e `JSON.parse` (`src/textos.js`): o build do RoqueOS quebra
  com import de JSON direto.
- O `id` do `app.json` (`calculator`) é permanente: é por ele que o RoqueOS acha janelas,
  atalhos e preferências de quem já usa.
- Do tema do RoqueOS só as seis variáveis CSS do contrato do SDK; as cores do app são `--calc-*`.
- Toda correção vem com teste que reprova sem ela.
- Todo commit com `Signed-off-by` (`git commit -s`): o workflow `dco` reprova sem.
- Português do Brasil no código e nos commits.
