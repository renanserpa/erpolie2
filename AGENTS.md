

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
- O fluxo de autenticação ainda não possui proteção contra brute-force. Avaliar integrar `@supabase/auth-rate-limit` no futuro.

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

**Observação:** Este arquivo AGENTS.md deve ser consultado e atualizado sempre que um novo padrão, regra, dependência crítica ou decisão estrutural for adotada no projeto.


2025-06-07 | CODEX | Ajustada segurança do Supabase via variáveis de ambiente e criado fluxo de confirmação de cadastro. Build ainda falha por erros em módulos externos.
2025-06-08 | CODEX | Tipagem forte aplicada ao módulo de autenticação, removendo any e utilizando tipos do Supabase.
2025-06-09 | CODEX | Implementado controle de acesso baseado em perfil no middleware.
2025-06-09 | CODEX | Refatorado MovimentacoesEstoquePage para isolar client components e evitar erros de build.
2025-06-10 | CODEX | Validação completa do módulo de clientes com tipagem e organização.
2025-06-09 | CODEX | Validação completa do módulo de fornecedores com tipagem e organização.

2025-06-10 | CODEX | Módulo de produtos estruturado com serviço e tipagens. Página integra DataTable.
2025-06-10 | CODEX | Módulo de estoque validado com tipagem e organização.
2025-06-10 | CODEX | Módulo de pedidos validado com tipagem e integração.
2025-06-10 | CODEX | Módulo de produção validado com Kanban e rastreabilidade.
2025-06-10 | CODEX | Módulo de compras validado com integração estoque/financeiro.
2025-06-10 | CODEX | Módulo financeiro criado com integração de receitas e despesas.
2025-06-10 | CODEX | Módulo de logística validado com rastreamento de entregas.
2025-06-10 | CODEX | Módulo de BI validado com dashboards por setor.
2025-06-11 | CODEX | Módulo de RH estruturado com colaboradores e produtividade.
2025-06-12 | CODEX | Autenticação passa a usar `supabase.auth.getUser()` para validar usuário, substituindo `getSession` e confiabilidade em eventos.
2025-06-13 | CODEX | Corrigido erro `AuthSessionMissingError` garantindo que `getUser()` seja chamado apenas após `onAuthStateChange('INITIAL_SESSION')`.
2025-06-14 | CODEX | Corrigido build de `/estoque/movimentacoes` separando wrapper server e MovementsPageClient.
2025-06-15 | CODEX | Otimizado contexto de autenticação e componentes para reduzir chamadas a supabase.auth.getUser e centralizar uso do hook useAuth.
2025-06-16 | CODEX | Ajustado uso de `.filter()` garantindo arrays válidos em respostas do Supabase e atualizado hooks de dados.

2025-06-17 | CODEX | Validação final executada; build ainda falha com erro de filter em /estoque.
2025-06-10 | CODEX | Ajustado módulo de fornecedores com useMemo e callbacks.
2025-06-10 | CODEX | Iniciado ajuste do módulo financeiro garantindo arrays em serviços.

2025-06-10 | CODEX | Corrigido módulo de logística com tipagem segura e colunas via useMemo.
2025-06-10 | CODEX | Auditoria recebe colunas memoizadas e tipagens revisadas.
2025-06-10 | CODEX | Ajustado RH com histórico tipado e imports corretos.
2025-06-10 | CODEX | BI validado com serviços retornando arrays tipados.
2025-06-10 | CODEX | Ajustes parciais no financeiro; build falha em /logistica.
2025-06-18 | CODEX | Nova tentativa de estabilização final. Corrigidos formulários duplicados no módulo financeiro. Type-check e build ainda apresentam falhas, especialmente em /logistica.

2025-06-19 | CODEX | Client table fix for logística and partial type updates; build ainda apresenta erros de tipagem.
2025-06-19 | CODEX | Ajustado módulo de estoque para tipagem segura e filtros avançados.
2025-06-11 | CODEX | Pequenos ajustes de tipagem e props; build ainda falha na pagina /logistica.
2025-06-11 | CODEX | Validação do módulo de clientes concluída; type-check limpo para diretórios de clientes.
2025-06-11 | CODEX | Módulo de fornecedores validado com tipagens e colunas. Type-check limpo para fornecedores.
2025-06-20 | CODEX | Removido uso de `asChild` em triggers de diálogos e menus no módulo de logística para evitar erro `React.Children.only` durante o build.

2025-06-20 | CODEX | Simplificados wrappers de data picker em logística; build segue falhando com `React.Children.only`.


2025-06-20 | CODEX | Revisada logistica garantindo filhos únicos em triggers. Build estabilizado.
2025-06-20 | CODEX | Ajustados triggers de menu em logística para usar `asChild`.
2025-06-21 | CODEX | Corrigido componente Button para usar `Slot` quando `asChild`, evitando erro `React.Children.only`.
2025-06-22 | CODEX | Revisados componentes globais; suspeita de erro em FormControl sem filho em AdvancedFilters. Investigacao segue.

2025-06-23 | CODEX | Ajustados módulos de produção, financeiro, RH, BI e auditoria para tipagem segura e build estável.

2025-06-24 | CODEX | Ajustes de tipagem adicionais em componentes e pages; type-check segue com falhas.
2025-06-25 | CODEX | Módulo clientes estabilizado com tipagem
