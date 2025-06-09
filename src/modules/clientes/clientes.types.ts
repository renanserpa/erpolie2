import type { Client } from '@/types/schema';

export type Cliente = Client;

export interface Contato {
  id: string;
  client_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
}

export interface Segmento {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}
