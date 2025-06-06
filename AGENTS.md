# AGENTS.md

> **Importante:** leia este arquivo antes de implementar qualquer automação ou refatoração no repositório.

## Contexto do Projeto

Este repositório centraliza o desenvolvimento do **Olie ERP**, um sistema modular, escalável e altamente automatizado para ateliês criativos. A stack principal é **Next.js**, **TypeScript** e **Supabase**.

O agente **CODEX** é o executor oficial de código e automações, responsável por:
- Execução de testes, lint e build
- Refatoração automática seguindo os padrões do projeto
- Geração e atualização de documentação técnica
- Sinalização de inconsistências e pontos de melhoria
- Proposição de scripts e automações adicionais quando padrões recorrentes forem identificados

Todos os agentes devem consultar também [`README.md`](README.md), [`CHECKLIST.md`](CHECKLIST.md), [`MODULOS.md`](MODULOS.md), [`FLUXOS.md`](FLUXOS.md) e [`docs/documentacao_centralizada.md`](docs/documentacao_centralizada.md) antes de iniciar qualquer trabalho.

- Buscar a solução mais robusta, escalável e alinhada às práticas modernas
- Reutilizar código e componentes sempre que possível
- Evitar mocks ou dados simulados em produção. Utilize apenas em testes/dev
- Dividir grandes mudanças em tarefas pequenas e commits atômicos
- Priorizar performance, legibilidade e tipagem forte (TypeScript)
- Documentar decisões importantes neste arquivo ou no PR
- Sinalizar dependências desatualizadas e más práticas

## Checklist para Tarefas/Commits do CODEX

- [ ] A alteração está restrita a um único módulo ou funcionalidade?
- [ ] O commit é pequeno, atômico e de fácil revisão?
- [ ] Todos os testes, lint e build foram executados e passaram (`npm test`, `npm run lint`, `npx next build`)?
- [ ] Conflitos foram resolvidos buscando a versão mais moderna e funcional?
- [ ] A documentação foi atualizada se necessário?
- [ ] Logs de ações críticas e rastreabilidade foram mantidos?
- [ ] Scripts e automações foram sugeridos ou otimizados quando possível?

## Resolução de Conflitos

- Sempre prefira a versão mais recente e funcional do código
- Em caso de dúvida de padrão, siga o que já estiver mais consolidado
- Se persistir dúvida, registre no PR ou consulte o mantenedor/líder do projeto
- Documente decisões de conflito neste arquivo quando relevante

## Política para Mocks, Dados de Teste e Produção

- Não incluir mocks em ambiente de produção
- Utilizar mocks apenas em testes ou quando especificado explicitamente
- Limpar dependências falsas e simulações antes do merge/deploy

## Automação e Scripts


## Pequenos Ciclos e Commits

- Priorizar ciclos curtos e entregas incrementais
- Realizar commits menores, atômicos e de fácil rastreio
- Reforçar revisões frequentes via PR para integração contínua

## Histórico de Atualizações

- 2025-06-06 Renan/CODEX: versão inicial adaptada para priorizar automação e robustez
- 2025-06-03 Manus AI: criação inicial do AGENTS.md com diretrizes gerais

Observação: este arquivo deve ser consultado e atualizado sempre que um novo padrão, regra, dependência crítica ou decisão estrutural for adotada no projeto.
