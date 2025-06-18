import './globals.css'
import { SupabaseSessionProvider } from '@/contexts/supabase-session-provider'
import { AuthContextProvider } from '@/contexts/auth-context'
import { createClient } from '@/lib/supabase/server'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Olie ERP',
  description: 'Sistema de gestão para produção artesanal',
}

export default async function RootLayout({ children }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SupabaseSessionProvider initialSession={session}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </SupabaseSessionProvider>
      </body>
    </html>
  )
}
