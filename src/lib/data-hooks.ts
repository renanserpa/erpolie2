"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Tipagem comum para retorno de dados
interface SupabaseResult<T> {
  success: boolean;
  data?: T[];
  error?: string;
}

// Hook para buscar dados genéricos com ordenação por campo
export function useSupabaseData<T>(table: string, orderBy: string): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setData(data as T[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [table, orderBy]);

  return { data, loading, error };
}

// Função para buscar insumos com filtros opcionais
export async function getSupplies(filters: Record<string, unknown> = {}): Promise<SupabaseResult<any>> {
  const supabase = createClient();
  let query = supabase
    .from("stock_items")
    .select(
      `
      *,
      supplier:supplier_id ( id, name ),
      unit_of_measurement:unit_of_measurement_id ( id, name, symbol )
    `
    );

  // Aplicar filtros se houver
  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "string" && value.startsWith("ilike.")) {
      query = query.ilike(key, value.replace("ilike.", ""));
    } else {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar insumos:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as any[] };
}
