import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, createRecord } from '@/lib/data-hooks';
import type { PedidoCompraFormValues } from './compras.schema';
import type { PedidoDeCompra } from './compras.types';

export async function fetchPurchaseOrders(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('purchase_orders')
      .select('*, supplier:supplier_id(id,name), status:status_id(id,name,color)')
      .order('created_at', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder;
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: PedidoDeCompra[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchPurchaseOrderById(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*, supplier:supplier_id(id,name), status:status_id(id,name,color), items:purchase_order_items(*)')
      .eq('id', id)
      .single();
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: PedidoDeCompra };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function createPurchaseOrder(values: PedidoCompraFormValues) {
  try {
    const supabase = createClient();
    const total = values.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
    const { data: order, error } = await supabase
      .from('purchase_orders')
      .insert({
        supplier_id: values.supplier_id,
        order_date: values.order_date.toISOString(),
        expected_delivery_date: values.expected_delivery_date?.toISOString() || null,
        status_id: values.status_id,
        total_amount: total,
        notes: values.notes || null
      })
      .select('id')
      .single();
    if (error || !order) return handleSupabaseError(error);

    const items = values.items.map(i => ({
      purchase_order_id: order.id,
      material_id: i.stock_item_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.quantity * i.unit_price
    }));
    const { error: itemsError } = await supabase.from('purchase_order_items').insert(items);
    if (itemsError) return handleSupabaseError(itemsError);

    return { success: true, data: { id: order.id } };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function updatePurchaseOrder(id: string, values: PedidoCompraFormValues) {
  try {
    const supabase = createClient();
    const total = values.items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
    const { error } = await supabase
      .from('purchase_orders')
      .update({
        supplier_id: values.supplier_id,
        order_date: values.order_date.toISOString(),
        expected_delivery_date: values.expected_delivery_date?.toISOString() || null,
        status_id: values.status_id,
        total_amount: total,
        notes: values.notes || null
      })
      .eq('id', id);
    if (error) return handleSupabaseError(error);

    await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id);
    const items = values.items.map(i => ({
      purchase_order_id: id,
      material_id: i.stock_item_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.quantity * i.unit_price
    }));
    const { error: itemsError } = await supabase.from('purchase_order_items').insert(items);
    if (itemsError) return handleSupabaseError(itemsError);

    return { success: true };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function receivePurchaseItems(orderId: string, receipts: { item_id: string; quantity: number }[]) {
  try {
    const supabase = createClient();
    for (const rec of receipts) {
      const { data: poItem, error } = await supabase
        .from('purchase_order_items')
        .select('received_quantity, material_id, unit_price')
        .eq('id', rec.item_id)
        .single();
      if (error || !poItem) throw error;

      const newReceived = (poItem.received_quantity || 0) + rec.quantity;
      await supabase
        .from('purchase_order_items')
        .update({ received_quantity: newReceived, total_price: newReceived * poItem.unit_price })
        .eq('id', rec.item_id);

      const { data: stockItem } = await supabase
        .from('stock_items')
        .select('quantity')
        .eq('id', poItem.material_id)
        .single();
      const newQty = (stockItem?.quantity || 0) + rec.quantity;
      await supabase.from('stock_items').update({ quantity: newQty }).eq('id', poItem.material_id);

      await createRecord('stock_movements', {
        stock_item_id: poItem.material_id,
        quantity: rec.quantity,
        movement_type: 'entrada',
        reference_id: orderId,
        reference_type: 'purchase_order'
      });

      await createRecord('financial_transactions', {
        date: new Date().toISOString(),
        amount: rec.quantity * poItem.unit_price,
        type: 'expense',
        description: 'Recebimento pedido de compra',
        reference_id: orderId,
        reference_type: 'purchase_order'
      });
    }
    return { success: true };
  } catch (error) {
    return handleSupabaseError(error);
  }
}
