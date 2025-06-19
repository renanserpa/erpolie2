import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FornecedoresPage from '@/modules/fornecedores/FornecedoresPage'

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <FornecedoresPage />
}
