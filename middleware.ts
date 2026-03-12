import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const publicRoutes = ['/login', '/api/auth/login']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get session
  const token = request.cookies.get('sb-token')?.value

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if admin route
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Verify user is admin
    try {
      const { data: { user } } = await supabase.auth.getUser(token)
      
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Check if user has admin role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
