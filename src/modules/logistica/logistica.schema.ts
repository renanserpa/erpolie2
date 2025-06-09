import * as z from 'zod';

export const entregaSchema = z.object({
  order_id: z.string().uuid({ message: 'Selecione um pedido válido.' }),
  route_id: z.string().uuid({ message: 'Selecione uma rota válida.' }).optional().nullable(),
  driver_id: z.string().uuid({ message: 'Selecione o responsável.' }).optional().nullable(),
  transporter_id: z.string().uuid({ message: 'Selecione a transportadora.' }).optional().nullable(),
  tracking_code: z.string().optional(),
  delivery_date: z.date({ required_error: 'Informe a data prevista.' }),
  status_id: z.string().uuid({ message: 'Selecione o status.' }),
});

export type EntregaFormValues = z.infer<typeof entregaSchema>;

export const rotaSchema = z.object({
  route_name: z.string().min(3, { message: 'Nome da rota é obrigatório.' }),
  driver_id: z.string().uuid({ message: 'Selecione o motorista.' }).optional().nullable(),
  route_date: z.date({ required_error: 'Data da rota é obrigatória.' }),
  notes: z.string().optional(),
});

export type RotaFormValues = z.infer<typeof rotaSchema>;
