# Segurança

## Como reportar

Não abra issue pública para falha de segurança. Use o
[relatório privado de vulnerabilidade](https://github.com/roqueos-apps/calculadora/security/advisories/new)
do GitHub. A resposta vem em até sete dias. A política completa está no
[SECURITY da roqueos-apps](https://github.com/roqueos-apps/.github/blob/main/SECURITY.md).

## O que vale aqui

A Calculadora roda **na mesma origem** do RoqueOS. O SDK entrega capacidades em vez das stores
do sistema, mas isso não é fronteira de segurança. O que protege quem usa o RoqueOS é:

- todo merge passa pela revisão do mantenedor (`CODEOWNERS`), e todo commit tem
  `Signed-off-by`;
- o RoqueOS instala o app por uma tag exata, com o commit travado no lockfile, e toda troca de
  versão é revisada antes de entrar;
- nenhum script roda sozinho no install, e o `app check` reprova se aparecer um;
- o app não grava nada, não fala com servidor nem com banco, e o `app check` reprova import do
  Firebase ou de dentro do RoqueOS;
- o CI de pull request não lê segredo nenhum.

---

## Security (English)

Do not open public issues for vulnerabilities; use GitHub's private vulnerability reporting.
The calculator runs on the same origin as RoqueOS. Protection comes from maintainer review and
signed-off commits, exact version pins in RoqueOS, no install-time scripts, no storage,
server or database access, and secret-free CI.
