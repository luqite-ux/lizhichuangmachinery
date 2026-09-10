import type { Metadata } from "next"
import { getPublishedArticles } from "@/lib/articles-db"
import { NewsPageClient } from "./news-page-client"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60
export const metadata: Metadata = {
  title: "News",
  description: "Company, equipment, and project updates from Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.",
  alternates: { canonical: absoluteUrl("/news") },
}

export default async function NewsPage() {
  const articles = await getPublishedArticles()
  return <NewsPageClient articles={articles} />
}
