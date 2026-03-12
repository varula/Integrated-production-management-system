import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/api/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for user in localStorage (for demo mode) or session
  const user = request.cookies.get('user')?.value
  
  // If no user and not a public route, redirect to login
  if (!user && !publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
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
