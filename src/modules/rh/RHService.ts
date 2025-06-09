import { createRecord, updateRecord, deleteRecord, getRecords, getRecordById } from '@/lib/data-hooks';
import { createClient } from '@/lib/supabase/client';
import type { Colaborador, HistoricoProducao } from './rh.types';
import type { ColaboradorFormValues } from './rh.schema';

export async function fetchColaboradores(params?: Record<string, unknown>) {
  return getRecords<Colaborador>('employees', params);
}

export async function fetchColaboradorById(id: string) {
  return getRecordById<Colaborador>('employees', id);
}

export async function createColaborador(data: ColaboradorFormValues) {
  return createRecord<Colaborador>('employees', data);
}

export async function updateColaborador(id: string, data: ColaboradorFormValues) {
  return updateRecord<Colaborador>('employees', id, data);
}

export async function deleteColaborador(id: string) {
  return deleteRecord('employees', id);
}

export async function fetchHistoricoProducao(employeeId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('production_stage_history')
    .select('*, stage:stage_id(id,name), order:production_order_id(id,production_order_number)')
    .eq('user_id', employeeId)
    .order('start_date', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: data as HistoricoProducao[] };
}
