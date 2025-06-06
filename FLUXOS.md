# FLUXOS.md — Olie ERP

Este documento descreve os fluxos de trabalho essenciais do Olie ERP, garantindo rastreabilidade, automação e controle total das operações.

## 1. Fluxo do Pedido à Entrega
### 1.1 Criação do Pedido
- Cliente solicita o pedido (WhatsApp, site ou presencial)
- Registro do pedido com cliente, itens, datas e responsável
- Status inicial: **Pendente**

### 1.2 Geração da Ordem de Produção
- Sistema cria automaticamente a OP vinculada ao pedido
- Detalhamento de produtos, responsáveis e etapas
- Status inicial da OP: **Aguardando Materiais**

### 1.3 Reserva de Insumos no Estoque
- Verificação de disponibilidade
- Reserva ou sugestão de compra automática se faltar material
- Atualização do status do pedido para **Em Produção**

### 1.4 Execução das Etapas de Produção
- Avanço das etapas em painel Kanban: Corte → Costura → Personalização → Acabamento
- Atribuição de responsáveis e rastreio de tempo
- Alertas em caso de atraso ou parada

### 1.5 Finalização e Baixa de Estoque
- Produto finalizado e insumos baixados automaticamente
- OP e pedido atualizados
- Produto embalado e pronto para envio

### 1.6 Entrega e Fechamento
- Logística prepara a entrega e gera etiqueta de rastreio
- Cliente é notificado e o pedido marcado como **Entregue**
- Pendências financeiras são sinalizadas

## 2. Fluxo de Compras e Estoque
### 2.1 Detecção de Estoque Mínimo
- Monitoramento automático do saldo de cada insumo
- Geração de sugestão de compra e alerta para a equipe

### 2.2 Geração de Pedido de Compra
- Seleção de fornecedores e definição de quantidades e prazos
- Status inicial: **Solicitado**

### 2.3 Aprovação e Envio para Fornecedor
- Revisão e aprovação do pedido
- Envio ao fornecedor

### 2.4 Recebimento e Conferência
- Registro de quantidades recebidas e atualização de estoque
- Status do pedido de compra: **Entregue** e gatilho financeiro

## 3. Fluxo de Produção
- OPs criadas a partir dos pedidos ou manualmente
- Etapas: Preparo, Corte, Costura, Personalização, Acabamento, Embalagem
- Kanban com responsáveis, datas e insumos consumidos
- Finalização gera baixa de estoque e atualização do pedido

## 4. Fluxo Financeiro
- Vendas geram receitas e compras geram contas a pagar
- Status: **Em aberto**, **Pago** ou **Atrasado**
- Dashboards de fluxo de caixa e integração futura com Pix/boleto

## 5. Fluxo de Logística
- Cadastro de entregas, rotas e motoristas
- Relação entre pedidos prontos e entregas
- Atualização automática de status com código de rastreio

## 6. Fluxo de RH
- Cadastro de colaboradores e controle de ponto
- Registro de férias, licenças e produtividade por etapa

## 7. Fluxo de BI e Notificações
- KPIs e dashboards por setor
- Alertas automáticos de estoque baixo, atrasos e pedidos parados

## 8. Fluxos de Personalização e Produtos Compostos
- Produtos podem ter múltiplos componentes e insumos
- Vínculo automático Produto → Componentes → Insumos
- Rastreio de insumos por pedido para controle de custo

## 9. Kanban em Telas-Chave
- Pedidos, Produção, Compras e Entregas sempre em painel Kanban
- Cards com filtros e busca para identificar gargalos

**Mantenha este documento atualizado sempre que novos fluxos forem implementados.**
