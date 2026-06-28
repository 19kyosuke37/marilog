import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type: type as 'recovery' | 'signup' | 'email' | 'magiclink' })
    if (type === 'recovery') {
      return NextResponse.redirect(`${origin}/auth/update-password`)
    }
    return NextResponse.redirect(`${origin}/`)
  }

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)

    if (type === 'recovery') {
      return NextResponse.redirect(`${origin}/auth/update-password`)
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        return NextResponse.redirect(`${origin}/auth/profile`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
