# OLIE ERP – DOCUMENTAÇÃO CENTRALIZADA DO SISTEMA

## 1. Visão Geral e Objetivo
O Olie ERP é um sistema de gestão modular, inteligente e escalável, criado sob medida para o Ateliê Olie e negócios criativos de produção artesanal e personalizada. O objetivo é centralizar, automatizar e dar visibilidade total a todos os processos do negócio, garantindo controle da operação, redução de erros, agilidade na tomada de decisão e crescimento escalável.

**Público-alvo**:
- Ateliês, confecções, costura, estamparia, personalização
- Pequenas e médias marcas de produtos sob demanda
- Estruturas com produção artesanal, multi-divisão ou franquias

## 2. Arquitetura e Stack Tecnológica
- **Frontend**: Next.js (React) com TailwindCSS
- Componentização máxima, layout responsivo, suporte a dark mode e acessibilidade
- **DataTable centralizado** e fluxo Kanban com drag-and-drop
- **Backend & Banco**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Deploy**: Vercel (prod, preview, staging)
- **Linguagem**: TypeScript, tipagem forte, sem `any`
- **Internacionalização**: PT-BR e pronto para expansão
- **Padrões**: CRUD, import/export CSV, máscaras de dados e logs/auditoria

## 3. Diferenciais Técnicos e Estratégicos
- Modular e escalável (multi-marca, multiunidade, multiusuário)
- Base de dados normalizada, rastreável e versionável
- Pronto para integrações (WhatsApp, Olist, Zapier, Marketplaces)
- Fluxos automatizados entre módulos (pedido → produção → estoque → entrega)
- RBAC: permissões detalhadas por função/módulo
- Painéis por setor e KPIs em tempo real
- **Padrão Kanban obrigatório** em todos os fluxos
- Pronto para rodar localmente e em nuvem
- Estrutura de agentes e squad virtual para desenvolvimento contínuo

## 4. Módulos Principais e Funcionalidades
### 4.1. Login e Autenticação
- Autenticação Supabase Auth (e-mail/senha, recuperação, redefinição)
- Perfis de usuário (Produção, Compras, Financeiro, RH, Admin etc.)
- Permissões configuráveis por módulo e função
- Logs de acesso

### 4.2. Dashboard Inicial
- KPIs de produção, vendas, compras, entregas, financeiro e RH
- Gráficos e filtros dinâmicos
- Lista de notificações, pendências e tarefas do dia

### 4.3. Clientes
- Cadastro completo (nome, CPF/CNPJ, contatos, endereço, histórico, "indicado por")
- Segmentação (final, loja, revenda etc.)
- Histórico de compras/pedidos por cliente
- Importação/exportação CSV e filtros avançados

### 4.4. Fornecedores
- Cadastro detalhado (nome, CNPJ, contatos, prazos, condições, produtos fornecidos)
- Associação de fornecedores a insumos ou componentes
- Histórico de compras e avaliação de desempenho
- Importação/exportação CSV

### 4.5. Estoque
- Cadastro de insumos, materiais, localizações e unidades
- Controle de saldo em tempo real e movimentações (entrada, saída, ajuste)
- Estoque mínimo/máximo com alertas automáticos
- Multi-localização e rastreabilidade por lote
- Relacionamento com compras, produção e produtos
- Inventário e histórico completo

### 4.6. Produtos
- Cadastro de produtos simples, compostos, variações e coleções temáticas
- Componentes e opções de personalização (tecidos, zíper, bordado, hotstamping etc.)
- Relacionamento produto ↔ insumo e produto ↔ componente
- Controle de estoque mínimo por produto
- Vínculo com tabelas de preço e canais de venda
- Visualização de componentes disponíveis para personalização

### 4.7. Pedidos (Vendas)
- Criação e controle de pedidos multi-itens e multipersonalização
- Associação com cliente, canal, responsável, previsão, status e arquivos
- Controle de status: rascunho, pendente, em produção, pronto, enviado, entregue, cancelado
- Histórico de alterações e impressão de etiquetas
- Geração automática de ordem de produção
- Importação/exportação CSV

### 4.8. Compras
- Requisição de compra baseada em estoque mínimo ou demanda
- Aprovação, acompanhamento e registro de ordens de compra
- Recebimento parcial ou total com atualização automática do estoque
- Histórico e avaliação de fornecedores

### 4.9. Produção
- Kanban de ordens de produção por etapa (preparo, corte, costura, acabamento etc.)
- Definição de etapas personalizadas, prioridade e responsáveis
- Relacionamento OP ↔ pedidos, produtos, colaboradores e insumos
- Rastreabilidade completa (quem fez, quando, quanto, como)
- Histórico e tempo de execução das etapas

