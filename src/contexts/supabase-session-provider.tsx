"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState, type ReactNode } from "react";
import type { Database } from "@/types/supabase";
import type { Session } from "@supabase/supabase-js";

interface SupabaseSessionProviderProps {
  initialSession: Session | null;
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
