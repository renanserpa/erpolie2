import { createClient } from '@/lib/supabase/client';
import { handleSupabaseError, createRecord, updateRecord, deleteRecord } from '@/lib/data-hooks';
import type { LancamentoFormValues } from './financeiro.schema';
import type { LancamentoFinanceiro, Categoria, FormaDePagamento } from './financeiro.types';

export async function fetchLancamentos(query: Record<string, unknown> = {}) {
  try {
    const supabase = createClient();
    let builder = supabase
      .from('financial_transactions')
      .select('*, category:category_id(id,name), payment_method:payment_method_id(id,name), status:status_id(id,name,color)')
      .order('transaction_date', { ascending: false });

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        builder = builder.eq(key, value as string);
      }
    });

    const { data, error } = await builder;
    if (error) return handleSupabaseError(error);
    const safeData = Array.isArray(data) ? (data as LancamentoFinanceiro[]) : [];
    return { success: true, data: safeData };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function createLancamento(data: LancamentoFormValues) {
  return createRecord<LancamentoFinanceiro>('financial_transactions', data);
}

export async function updateLancamento(id: string, data: LancamentoFormValues) {
  return updateRecord<LancamentoFinanceiro>('financial_transactions', id, data);
}

export async function deleteLancamento(id: string) {
  return deleteRecord('financial_transactions', id);
}

export async function fetchCategorias() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('financial_categories')
      .select('id,name')
      .order('name');
    if (error) return handleSupabaseError(error);
    const safeData = Array.isArray(data) ? (data as Categoria[]) : [];
    return { success: true, data: safeData };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export async function fetchFormasPagamento() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('payment_methods')
      .select('id,name')
      .eq('is_active', true)
      .order('name');
    if (error) return handleSupabaseError(error);
    const safeData = Array.isArray(data) ? (data as FormaDePagamento[]) : [];
    return { success: true, data: safeData };
  } catch (error) {
    return handleSupabaseError(error);
  }
}
