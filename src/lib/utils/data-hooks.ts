"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// GENÉRICO – USADO PARA CONSULTAR DADOS EM TEMPO REAL COM SUPABASE
export function useSupabaseData<T>(table: string, orderBy: string = "created_at") {
  const supabase = createClient();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending: true });

      if (error) {
        setError(error.message);
        toast.error(`Erro ao carregar dados de ${table}`);
      } else {
        setData(data as T[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [supabase, table, orderBy]);

  return { data, loading, error };
}

// CONSULTA COM FILTROS AVANÇADOS PARA INSUMOS
export async function getSupplies(filters: Record<string, unknown>) {
  const supabase = createClient();

  try {
    let query = supabase
      .from("stock_items")
      .select(
        `
        *,
        supplier:supplier_id (id, name),
        unit_of_measurement:unit_of_measurement_id (id, name, symbol)
      `
      )
      .order("created_at", { ascending: false });

    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "") {
        if (key === "low_stock" && value === true) {
          query = query.lt("quantity", "min_quantity");
        } else if (typeof value === "string" && value.startsWith("ilike.")) {
          query = query.ilike(key, value.replace("ilike.", ""));
        } else {
          query = query.eq(key, value);
        }
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro na consulta:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: unknown) {
    console.error("Erro inesperado:", err);
    return { success: false, error: err };
  }
}
