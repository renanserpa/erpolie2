import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export const createClient = () => createPagesBrowserClient<Database>()

export const createSupabaseClient = createClient
