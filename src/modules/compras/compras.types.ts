import type { Supplier, StockItem, GlobalStatus } from '@/types/schema';

export interface ItemDeCompra {
  id: string;
  purchase_order_id: string;
  stock_item_id: string;
  quantity: number;
  unit_price: number;
  received_quantity?: number | null;
  total_price?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  stock_item?: Pick<StockItem, 'id' | 'name' | 'quantity'>;
}

export interface PedidoDeCompra {
  id: string;
  supplier_id: string;
  status_id: string;
  order_date: string;
  expected_delivery_date?: string | null;
  total_amount: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Pick<Supplier, 'id' | 'name'>;
  status?: Pick<GlobalStatus, 'id' | 'name' | 'color'>;
  items?: ItemDeCompra[];
}

export interface Recebimento {
  order_id: string;
  item_id: string;
  quantity: number;
  date: string;
}
