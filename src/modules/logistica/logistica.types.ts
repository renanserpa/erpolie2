export interface Transportadora {
  id: string;
  name: string;
  contact?: string | null;
}

export interface ResponsavelEntrega {
  id: string;
  name: string;
}

export interface Rota {
  id: string;
  route_name: string;
  route_date: string;
  driver_id?: string | null;
  created_at: string;
  driver?: ResponsavelEntrega | null;
}

export interface Entrega {
  id: string;
  order_id: string;
  route_id?: string | null;
  driver_id?: string | null;
  transporter_id?: string | null;
  tracking_code?: string | null;
  delivery_date?: string | null;
  status_id: string;
  created_at: string;
  updated_at: string;
  order?: {
    id: string;
    order_number?: string | null;
    client?: { id: string; name: string } | null;
  };
  route?: Rota | null;
  status?: { id: string; name: string; color?: string | null } | null;
  driver?: ResponsavelEntrega | null;
  transporter?: Transportadora | null;
}
