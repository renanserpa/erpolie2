# Módulo de Compras

Campos principais dos pedidos de compra:
- id
- purchase_order_number
- supplier_id
- status_id
- order_date
- expected_delivery_date
- total_amount
- notes
- created_at
- updated_at

Fluxo básico: geração de pedidos por demanda ou estoque mínimo, associação de fornecedores e insumos, controle de status e recebimento. Ao receber os itens o estoque é atualizado e uma despesa é lançada no módulo financeiro.
