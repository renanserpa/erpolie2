import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import ProdutosPage from '@/modules/produtos/ProdutosPage'

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <ProdutosPage />
}
