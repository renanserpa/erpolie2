

1. **Contexto do Projeto**
Este repositório centraliza o desenvolvimento do Olie ERP — sistema modular, escalável e altamente automatizado para gestão de ateliês criativos, com stack Next.js + TypeScript + Supabase.
O agente CODEX é o principal executor de código, refatoração e automação, respondendo por:
- Execução de testes, lint e build
- Refatoração automática (com sugestões e aplicação de padrões)
- Geração e atualização de documentação técnica
- Sinalização de inconsistências ou pontos de melhoria
- Proposição de scripts e automações adicionais quando detectar padrões recorrentes

2. **Princípios para Agentes (CODEX)**
- Sempre buscar a solução mais robusta, escalável e alinhada com as práticas modernas.
- Reutilizar código e componentes ao máximo, evitando duplicidade.
- Evitar mocks ou dados simulados em produção. Use apenas em ambiente de testes/dev.
- Dividir grandes mudanças em tarefas pequenas e commits atômicos.
- Priorizar performance, legibilidade, tipagem forte (TypeScript) e manutenibilidade.
- Documentar decisões importantes neste arquivo ou no PR.
- Propor melhorias de automação, scripts de build/test/doc ao identificar demandas.
- Sinalizar problemas de arquitetura, dependências desatualizadas e más práticas.

3. **Checklist para Tarefas/Commits do CODEX**
- O código segue os padrões e arquitetura definidos neste repositório?
- Não há mocks ou dados simulados em produção?
- A alteração está restrita a um único módulo ou funcionalidade?
- O commit é pequeno, atômico e de fácil revisão?
- Todos os testes, lint e build foram executados e passaram (`npm test`, `npm run lint`, `npx next build`)?
- Conflitos foram resolvidos buscando a versão mais moderna e funcional?
- A documentação foi atualizada se necessário?
- Logs de ações críticas e rastreabilidade mantidos?
- Scripts e automações (test, build, doc) sugeridos ou otimizados quando possível?

4. **Resolução de Conflitos**
- Sempre prefira a versão mais recente e funcional do código.
- Em caso de dúvida de padrão, siga o que já está mais consolidado no projeto.
- Se persistir dúvida, registre no PR ou peça análise do mantenedor/líder do projeto.
- Documente decisões de conflito neste arquivo (histórico) se relevante.

5. **Política para Mocks, Dados de Teste e Produção**
- Não incluir mocks em ambiente de produção.
- Permitir uso de mocks apenas em ambiente de testes ou se especificado explicitamente na tarefa.
- Limpar dependências falsas e simulações antes do merge/deploy.

6. **Automação e Scripts**
- Sempre que identificar padrões de repetição, sugerir ou criar scripts automatizados (lint, fix, doc, test).
- Geração automática de documentação técnica quando possível (Typedoc/JSDoc).
- Propor melhorias para pipeline CI/CD.
- Validar periodicamente se os scripts estão alinhados com os requisitos do projeto.

7. **Pequenos Ciclos e Commits**
- Priorizar ciclos curtos de desenvolvimento, com entregas incrementais.
- Realizar commits menores, atômicos e de fácil rastreio.
- Reforçar revisões frequentes via PR para facilitar integração contínua.

8. **Histórico de Atualizações**
Data | Autor | Descrição
---- | ----- | ---------
2025-06-06 | Renan/CODEX | Versão inicial, adaptada para priorizar automação, robustez e refino contínuo pelo agente CODEX.
2025-06-06 | CODEX | Remoção de credenciais Supabase hardcoded em middleware, uso de variáveis de ambiente.
2025-06-06 | CODEX | Criação da página /auth/verify para confirmação de cadastro.

**Observação:** Este arquivo AGENTS.md deve ser consultado e atualizado sempre que um novo padrão, regra, dependência crítica ou decisão estrutural for adotada no projeto.

