import type { Database } from '@/types/supabase';

export type OrdemDeProducao = Database['public']['Tables']['production_orders']['Row'] & {
  order?: {
    id: string;
    order_number: string;
    client?: { id: string; name: string } | null;
  } | null;
  status?: { id: string; name: string } | null;
  priority?: { id: string; name: string } | null;
};

export type EtapaDeProducao = Database['public']['Tables']['production_stages']['Row'];

export interface ResponsavelOP {
  user_id: string;
  stage_id: string;
  start_date: string;
  end_date?: string | null;
  user?: { id: string; name: string | null } | null;
}
