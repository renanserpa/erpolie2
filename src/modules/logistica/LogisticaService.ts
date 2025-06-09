import { createClient } from '@/lib/supabase/client';
import { createRecord, updateRecord, deleteRecord, handleSupabaseError } from "@/lib/data-hooks";
import type { EntregaFormValues, RotaFormValues } from './logistica.schema';
import type { Entrega, Rota } from './logistica.types';

export async function fetchEntregas(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('deliveries')
      .select(
        '*, order:order_id(id, order_number, client:client_id(id, name)), route:route_id(id, route_name), status:status_id(id, name, color)'
      )
      .order('created_at', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder;
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: Entrega[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchEntregaById(id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('deliveries')
      .select(
        '*, order:order_id(id, order_number, client:client_id(id, name)), route:route_id(id, route_name), status:status_id(id, name, color)'
      )
      .eq('id', id)
      .single();
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: Entrega };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchRotas(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('delivery_routes')
      .select('*, driver:driver_id(id, full_name)')
      .order('route_date', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder;
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: Rota[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function createEntrega(values: EntregaFormValues) {
  return createRecord<Entrega>('deliveries', values);
}

export async function updateEntrega(id: string, values: EntregaFormValues) {
  return updateRecord<Entrega>('deliveries', id, values);
}

export async function deleteEntrega(id: string) {
  return deleteRecord('deliveries', id);
}

export async function createRota(values: RotaFormValues) {
  return createRecord<Rota>('delivery_routes', values);
}

export async function updateRota(id: string, values: RotaFormValues) {
  return updateRecord<Rota>('delivery_routes', id, values);
}

export async function deleteRota(id: string) {
  return deleteRecord('delivery_routes', id);
}
