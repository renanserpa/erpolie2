"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Tipagem comum para retorno de dados
interface SupabaseResult<T> {
  success: boolean;
  data?: T[];
  error?: string;
}

// Hook para buscar dados genéricos com ordenação por campo
export function useSupabaseData<T>(
  table: string,
  orderBy: string,
): { data: T[]; loading: boolean; error: string | null } {
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
export async function getInsumos(
  filters: Record<string, unknown> = {},
): Promise<{ success: boolean; data: StockItem[]; error?: string }> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("stock_items")
      .select(
        "*, unit_of_measurement:unit_of_measurement_id(id, name, abbreviation)"
      );

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string" && value.startsWith("ilike.")) {
          query = query.ilike(key, value.replace("ilike.", ""));
        } else {
          query = query.eq(key, value as string);
        }
      }
    });

    const { data, error } = await query.returns<StockItem[]>();
    if (error) {
      toast.error("Erro ao carregar dados");
      return { success: false, data: [], error: error.message };
    }
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    toast.error("Erro ao carregar dados");
    const message =
      err instanceof Error ? err.message : "Erro ao acessar o banco de dados";
    return { success: false, data: [], error: message };
  }
}

export const getSupplies = getInsumos;

// --- Generic Supabase helpers ---
export function handleSupabaseError(error: unknown): {
  success: false;
  error: string;
} {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: string }).message)
      : "Erro ao acessar o banco de dados";
  console.error("Supabase error:", error);
  return { success: false, error: message } as const;
}

export async function createRecord<T>(
  table: string,
  data: Partial<T>,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = createClient();
    const cleanData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });

    const { data: result, error } = await supabase
      .from(table)
      .insert(cleanData)
      .select()
      .single()
      .returns<T>();
    if (error) return handleSupabaseError(error);
    if (!result) {
      console.error("createRecord returned no data for table", table);
      return {
        success: false,
        error: "Erro desconhecido ao criar registro",
      } as const;
    }
    return { success: true, data: result as T };
  } catch (err) {
    console.error("createRecord unexpected error:", err);
    return handleSupabaseError(err);
  }
}

export async function updateRecord<T>(
  table: string,
  id: string,
  data: Partial<T>,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = createClient();
    const cleanData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });
    cleanData.updated_at = new Date().toISOString();
    const { data: result, error } = await supabase
      .from(table)
      .update(cleanData)
      .eq("id", id)
      .select()
      .single()
      .returns<T>();
    if (error) return handleSupabaseError(error);
    return { success: true, data: result as T };
  } catch (err) {
    return handleSupabaseError(err);
  }
}

export async function deleteRecord(
  table: string,
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return handleSupabaseError(error);
    return { success: true };
  } catch (err) {
    return handleSupabaseError(err);
  }
}

export async function getRecordById<T>(
  table: string,
  id: string,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single()
      .returns<T>();
    if (error) return handleSupabaseError(error);
    return { success: true, data: data as T };
  } catch (err) {
    return handleSupabaseError(err);
  }
}

export async function getRecords<T>(
  table: string,
  query: Record<string, unknown> = {},
): Promise<{ success: boolean; data?: T[]; error?: string }> {
  try {
    const supabase = createClient();
    let builder = supabase.from(table).select("*");
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string" && value.startsWith("ilike.")) {
          builder = builder.ilike(key, value.replace("ilike.", ""));
        } else {
          builder = builder.eq(key, value as string);
        }
      }
    });
    const { data, error } = await builder.returns<T[]>();
    if (error) return handleSupabaseError(error);
    return { success: true, data: Array.isArray(data) ? (data as T[]) : [] };
  } catch (err) {
    return handleSupabaseError(err);
  }
}

// --- Entity helpers ---
import type { Client, Supplier, StockItem, Component } from "@/types/schema";

export const getClients = async (
  query: Record<string, unknown> = {},
): Promise<{ success: boolean; data: Client[]; error?: string }> => {
  const result = await getRecords<Client>("clients", query);
  if (!result.success) {
    toast.error("Erro ao carregar dados");
    return { success: false, data: [], error: result.error };
  }
  return { success: true, data: result.data || [] };
};

export const getSuppliers = async (
  query: Record<string, unknown> = {},
): Promise<{ success: boolean; data: Supplier[]; error?: string }> => {
  const result = await getRecords<Supplier>("suppliers", query);
  if (!result.success) {
    toast.error("Erro ao carregar dados");
    return { success: false, data: [], error: result.error };
  }
  return { success: true, data: result.data || [] };
};

export const getSupplierById = (id: string) =>
  getRecordById<Supplier>("suppliers", id);

export const createSupplier = (data: Partial<Supplier>) =>
  createRecord<Supplier>("suppliers", data);

export const updateSupplier = (id: string, data: Partial<Supplier>) =>
  updateRecord<Supplier>("suppliers", id, data);

export const deleteSupplier = (id: string) => deleteRecord("suppliers", id);

export const getStockItems = async (
  query: Record<string, unknown> = {},
): Promise<{ success: boolean; data?: StockItem[]; error?: string }> => {
  const lowStock = Boolean(query.low_stock);
  if ("low_stock" in query) delete query.low_stock;
  const result = await getRecords<StockItem>("stock_items", query);
  if (result.success && lowStock) {
    result.data = (result.data || []).filter(
      (i) => typeof i.min_quantity === "number" && i.quantity < i.min_quantity,
    );
  }
  return result;
};

export const getComponents = async (
  query: Record<string, unknown> = {},
): Promise<{ success: boolean; data: Component[]; error?: string }> => {
  try {
    const supabase = createClient();
    let builder = supabase
      .from("components")
      .select(
        "*, unit_of_measurement:unit_of_measurement_id(id, name, abbreviation)"
      );

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string" && value.startsWith("ilike.")) {
          builder = builder.ilike(key, value.replace("ilike.", ""));
        } else {
          builder = builder.eq(key, value as string);
        }
      }
    });

    const { data, error } = await builder.returns<Component[]>();
    if (error) {
      toast.error("Erro ao carregar dados");
      return { success: false, data: [], error: error.message };
    }
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (err) {
    toast.error("Erro ao carregar dados");
    const message =
      err instanceof Error ? err.message : "Erro ao acessar o banco de dados";
    return { success: false, data: [], error: message };
  }
};

export const getComponentById = (id: string) =>
  getRecordById<Component>("components", id);

export const createComponent = (data: Partial<Component>) =>
  createRecord<Component>("components", data);

export const updateComponent = (id: string, data: Partial<Component>) =>
  updateRecord<Component>("components", id, data);

export const deleteComponent = (id: string) => deleteRecord("components", id);
