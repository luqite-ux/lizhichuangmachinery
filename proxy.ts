import { NextResponse as ServiceGuardNextResponse, type NextRequest as ServiceGuardRequest } from 'next/server'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from './lib/service-status'
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'

function existingServiceExpiryIntegration(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')
  if (!isPublic && pathname.startsWith('/admin') && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next|images|favicon|robots.txt|sitemap.xml|.*\\..*).*)'] }

export async function proxy(request: ServiceGuardRequest) {
  if (!isServiceGuardExcludedPath(request.nextUrl.pathname) && !await isWebsiteServiceAvailable()) return ServiceGuardNextResponse.rewrite(new URL('/service-expired', request.url))
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/admin')) return existingServiceExpiryIntegration(request)
  const locale = pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-site-locale', locale)
  if (locale === 'zh') {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    if (!/^\/(?:$|products(?:\/|$)|about$|solutions$|news(?:\/|$)|contact$)/.test(url.pathname)) return NextResponse.next({ request: { headers: requestHeaders } })
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }
  return NextResponse.next({ request: { headers: requestHeaders } })
}
