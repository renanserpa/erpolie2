import { SupabaseSessionProvider } from '@/contexts/supabase-session-provider'
import { createClient } from '@/lib/supabase/server'

export default async function RootLayout({ children }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="pt-BR">
      <body>
        <SupabaseSessionProvider initialSession={session}>
          {children}
        </SupabaseSessionProvider>
      </body>
    </html>
  )
}