### 4.10. Logística (Entregas)
- Cadastro de rotas, entregas e status
- Associação entre pedidos e entregas
- Definição de datas, transportadoras e acompanhamento de status
- Filtros por rota, status e responsável

### 4.11. Financeiro
- Lançamentos financeiros por categoria, tipo e forma de pagamento
- Controle de contas a pagar e a receber, conciliação bancária
- Integração direta com pedidos, compras e fornecedores
- Dashboards e relatórios financeiros

### 4.12. RH
- Cadastro de colaboradores, cargos e vínculos
- Controle de ponto, férias e licenças
- Produção atribuída por colaborador
- Permissões específicas por função ou colaborador

### 4.13. Notificações e Logs
- Cadastro de notificações internas, automáticas e customizáveis
- Logs de ações, alterações e auditoria detalhada

### 4.14. Configurações
- Parâmetros globais (moeda, timezone, estoque mínimo, notificações)
- Gestão de usuários e permissões detalhadas
- Logs de sistema, tentativas de login e status globais

### 4.15. BI – Business Intelligence
- Painéis interativos por área (produção, vendas, financeiro)
- Gráficos e relatórios customizáveis, exportação de dados
- Drill-down para investigação de desvios

### 4.16. Universidade/Onboarding
- Cadastro de trilhas e módulos de treinamento
- Controle de progresso e materiais de apoio (PDF, vídeo, quiz)
- Certificação interna e onboarding

## 5. Padrão Kanban – Requisito Obrigatório
Todos os fluxos principais (Produção, Compras, Pedidos, Entregas) devem ter telas em Kanban. Veja padrão na seção anterior.
- Movimentação via drag-and-drop
- Indicadores de prioridade, atraso e responsável
- Cards clicáveis com resumo e ações rápidas
- Kanban customizável por setor ou módulo
- Acompanhamento em tempo real do fluxo
- Ações integradas com notificações internas
- Tecnologias sugeridas: react-beautiful-dnd e TanStack Table com performance otimizada

## 6. Fluxos de Trabalho e Integração dos Módulos
### 6.1. Fluxo Pedido → Produção → Estoque → Entrega
1. Cliente realiza pedido (WhatsApp, site ou manual)
2. Pedido é cadastrado e a personalização registrada
3. Ordem de Produção é criada e etapas distribuídas na equipe
4. Insumos são reservados no estoque automaticamente
5. Produção avança por etapas (Kanban) com registro de responsável, tempo e status
6. Estoque é baixado conforme uso dos insumos
7. Produto finalizado, conferido, embalado e entregue ao cliente
8. Status atualizado em todos os módulos (notificações internas)
9. Pedido fechado, financeiro atualizado e relatório gerado

### 6.2. Fluxo de Compras
1. Sistema identifica estoque mínimo ou solicitação manual
2. Pedido de compra é criado e aprovado
3. Ordem de compra enviada ao fornecedor
4. Recebimento registrado (parcial ou total) e estoque atualizado
5. Lançamento financeiro da despesa vinculado

### 6.3. Fluxo de Produção
1. OP aberta via pedido ou manual
2. Componentes ou insumos associados e etapas distribuídas
3. Execução registrada por etapa, responsável e tempo gasto
4. Encerramento da OP com movimentação automática do estoque

## 7. Critérios de Qualidade e Padrões de Código
- Tipagem rigorosa em TypeScript (sem `any`)
- CRUD completo e robusto
- Filtros avançados e busca em todas as listagens
- Importação/exportação CSV nativo
- Logs e auditoria detalhada em ações críticas
- Componentização máxima: tabelas, formulários, diálogos e filtros
- DataTable centralizado (TanStack Table)
- Navegação consistente, sem refresh
- Validações em tempo real
- Multiusuário com permissões controladas
- Responsividade total (desktop, tablet, mobile)
- Relatórios impressos ou em PDF
- Deploy contínuo via Vercel (staging e produção)
- Documentação e checklist para onboarding rápido

## 8. Visão de Futuro
- Integração com WhatsApp (atendimento, status, pedidos)
- Marketplace e venda direta (Olist, Shopify, Mercado Livre)
- App mobile para produção e logística
- Inteligência artificial para previsão de demanda e sugestões de compras
- Multi-tenant para franquias e expansão
- Gamificação para equipe (produção, vendas e metas)
- Backup automático e histórico de alterações
