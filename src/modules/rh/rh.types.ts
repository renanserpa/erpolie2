import type { Database } from '@/types/supabase';

export type Colaborador = Database['public']['Tables']['employees']['Row'] & {
  user?: { id: string; email: string } | null;
};

export type Cargo = {
  id: string;
  title: string;
  department_id: string | null;
  level: number | null;
  is_management: boolean | null;
};

export type Vinculo = Database['public']['Tables']['employment_types']['Row'];

export type HistoricoProducao = Database['public']['Tables']['production_stage_history']['Row'] & {
  stage?: { id: string; name: string } | null;
  order?: { id: string; production_order_number: string } | null;
};

export type PermissaoModulo = Database['public']['Tables']['user_permissions']['Row'] & {
  module?: { id: string; name: string; code: string } | null;
  role?: { id: string; name: string } | null;
};
