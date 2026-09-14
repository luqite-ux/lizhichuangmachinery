import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getArticleBySlug } from "@/lib/articles-db"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const article = await getArticleBySlug(slug)
  if (!article) return {}
  const url = absoluteUrl(`/news/${article.slug}`)
  return { title: article.title, description: article.summary, alternates: { canonical: url }, openGraph: { type: "article", title: article.title, description: article.summary, url, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: article.featuredImage ? [{ url: article.featuredImage }] : [] } }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = await getArticleBySlug(slug)
  if (!article) notFound()
  const url = absoluteUrl(`/news/${article.slug}`)
  const schema = { "@context": "https://schema.org", "@type": "NewsArticle", "@id": `${url}#article`, headline: article.title, description: article.summary, datePublished: article.publishedAt, dateModified: article.updatedAt, image: article.featuredImage ? [article.featuredImage] : undefined, author: { "@id": `${absoluteUrl()}#organization` }, publisher: { "@id": `${absoluteUrl()}#organization` }, mainEntityOfPage: url }
  return <article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><div className="border-b border-border bg-secondary/30"><div className="mx-auto max-w-4xl px-4 py-4 md:px-6"><nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground"><Link href="/">Home</Link><ChevronRight className="size-3.5" /><Link href="/news">News</Link><ChevronRight className="size-3.5" /><span className="line-clamp-1 text-foreground">{article.title}</span></nav></div></div><header className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16" data-motion-section><time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time><h1 className="mt-3 text-balance text-3xl font-bold text-foreground md:text-5xl">{article.title}</h1><p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.summary}</p>{article.featuredImage ? <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-secondary"><Image src={article.featuredImage} alt="" fill priority className="object-cover" /></div> : null}</header><div className="article-prose mx-auto max-w-3xl px-4 pb-16 md:px-6" data-motion-section dangerouslySetInnerHTML={{ __html: article.body }} /></article>
}
