import {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecords,
  getRecordById,
} from '@/lib/data-hooks';
import type { ProdutoFormValues } from './produtos.schema';
import type { Produto } from './produtos.types';

export async function fetchProdutos(query: Record<string, unknown> = {}) {
  return getRecords<Produto>('products', query);
}

export async function fetchProdutoById(id: string) {
  return getRecordById<Produto>('products', id);
}

export async function createProduto(data: ProdutoFormValues) {
  return createRecord<Produto>('products', data);
}

export async function updateProduto(id: string, data: ProdutoFormValues) {
  return updateRecord<Produto>('products', id, data);
}

export async function deleteProduto(id: string) {
  return deleteRecord('products', id);
}
