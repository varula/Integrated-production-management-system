import { type NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and static assets
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For demo mode, allow all access (authentication checked in React layer)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
