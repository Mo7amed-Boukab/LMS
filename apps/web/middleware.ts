import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('Authentication')
  const roleCookie = request.cookies.get('Role')
  
  const isAuth = !!authCookie
  const role = roleCookie?.value
  const { pathname } = request.nextUrl

  // Define protected routes
  const isTeacherRoute = pathname.startsWith('/teacher')
  const isStudentRoute = pathname.startsWith('/student')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // 1. Redirect to login if not authenticated on protected routes
  if ((isTeacherRoute || isStudentRoute) && !isAuth) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // 2. Role-based protection
  if (isTeacherRoute && role !== 'formateur') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isStudentRoute && role !== 'apprenant') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. Redirect to dashboard if already authenticated on auth routes
  if (isAuthRoute && isAuth) {
    const dashboard = role === 'formateur' ? '/teacher' : '/'
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/teacher/:path*', '/student/:path*', '/login', '/register'],
}
