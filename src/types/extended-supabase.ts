import type { Database } from './supabase';
import type { Json } from './supabase';

export interface BIDashboardRow {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  periodo: string;
  configuracao: Json | null;
  created_at: string;
  updated_at: string;
}

export type ExtendedDatabase = Database & {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      bi_dashboards: {
        Row: BIDashboardRow;
        Insert: Partial<Omit<BIDashboardRow, 'id' | 'created_at' | 'updated_at'>> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<BIDashboardRow>;
        Relationships: [];
      };
    };
  };
};
