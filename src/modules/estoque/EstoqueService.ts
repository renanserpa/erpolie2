import { getStockItems, getSupplies, getRecordById, createRecord, updateRecord, deleteRecord, getRecords } from '@/lib/data-hooks';
import type { Insumo, MovimentacaoEstoque } from './estoque.types';

export async function fetchStockItems(query: Record<string, unknown> = {}) {
  return getStockItems(query);
}

export async function fetchInsumos(query: Record<string, unknown> = {}) {
  return getSupplies(query);
}

export async function fetchMovimentacoes(query: Record<string, unknown> = {}) {
  return getRecords<MovimentacaoEstoque>('stock_movements_view', query);
}

export async function fetchInsumoById(id: string) {
  return getRecordById<Insumo>('stock_items', id);
}

export async function createInsumo(data: Partial<Insumo>) {
  return createRecord<Insumo>('stock_items', data);
}

export async function updateInsumo(id: string, data: Partial<Insumo>) {
  return updateRecord<Insumo>('stock_items', id, data);
}

export async function deleteInsumo(id: string) {
  return deleteRecord('stock_items', id);
}
