import * as z from 'zod';

export const componenteSchema = z.object({
  component_id: z.string().min(1),
  quantity: z.number().positive()
});

export const opcaoValorSchema = z.object({
  value: z.string().min(1)
});

export const opcaoPersonalizacaoSchema = z.object({
  name: z.string().min(1),
  values: z.array(opcaoValorSchema)
});

export const produtoSchema = z.object({
  name: z.string().min(2, { message: 'Nome do produto deve ter pelo menos 2 caracteres.' }),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  cost: z.number().nonnegative().optional().nullable(),
  stock_quantity: z.number().int().nonnegative().optional().nullable(),
  is_active: z.boolean().default(true),
  components: z.array(componenteSchema).optional(),
  personalizacao: z.array(opcaoPersonalizacaoSchema).optional(),
});

export type ProdutoFormValues = z.infer<typeof produtoSchema>;
