import type { FinancialTransaction, FinancialCategory, PaymentMethod, GlobalStatus } from '@/types/schema';

export interface LancamentoFinanceiro extends FinancialTransaction {
  category?: Pick<FinancialCategory, 'id' | 'name'> | null;
  payment_method?: Pick<PaymentMethod, 'id' | 'name'> | null;
  status?: Pick<GlobalStatus, 'id' | 'name' | 'color'> | null;
}

export interface Conta {
  id: string;
  name: string;
  bank?: string | null;
  number?: string | null;
  balance: number;
}

export type Categoria = FinancialCategory;
export type FormaDePagamento = PaymentMethod;
