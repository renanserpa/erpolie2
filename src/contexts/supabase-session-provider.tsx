"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@supabase/ssr";
import { useState, type ReactNode } from "react";
import type { Database } from "@/types/supabase";

interface SupabaseSessionProviderProps {
  initialSession: any;
  children: ReactNode;
}

export function SupabaseSessionProvider({ initialSession, children }: SupabaseSessionProviderProps) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}

export default SupabaseSessionProvider;
