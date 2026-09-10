#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
for (const path of [join(ROOT, '.env.local')]) {
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/u)) {
    const index = line.indexOf('=')
    if (index > 0) process.env[line.slice(0, index)] ??= line.slice(index + 1)
  }
}
const required = (name) => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}
const base = (process.env.AUDIT_BASE_URL || 'http://localhost:34185').replace(/\/$/u, '')
const tenantId = required('NEXT_PUBLIC_TENANT_ID')
const supabase = createClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } })
const [tenantResult, productResult, categoryResult, articleResult, inquiryCountResult] = await Promise.all([
  supabase.from('tenants').select('*').eq('id', tenantId).single(),
  supabase.from('products').select('*').eq('tenant_id', tenantId).eq('is_active', true).order('sort_order'),
  supabase.from('product_categories').select('*').eq('tenant_id', tenantId).eq('is_active', true).order('sort_order'),
  supabase.from('articles').select('*').eq('tenant_id', tenantId),
  supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
])
for (const result of [tenantResult, productResult, categoryResult, articleResult, inquiryCountResult]) if (result.error) throw result.error
const products = productResult.data
const forbiddenPattern = /(warrant(?:y|ies)|guarantee(?:d)?|质保|保修)/iu
const databaseForbiddenHits = JSON.stringify({ tenant: tenantResult.data, products, articles: articleResult.data }).match(forbiddenPattern) || []

const paths = ['/', '/products', '/solutions', '/about', '/news', '/contact', '/robots.txt', '/sitemap.xml', ...products.map((product) => `/products/${product.slug}`)]
const routeChecks = []
for (const path of paths) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' })
  routeChecks.push({ path, status: response.status, contentType: response.headers.get('content-type') })
}
const homeHtml = await (await fetch(`${base}/`)).text()
const productHtml = await (await fetch(`${base}/products/${products[0].slug}`)).text()
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const robots = await (await fetch(`${base}/robots.txt`)).text()
const r2Checks = []
for (const product of products) {
  const response = await fetch(product.image_url, { method: 'HEAD' })
  r2Checks.push({ slug: product.slug, url: product.image_url, status: response.status, contentType: response.headers.get('content-type') })
}
const initialInquiryCount = inquiryCountResult.count || 0
const invalidInquiryResponse = await fetch(`${base}/api/inquiries`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'CODEX DELIVERY CHECK', company: 'CODEX DELIVERY CHECK', email: 'codex-delivery-check@example.invalid', phone: '+10000000000', country: 'Test', targetOutput: 'Test', message: 'CODEX DELIVERY CHECK invalid CAPTCHA request' }) })
const { count: finalInquiryCount, error: finalInquiryError } = await supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId)
if (finalInquiryError) throw finalInquiryError

const result = {
  generatedAt: new Date().toISOString(), base, tenantId,
  tenant: { displayName: tenantResult.data.display_name, adminGroup: tenantResult.data.admin_group, defaultLanguage: tenantResult.data.default_language, supportedLanguages: tenantResult.data.supported_languages, formalDomainPending: tenantResult.data.extra_settings?.formal_domain_pending === true, formalContactEmailPending: tenantResult.data.extra_settings?.formal_contact_email_pending === true, logoUrl: tenantResult.data.logo_url, faviconUrl: tenantResult.data.favicon_url },
  counts: { products: products.length, categories: categoryResult.data.length, articles: articleResult.data.length },
  uniqueProductCovers: new Set(products.map((product) => product.image_url)).size,
  routeChecks,
  sitemapProductCount: products.filter((product) => sitemap.includes(`/products/${product.slug}`)).length,
  robots: { blocksAdmin: robots.includes('Disallow: /admin'), declaresSitemap: robots.includes('/sitemap.xml') },
  html: { homeOrganizationSchema: homeHtml.includes('"@type":"Organization"'), homeWebsiteSchema: homeHtml.includes('"@type":"WebSite"'), productSchema: productHtml.includes('"@type":"Product"'), productCanonical: productHtml.includes(`/products/${products[0].slug}`), brandedIcons: (homeHtml.match(/\/images\/logo\.png/gu) || []).length >= 3 },
  r2Checks,
  databaseForbiddenHits,
  invalidCaptcha: { status: invalidInquiryResponse.status, countBefore: initialInquiryCount, countAfter: finalInquiryCount, rejectedWithoutWrite: invalidInquiryResponse.status === 400 && initialInquiryCount === finalInquiryCount },
  result: routeChecks.every((item) => item.status === 200) && products.length === 10 && categoryResult.data.length === 5 && articleResult.data.length === 0 && new Set(products.map((product) => product.image_url)).size === 10 && r2Checks.every((item) => item.status === 200) && databaseForbiddenHits.length === 0 && invalidInquiryResponse.status === 400 && initialInquiryCount === finalInquiryCount ? 'PASS' : 'FAIL',
}
const output = join(ROOT, '.codex-delivery', 'local-integration-audit.json')
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
process.stdout.write(JSON.stringify({ result: result.result, counts: result.counts, uniqueProductCovers: result.uniqueProductCovers, sitemapProductCount: result.sitemapProductCount, routesPassing: routeChecks.filter((item) => item.status === 200).length, routesTotal: routeChecks.length, r2Passing: r2Checks.filter((item) => item.status === 200).length, invalidCaptcha: result.invalidCaptcha, forbiddenHits: databaseForbiddenHits.length }))
