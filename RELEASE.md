# Release 1.0.0 - Olie ERP

Esta versão marca a primeira release estável do Olie ERP, pronta para deploy em produção na Vercel. As principais correções e melhorias realizadas ao longo da sprint de estabilização incluem:

- Tipagem completa de todos os módulos (clientes, fornecedores, produtos, pedidos, estoque, produção, compras, financeiro, logística, RH e BI).
- Refatoração do módulo de autenticação, com fluxo de verificação e uso das variáveis do Supabase via ambiente.
- Normalização de componentes e hooks compartilhados, reduzindo duplicidade.
- Ajustes de páginas para cumprimento das regras de server/client components do Next.js 15.
- Integração entre módulos, com páginas de Kanban, filtros avançados e exportação CSV.
- Build validado e testes unitários rodando com Vitest.

A build foi gerada executando `npm run build` após `npm run lint` e `npm run test`, garantindo que o código esteja pronto para produção.

