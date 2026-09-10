#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { stdin } from 'node:process'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { CATEGORIES, PRODUCTS } from './lizhichuang-catalog.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ADMIN_ROOT = resolve(ROOT, '..', 'huanqiu-admin')
const PROJECT_KEY = 'lizhichuangmachinery'
const PROVISIONAL_DOMAIN = 'lizhichuangmachinery.vercel.app'
const ADMIN_EMAIL = '308881443@qq.com'
const SOURCE_ROOT = process.env.LZC_SOURCE_ROOT || String.raw`Y:\客户资料1\1485-郑州利之创机械设备\环球出海资料`
const ASSET_PLAN_PATH = join(ROOT, '.codex-delivery', 'prepared-asset-plan.json')

for (const envPath of [
  join(ROOT, '.env.local'),
  join(ADMIN_ROOT, '.env'),
  join(ADMIN_ROOT, '.env.local'),
  join(ADMIN_ROOT, '_migrate-batch', '.env'),
]) {
  if (!existsSync(envPath)) continue
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/u)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 1) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (/^['"]/.test(value)) value = value.slice(1, -1)
    process.env[key] ??= value
  }
}

function env(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

async function readPassword() {
  if (stdin.isTTY) throw new Error('Initial password must be provided through redirected stdin')
  let value = ''
  for await (const chunk of stdin) value += chunk.toString()
  value = value.replace(/(?:\r\n|\n|\r)$/u, '')
  if (!value || /[\r\n]/u.test(value)) throw new Error('Initial password input must be exactly one non-empty line')
  return value
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function contentType(path) {
  if (/\.png$/iu.test(path)) return 'image/png'
  if (/\.webp$/iu.test(path)) return 'image/webp'
  if (/\.pdf$/iu.test(path)) return 'application/pdf'
  return 'image/jpeg'
}

function extension(path) {
  const value = extname(path).toLowerCase()
  return value && value.length <= 6 ? value : ''
}

function sourceLabel(path) {
  return path.startsWith(SOURCE_ROOT) ? path.slice(SOURCE_ROOT.length).replace(/^[/\\]+/u, '') : basename(path)
}

async function main() {
  if (!existsSync(ASSET_PLAN_PATH)) throw new Error('Prepared asset plan is missing')
  const plan = JSON.parse(readFileSync(ASSET_PLAN_PATH, 'utf8'))
  if (plan.product_count !== PRODUCTS.length) throw new Error('Prepared asset plan does not cover the catalog')

  const password = await readPassword()
  const passwordHash = await bcrypt.hash(password, 12)
  const supabase = createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const [{ data: existingTenant, error: tenantLookupError }, { data: emailOwner, error: emailError }] = await Promise.all([
    supabase.from('tenants').select('id,domain,password_hash,extra_settings').eq('name', PROJECT_KEY).maybeSingle(),
    supabase.from('admin_users').select('id,tenant_id,email,password_hash').eq('email', ADMIN_EMAIL).maybeSingle(),
  ])
  if (tenantLookupError) throw tenantLookupError
  if (emailError) throw emailError
  if (emailOwner && existingTenant && emailOwner.tenant_id !== existingTenant.id) throw new Error('Temporary admin email is assigned to another tenant')
  if (emailOwner && !existingTenant) throw new Error('Temporary admin email exists without this tenant')

  const initialTenant = {
    domain: existingTenant?.domain || PROVISIONAL_DOMAIN,
    name: PROJECT_KEY,
    display_name: '郑州利之创机械设备有限公司',
    email: ADMIN_EMAIL,
    password_hash: existingTenant?.password_hash || passwordHash,
    admin_group: 2,
    supported_languages: ['en'],
    default_language: 'en',
    brand_color: '#174f91',
    public_contact_email: null,
    contact_email: null,
    inquiry_notification_email: null,
    contact_phone: '+86 185 5981 2218',
    contact_whatsapp: null,
    contact_address_short: 'Xinzheng, Zhengzhou, Henan, China',
    contact_address_i18n: {
      en: '300 meters west of the intersection of Zijing Shan South Road and Qinggong Road, heading north, Guodian Town, Xinzheng City, Zhengzhou, Henan Province, China',
    },
  }

  const tenantMutation = existingTenant
    ? supabase.from('tenants').update(initialTenant).eq('id', existingTenant.id).select('id,domain,display_name,admin_group').single()
    : supabase.from('tenants').insert(initialTenant).select('id,domain,display_name,admin_group').single()
  const { data: tenant, error: tenantError } = await tenantMutation
  if (tenantError) throw tenantError

  const publicR2 = (process.env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL_PREFIX || '').trim().replace(/\/$/u, '')
  if (!publicR2) throw new Error('R2_PUBLIC_URL or R2_PUBLIC_URL_PREFIX is required')
  const r2 = new S3Client({
    region: 'auto',
    endpoint: env('R2_S3_ENDPOINT'),
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    credentials: { accessKeyId: env('R2_ACCESS_KEY_ID'), secretAccessKey: env('R2_SECRET_ACCESS_KEY') },
  })
  const bucket = process.env.R2_BUCKET_NAME?.trim() || 'sscewebsite'
  const uploadedByHash = new Map()
  const assetRecords = []

  async function upload(path, kind, sourcePath, stableName = basename(path)) {
    if (!existsSync(path)) throw new Error(`Missing asset: ${path}`)
    const body = readFileSync(path)
    const hash = sha256(body)
    const existing = uploadedByHash.get(hash)
    if (existing) {
      assetRecords.push({ kind, sourcePath: sourceLabel(sourcePath), sha256: hash, r2Key: existing.key, url: existing.url, duplicateOf: existing.sourcePath })
      return existing.url
    }
    const safeName = stableName.replace(/[^A-Za-z0-9._-]+/gu, '-').replace(/^-+|-+$/gu, '') || `asset${extension(path)}`
    const key = `customers/${tenant.id}/${kind}/${hash.slice(0, 16)}-${safeName}`
    await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType(path) }))
    const url = `${publicR2}/${key.split('/').map(encodeURIComponent).join('/')}`
    uploadedByHash.set(hash, { key, url, sourcePath: sourceLabel(sourcePath) })
    assetRecords.push({ kind, sourcePath: sourceLabel(sourcePath), sha256: hash, r2Key: key, url })
    return url
  }

  const logoLocal = join(ROOT, 'public', 'images', 'logo.png')
  const logoUrl = await upload(logoLocal, 'brand', join(SOURCE_ROOT, '公司资料', 'logo头.jpg'), 'lizhichuang-logo.png')
  const bannerUrls = []
  for (const index of [1, 2, 3]) {
    bannerUrls.push(await upload(
      join(ROOT, 'public', 'images', index === 1 ? 'hero-machine-line.jpg' : index === 2 ? 'hero-wipes-clouds.jpg' : 'hero-wipes-stack.jpg'),
      'banners',
      join(SOURCE_ROOT, '轮播图', `${index}.jpg`),
      `banner-${index}.jpg`,
    ))
  }
  const companyFiles = ['about-lobby-1.jpg', 'about-lobby-2.jpg', 'about-office-culture.jpg', 'about-tradeshow.jpg']
  const companyUrls = []
  for (const file of companyFiles) companyUrls.push(await upload(join(ROOT, 'public', 'images', file), 'company', file, file))
  const ceSource = join(SOURCE_ROOT, '公司资料', '郑州利之创机械设备有限公司CE证书.pdf')
  const ceUrl = await upload(ceSource, 'certificates', ceSource, 'lzc-lpdt60-ce-certificate.pdf')

  const preparedByKey = new Map(plan.products.map((product) => [product.key, product]))
  const productAssets = new Map()
  for (const product of PRODUCTS) {
    const prepared = preparedByKey.get(product.key)
    if (!prepared) throw new Error(`Missing prepared product: ${product.key}`)
    const coverUrl = await upload(prepared.cover_local, `products/${product.key}`, prepared.cover_source, 'cover.jpg')
    const galleryUrls = []
    for (const [index, source] of prepared.gallery_sources.entries()) {
      galleryUrls.push(await upload(source, `products/${product.key}`, source, `gallery-${String(index + 1).padStart(2, '0')}${extension(source)}`))
    }
    const datasheetUrls = []
    for (const [index, source] of prepared.technical_datasheets.entries()) {
      datasheetUrls.push(await upload(source, `documents/${product.key}`, source, `datasheet-${String(index + 1).padStart(2, '0')}.pdf`))
    }
    const drawingUrls = []
    for (const [index, source] of prepared.machine_visual_documents.entries()) {
      drawingUrls.push(await upload(source, `documents/${product.key}`, source, `equipment-layout-${String(index + 1).padStart(2, '0')}.pdf`))
    }
    productAssets.set(product.key, { coverUrl, galleryUrls, datasheetUrls, drawingUrls, localCover: prepared.cover_public })
  }

  const previousExtra = existingTenant?.extra_settings && typeof existingTenant.extra_settings === 'object' ? existingTenant.extra_settings : {}
  const tenantSettings = {
    ...initialTenant,
    logo_url: logoUrl,
    favicon_url: logoUrl,
    site_title_i18n: { en: 'LIZHICHUANG MACHINERY | Wet Wipes Production Equipment' },
    site_tagline_i18n: { en: 'Wet wipes production and packaging equipment, engineered end to end' },
    site_description_i18n: { en: 'Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, manufactures, commissions, sells, and services wet wipes production and packaging equipment.' },
    seo_title_i18n: { en: 'LIZHICHUANG MACHINERY Wet Wipes Production Equipment' },
    seo_description_i18n: { en: 'Explore ten customer-documented wet wipes production, packing, and rewinding equipment lines from Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.' },
    seo_keywords_i18n: { en: 'wet wipes machine, wet wipes production line, mini wet wipes packing line, single sachet wet wipes machine, barrel wipes rewinder' },
    social_links: {},
    google_analytics_id: null,
    google_tag_manager_id: null,
    notes: 'Source: customer workbook, company brochure, CE certificate, equipment folders, technical sheets, factory photographs, trade-show photographs, and three supplied carousel images.',
    extra_settings: {
      ...previousExtra,
      translation_profile: {
        industry: 'Wet wipes production and packaging machinery',
        company_summary: 'Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, manufactures, commissions, sells, and services wet wipes production and packaging equipment.',
        main_products: PRODUCTS.map((product) => product.name),
        target_markets: [],
        glossary: {
          '利之创机械': 'LIZHICHUANG MACHINERY',
          '超迷你湿巾': 'super mini wet wipes',
          '立方包': 'cube pack',
          '中包机': 'secondary packing machine',
          '复卷机': 'rewinder',
        },
      },
      site_settings_source: 'customer workbook, brochure, CE certificate and supplied media',
      site_settings_initialized_at: new Date().toISOString(),
      site_settings_manual_fields: Array.isArray(previousExtra.site_settings_manual_fields) ? previousExtra.site_settings_manual_fields : [],
      formal_domain_pending: true,
      formal_contact_email_pending: true,
      banner_urls: bannerUrls,
      company_gallery_urls: companyUrls,
      ce_certificate_url: ceUrl,
      r2_asset_manifest_path: '.codex-delivery/r2-asset-map.json',
    },
  }
  const { error: settingsError } = await supabase.from('tenants').update(tenantSettings).eq('id', tenant.id)
  if (settingsError) throw settingsError

  for (const [index, category] of CATEGORIES.entries()) {
    const product = PRODUCTS.find((entry) => entry.categorySlug === category.slug)
    const cover = product ? productAssets.get(product.key)?.coverUrl : null
    const { error } = await supabase.from('product_categories').upsert({
      tenant_id: tenant.id,
      slug: category.slug,
      name: category.name,
      name_en: category.name,
      name_i18n: { en: category.name },
      description: category.description,
      description_en: category.description,
      description_i18n: { en: category.description },
      icon: cover,
      parent_id: null,
      sort_order: index,
      is_active: true,
      extra_data: { source: 'customer equipment folder inventory' },
    }, { onConflict: 'tenant_id,slug', ignoreDuplicates: false })
    if (error) throw new Error(`Category ${category.slug}: ${error.message}`)
  }

  for (const [index, product] of PRODUCTS.entries()) {
    const assets = productAssets.get(product.key)
    const images = [assets.coverUrl, ...assets.galleryUrls]
    const payload = {
      tenant_id: tenant.id,
      slug: product.slug,
      name: product.name,
      name_en: product.name,
      name_i18n: { en: product.name },
      description: product.summary,
      description_en: product.summary,
      description_i18n: { en: product.summary },
      overview: product.overview,
      overview_en: product.overview,
      overview_i18n: { en: product.overview },
      image_url: assets.coverUrl,
      category: product.categoryName,
      category_slug: product.categorySlug,
      features: product.features,
      features_i18n: { en: product.features },
      applications: product.applications,
      applications_i18n: { en: product.applications },
      advantages: product.features,
      advantages_i18n: { en: product.features },
      specs: product.specifications,
      extra_data: {
        images,
        model: product.model,
        short_name_i18n: { en: product.shortName },
        family_i18n: { en: product.categoryName },
        process_steps_i18n: { en: product.processSteps },
        specifications: product.specifications,
        datasheet_urls: assets.datasheetUrls,
        equipment_layout_urls: assets.drawingUrls,
        source_key: product.key,
        source_mapping: preparedByKey.get(product.key).mapping_evidence,
        local_fallback_cover: assets.localCover,
        certificate_i18n: product.certificate ? { en: product.certificate } : {},
      },
      sort_order: index,
      is_active: true,
    }
    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'tenant_id,slug', ignoreDuplicates: false })
    if (error) throw new Error(`Product ${product.slug}: ${error.message}`)
  }

  const adminPayload = {
    tenant_id: tenant.id,
    email: ADMIN_EMAIL,
    name: '郑州利之创机械设备有限公司',
    role: 'admin',
    is_active: true,
    admin_group: 2,
    admin_groups: [2],
    must_change_password: false,
    permissions: { products: true, articles: true, inquiries: true, settings: true },
  }
  const adminMutation = emailOwner
    ? supabase.from('admin_users').update(adminPayload).eq('id', emailOwner.id)
    : supabase.from('admin_users').insert({ ...adminPayload, password_hash: passwordHash })
  const { error: adminError } = await adminMutation
  if (adminError) throw adminError

  const [{ count: productCount }, { count: categoryCount }, { count: articleCount }, { data: readback, error: readbackError }, { data: adminReadback, error: adminReadbackError }, { data: productReadback, error: productReadbackError }] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('is_active', true),
    supabase.from('product_categories').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('is_active', true),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
    supabase.from('tenants').select('id,domain,display_name,admin_group,default_language,supported_languages,contact_email,contact_phone,logo_url,favicon_url,extra_settings').eq('id', tenant.id).single(),
    supabase.from('admin_users').select('email,tenant_id,admin_group,must_change_password,is_active').eq('tenant_id', tenant.id).eq('email', ADMIN_EMAIL).single(),
    supabase.from('products').select('slug,image_url,extra_data').eq('tenant_id', tenant.id).eq('is_active', true).order('sort_order'),
  ])
  if (readbackError) throw readbackError
  if (adminReadbackError) throw adminReadbackError
  if (productReadbackError) throw productReadbackError
  if (productCount !== PRODUCTS.length || categoryCount !== CATEGORIES.length || articleCount !== 0 || readback.admin_group !== 2) throw new Error('Seed count or tenant readback mismatch')
  if (adminReadback.must_change_password !== false || adminReadback.admin_group !== 2 || !adminReadback.is_active) throw new Error('Admin readback mismatch')
  if (productReadback.some((product) => !product.image_url?.startsWith(`${publicR2}/`))) throw new Error('A product cover is not stored on R2')
  if (new Set(productReadback.map((product) => product.image_url)).size !== PRODUCTS.length) throw new Error('Product cover URLs are not unique')

  const artifactPath = join(ROOT, '.codex-delivery', 'r2-asset-map.json')
  mkdirSync(dirname(artifactPath), { recursive: true })
  writeFileSync(artifactPath, `${JSON.stringify({ tenantId: tenant.id, generatedAt: new Date().toISOString(), assets: assetRecords }, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ tenantId: tenant.id, domain: readback.domain, displayName: readback.display_name, adminGroup: readback.admin_group, defaultLanguage: readback.default_language, supportedLanguages: readback.supported_languages, products: productCount, categories: categoryCount, articles: articleCount, adminEmail: adminReadback.email, mustChangePassword: adminReadback.must_change_password, r2Assets: assetRecords.length, r2UniqueAssets: uploadedByHash.size, productCoversUnique: true, readback: 'PASS' })}\n`)
}

main().catch((error) => {
  process.stderr.write(`Lizhichuang seed failed: ${error.message}\n`)
  process.exitCode = 1
})
