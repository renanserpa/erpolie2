import * as z from 'zod';

export const lancamentoSchema = z.object({
  transaction_date: z.date({ required_error: 'Data é obrigatória' }),
  amount: z.number({ required_error: 'Valor é obrigatório' }).positive(),
  description: z.string().min(3, 'Descrição obrigatória'),
  category_id: z.string().uuid({ message: 'Categoria inválida' }),
  payment_method_id: z.string().uuid({ message: 'Forma de pagamento inválida' }),
  reference_type: z.enum(['order', 'purchase', 'other']).optional(),
  reference_id: z.string().uuid().optional(),
  status_id: z.string().uuid({ message: 'Status inválido' }),
  type_id: z.string().uuid({ message: 'Tipo inválido' })
});

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;
