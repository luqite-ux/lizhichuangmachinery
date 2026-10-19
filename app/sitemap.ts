import type { MetadataRoute } from "next"
import { getPublishedArticles } from "@/lib/articles-db"
import { fetchProductsData } from "@/lib/products-db"
import { absoluteUrl } from "@/lib/site-config"
import { localizedPath } from '@/lib/localization'
export const revalidate = 60
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ products }, articles] = await Promise.all([fetchProductsData(), getPublishedArticles()])
  const now = new Date()
  const entries = [
    ...["", "/products", "/solutions", "/about", "/news", "/contact"].map((path) => ({ url: absoluteUrl(path || "/"), lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .7 })),
    ...products.map((product) => ({ url: absoluteUrl(`/products/${product.slug}`), lastModified: product.updatedAt ? new Date(product.updatedAt) : now, changeFrequency: "weekly" as const, priority: .8 })),
    ...articles.map((article) => ({ url: absoluteUrl(`/news/${article.slug}`), lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: .6 })),
  ]
  return entries.flatMap(entry => (['en', 'zh'] as const).map(locale => ({ ...entry,
    url: absoluteUrl(localizedPath(new URL(entry.url).pathname, locale)),
    alternates: { languages: { en: entry.url, 'zh-CN': absoluteUrl(localizedPath(new URL(entry.url).pathname, 'zh')), 'x-default': entry.url } },
  })))
}
