export interface Insumo {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  group_id?: string | null;
  location_id?: string | null;
  unit_of_measurement_id?: string | null;
  quantity: number;
  min_quantity?: number | null;
  max_quantity?: number | null;
  cost_price?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  group?: { id: string; name: string } | null;
  location?: { id: string; name: string } | null;
  unit_of_measurement?: { id: string; name: string; symbol: string } | null;
}

export interface MovimentacaoEstoque {
  id: string;
  stock_item_id: string;
  quantity: number;
  movement_type: string;
  source_location_id?: string | null;
  destination_location_id?: string | null;
  reference_document?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  item_name?: string;
  location_from_name?: string | null;
  location_to_name?: string | null;
}

export interface LocalizacaoEstoque {
  id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  is_active?: boolean | null;
  created_at: string;
  updated_at?: string | null;
}

export interface GrupoDeInsumo {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean | null;
  created_at: string;
  updated_at?: string | null;
}
