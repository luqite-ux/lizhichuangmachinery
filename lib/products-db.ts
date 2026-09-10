import { getSupabaseClient, getTenantId } from "@/lib/supabase"
import type { Product, ProductCategory } from "@/lib/products"
import { DEFAULT_LOCALE, resolveLocalized, resolveLocalizedList, type Locale } from "@/lib/i18n"

type Row = Record<string, unknown>

const PRODUCT_FIELDS = "id,slug,name,name_en,name_i18n,description,description_en,description_i18n,overview,overview_en,overview_i18n,image_url,category,category_slug,features,features_i18n,applications,applications_i18n,specs,extra_data,updated_at"
const CATEGORY_FIELDS = "id,slug,name,name_en,name_i18n,description,description_en,description_i18n"

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : []
}

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string" && Boolean(entry[1].trim())))
}

export function mapProduct(row: Row, locale: Locale = DEFAULT_LOCALE): Product {
  const extra = row.extra_data && typeof row.extra_data === "object" ? row.extra_data as Record<string, unknown> : {}
  const image = typeof row.image_url === "string" ? row.image_url : ""
  const gallery = strings(extra.images)
  return {
    id: String(row.id),
    slug: String(row.slug),
    model: typeof extra.model === "string" ? extra.model : "",
    name: resolveLocalized(row.name_i18n, locale, row.name_en, row.name),
    shortName: resolveLocalized(extra.short_name_i18n, locale, row.name_en, row.name),
    categorySlug: typeof row.category_slug === "string" ? row.category_slug : "",
    categoryName: resolveLocalized(extra.family_i18n, locale, row.category),
    summary: resolveLocalized(row.description_i18n, locale, row.description_en, row.description),
    overview: resolveLocalized(row.overview_i18n, locale, row.overview_en, row.overview, row.description),
    images: [...new Set([image, ...gallery].filter(Boolean))],
    features: resolveLocalizedList(row.features_i18n, locale, row.features),
    processSteps: resolveLocalizedList(extra.process_steps_i18n, locale),
    applications: resolveLocalizedList(row.applications_i18n, locale, row.applications),
    specifications: stringRecord(extra.specifications ?? row.specs),
    datasheetUrls: strings(extra.datasheet_urls),
    equipmentLayoutUrls: strings(extra.equipment_layout_urls),
    certificate: resolveLocalized(extra.certificate_i18n, locale),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
  }
}

export async function fetchProductsData(locale: Locale = DEFAULT_LOCALE): Promise<{ products: Product[]; categories: ProductCategory[] }> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) throw new Error("Product database configuration is incomplete")
  const [productsResult, categoriesResult] = await Promise.all([
    client.from("products").select(PRODUCT_FIELDS).eq("tenant_id", tenantId).eq("is_active", true).order("sort_order"),
    client.from("product_categories").select(CATEGORY_FIELDS).eq("tenant_id", tenantId).eq("is_active", true).is("parent_id", null).order("sort_order"),
  ])
  if (productsResult.error) throw new Error(`Unable to load products: ${productsResult.error.message}`)
  if (categoriesResult.error) throw new Error(`Unable to load categories: ${categoriesResult.error.message}`)
  return {
    products: (productsResult.data as Row[]).map((row) => mapProduct(row, locale)),
    categories: (categoriesResult.data as Row[]).map((row) => ({ id: String(row.id), slug: String(row.slug), name: resolveLocalized(row.name_i18n, locale, row.name_en, row.name), description: resolveLocalized(row.description_i18n, locale, row.description_en, row.description) })),
  }
}

export async function getProductBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Product | null> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) return null
  const { data, error } = await client.from("products").select(PRODUCT_FIELDS).eq("tenant_id", tenantId).eq("slug", slug).eq("is_active", true).maybeSingle()
  if (error) throw new Error(`Unable to load product: ${error.message}`)
  return data ? mapProduct(data as Row, locale) : null
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const { products } = await fetchProductsData()
  return products.filter((item) => item.slug !== product.slug && item.categorySlug === product.categorySlug).slice(0, 3)
}
