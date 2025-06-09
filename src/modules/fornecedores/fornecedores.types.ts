import type { Supplier } from '@/types/schema';

export type Fornecedor = Supplier;

export interface ContatoFornecedor {
  id: string;
  supplier_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
}

export interface ProdutoFornecido {
  id: string;
  supplier_id: string;
  product_id: string;
  price: number;
  created_at: string;
}
