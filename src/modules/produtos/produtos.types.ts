import type { Product } from '@/types/schema';

export type Produto = Product;

export interface Componente {
  component_product_id: string;
  quantity: number;
  component?: {
    id: string;
    name: string;
    sku?: string | null;
  };
}

export interface OpcaoDePersonalizacao {
  id?: string;
  name: string;
  values: string[];
}

export interface Categoria {
  id: string;
  name: string;
  description?: string | null;
  parent_category_id?: string | null;
  parent_category_name?: string | null;
}

export interface GrupoDeProdutos {
  id: string;
  name: string;
}
