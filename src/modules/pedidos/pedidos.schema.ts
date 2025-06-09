import * as z from 'zod';

export const itemPedidoSchema = z.object({
  product_id: z.string().uuid({ message: 'Selecione um produto válido.' }),
  quantity: z.number().min(1, { message: 'Quantidade deve ser pelo menos 1.' }),
  unit_price: z.number().nonnegative({ message: 'Preço unitário não pode ser negativo.' }),
});

export const pedidoSchema = z.object({
  customer_id: z.string().uuid({ message: 'Selecione um cliente válido.' }),
  date: z.date({ required_error: 'A data do pedido é obrigatória.' }),
  status_id: z.string().uuid({ message: 'Selecione um status válido.' }),
  channel_id: z.string().uuid({ message: 'Selecione um canal de venda válido.' }).optional(),
  order_items: z.array(itemPedidoSchema).min(1, { message: 'O pedido deve ter pelo menos um item.' }),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;
