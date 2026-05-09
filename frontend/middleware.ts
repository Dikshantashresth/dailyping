import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
