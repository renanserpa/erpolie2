# AGENTS.md

> **Importante:** leia este arquivo antes de implementar qualquer automação ou refatoração no repositório.

## Contexto do Projeto

Este repositório concentra o ERP Olie, um projeto baseado em Next.js, TypeScript e scripts SQL. O objetivo deste documento é padronizar as diretrizes para quaisquer agentes, automações e desenvolvedores que atuem aqui, garantindo refatorações seguras e código consistente.

Todos os agentes devem consultar também [`README.md`](README.md), [`CHECKLIST.md`](CHECKLIST.md), [`MODULOS.md`](MODULOS.md) e [`docs/documentacao_centralizada.md`](docs/documentacao_centralizada.md) antes de iniciar qualquer trabalho.

## Princípios para Agentes/Refatoração Automática

- Sempre buscar a solução mais robusta, reutilizável e escalável.
- Evitar uso de mocks ou dados simulados em produção, a menos que solicitado explicitamente.
- Dividir grandes mudanças em tarefas menores e commits atômicos.
- Resolver conflitos escolhendo a versão mais moderna e funcional do código.
- Priorizar performance, legibilidade e manutenção.
- Documentar decisões importantes no PR ou neste arquivo.

## Checklist para Abertura de Tarefas

- [ ] O código segue padrões de robustez do projeto?
- [ ] Documentação principal (README, CHECKLIST, MODULOS) foi consultada?
- [ ] Não há dados mockados no produto final?
- [ ] A alteração está restrita a um único módulo ou funcionalidade?
- [ ] O commit/merge é pequeno e atômico?
- [ ] Conflitos foram resolvidos buscando a versão mais moderna e funcional?
- [ ] As decisões técnicas relevantes estão documentadas?
- [ ] Se necessário, este AGENTS.md foi atualizado?
- [ ] Todos os testes foram executados com `npm test` e passaram?

## Orientação sobre Resolução de Conflitos

Ao encontrar conflitos de merge, mantenha o lado mais atualizado e funcional. Se houver divergência de estilo ou implementação, prefira o padrão já estabelecido no repositório. Quando persistir dúvida, registre a questão no PR e consulte o mantenedor.

## Política para Mock vs. Produção

- Evite incluir mocks ou simulações em ambientes finais.
- Utilize mocks apenas em testes ou quando explicitamente especificado na tarefa.
- Certifique-se de que dependências falsas não acompanhem o código de produção.

## Pequenos Ciclos e Commits

- Priorize ciclos curtos de desenvolvimento.
- Realize commits menores e focados em uma única funcionalidade.
- Utilize mensagens de commit descritivas, preferencialmente no padrão imperativo.
- Revise o PR com frequência para facilitar integrações.

## Divisão de Tarefas

Quando o escopo for amplo, divida em subtarefas menores e priorize entregas incrementais. Cada commit deve resolver uma parte clara do problema para facilitar revisões e reversões.

## Atualização Futuras deste Arquivo

Sempre que um novo padrão, regra ou decisão deva ser adotado por todos os agentes ou desenvolvedores, registre a alteração na seção "Histórico de Atualizações" abaixo, indicando data e autor.

## Histórico de Atualizações

- 2025-06-03 Manus AI: criação inicial do AGENTS.md com diretrizes gerais.

