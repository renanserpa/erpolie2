import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

export const createClient = () => createBrowserClient<Database>()

export const createSupabaseClient = createClient
