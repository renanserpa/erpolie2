import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
  getSupplierById,
} from '@/lib/data-hooks';
import type { FornecedorFormValues } from './fornecedores.schema';

export async function fetchFornecedores(params?: Record<string, unknown>) {
  return getSuppliers(params || {});
}

export async function fetchFornecedorById(id: string) {
  return getSupplierById(id);
}

export async function createFornecedor(data: FornecedorFormValues) {
  return createSupplier(data);
}

export async function updateFornecedor(id: string, data: FornecedorFormValues) {
  return updateSupplier(id, data);
}

export async function deleteFornecedor(id: string) {
  return deleteSupplier(id);
}
