"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtendedDatabase } from "@/types/extended-supabase";

export function createClient(): SupabaseClient<ExtendedDatabase> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase credentials are missing in environment variables");
  }

  return createBrowserClient<ExtendedDatabase>(url, anonKey);
}

export const createSupabaseClient = createClient;
