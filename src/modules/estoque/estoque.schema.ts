import * as z from 'zod';

export const insumoFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  group_id: z.string().optional().nullable(),
  location_id: z.string().optional().nullable(),
  unit_of_measure: z.string().default('un'),
  quantity: z.number().default(0),
  min_quantity: z.number().default(0),
  cost_price: z.number().optional().nullable(),
  is_active: z.boolean().default(true),
});
export type InsumoFormValues = z.infer<typeof insumoFormSchema>;

export const movementFormSchema = z.object({
  stock_item_id: z.string().min(1, { message: 'Item de estoque é obrigatório.' }),
  quantity: z.number().nonzero({ message: 'Quantidade deve ser diferente de zero.' }),
  movement_type: z.enum(['entrada', 'saida', 'ajuste', 'transferencia'], {
    required_error: 'Tipo de movimentação é obrigatório.',
  }),
  source_location_id: z.string().optional(),
  destination_location_id: z.string().optional(),
  reference_document: z.string().optional(),
  notes: z.string().optional(),
});
export type MovementFormValues = z.infer<typeof movementFormSchema>;
