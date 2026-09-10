import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/products/${product.slug}`} className="reveal-panel group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_44px_rgba(28,65,125,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-[#f3f6fa] p-5">
      {product.images[0] ? <Image src={product.images[0]} alt={`${product.model} ${product.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.025]" /> : null}
      <span className="absolute left-4 top-4 rounded-sm bg-white/90 px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-primary shadow-sm">{product.model}</span>
    </div>
    <div className="flex flex-1 flex-col gap-3 p-6"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{product.categoryName}</span><h3 className="text-lg font-bold leading-snug text-foreground">{product.name}</h3><p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.summary}</p><span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">View equipment <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></div>
  </Link>
}
