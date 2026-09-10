import { getSupabaseClient, getTenantId } from "@/lib/supabase"
import type { NewsArticle } from "@/lib/news"
import { DEFAULT_LOCALE, resolveLocalized, type Locale } from "@/lib/i18n"

type Row = Record<string, unknown>
const FIELDS = "id,slug,title,title_en,title_i18n,excerpt,excerpt_en,excerpt_i18n,content,content_en,content_i18n,featured_image,published_at,created_at,updated_at"

function mapArticle(row: Row, locale: Locale = DEFAULT_LOCALE): NewsArticle {
  const created = String(row.created_at || new Date(0).toISOString())
  return {
    id: String(row.id), slug: String(row.slug),
    title: resolveLocalized(row.title_i18n, locale, row.title_en, row.title),
    summary: resolveLocalized(row.excerpt_i18n, locale, row.excerpt_en, row.excerpt),
    body: resolveLocalized(row.content_i18n, locale, row.content_en, row.content),
    featuredImage: typeof row.featured_image === "string" && row.featured_image ? row.featured_image : null,
    publishedAt: String(row.published_at || created),
    updatedAt: String(row.updated_at || row.published_at || created),
  }
}

export async function getPublishedArticles(locale: Locale = DEFAULT_LOCALE): Promise<NewsArticle[]> {
  const client = getSupabaseClient(); const tenantId = getTenantId()
  if (!client || !tenantId) return []
  const { data, error } = await client.from("articles").select(FIELDS).eq("tenant_id", tenantId).eq("is_published", true).order("published_at", { ascending: false })
  if (error) throw new Error(`Unable to load articles: ${error.message}`)
  return (data as Row[]).map((row) => mapArticle(row, locale))
}

export async function getArticleBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<NewsArticle | null> {
  const client = getSupabaseClient(); const tenantId = getTenantId()
  if (!client || !tenantId) return null
  const { data, error } = await client.from("articles").select(FIELDS).eq("tenant_id", tenantId).eq("slug", slug).eq("is_published", true).maybeSingle()
  if (error) throw new Error(`Unable to load article: ${error.message}`)
  return data ? mapArticle(data as Row, locale) : null
}
