# Módulo de Business Intelligence (BI)

Painéis e relatórios interativos para análise de desempenho dos setores.

Campos principais utilizados nas consultas:
- orders.status_id
- production_orders.status_id
- financial_transactions.amount
- stock_items.quantity
- deliveries.status_id

Fluxo básico: consolidação de indicadores em consultas RPC, exibição em gráficos
com filtros por período e possibilidade de drill-down para detalhes. Os dados
podem ser exportados em CSV ou PDF a partir dos painéis.
