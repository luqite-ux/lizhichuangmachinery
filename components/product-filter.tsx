"use client"
import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product, ProductCategory } from "@/lib/products"
import { cn } from "@/lib/utils"

export function ProductFilter({ products, categories }: { products: Product[]; categories: ProductCategory[] }) {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? products : products.filter((product) => product.categorySlug === active)
  return <div><div className="flex flex-wrap gap-2" role="group" aria-label="Filter equipment by category">{[{ slug: "all", name: "All Equipment" }, ...categories].map((category) => <button key={category.slug} type="button" onClick={() => setActive(category.slug)} aria-pressed={active === category.slug} className={cn("rounded-sm border px-3.5 py-2 text-sm font-medium transition-colors", active === category.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")}>{category.name}</button>)}</div><p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground" aria-live="polite">Showing {filtered.length} of {products.length} equipment models</p><div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div>
}
