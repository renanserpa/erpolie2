import { cookies as nextCookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export const createClient = (
  cookieStore: ReturnType<typeof nextCookies> = nextCookies(),
) => createServerComponentClient<Database>({ cookies: () => cookieStore })
