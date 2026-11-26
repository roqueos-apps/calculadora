# How to contribute

_English | [Português](docs/pt-BR/CONTRIBUTING.md)_

Thank you for wanting to help. The organization-wide rules are in the
[roqueos-apps CONTRIBUTING](https://github.com/roqueos-apps/.github/blob/main/CONTRIBUTING.md);
this file has only what belongs to the Calculator.

1. Open an issue before changing what people see or how a calculation is done. A small fix can go
   straight to a pull request.
2. Fork, create a branch and run `yarn install --ignore-scripts`.
3. Every commit carries `Signed-off-by` (`git commit -s`, the DCO). The `dco` check of the pull
   request fails without it; `git rebase --signoff main` fixes a branch that already has commits.
4. Every fix comes with a test that fails without it. A wrong result becomes a case in
   `test/motor.spec.js`, with the expression and the expected result.
5. New text goes into all ten `i18n/*.json`, with the same keys. `app check` fails if a language
   is missing.
6. Renaming or removing a test cited in `paridade.json` means updating `paridade.json` in the same
   commit: RoqueOS refuses a version whose inventory cites a test that no longer exists.
7. Run `yarn verificar` before opening the pull request. It is the same as CI. `yarn dev` opens the
   Calculator in a fake RoqueOS window, with the language picker.

Do not change the `id` in `app.json` (`calculator`): RoqueOS finds the windows, shortcuts and
preferences of people who already use it by that id.

Code, comments and commit messages are in Brazilian Portuguese. Issues and pull requests in
English are welcome. By taking part you agree to the [code of conduct](CODE_OF_CONDUCT.md).

The rest of the documentation, from getting started to what each test proves, starts at
[docs/INDEX.md](docs/INDEX.md).
