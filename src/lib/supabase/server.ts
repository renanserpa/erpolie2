import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtendedDatabase } from "@/types/extended-supabase";

export async function createSupabaseServerClient(): Promise<SupabaseClient<ExtendedDatabase>> {
  return createServerComponentClient<ExtendedDatabase>({ cookies });
}
