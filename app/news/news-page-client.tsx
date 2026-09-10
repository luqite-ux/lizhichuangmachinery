"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NewsArticle } from "@/lib/news"

export function NewsPageClient({ articles }: { articles: NewsArticle[] }) {
  return <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
    <div className="max-w-2xl"><span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">News</span><h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">Company & Industry News</h1><p className="mt-3 text-pretty text-muted-foreground">Equipment, project, and company updates published through the customer management system.</p></div>
    <div className="mt-10">{articles.length === 0 ? <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Newspaper /></span><h2 className="mt-4 text-xl font-bold text-foreground">No published articles yet</h2><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">The section is ready for verified company and equipment updates. New published articles will appear here automatically.</p><Button asChild className="mt-6"><Link href="/contact">Contact Our Team <ArrowUpRight className="ml-1.5 size-4" /></Link></Button></div> : <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <li key={article.id} className="h-full"><Link href={`/news/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card hover:border-primary">{article.featuredImage ? <div className="relative aspect-[16/10] overflow-hidden bg-secondary"><Image src={article.featuredImage} alt="" fill sizes="33vw" className="object-cover" /></div> : null}<div className="flex flex-1 flex-col p-6"><time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}</time><h2 className="mt-2 line-clamp-2 text-lg font-bold text-foreground">{article.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.summary}</p><span className="mt-auto pt-5 text-sm font-semibold text-primary">Read article</span></div></Link></li>)}</ul>}</div>
  </div>
}
