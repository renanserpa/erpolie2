# Módulo de Logística

Controle completo das entregas de produtos, desde o despacho até a confirmação de entrega. Integra os pedidos e o histórico financeiro, permitindo rastreamento e atualização de status.

## Campos principais das entregas
- id
- order_id
- route_id
- driver_id
- transporter_id
- tracking_code
- delivery_date
- status_id
- created_at
- updated_at

## Campos principais das rotas
- id
- route_name
- driver_id
- route_date
- notes

Fluxo básico: cadastrar entrega vinculando ao pedido e definir responsável, transportadora e rota. O status evolui de `Separando` para `Enviado`, `Entregue`, `Atrasado` ou `Cancelado`. O módulo gera etiquetas de envio com QR code e permite notificar o cliente sobre o despacho e mudança de status.
