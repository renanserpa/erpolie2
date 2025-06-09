import * as z from 'zod';

export const compraItemSchema = z.object({
  stock_item_id: z.string().uuid({ message: 'Selecione um insumo válido.' }),
  quantity: z.number().min(1, { message: 'Quantidade deve ser maior que 0.' }),
  unit_price: z.number().nonnegative({ message: 'Preço unitário inválido.' })
});

export const pedidoCompraSchema = z.object({
  supplier_id: z.string().uuid({ message: 'Selecione um fornecedor válido.' }),
  status_id: z.string().uuid({ message: 'Selecione o status.' }),
  order_date: z.date(),
  expected_delivery_date: z.date().optional(),
  notes: z.string().optional(),
  items: z.array(compraItemSchema).min(1)
});

export type PedidoCompraFormValues = z.infer<typeof pedidoCompraSchema>;
