import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { ExtendedDatabase } from "@/types/extended-supabase";

export async function createSupabaseMiddlewareClient(req: NextRequest) {
  // Cria uma resposta inicial
  const response = NextResponse.next();

  // Credenciais obtidas do ambiente com validação
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials are missing in environment variables");
  }

  // Cria o cliente Supabase usando createServerClient
  const supabase = createServerClient<ExtendedDatabase>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}
