"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { ExtendedDatabase } from "@/types/extended-supabase";

export function createClient() {
  return createBrowserClient<ExtendedDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const createSupabaseClient = createClient;
