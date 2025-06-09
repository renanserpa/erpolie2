import * as z from 'zod';

export const colaboradorSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  role: z.string().optional(),
  employment_type_id: z.string().uuid().optional(),
  hire_date: z.string().optional(),
  status: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type ColaboradorFormValues = z.infer<typeof colaboradorSchema>;
