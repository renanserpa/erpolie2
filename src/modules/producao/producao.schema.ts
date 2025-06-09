import * as z from 'zod';

export const ordemProducaoSchema = z.object({
  order_id: z.string().uuid({ message: 'Pedido inválido.' }),
  priority_id: z.string().uuid({ message: 'Prioridade inválida.' }).optional(),
  estimated_start_date: z.date().optional(),
  estimated_end_date: z.date().optional(),
  notes: z.string().optional(),
});

export type OrdemProducaoFormValues = z.infer<typeof ordemProducaoSchema>;
