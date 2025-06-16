"use client";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Simple hook to get the current authenticated user.
 * It listens for auth state changes and updates the user accordingly.
 */
export function useAuth(): User | null {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getInitialUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    void getInitialUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return user;
}
