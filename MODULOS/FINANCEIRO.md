# Módulo Financeiro

Controle de receitas e despesas com integração a pedidos e compras. Permite acompanhar o status de cada lançamento e gerar relatórios de fluxo de caixa.

Campos principais dos lançamentos:
- id
- transaction_date
- amount
- description
- type_id (receita ou despesa)
- category_id
- payment_method_id
- status_id
- reference_type (order|purchase|other)
- reference_id
- created_at
- updated_at

Fluxo básico: ao registrar um pedido ou compra, é criado automaticamente um lançamento financeiro. Os lançamentos podem ser filtrados por status, categoria e período, auxiliando na conciliação bancária e geração de relatórios.
