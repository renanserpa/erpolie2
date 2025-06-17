'use client'
import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import type { Database } from '@/lib/database.types'

export function SupabaseSessionProvider({ initialSession, children }) {
  const [supabaseClient] = useState(() => createBrowserClient<Database>())
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
