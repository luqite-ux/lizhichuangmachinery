import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, Download, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const url = absoluteUrl(`/products/${product.slug}`)
  const image = product.images[0]
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: url },
    openGraph: { title: product.name, description: product.summary, type: "website", url, images: image ? [{ url: image }] : [] },
    twitter: { card: "summary_large_image", title: product.name, description: product.summary, images: image ? [image] : [] },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const related = await getRelatedProducts(product)
  const url = absoluteUrl(`/products/${product.slug}`)
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`,
    name: product.name, model: product.model, description: product.summary, image: product.images,
    manufacturer: { "@id": `${absoluteUrl()}#organization` },
    url,
  }
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  }

  return <div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    <div className="border-b border-border bg-secondary/30"><div className="mx-auto max-w-7xl px-4 py-4 md:px-6"><nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground"><Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="size-3.5" aria-hidden="true" /><Link href="/products" className="hover:text-primary">Products</Link><ChevronRight className="size-3.5" aria-hidden="true" /><span className="line-clamp-1 text-foreground" aria-current="page">{product.model}</span></nav></div></div>

    <section className="border-b border-border"><div className="mx-auto grid max-w-7xl gap-9 px-4 py-12 md:grid-cols-[1fr_1.08fr] md:items-center md:px-6 md:py-16">
      <div><span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{product.categoryName}</span><p className="mt-3 font-mono text-sm font-semibold tracking-[0.1em] text-primary">{product.model}</p><h1 className="mt-2 text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">{product.name}</h1><p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">{product.overview}</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg"><Link href={`/contact?product=${encodeURIComponent(product.slug)}`}>Request a Quote <ArrowUpRight className="ml-1.5 size-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/products">All Equipment</Link></Button></div></div>
      <div className="grid gap-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-white">{product.images[0] ? <Image src={product.images[0]} alt={`${product.model} ${product.name}`} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-5" /> : null}</div>
        {product.images.length > 1 ? <div className="grid grid-cols-3 gap-3">{product.images.slice(1, 4).map((src, index) => <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-white"><Image src={src} alt={`${product.model} equipment view ${index + 2}`} fill sizes="16vw" className="object-contain p-2" /></div>)}</div> : null}
      </div>
    </div></section>

    <section className="border-b border-border py-14 md:py-16"><div className="mx-auto max-w-7xl px-4 md:px-6"><h2 className="text-2xl font-bold text-foreground md:text-3xl">Configuration Highlights</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{product.features.map((feature) => <div key={feature} className="reveal-panel flex gap-3 rounded-lg border border-border bg-card p-5"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-foreground">{feature}</p></div>)}</div></div></section>

    <section className="border-b border-border bg-secondary/30 py-14 md:py-16"><div className="mx-auto max-w-7xl px-4 md:px-6"><h2 className="text-2xl font-bold text-foreground md:text-3xl">Process Flow</h2><ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{product.processSteps.map((step, index) => <li key={step} className="reveal-panel flex items-center gap-3 rounded-lg border border-border bg-card p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary font-mono text-xs font-bold text-primary-foreground">{String(index + 1).padStart(2, "0")}</span><span className="text-sm font-medium text-foreground">{step}</span></li>)}</ol></div></section>

    <section className="border-b border-border py-14 md:py-16"><div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 md:px-6">
      <div><h2 className="text-2xl font-bold text-foreground">Verified Product Information</h2><dl className="mt-6 overflow-hidden rounded-lg border border-border">{Object.entries(product.specifications).map(([key, value], index) => <div key={key} className={`grid grid-cols-[0.8fr_1.2fr] gap-4 px-4 py-3 text-sm ${index % 2 ? "bg-secondary/35" : "bg-card"}`}><dt className="font-semibold text-foreground">{key}</dt><dd className="text-muted-foreground">{value}</dd></div>)}</dl>{product.certificate ? <p className="mt-4 flex gap-2 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />{product.certificate}</p> : null}</div>
      <div><h2 className="text-2xl font-bold text-foreground">Applications & Documents</h2><ul className="mt-6 flex flex-wrap gap-2">{product.applications.map((item) => <li key={item} className="rounded-sm border border-border bg-card px-3.5 py-2 text-sm text-foreground">{item}</li>)}</ul>{product.datasheetUrls.length || product.equipmentLayoutUrls.length ? <div className="mt-6 space-y-2">{[...product.datasheetUrls.map((href, i) => ({ href, label: `Technical datasheet ${i + 1}` })), ...product.equipmentLayoutUrls.map((href, i) => ({ href, label: `Equipment layout ${i + 1}` }))].map((doc) => <a key={doc.href} href={doc.href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary"><span className="inline-flex items-center gap-2"><FileText className="size-4" aria-hidden="true" />{doc.label}</span><Download className="size-4" aria-hidden="true" /></a>)}</div> : null}<div className="mt-6 flex gap-3 rounded-lg border border-border bg-secondary/40 p-5"><Info className="size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-relaxed text-muted-foreground">Final line interfaces and project specifications are confirmed against the requested wipe format, pack combination, target output, and available workshop layout.</p></div></div>
    </div></section>

    {related.length ? <section className="py-14 md:py-16"><div className="mx-auto max-w-7xl px-4 md:px-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-foreground md:text-3xl">Related Equipment</h2><Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="size-4" /></Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></div></section> : null}
  </div>
}
