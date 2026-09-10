import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { getTenantId } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabase/server'

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL('/admin/login', request.url)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}

export async function POST(request: NextRequest) {
  let email = ''
  let password = ''
  try {
    const form = await request.formData()
    email = String(form.get('email') || '').trim().toLowerCase()
    password = String(form.get('password') || '')
  } catch {
    return redirectWithError(request, '请求格式错误')
  }

  const tenantId = getTenantId()
  if (!email || !password) return redirectWithError(request, '请输入邮箱和密码')
  if (!tenantId) return redirectWithError(request, '站点配置未完成')

  const supabase = createAdminClient()
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id,password_hash,is_active,tenant_id')
    .eq('email', email)
    .eq('tenant_id', tenantId)
    .maybeSingle()

  if (error || !user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
    return redirectWithError(request, '邮箱或密码错误')
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000)
  const { error: sessionError } = await supabase.from('admin_user_sessions').insert({
    admin_user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    ip: request.headers.get('x-forwarded-for') || '',
    user_agent: request.headers.get('user-agent') || '',
  })
  if (sessionError) return redirectWithError(request, '登录失败，请稍后重试')

  await supabase.from('admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id)
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  const cookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    expires: expiresAt,
    path: '/',
  }
  response.cookies.set(SESSION_COOKIE, token, cookie)
  response.cookies.set('hq_tenant_id', tenantId, cookie)
  return response
}
