import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError } from '@/lib/data-hooks';
import type { EtapaDeProducao, OrdemDeProducao } from './producao.types';

export async function fetchOrdensProducao(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('production_orders')
      .select(
        '*, order:order_id(id, order_number, client:client_id(id, name)), status:status_id(id, name), priority:priority_id(id, name)'
      )
      .order('created_at', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder.returns<OrdemDeProducao[]>();
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: OrdemDeProducao[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchEtapasProducao() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('production_stages')
      .select('*')
      .order('order')
      .returns<EtapaDeProducao[]>();
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: EtapaDeProducao[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}
