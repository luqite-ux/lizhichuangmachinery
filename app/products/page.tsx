import { localizeMetadata } from "@/lib/localized-metadata"
import { getRequestLocale } from "@/lib/request-locale"
import { localizedTree } from "@/lib/localized-tree"
import type { Metadata } from "next"
import { ProductFilter } from "@/components/product-filter"
import { fetchProductsData } from "@/lib/products-db"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60

const baseMetadata: Metadata = {
  title: "Wet Wipes Production & Packaging Equipment",
  description:
    "Ten customer-documented wet wipes production, grouped packing, and canister-roll equipment models from Lizhichuang Machinery.",
  alternates: { canonical: absoluteUrl("/products") },
  openGraph: { title: "Wet Wipes Production & Packaging Equipment", description: "Ten customer-documented wet wipes production, grouped packing, and canister-roll equipment models from Lizhichuang Machinery.", type: "website", url: absoluteUrl("/products"), images: [{ url: absoluteUrl("/images/hero-machine-line.jpg") }] },
}

export default async function ProductsPage() {
  const locale = await getRequestLocale()
  const { products, categories } = await fetchProductsData(locale)
  return localizedTree((
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="max-w-2xl" data-motion-section>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          Products
        </span>
        <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
          Wet Wipes Production &amp; Packaging Equipment
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          Explore ten customer-documented models for mini packs, portable packs, cube packs,
          individual sachets, grouped packing, and canister rolls.
        </p>
      </div>

      <div className="mt-10" data-motion-section>
        <ProductFilter products={products} categories={categories} />
      </div>
    </div>
  ), locale)
}

export async function generateMetadata(): Promise<Metadata> { return localizeMetadata(baseMetadata, await getRequestLocale()) }
