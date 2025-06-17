import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  const { email, password } = await req.json()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return NextResponse.json({ error: error.message }, { status: 401 })

  return NextResponse.json({ success: true }, { status: 200 })
}
