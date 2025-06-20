"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtendedDatabase } from "@/types/extended-supabase";

// Versão alternativa do cliente Supabase para uso em componentes
// que não suportam o uso de next/headers
export function createSupabaseServerClientAlternative(): SupabaseClient<ExtendedDatabase> {
  return createBrowserClient<ExtendedDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
