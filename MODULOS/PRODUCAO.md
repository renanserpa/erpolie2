# Módulo de Produção

Campos principais das Ordens de Produção:
- id
- production_order_number
- order_id
- priority_id
- status_id
- current_stage_id
- estimated_start_date
- estimated_end_date
- actual_start_date
- actual_end_date
- notes
- created_at
- updated_at

Fluxo básico: OP gerada a partir do pedido, execução em etapas (preparo, corte, costura, personalização, acabamento, finalização) com registro de responsável, tempo e materiais consumidos. Baixa automática do estoque ao concluir a etapa e histórico completo de movimentações.
