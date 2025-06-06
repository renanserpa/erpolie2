# MODULOS.md

## Visao Geral
Este documento lista e descreve todos os modulos principais do Olie ERP. Cada modulo possui seu proprio arquivo detalhado com campos, fluxos, APIs e wireframes (ver pasta `/MODULOS`).

---
## 1. CLIENTES
- **Descricao**: Cadastro completo de clientes PF/PJ, com campos obrigatorios e opcionais, historico de pedidos, contatos e segmentacao.
- **Funcionalidades**:
  - Cadastro/edicao de clientes (nome, CPF/CNPJ, endereco, contatos, indicado por, segmento, status)
  - Importacao/exportacao CSV
  - Historico de pedidos
  - Filtros avancados e busca
- **Fluxos Relacionados**:
  - Cadastro de novo cliente
  - Visualizacao do historico de pedidos

---
## 2. FORNECEDORES
- **Descricao**: Cadastro de fornecedores, relacao de insumos fornecidos, avaliacao e historico de compras.
- **Funcionalidades**:
  - Cadastro/edicao (razao social, fantasia, CNPJ, contatos, avaliacao, historico de compras)
  - Importacao/exportacao CSV
  - Associacao de insumos por fornecedor
  - Filtros por status, cidade, categoria
- **Fluxos Relacionados**:
  - Cadastro de novo fornecedor
  - Geracao de ordem de compra

---
## 3. ESTOQUE
- **Descricao**: Controle de insumos e produtos acabados, movimentacoes, inventario, saldo minimo e rastreio por lote.
- **Funcionalidades**:
  - Cadastro de insumos/materiais
  - Movimentacao (entrada, saida, ajuste, inventario)
  - Alertas automaticos de estoque minimo
  - Relacionamento com producao, pedidos e compras
  - Multi-localizacao
- **Fluxos Relacionados**:
  - Entrada e baixa automatica via ordem de producao
  - Inventario e ajustes manuais

---
## 4. PRODUTOS
- **Descricao**: Cadastro de produtos, variacoes, componentes e personalizacoes (bordado, hotstamping, cor, tecido, ziper etc.).
- **Funcionalidades**:
  - Cadastro/edicao de produtos e variacoes
  - Definicao de componentes, insumos e opcoes de personalizacao
  - Estoque minimo por produto
  - Relacao produto ↔ insumo
- **Fluxos Relacionados**:
  - Criacao de novo produto com componentes
  - Atualizacao de catalogo

---
## 5. PEDIDOS
- **Descricao**: Gestao de pedidos de venda com multiplos itens e personalizacoes. Status Kanban (rascunho, producao, pronto, enviado).
- **Funcionalidades**:
  - Cadastro/edicao de pedidos
  - Status visual em Kanban
  - Detalhamento por item (variacoes e personalizacao)
  - Geracao automatica de ordem de producao
  - Impressao de etiquetas
- **Fluxos Relacionados**:
  - Criacao de pedido com multiplos itens
  - Transicao de status do pedido

---
## 6. COMPRAS
- **Descricao**: Solicitacao e controle de ordens de compra, recebimento parcial/total e atualizacao automatica de estoque.
- **Funcionalidades**:
  - Criacao/edicao de ordens de compra
  - Recebimento de materiais e conferencia
  - Relacao pedido de compra ↔ fornecedor
  - Historico de compras por fornecedor
- **Fluxos Relacionados**:
  - Pedido de compra automatico por estoque minimo
  - Entrada no estoque via recebimento

---
## 7. PRODUCAO
- **Descricao**: Painel Kanban de ordens de producao com etapas personalizaveis (preparo, corte, costura, acabamento). Historico de execucao e priorizacao automatica.
- **Funcionalidades**:
  - Criacao/edicao de ordens de producao
  - Status por etapa em Kanban
  - Atribuicao de responsaveis e prazos
  - Historico de tempo e materiais usados
  - Relacionamento com pedidos e estoque
- **Fluxos Relacionados**:
  - Geracao automatica da ordem via pedido
  - Reserva e baixa de insumos conforme etapa

---
## 8. FINANCEIRO
- **Descricao**: Controle de receitas, despesas, centro de custo e integracao com pedidos, compras e caixa.
- **Funcionalidades**:
  - Lancamento financeiro (receita/despesa)
  - Vinculo com pedidos e compras
  - Controle de contas a pagar e receber
  - Dashboard de fluxo de caixa
- **Fluxos Relacionados**:
  - Lancamento de receita e baixa automatica na venda
  - Controle de pagamento/recebimento

---
## 9. LOGISTICA
- **Descricao**: Gestao de entregas, rotas e status de envio com painel Kanban.
- **Funcionalidades**:
  - Cadastro de rotas e transportadoras
  - Status de entregas em Kanban
  - Impressao de etiquetas e rastreamento
  - Filtros por status e rota
- **Fluxos Relacionados**:
  - Atualizacao de status de entrega
  - Geracao de etiqueta automatica

---
## 10. RH
- **Descricao**: Cadastro de colaboradores, gestao de cargos, ponto, ferias e historico funcional.
- **Funcionalidades**:
  - Cadastro de funcionarios, cargos e setores
  - Controle de ponto e justificativas
  - Gestao de ferias e licencas
  - Relacionamento com producao
- **Fluxos Relacionados**:
  - Apontamento de producao por colaborador
  - Ferias e movimentacao de pessoal

---
## 11. ADMINISTRACAO / CONFIGURACOES
- **Descricao**: Permissoes de usuario, logs e parametros globais, com integracoes futuras.
- **Funcionalidades**:
  - Gestao de usuarios e permissoes
  - Parametros globais do sistema
  - Logs e auditoria
  - Integracoes e webhooks
- **Fluxos Relacionados**:
  - Atualizacao de parametros do sistema
  - Controle e revisao de logs

---
## 12. BUSINESS INTELLIGENCE (BI)
- **Descricao**: Paineis de indicadores e relatorios analiticos por area.
- **Funcionalidades**:
  - Dashboard interativo e filtros avancados
  - Graficos por modulo e setor
  - Relatorios e exportacao
- **Fluxos Relacionados**:
  - Visualizacao e analise de KPIs
  - Exportacao para tomada de decisao

---
## 13. UNIVERSIDADE / ONBOARDING
- **Descricao**: Trilhas de treinamento, controle de progresso e certificacao interna.
- **Funcionalidades**:
  - Cadastro de trilhas e modulos
  - Controle de progresso
  - Materiais de apoio (PDF, video, quiz)
  - Certificacao para funcoes criticas
- **Fluxos Relacionados**:
  - Onboarding de novo colaborador
  - Validacao de treinamento obrigatorio

---
**Para detalhamento completo de cada modulo, consulte os arquivos especificos na pasta `/MODULOS`.**
