import * as z from 'zod';

export const clienteSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }).optional().nullable(),
  phone: z.string().optional().nullable(),
  document: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;
