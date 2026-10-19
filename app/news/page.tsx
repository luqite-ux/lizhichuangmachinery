import { localizeMetadata } from "@/lib/localized-metadata"
import { getRequestLocale } from "@/lib/request-locale"
import { localizedTree } from "@/lib/localized-tree"
import type { Metadata } from "next"
import { getPublishedArticles } from "@/lib/articles-db"
import { NewsPageClient } from "./news-page-client"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60
const baseMetadata: Metadata = {
  title: "News",
  description: "Company, equipment, and project updates from Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.",
  alternates: { canonical: absoluteUrl("/news") },
  openGraph: { title: "News", description: "Company, equipment, and project updates from Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.", type: "website", url: absoluteUrl("/news"), images: [{ url: absoluteUrl("/images/hero-machine-line.jpg") }] },
}

export default async function NewsPage() {
  const locale = await getRequestLocale()
  const articles = await getPublishedArticles(locale)
  return localizedTree(<NewsPageClient articles={articles} />, locale)
}

export async function generateMetadata(): Promise<Metadata> { return localizeMetadata(baseMetadata, await getRequestLocale()) }
