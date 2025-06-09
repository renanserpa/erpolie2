import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError } from '@/lib/data-hooks';
import type { PedidoFormValues } from './pedidos.schema';
import type { Pedido } from './pedidos.types';

export async function fetchPedidos(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('orders')
      .select('*, client:client_id(id, name), status:status_id(id, name)')
      .order('created_at', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder;
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: Pedido[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchPedidoById(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, client:client_id(id, name), status:status_id(id, name), order_items(*, product:product_id(id, name))')
      .eq('id', id)
      .single();
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: Pedido };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function createPedido(values: PedidoFormValues) {
  try {
    const supabase = createClient();
    const total = values.order_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        client_id: values.customer_id,
        date: values.date.toISOString(),
        status_id: values.status_id,
        channel_id: values.channel_id || null,
        total_amount: total,
        production_order_requested: true,
      })
      .select('id')
      .single();
    if (error || !order) return handleSupabaseError(error);

    const items = values.order_items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.unit_price,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) return handleSupabaseError(itemsError);

    // Cria OP vinculada
    await supabase
      .from('production_orders')
      .insert({ order_id: order.id, status_id: values.status_id });

    return { success: true, data: { id: order.id } };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function updatePedido(id: string, values: PedidoFormValues) {
  try {
    const supabase = createClient();
    const total = values.order_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const { error } = await supabase
      .from('orders')
      .update({
        client_id: values.customer_id,
        date: values.date.toISOString(),
        status_id: values.status_id,
        channel_id: values.channel_id || null,
        total_amount: total,
      })
      .eq('id', id);
    if (error) return handleSupabaseError(error);

    await supabase.from('order_items').delete().eq('order_id', id);
    const items = values.order_items.map((i) => ({
      order_id: id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.unit_price,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) return handleSupabaseError(itemsError);

    return { success: true };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function deletePedido(id: string) {
  try {
    const supabase = createClient();
    await supabase.from('order_items').delete().eq('order_id', id);
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) return handleSupabaseError(error);
    return { success: true };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchOrderStatuses() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('global_statuses')
      .select('id, name, color')
      .eq('type', 'order')
      .order('name');
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: { id: string; name: string; color?: string | null }[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}
