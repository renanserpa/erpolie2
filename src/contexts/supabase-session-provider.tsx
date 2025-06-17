'use client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import type { Database } from '@/lib/database.types'

export function SupabaseSessionProvider({ initialSession, children }) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient<Database>()
  )
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
