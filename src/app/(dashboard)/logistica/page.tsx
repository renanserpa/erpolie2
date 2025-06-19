import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogisticaPage from '@/modules/logistica/LogisticaPage'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <LogisticaPage />
}
