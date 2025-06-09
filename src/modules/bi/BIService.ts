import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError } from '@/lib/data-hooks';
import type { PedidoStatusData } from './BIPedidosPorStatus';
import type { ProducaoEtapaData } from './BIProducaoEtapas';

export async function fetchPedidosPorStatus() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('bi_pedidos_por_status');
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: PedidoStatusData[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchProducaoPorEtapa() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('bi_producao_por_etapa');
    if (error) return handleSupabaseError(error);
    return { success: true, data } as { success: true; data: ProducaoEtapaData[] };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchResumoFinanceiro() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('bi_resumo_financeiro');
    if (error) return handleSupabaseError(error);
    return { success: true, data: data as {receitas: number; despesas: number; saldo: number} };
  } catch (error) {
    return handleSupabaseError(error);
  }
}
