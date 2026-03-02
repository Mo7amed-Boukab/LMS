import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // _auth_role is a lightweight cookie set by auth-context.tsx on the
  // FRONTEND domain after a successful login. The API-domain httpOnly cookies
  // (Authentication, Refresh) are invisible to this middleware because they
  // belong to a different domain.
  const roleFromCookie = request.cookies.get('_auth_role')

  const isAuth = !!roleFromCookie
  const role = roleFromCookie?.value
  const { pathname } = request.nextUrl

  const isTeacherRoute = pathname.startsWith('/teacher')
  const isStudentRoute = pathname.startsWith('/student')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  if ((isTeacherRoute || isStudentRoute) && !isAuth) {
    // Use request.nextUrl.origin to avoid Render's internal 0.0.0.0:10000 address
    const loginUrl = new URL('/login', request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isTeacherRoute && role !== 'formateur') {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin))
  }

  if (isStudentRoute && role !== 'apprenant') {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin))
  }

  if (isAuthRoute && isAuth) {
    const dashboard = role === 'formateur' ? '/teacher' : '/'
    return NextResponse.redirect(new URL(dashboard, request.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/teacher/:path*', '/student/:path*', '/login', '/register'],
}
