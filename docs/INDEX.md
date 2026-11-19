# Calculator documentation

_English | [Português](pt-BR/INDEX.md)_

The scientific calculator of RoqueOS, in its own open repository: for whoever fixes a
calculation, changes how it looks, releases a version or brings a new version into RoqueOS.

Where to start depends on what you want.

| I want to...                                  | Read                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Install it and see it working**             | [GETTING-STARTED.md](GETTING-STARTED.md): from zero to the calculator in a fake RoqueOS window |
| **Release a version and get it into RoqueOS** | [OPERATIONS.md](OPERATIONS.md): the routine, tagging, pinning in RoqueOS, undoing              |
| **Understand a failure**                      | [WHEN-IT-BREAKS.md](WHEN-IT-BREAKS.md): symptom, cause, what to do, with the literal message   |
| **See how it is built inside**                | [ARCHITECTURE.md](ARCHITECTURE.md): context, components, flows, data, decisions, limits        |
| **Look up a command, file or format**         | [REFERENCE.md](REFERENCE.md)                                                                   |
| **See how RoqueOS and the app talk**          | [INTEGRATIONS.md](INTEGRATIONS.md): `definirApp`, `app.json`, `paridade.json`                  |
| **Know what each test suite proves**          | [TESTING.md](TESTING.md): the gate and the acceptance criteria                                 |
| **Know what is decided and not reopened**     | [DECISIONS.md](DECISIONS.md)                                                                   |
| **Find a term**                               | [GLOSSARY.md](GLOSSARY.md)                                                                     |
| **Contribute**                                | [../CONTRIBUTING.md](../CONTRIBUTING.md)                                                       |
| **See what changed**                          | [../CHANGELOG.md](../CHANGELOG.md)                                                             |

## Diagrams

Every diagram is Mermaid inside the Markdown that explains it: GitHub renders it and the text is
the source. The cover image is a screenshot, not a diagram.

| Diagram                               | Source                                                                                      | Explained in                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Context: RoqueOS, the SDK and the app | Mermaid block                                                                               | [ARCHITECTURE.md, section 2](ARCHITECTURE.md#2-context-who-uses-it-and-what-it-depends-on) |
| Mounting and switching language       | Mermaid block                                                                               | [ARCHITECTURE.md, section 5](ARCHITECTURE.md#5-the-main-flows)                             |
| From a key press to the display       | Mermaid block                                                                               | [ARCHITECTURE.md, section 5](ARCHITECTURE.md#5-the-main-flows)                             |
| From a commit to RoqueOS              | Mermaid block                                                                               | [OPERATIONS.md, section 2](OPERATIONS.md#2-releasing-a-version)                            |
| Cover of the README                   | [capa.jpg](capa.jpg), a Playwright screenshot of 28/09/2026 (see [ASSETS.md](../ASSETS.md)) | [README.md](../README.md)                                                                  |
