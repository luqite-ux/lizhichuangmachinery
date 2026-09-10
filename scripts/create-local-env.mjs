#!/usr/bin/env node
import { randomBytes, randomUUID } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ADMIN_ROOT = resolve(ROOT, '..', 'huanqiu-admin')

function load(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/u)) {
    const value = line.trim()
    if (!value || value.startsWith('#')) continue
    const index = value.indexOf('=')
    if (index < 1) continue
    const key = value.slice(0, index).trim()
    let item = value.slice(index + 1).trim()
    if (/^['"]/.test(item)) item = item.slice(1, -1)
    process.env[key] ??= item
  }
}

for (const path of [join(ROOT, '.env.local'), join(ADMIN_ROOT, '.env'), join(ADMIN_ROOT, '.env.local'), join(ADMIN_ROOT, '_migrate-batch', '.env')]) load(path)

const required = (name) => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

const supabaseUrl = required('NEXT_PUBLIC_SUPABASE_URL')
const anonKey = required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const serviceRoleKey = required('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
const { data: tenant, error } = await supabase.from('tenants').select('id').eq('name', 'lizhichuangmachinery').single()
if (error) throw error

const existingPath = join(ROOT, '.env.local')
const existing = existsSync(existingPath) ? readFileSync(existingPath, 'utf8') : ''
const existingMap = new Map(existing.split(/\r?\n/u).flatMap((line) => {
  const index = line.indexOf('=')
  return index > 0 ? [[line.slice(0, index), line.slice(index + 1)]] : []
}))
const captchaSecret = existingMap.get('CAPTCHA_SECRET') || randomBytes(48).toString('base64url')
const captchaSiteScope = existingMap.get('CAPTCHA_SITE_SCOPE') || `lizhichuangmachinery-${randomUUID()}`
const values = {
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  NEXT_PUBLIC_TENANT_ID: tenant.id,
  NEXT_PUBLIC_ADMIN_URL: 'https://admin.globle-trade.com',
  NEXT_PUBLIC_SITE_URL: 'https://lizhichuangmachinery.vercel.app',
  SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
  CAPTCHA_SECRET: captchaSecret,
  CAPTCHA_SITE_SCOPE: captchaSiteScope,
}
writeFileSync(existingPath, `${Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n')}\n`, 'utf8')
process.stdout.write(JSON.stringify({ created: true, tenantId: tenant.id, captchaSecretLength: captchaSecret.length, siteScopeUnique: captchaSiteScope.startsWith('lizhichuangmachinery-') }))
