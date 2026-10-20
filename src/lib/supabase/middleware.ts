import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1. If user is ALREADY authenticated and visits /login or /register
  if (user && (pathname === '/login' || pathname === '/register')) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'advisor'])
      .maybeSingle()

    const isAdmin = !!roleData
    const redirectParam = request.nextUrl.searchParams.get('redirect')

    const url = request.nextUrl.clone()
    url.searchParams.delete('redirect')

    if (redirectParam && !redirectParam.startsWith('/login') && !redirectParam.startsWith('/register')) {
      if (redirectParam.startsWith('/admin') && !isAdmin) {
        url.pathname = '/dashboard'
      } else {
        url.pathname = redirectParam
      }
    } else if (isAdmin) {
      url.pathname = '/admin'
    } else {
      url.pathname = '/dashboard'
    }

    return NextResponse.redirect(url)
  }

  // 2. Protected routes check for /dashboard
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 3. Protected routes check for /admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verify admin or advisor role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'advisor'])
      .maybeSingle()

    if (!roleData) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
