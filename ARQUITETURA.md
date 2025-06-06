# Olie ERP — Arquitetura Completa do Sistema

## 1. Objetivo e Visão Geral
O Olie ERP é um sistema de gestão modular, inteligente e escalável, desenvolvido para atender todas as demandas do Ateliê Olie — especializado em produção artesanal e personalizada de bolsas, nécessaires e itens customizados. O sistema centraliza, automatiza e dá visibilidade total a todos os fluxos do negócio, suportando crescimento, controle operacional, rastreabilidade e integrações com marketplaces, canais de venda e automações futuras.

## 2. Stack Tecnológica & Princípios de Arquitetura
- **Frontend**: Next.js (React) + TailwindCSS (cores: `#F0FFBE`, `#A5854E`)
- **Backend & Banco**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Deploy**: Vercel para ambientes de produção, staging e preview
- **Linguagem**: TypeScript 100% tipado, sem `any`
- **Design**: moderno, responsivo, dark/light mode e acessível
- **Padrões**: CRUD completo, import/export CSV, máscaras de dados e logs/auditoria
- **Internacionalização**: Português-br, pronto para expansão
- **Componentização**: DataTable, filtros, dialogs, cards e formulários modulares
- IDs string/UUID, datas em ISO 8601 e booleans padronizados (`is_active`)
- Permissões RBAC e multi-tenant prontos para multi-marca/unidade

## 3. Módulos Principais & Funcionalidades
1. **Login e Autenticação**
   - Supabase Auth (e-mail/senha, recuperação, redefinição)
   - Perfis de usuário (produção, compras, financeiro, RH, admin etc.)
   - Permissões configuráveis por módulo/função
2. **Dashboard Inicial**
   - KPIs de produção, vendas, compras, estoque, entregas, financeiro e RH
   - Gráficos dinâmicos e alertas do dia
3. **Clientes**
   - Cadastro completo (pessoa física/jurídica)
   - Histórico de pedidos e segmentação
   - Importação/exportação CSV
4. **Fornecedores**
   - Cadastro detalhado e associação a insumos/componentes
   - Histórico de compras e avaliação de desempenho
5. **Produtos**
   - Produtos simples/compostos, coleções e SKUs
   - Opções de personalização (cor, bordado, hotstamping etc.)
6. **Estoque**
   - Cadastro de insumos, movimentações e controle de saldos
   - Alerta de estoque mínimo/máximo e rastreabilidade por lote
7. **Pedidos**
   - Criação de pedidos multi-itens com geração de Ordem de Produção
   - Status detalhado: rascunho, produção, pronto, enviado, entregue
8. **Compras**
   - Ordens de compra baseadas em demanda ou estoque mínimo
   - Recebimento parcial/total com atualização automática do estoque
9. **Produção**
   - Painel Kanban por etapas (preparo, corte, costura, acabamento...)
   - Reserva automática de insumos e relação direta com pedidos
10. **Logística**
    - Cadastro de rotas e entregas, relação pedidos/entregas
    - Gestão de transportadoras e rastreio integrado
11. **Financeiro**
    - Lançamentos de receitas e despesas por categoria/forma de pagamento
    - Integração com pedidos, compras e fornecedores
12. **RH**
    - Cadastro de colaboradores, controle de ponto e histórico funcional
13. **Notificações & Logs**
    - Alertas personalizáveis e auditoria detalhada de ações
14. **Configurações**
    - Parâmetros globais, permissões e logs do sistema
15. **BI**
    - Relatórios e dashboards customizáveis com drill-down
16. **Universidade/Onboarding**
    - Trilhas de treinamento, materiais de apoio e certificações internas

## 4. Fluxos Essenciais
- **Pedido Personalizado**: WhatsApp/site → cadastro no sistema → geração de OP → etapas Kanban → baixa de insumos → entrega ao cliente → atualização financeira
- **Compras**: alerta de estoque → ordem de compra → recebimento → entrada no estoque → lançamento financeiro
- **Produção**: OP criada → reserva de insumos → execução por etapas → baixa automática no estoque

## 5. Diferenciais & Padrões Técnicos
- Multi-marca, multi-unidade e multi-tenant
- Componentização máxima e tipagem forte (TypeScript)
- Logs e auditoria completos
- Kanban em produção, compras, pedidos e entregas
- Importação/exportação CSV em todos os cadastros
- Integração futura com WhatsApp, Olist e Zapier

## 6. Roadmap & Processo de Validação
- Validação incremental dos módulos (login, clientes, fornecedores...)
- Rodar lint e build antes de prosseguir
- Checklist de validação de cada módulo
- Deploy contínuo via Vercel (preview, staging, produção)
- Documentação sempre atualizada

## 7. Arquivos Essenciais do Projeto
- `ARQUITETURA.md` — Este documento-mestre
- `AGENTS.md` — Papeis dos agentes virtuais e squad
- `FLUXOS.md` — Diagramas e fluxos operacionais
- `ESTRUTURA-DE-PASTAS.md` — Hierarquia de arquivos/pastas
- `SQUAD.md` — Lista de papeis e contatos
- `CHECKLIST.md` — Progresso por módulo, bugs e pendências
- `README.md` — Resumo para novos devs/consultores
- `FAQ.md` — Dúvidas, padrões e alertas
