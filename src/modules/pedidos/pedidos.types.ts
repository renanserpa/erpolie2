import type { Order, ProductionOrder } from '@/types/schema';

export type Pedido = Order;

export interface ItemDoPedido {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: { id: string; name: string };
}

export interface PersonalizacaoDoItem {
  id: string;
  order_item_id: string;
  name: string;
  value: string;
}

export type OrdemProducao = ProductionOrder;
