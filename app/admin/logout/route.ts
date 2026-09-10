import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'

function logout(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  response.cookies.set('hq_tenant_id', '', { path: '/', maxAge: 0 })
  return response
}

export const GET = logout
export const POST = logout
