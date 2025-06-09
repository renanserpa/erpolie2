import { createRecord, updateRecord, deleteRecord, getClients, getRecordById } from '@/lib/data-hooks';
import type { ClienteFormValues } from './clientes.schema';

export async function fetchClientes(params?: Record<string, unknown>) {
  return getClients(params);
}

export async function fetchClienteById(id: string) {
  return getRecordById('clients', id);
}

export async function createCliente(data: ClienteFormValues) {
  return createRecord('clients', data);
}

export async function updateCliente(id: string, data: ClienteFormValues) {
  return updateRecord('clients', id, data);
}

export async function deleteCliente(id: string) {
  return deleteRecord('clients', id);
}
