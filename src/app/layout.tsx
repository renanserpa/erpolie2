import './globals.css'
import { SupabaseSessionProvider } from '@/contexts/supabase-session-provider'
import { AuthContextProvider } from '@/contexts/auth-context'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Olie ERP',
  description: 'Sistema de gestão para produção artesanal',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies })
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
